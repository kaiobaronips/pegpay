import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { decryptJson, encryptJson, sha256 } from './crypto.js'
import { sql } from './db.js'

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const STEP_SECONDS = 30

function encodeBase32(bytes: Buffer): string {
  let value = 0
  let bits = 0
  let encoded = ''
  for (const byte of bytes) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      encoded += BASE32_ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) encoded += BASE32_ALPHABET[(value << (5 - bits)) & 31]
  return encoded
}

function decodeBase32(secret: string): Buffer | null {
  let value = 0
  let bits = 0
  const output: number[] = []
  for (const character of secret.replace(/[\s=]/g, '').toUpperCase()) {
    const digit = BASE32_ALPHABET.indexOf(character)
    if (digit < 0) return null
    value = (value << 5) | digit
    bits += 5
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return output.length ? Buffer.from(output) : null
}

function totpAt(secret: string, timestampMs: number): string | null {
  const key = decodeBase32(secret)
  if (!key) return null
  const counter = Math.floor(timestampMs / 1000 / STEP_SECONDS)
  const message = Buffer.alloc(8)
  message.writeBigUInt64BE(BigInt(counter))
  const digest = createHmac('sha1', key).update(message).digest()
  const offset = digest[digest.length - 1]! & 15
  const binary = ((digest[offset]! & 127) << 24) | (digest[offset + 1]! << 16) | (digest[offset + 2]! << 8) | digest[offset + 3]!
  return String(binary % 1_000_000).padStart(6, '0')
}

export function createTotpSecret(): string {
  return encodeBase32(randomBytes(20))
}

export function validTotp(secret: string, code: string): boolean {
  if (!/^\d{6}$/.test(code)) return false
  const supplied = Buffer.from(code)
  for (const offset of [-1, 0, 1]) {
    const expected = totpAt(secret, Date.now() + offset * STEP_SECONDS * 1000)
    if (expected && timingSafeEqual(supplied, Buffer.from(expected))) return true
  }
  return false
}

export function otpauthUri(email: string, secret: string): string {
  const issuer = 'PegPay'
  return `otpauth://totp/${encodeURIComponent(`${issuer}:${email}`)}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=${STEP_SECONDS}`
}

export async function startMfaChallenge(email: string, purpose: 'ENROLL' | 'LOGIN', secret?: string): Promise<string> {
  const token = randomBytes(32).toString('base64url')
  if (purpose === 'ENROLL') {
    if (!secret) throw new Error('MFA enrollment requires a secret')
    await sql`INSERT INTO admin_mfa_credentials (email, secret_ciphertext, enabled_at, updated_at)
      VALUES (${email}, ${encryptJson({ secret })}, NULL, NOW())
      ON CONFLICT (email) DO UPDATE SET secret_ciphertext = EXCLUDED.secret_ciphertext, enabled_at = NULL, updated_at = NOW()`
  }
  await sql`INSERT INTO admin_mfa_challenges (token_hash, email, purpose, expires_at, attempts, created_at)
    VALUES (${sha256(token)}, ${email}, ${purpose}, NOW() + INTERVAL '10 minutes', 0, NOW())`
  return token
}

export function isMissingMfaSchema(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: unknown }).code === '42P01'
}

export async function verifyMfaChallenge(token: string, code: string): Promise<{ email: string; purpose: 'ENROLL' | 'LOGIN' } | null> {
  const challenges = await sql`SELECT c.email, c.purpose, c.attempts, m.secret_ciphertext, m.enabled_at
    FROM admin_mfa_challenges c JOIN admin_mfa_credentials m ON m.email = c.email
    WHERE c.token_hash = ${sha256(token)} AND c.expires_at > NOW() AND c.used_at IS NULL AND c.attempts < 5
    LIMIT 1` as { email: string; purpose: 'ENROLL' | 'LOGIN'; attempts: number; secret_ciphertext: string; enabled_at: string | null }[]
  const challenge = challenges[0]
  if (!challenge) return null
  const secret = decryptJson(challenge.secret_ciphertext).secret
  const allowed = typeof secret === 'string' && validTotp(secret, code)
  if (!allowed) {
    await sql`UPDATE admin_mfa_challenges SET attempts = attempts + 1 WHERE token_hash = ${sha256(token)} AND used_at IS NULL`
    return null
  }
  if (challenge.purpose === 'LOGIN' && !challenge.enabled_at) return null
  const used = await sql`UPDATE admin_mfa_challenges SET used_at = NOW()
    WHERE token_hash = ${sha256(token)} AND used_at IS NULL RETURNING email, purpose` as { email: string; purpose: 'ENROLL' | 'LOGIN' }[]
  if (!used[0]) return null
  if (challenge.purpose === 'ENROLL') {
    await sql`UPDATE admin_mfa_credentials SET enabled_at = NOW(), updated_at = NOW() WHERE email = ${challenge.email}`
  }
  return used[0]
}
