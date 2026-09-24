import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { config } from './config.js'

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

export function opaqueToken(): string {
  return randomBytes(32).toString('base64url')
}

export function encryptJson(value: Record<string, string>): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', config.encryptionKey, iv)
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()])
  return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${encrypted.toString('base64url')}`
}

export function decryptJson(value: string): Record<string, string> {
  const [ivEncoded, tagEncoded, encryptedEncoded] = value.split('.')
  if (!ivEncoded || !tagEncoded || !encryptedEncoded) throw new Error('Dados criptografados inválidos')
  const decipher = createDecipheriv('aes-256-gcm', config.encryptionKey, Buffer.from(ivEncoded, 'base64url'))
  decipher.setAuthTag(Buffer.from(tagEncoded, 'base64url'))
  const clear = Buffer.concat([decipher.update(Buffer.from(encryptedEncoded, 'base64url')), decipher.final()]).toString('utf8')
  const parsed: unknown = JSON.parse(clear)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Dados descriptografados inválidos')
  return parsed as Record<string, string>
}

export function verifyPassword(password: string): boolean {
  const [salt, expectedEncoded] = config.adminPasswordScrypt.split(':')
  if (!salt || !expectedEncoded) return false
  const actual = scryptSync(password, salt, 64)
  const expected = Buffer.from(expectedEncoded, 'base64url')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export function requestActorHash(value: string): string {
  return createHmac('sha256', config.piiHashSecret).update(value).digest('hex')
}
