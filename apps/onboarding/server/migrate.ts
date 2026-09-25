import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL_UNPOOLED?.trim() || process.env.DATABASE_URL?.trim()
if (!databaseUrl) throw new Error('DATABASE_URL_UNPOOLED ou DATABASE_URL ausente')
const sql = neon(databaseUrl)

type Migration = { id: string; run: (sql: NeonQueryFunction<false, false>) => Promise<unknown> }

/**
 * Migrations versionadas e registradas em `schema_migrations`: cada uma roda uma vez só, em
 * ordem, e dá para saber o que foi aplicado em cada ambiente. Toda a DDL segue idempotente,
 * então a baseline pode ser marcada como aplicada num banco que já existia sem quebrar nada,
 * e uma falha no meio simplesmente não registra a migration — a próxima execução repete.
 *
 * Nunca edite uma migration já aplicada: acrescente outra.
 */
const migrations: Migration[] = [
  {
    id: '001_baseline_propostas',
    run: async (sql) => {
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
        hcred_proposal_id VARCHAR(64) UNIQUE,
        hcred_status VARCHAR(100),
        hcred_last_checked_at TIMESTAMPTZ,
        hcred_idempotency_key CHAR(64) UNIQUE,
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
      await sql`CREATE TABLE IF NOT EXISTS admin_mfa_credentials (
        email VARCHAR(254) PRIMARY KEY,
        secret_ciphertext TEXT NOT NULL,
        enabled_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`
      await sql`CREATE TABLE IF NOT EXISTS admin_mfa_challenges (
        token_hash CHAR(64) PRIMARY KEY,
        email VARCHAR(254) NOT NULL,
        purpose VARCHAR(12) NOT NULL CHECK (purpose IN ('ENROLL', 'LOGIN')),
        expires_at TIMESTAMPTZ NOT NULL,
        attempts SMALLINT NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 5),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        used_at TIMESTAMPTZ
      )`
      await sql`CREATE INDEX IF NOT EXISTS admin_mfa_challenges_email_idx ON admin_mfa_challenges (email, expires_at DESC)`
      await sql`ALTER TABLE proposal_documents ADD COLUMN IF NOT EXISTS retention_due_at TIMESTAMPTZ`
      await sql`ALTER TABLE credit_proposals ADD COLUMN IF NOT EXISTS retention_due_at TIMESTAMPTZ`
      await sql`CREATE INDEX IF NOT EXISTS credit_proposals_retention_due_idx ON credit_proposals (retention_due_at) WHERE retention_due_at IS NOT NULL`
      await sql`CREATE TABLE IF NOT EXISTS kyc_verifications (
        proposal_id UUID PRIMARY KEY REFERENCES credit_proposals(id), provider VARCHAR(32) NOT NULL,
        didit_session_id UUID UNIQUE, status VARCHAR(24) NOT NULL CHECK (status IN ('PENDING','APPROVED','REJECTED','MANUAL_REVIEW','EXPIRED')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), decided_at TIMESTAMPTZ
      )`
      await sql`CREATE TABLE IF NOT EXISTS kyc_webhook_events (
        event_id UUID PRIMARY KEY, provider VARCHAR(32) NOT NULL, received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`
      await sql`ALTER TABLE credit_proposals ADD COLUMN IF NOT EXISTS onboarding_expires_at TIMESTAMPTZ`
      await sql`ALTER TABLE credit_proposals ADD COLUMN IF NOT EXISTS hcred_proposal_id VARCHAR(64)`
      await sql`ALTER TABLE credit_proposals ADD COLUMN IF NOT EXISTS hcred_status VARCHAR(100)`
      await sql`ALTER TABLE credit_proposals ADD COLUMN IF NOT EXISTS hcred_last_checked_at TIMESTAMPTZ`
      await sql`ALTER TABLE credit_proposals ADD COLUMN IF NOT EXISTS hcred_idempotency_key CHAR(64)`
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS credit_proposals_hcred_idempotency_idx ON credit_proposals (hcred_idempotency_key) WHERE hcred_idempotency_key IS NOT NULL`
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS credit_proposals_hcred_id_idx ON credit_proposals (hcred_proposal_id) WHERE hcred_proposal_id IS NOT NULL`
      await sql`UPDATE credit_proposals SET onboarding_expires_at = NOW() + INTERVAL '1 hour' WHERE onboarding_expires_at IS NULL AND status = 'DRAFT'`
      await sql`ALTER TABLE proposal_documents DROP CONSTRAINT IF EXISTS proposal_documents_kind_check`
      await sql`UPDATE proposal_documents SET kind = 'IDENTITY_DOCUMENT_FRONT' WHERE kind = 'IDENTITY_DOCUMENT'`
      await sql`ALTER TABLE proposal_documents ADD CONSTRAINT proposal_documents_kind_check CHECK (kind IN ('SELFIE_WITH_DOCUMENT','IDENTITY_DOCUMENT_FRONT','IDENTITY_DOCUMENT_BACK'))`
    },
  },
  {
    id: '002_notificacoes_whatsapp',
    run: async (sql) => {
      await sql`CREATE TABLE IF NOT EXISTS proposal_whatsapp_notifications (
        id UUID PRIMARY KEY, proposal_id UUID NOT NULL REFERENCES credit_proposals(id),
        proposal_status VARCHAR(24) NOT NULL CHECK (proposal_status IN ('RECEIVED','UNDER_REVIEW','PENDING','APPROVED','REJECTED')),
        state VARCHAR(16) NOT NULL CHECK (state IN ('PENDING','SENT','FAILED')),
        attempts SMALLINT NOT NULL DEFAULT 1, last_error VARCHAR(120), sent_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (proposal_id, proposal_status)
      )`
    },
  },
  {
    id: '003_rate_limit_de_requisicoes',
    run: async (sql) => {
      await sql`CREATE TABLE IF NOT EXISTS request_rate_limits (
        scope VARCHAR(40) NOT NULL,
        actor_id_hash CHAR(64) NOT NULL,
        window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        hits INTEGER NOT NULL DEFAULT 1,
        PRIMARY KEY (scope, actor_id_hash)
      )`
      await sql`CREATE INDEX IF NOT EXISTS request_rate_limits_window_idx ON request_rate_limits (window_started_at)`
    },
  },
  {
    id: '004_historico_tentativas_kyc',
    run: async (sql) => {
      // Append-only de propósito: `kyc_verifications` guarda uma linha por proposta e cada
      // reinício sobrescrevia a decisão e o session_id anteriores. Sem este histórico, três
      // recusas seguidas de uma aprovação ficavam indistinguíveis de uma aprovação de primeira,
      // e não havia como reconstruir o caso para a instituição parceira ou para auditoria.
      await sql`CREATE TABLE IF NOT EXISTS kyc_verification_attempts (
        id UUID PRIMARY KEY,
        proposal_id UUID NOT NULL REFERENCES credit_proposals(id),
        attempt_number SMALLINT NOT NULL CHECK (attempt_number > 0),
        didit_session_id UUID,
        status VARCHAR(24) NOT NULL CHECK (status IN ('PENDING','APPROVED','REJECTED','MANUAL_REVIEW','EXPIRED')),
        reason_code VARCHAR(80),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        decided_at TIMESTAMPTZ,
        UNIQUE (proposal_id, attempt_number)
      )`
      await sql`CREATE INDEX IF NOT EXISTS kyc_attempts_proposal_idx ON kyc_verification_attempts (proposal_id, created_at DESC)`
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS kyc_attempts_session_idx ON kyc_verification_attempts (didit_session_id) WHERE didit_session_id IS NOT NULL`
      // Preserva o que já existe hoje como tentativa 1, para a contagem não nascer zerada.
      await sql`INSERT INTO kyc_verification_attempts (id, proposal_id, attempt_number, didit_session_id, status, created_at, decided_at)
        SELECT gen_random_uuid(), proposal_id, 1, didit_session_id, status, created_at, decided_at
        FROM kyc_verifications
        ON CONFLICT DO NOTHING`
    },
  },
  {
    id: '005_consentimento_biometrico',
    run: async (sql) => {
      // Documento e prova de vida são dado sensível (LGPD art. 5º II) e o art. 11 I exige
      // consentimento específico e destacado — não serve o consentimento geral do cadastro,
      // que é agrupado com outras finalidades. Por isso um registro próprio, com versão.
      await sql`ALTER TABLE credit_proposals ADD COLUMN IF NOT EXISTS biometric_consent_at TIMESTAMPTZ`
      await sql`ALTER TABLE credit_proposals ADD COLUMN IF NOT EXISTS biometric_consent_version VARCHAR(32)`
    },
  },
  {
    id: '006_marcacao_de_retencao',
    run: async (sql) => {
      // As colunas existiam desde a baseline e nenhuma linha do sistema as preenchia: na
      // prática a retenção era indefinida. Marca o passado a partir da data de encerramento
      // real (updated_at), e não de agora, para não esticar o prazo de quem já fechou.
      await sql`UPDATE credit_proposals SET retention_due_at = updated_at + INTERVAL '60 months'
        WHERE retention_due_at IS NULL AND status = 'APPROVED'`
      await sql`UPDATE credit_proposals SET retention_due_at = updated_at + INTERVAL '6 months'
        WHERE retention_due_at IS NULL AND status = 'REJECTED'`
      // Rascunho cuja janela expirou sem envio é abandono.
      await sql`UPDATE credit_proposals SET retention_due_at = onboarding_expires_at + INTERVAL '6 months'
        WHERE retention_due_at IS NULL AND status = 'DRAFT' AND onboarding_expires_at < NOW()`
      await sql`CREATE INDEX IF NOT EXISTS proposal_documents_retention_idx ON proposal_documents (retention_due_at) WHERE retention_due_at IS NOT NULL`
    },
  },
  {
    id: '007_reset_rascunho_pp20260921e1e47b',
    run: async (sql) => {
      // Correção de dado pontual: a proposta PP-20260921-E1E47B carregava dados sintéticos
      // dos testes desta sessão e precisa começar limpa para uma validação ponta a ponta com
      // biometria e documentos reais. Vai como migration, e não como endpoint administrativo,
      // porque roda uma única vez e fica registrada — um endpoint que apaga dados de proposta
      // seria capacidade permanente e perigosa para resolver um caso isolado.
      const protocol = 'PP-20260921-E1E47B'

      await sql`UPDATE credit_proposals SET
          personal_data_ciphertext = NULL,
          consent_version = NULL, consented_at = NULL,
          biometric_consent_at = NULL, biometric_consent_version = NULL,
          onboarding_expires_at = NOW() + INTERVAL '24 hours',
          updated_at = NOW()
        WHERE protocol = ${protocol} AND status = 'DRAFT'`

      // EXPIRED em vez de DELETE: o CLAUDE.md proíbe apagar decisão de KYC, e EXPIRED já
      // libera nova sessão de imediato, sem esperar a janela de abandono de 30 minutos.
      await sql`UPDATE kyc_verifications SET status = 'EXPIRED', updated_at = NOW()
        WHERE proposal_id = (SELECT id FROM credit_proposals WHERE protocol = ${protocol})`

      // `kyc_verification_attempts` e `proposal_audit_log` ficam intactos de propósito: são
      // append-only e apagá-los desfaria a rastreabilidade construída nesta mesma sessão.
      await sql`INSERT INTO proposal_audit_log (proposal_id, event_type, actor_type, occurred_at)
        SELECT id, 'DRAFT_RESET_FOR_TESTING', 'ADMIN', NOW()
        FROM credit_proposals WHERE protocol = ${protocol}`
    },
  },
  {
    id: '008_ancora_da_janela_de_abandono',
    run: async (sql) => {
      // A janela de abandono media `updated_at`, que também muda quando apenas sincronizamos
      // nossa cópia do estado da Didit. Sincronizar não é atividade do cliente: uma consulta
      // de status fazia uma sessão largada há horas parecer recém-iniciada, e o cliente ficava
      // 30 minutos bloqueado sem ter feito nada. A janela ganha âncora própria.
      await sql`ALTER TABLE kyc_verifications ADD COLUMN IF NOT EXISTS session_started_at TIMESTAMPTZ`
      // Preenche com o início real da sessão, que o histórico de tentativas guarda.
      await sql`UPDATE kyc_verifications v SET session_started_at = COALESCE(
          (SELECT a.created_at FROM kyc_verification_attempts a
            WHERE a.proposal_id = v.proposal_id AND a.didit_session_id = v.didit_session_id
            ORDER BY a.created_at DESC LIMIT 1),
          v.created_at
        ) WHERE v.session_started_at IS NULL`
    },
  },
  {
    id: '009_url_da_sessao_didit',
    run: async (sql) => {
      // Guardar a URL permite devolver a MESMA verificação a quem clica de novo, em vez de
      // responder "já iniciada" e deixar o cliente sem saída. A Didit reaproveita a sessão do
      // mesmo `vendor_data`, então negar era atrito sobre uma URL que entregaríamos igual.
      await sql`ALTER TABLE kyc_verifications ADD COLUMN IF NOT EXISTS didit_session_url TEXT`
    },
  },
]

await sql`CREATE TABLE IF NOT EXISTS schema_migrations (
  id VARCHAR(80) PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`

const applied = new Set((await sql`SELECT id FROM schema_migrations` as { id: string }[]).map((row) => row.id))

for (const migration of migrations) {
  if (applied.has(migration.id)) {
    console.info(`· ${migration.id} (já aplicada)`)
    continue
  }
  await migration.run(sql)
  await sql`INSERT INTO schema_migrations (id) VALUES (${migration.id}) ON CONFLICT (id) DO NOTHING`
  console.info(`✓ ${migration.id}`)
}

console.info(`Migrações concluídas: ${migrations.length} conhecidas, ${migrations.length - applied.size} aplicadas agora`)
