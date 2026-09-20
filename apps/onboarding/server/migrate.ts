import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL_UNPOOLED?.trim() || process.env.DATABASE_URL?.trim()
if (!databaseUrl) throw new Error('DATABASE_URL_UNPOOLED ou DATABASE_URL ausente')
const sql = neon(databaseUrl)

await sql`CREATE TABLE IF NOT EXISTS credit_proposals (
  id UUID PRIMARY KEY,
  protocol VARCHAR(32) NOT NULL UNIQUE,
  conversation_key CHAR(64) NOT NULL,
  onboarding_token_hash CHAR(64) NOT NULL UNIQUE,
  onboarding_expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),
  amount_cents BIGINT CHECK (amount_cents IS NULL OR amount_cents > 0),
  installments SMALLINT CHECK (installments IS NULL OR installments BETWEEN 1 AND 48),
  status VARCHAR(24) NOT NULL CHECK (status IN ('DRAFT','RECEIVED','UNDER_REVIEW','PENDING','APPROVED','REJECTED')),
  personal_data_ciphertext TEXT,
  consent_version VARCHAR(32),
  consented_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`
await sql`CREATE INDEX IF NOT EXISTS credit_proposals_conversation_status_idx ON credit_proposals (conversation_key, status, created_at DESC)`
await sql`CREATE TABLE IF NOT EXISTS proposal_documents (
  id UUID PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES credit_proposals(id),
  kind VARCHAR(40) NOT NULL CHECK (kind IN ('SELFIE_WITH_DOCUMENT','IDENTITY_DOCUMENT_FRONT','IDENTITY_DOCUMENT_BACK')),
  blob_pathname TEXT NOT NULL UNIQUE,
  content_type VARCHAR(100) NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 4194304),
  etag TEXT NOT NULL,
  validation_status VARCHAR(16) NOT NULL CHECK (validation_status IN ('VALID','REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (proposal_id, kind)
)`
await sql`CREATE TABLE IF NOT EXISTS proposal_audit_log (
  id BIGSERIAL PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES credit_proposals(id),
  event_type VARCHAR(80) NOT NULL,
  actor_type VARCHAR(16) NOT NULL CHECK (actor_type IN ('CUSTOMER','ADMIN','SYSTEM')),
  actor_id_hash CHAR(64),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`
await sql`CREATE INDEX IF NOT EXISTS proposal_audit_proposal_idx ON proposal_audit_log (proposal_id, occurred_at DESC)`
await sql`CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash CHAR(64) PRIMARY KEY,
  email VARCHAR(254) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
)`
await sql`CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id BIGSERIAL PRIMARY KEY,
  actor_id_hash CHAR(64) NOT NULL,
  succeeded BOOLEAN NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`
await sql`CREATE INDEX IF NOT EXISTS admin_login_attempts_actor_idx ON admin_login_attempts (actor_id_hash, occurred_at DESC)`
await sql`ALTER TABLE credit_proposals ADD COLUMN IF NOT EXISTS onboarding_expires_at TIMESTAMPTZ`
await sql`UPDATE credit_proposals SET onboarding_expires_at = NOW() + INTERVAL '1 hour' WHERE onboarding_expires_at IS NULL AND status = 'DRAFT'`
await sql`ALTER TABLE proposal_documents DROP CONSTRAINT IF EXISTS proposal_documents_kind_check`
await sql`UPDATE proposal_documents SET kind = 'IDENTITY_DOCUMENT_FRONT' WHERE kind = 'IDENTITY_DOCUMENT'`
await sql`ALTER TABLE proposal_documents ADD CONSTRAINT proposal_documents_kind_check CHECK (kind IN ('SELFIE_WITH_DOCUMENT','IDENTITY_DOCUMENT_FRONT','IDENTITY_DOCUMENT_BACK'))`

console.info('Migração segura de propostas concluída')
