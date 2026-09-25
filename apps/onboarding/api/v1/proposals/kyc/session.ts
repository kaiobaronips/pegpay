import type { ServerResponse } from 'node:http'
import { randomUUID } from 'node:crypto'
import { audit, extendOnboardingWindow, proposalByToken, sql } from '../../../../server/db.js'
import { createDiditSession, retrieveDiditVerificationStatus, type DiditVerificationStatus } from '../../../../server/integrations/didit.js'
import { CONSENT_VERSION } from '../../../../server/consent.js'
import { apiError, json, proposalToken, readJson, requestId, type ApiRequest } from '../../../../server/http.js'
import { kycSessionGate } from '../../../../server/kyc-policy.js'
import { isRateLimited, rateLimits } from '../../../../server/rate-limit.js'

interface VerificationRow { didit_session_id: string | null; status: DiditVerificationStatus; age_minutes: number; session_started_at: string | null; didit_session_url: string | null }

/**
 * Busca a decisão real na Didit antes de decidir. A gravação é compare-and-swap contra a sessão
 * e o status que acabamos de ler: se um webhook chegou nesse meio-tempo, ele vence e nós não
 * rebaixamos um estado já decidido. Indisponibilidade da Didit degrada para o status gravado.
 */
async function reconciledStatus(current: VerificationRow, proposalId: string, correlationId: string): Promise<DiditVerificationStatus> {
  // APPROVED não se reconcilia: nada que a Didit devolva agora deve rebaixar uma aprovação.
  if (!current.didit_session_id || current.status === 'APPROVED') return current.status
  let fresh: DiditVerificationStatus
  try {
    fresh = await retrieveDiditVerificationStatus(current.didit_session_id)
  } catch (error) {
    console.error(JSON.stringify({ level: 'warn', service: 'onboarding', event: 'didit_reconcile_failed', requestId: correlationId, reason: error instanceof Error ? error.message : 'UNKNOWN' }))
    return current.status
  }
  if (fresh === current.status) return fresh
  const applied = await sql`UPDATE kyc_verifications SET status = ${fresh}, updated_at = NOW(),
      decided_at = CASE WHEN ${fresh} IN ('APPROVED','REJECTED','MANUAL_REVIEW') THEN NOW() ELSE decided_at END
    WHERE proposal_id = ${proposalId} AND didit_session_id = ${current.didit_session_id} AND status = ${current.status}
    RETURNING status` as { status: DiditVerificationStatus }[]
  if (!applied[0]) {
    // Um webhook mudou a linha entre a leitura e a escrita. O que ele gravou é mais recente.
    const latest = await sql`SELECT status FROM kyc_verifications WHERE proposal_id = ${proposalId} LIMIT 1` as { status: DiditVerificationStatus }[]
    return latest[0]?.status ?? current.status
  }
  await audit(proposalId, `DIDIT_KYC_${fresh}_RECONCILED`, 'SYSTEM')
  return fresh
}

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'POST') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)

  let proposalId: string | undefined
  try {
    const token = proposalToken(request)
    const proposal = await proposalByToken(token)
    if (!proposal || proposal.status !== 'DRAFT') return apiError(response, 409, 'PROPOSAL_NOT_AVAILABLE', 'Esta proposta não está disponível para verificação.', correlationId)
    proposalId = proposal.id

    // O teto é por proposta, não por IP: o público-alvo compartilha IP em CGNAT de operadora
    // móvel, e um balde por IP puniria clientes que nada têm a ver uns com os outros.
    if (await isRateLimited(request, rateLimits.kycSession, proposal.id)) {
      return apiError(response, 429, 'TOO_MANY_REQUESTS', 'Muitas tentativas de verificação. Aguarde alguns minutos.', correlationId)
    }

    // Consentimento específico para biometria, pedido e registrado no momento exato em que o
    // tratamento sensível começa. Sem ele a verificação não abre — um checkbox que o servidor
    // não exige é só enfeite.
    const body = await readJson(request, 4_096)
    const givenNow = Boolean(body && typeof body === 'object' && !Array.isArray(body) && (body as Record<string, unknown>).biometricConsent === true)
    const consentRows = await sql`SELECT biometric_consent_at FROM credit_proposals WHERE id = ${proposal.id} LIMIT 1` as { biometric_consent_at: string | null }[]
    if (!consentRows[0]?.biometric_consent_at) {
      if (!givenNow) return apiError(response, 400, 'BIOMETRIC_CONSENT_REQUIRED', 'É necessário autorizar a verificação por documento e prova de vida para continuar.', correlationId)
      await sql`UPDATE credit_proposals SET biometric_consent_at = NOW(), biometric_consent_version = ${CONSENT_VERSION}, updated_at = NOW()
        WHERE id = ${proposal.id} AND biometric_consent_at IS NULL`
      await audit(proposal.id, 'BIOMETRIC_CONSENT_GRANTED', 'CUSTOMER')
    }

    const rows = await sql`SELECT didit_session_id, status, session_started_at, didit_session_url,
        EXTRACT(EPOCH FROM (NOW() - COALESCE(session_started_at, updated_at))) / 60 AS age_minutes
      FROM kyc_verifications WHERE proposal_id = ${proposal.id} LIMIT 1` as VerificationRow[]
    const current = rows[0]

    const status = current ? await reconciledStatus(current, proposal.id, correlationId) : null
    const counted = await sql`SELECT COUNT(*)::int AS rejected FROM kyc_verification_attempts
      WHERE proposal_id = ${proposal.id} AND status = 'REJECTED'` as { rejected: number }[]
    const rejectedAttempts = counted[0]?.rejected ?? 0

    const gate = kycSessionGate({ status, ageMinutes: current ? Number(current.age_minutes) : null, rejectedAttempts })
    // Verificação em andamento: devolve a MESMA sessão para o cliente continuar de onde parou.
    // Negar aqui seria recusar exatamente a URL que a Didit nos daria de volta, e foi o que
    // deixou cliente preso na tela de documentos.
    if (gate.action === 'BLOCK' && status === 'PENDING' && current?.didit_session_url) {
      await audit(proposal.id, 'DIDIT_KYC_SESSION_RESUMED', 'CUSTOMER')
      return json(response, 200, { success: true, data: { url: current.didit_session_url } })
    }
    // Em andamento mas sem URL guardada (sessão anterior à coluna, ou reivindicação
    // interrompida): bloquear daria ao cliente uma recusa e nenhum caminho. Segue para criar,
    // que é inócuo — a Didit reaproveita a sessão do mesmo `vendor_data` — e ainda grava a URL.
    const blockedWithoutWayForward = gate.action === 'BLOCK' && status === 'PENDING' && !current?.didit_session_url
    if (gate.action === 'BLOCK' && !blockedWithoutWayForward) {
      return apiError(response, gate.status, gate.code, gate.message, correlationId)
    }

    // Esgotou as tentativas: para de gerar sessão nova e passa para análise humana.
    if (gate.action === 'ESCALATE') {
      await sql`UPDATE kyc_verifications SET status = 'MANUAL_REVIEW', decided_at = NOW(), updated_at = NOW()
        WHERE proposal_id = ${proposal.id} AND status <> 'MANUAL_REVIEW'`
      await audit(proposal.id, 'DIDIT_KYC_ESCALATED_MAX_ATTEMPTS', 'SYSTEM')
      console.error(JSON.stringify({ level: 'warn', service: 'onboarding', event: 'kyc_max_attempts_escalated', requestId: correlationId, proposalId: proposal.id, rejectedAttempts }))
      return apiError(response, gate.status, gate.code, gate.message, correlationId)
    }

    // Reivindica o slot ANTES de falar com a Didit. Sem isso, dois cliques simultâneos criam
    // duas sessões e o webhook da perdedora não casa com a linha — uma decisão de KYC se perde.
    // `didit_session_id` vai a NULL para marcar "reivindicado, ainda sem sessão".
    const claimed = current
      // Compara com `status`, o valor JÁ reconciliado — e não com o lido antes da consulta à
      // Didit. Usar o antigo fazia a condição nunca casar sempre que a Didit informasse algo
      // diferente do gravado, devolvendo KYC_ALREADY_STARTED de forma determinística.
      // `didit_session_id` continua no filtro porque é ele que serializa dois cliques
      // simultâneos: o primeiro o zera e o segundo deixa de casar.
      ? await sql`UPDATE kyc_verifications
            SET status = 'PENDING', didit_session_id = NULL, decided_at = NULL,
                session_started_at = NOW(), updated_at = NOW()
          WHERE proposal_id = ${proposal.id}
            AND didit_session_id IS NOT DISTINCT FROM ${current.didit_session_id}
            AND status = ${status}
          RETURNING proposal_id` as { proposal_id: string }[]
      : await sql`INSERT INTO kyc_verifications (proposal_id, provider, didit_session_id, status, created_at, updated_at, session_started_at)
          VALUES (${proposal.id}, 'DIDIT', NULL, 'PENDING', NOW(), NOW(), NOW())
          ON CONFLICT (proposal_id) DO NOTHING
          RETURNING proposal_id` as { proposal_id: string }[]
    if (!claimed[0]) return apiError(response, 409, 'KYC_ALREADY_STARTED', 'A verificação já foi iniciada. Aguarde alguns instantes e tente novamente.', correlationId)

    if (gate.action === 'START' && gate.restartingAbandoned) await audit(proposal.id, 'DIDIT_KYC_ABANDONED_RESTARTED', 'SYSTEM')

    let session: Awaited<ReturnType<typeof createDiditSession>>
    try {
      session = await createDiditSession(proposal.id)
    } catch (error) {
      // Devolve o slot, senão o cliente fica trancado num PENDING sem sessão por 30 minutos.
      await sql`UPDATE kyc_verifications SET status = ${current?.status ?? 'EXPIRED'},
          didit_session_id = ${current?.didit_session_id ?? null},
          session_started_at = ${current?.session_started_at ?? null}, updated_at = NOW()
        WHERE proposal_id = ${proposal.id} AND didit_session_id IS NULL`
      throw error
    }

    await sql`UPDATE kyc_verifications SET didit_session_id = ${session.session_id},
        didit_session_url = ${session.url}, updated_at = NOW()
      WHERE proposal_id = ${proposal.id} AND didit_session_id IS NULL`
    // Histórico append-only: a linha de `kyc_verifications` é sobrescrita a cada reinício, então
    // sem isto três recusas seguidas de uma aprovação ficariam indistinguíveis de uma aprovação
    // de primeira — e uma decisão de KYC não pode desaparecer.
    // A Didit devolve a MESMA sessão enquanto houver uma aberta para este `vendor_data`, então
    // reiniciar retoma a verificação em vez de abrir outra. Sessão repetida é a mesma tentativa:
    // contá-la de novo inflaria o teto de recusas e puniria quem apenas voltou para concluir.
    await sql`INSERT INTO kyc_verification_attempts (id, proposal_id, attempt_number, didit_session_id, status, created_at)
      SELECT ${randomUUID()}, ${proposal.id}, COALESCE(MAX(attempt_number), 0) + 1, ${session.session_id}, 'PENDING', NOW()
      FROM kyc_verification_attempts WHERE proposal_id = ${proposal.id}
      ON CONFLICT (didit_session_id) WHERE didit_session_id IS NOT NULL DO NOTHING`
    // A verificação leva o cliente para fora do site e o traz de volta; sem renovar a janela
    // de 1 hora ele retorna da Didit para um link já expirado.
    await extendOnboardingWindow(proposal.id, 24)
    await audit(proposal.id, 'DIDIT_KYC_SESSION_CREATED', 'SYSTEM')
    return json(response, 201, { success: true, data: { url: session.url } })
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'UNKNOWN'
    // Falha da Didit e falha de banco pedem mensagens diferentes: dizer que "a verificação está
    // indisponível" quando o problema é nosso banco manda o cliente esperar por algo que não vem.
    const integrationFailure = reason.startsWith('DIDIT_')
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'kyc_session_failed', requestId: correlationId, proposalId, reason, integrationFailure }))
    if (reason === 'DIDIT_NOT_CONFIGURED') return apiError(response, 503, 'KYC_NOT_CONFIGURED', 'A verificação de identidade ainda não está disponível.', correlationId)
    if (integrationFailure) return apiError(response, 503, 'KYC_SESSION_FAILED', 'A verificação de identidade está instável no momento. Tente novamente em alguns minutos.', correlationId)
    return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível iniciar a verificação. Tente novamente.', correlationId)
  }
}
