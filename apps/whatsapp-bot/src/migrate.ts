import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL_UNPOOLED?.trim()
if (!databaseUrl) throw new Error('DATABASE_URL_UNPOOLED ausente')

const sql = neon(databaseUrl)
await sql`CREATE TABLE IF NOT EXISTS whatsapp_conversations (
  conversation_key CHAR(64) PRIMARY KEY,
  state VARCHAR(32) NOT NULL,
  amount_cents BIGINT,
  installments SMALLINT,
  handled_message_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`
await sql`CREATE TABLE IF NOT EXISTS whatsapp_inbound_events (
  provider_message_id VARCHAR(255) PRIMARY KEY,
  conversation_key CHAR(64) NOT NULL,
  processing_status VARCHAR(16) NOT NULL CHECK (processing_status IN ('processing', 'completed', 'failed')),
  attempts SMALLINT NOT NULL DEFAULT 1 CHECK (attempts > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`
console.info('Migração whatsapp_conversations concluída')
