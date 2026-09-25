import type { ServerResponse } from 'node:http'
import { requireAdmin } from '../../../server/admin-auth.js'
import { sql } from '../../../server/db.js'
import { apiError, json, requestId, type ApiRequest } from '../../../server/http.js'
import { RETENTION_ABANDONED_DRAFT_MONTHS } from '../../../server/retention.js'

interface DueRow { id: string; protocol: string; status: string; retention_due_at: string; documents: number }

/**
 * Relatório de propostas cujo prazo de retenção venceu — para revisão humana, não para
 * expurgo automático. O `CLAUDE.md` proíbe apagar silenciosamente proposta, KYC ou decisão
 * de crédito, e uma rotina que deleta sozinha é exatamente isso: perda sem rastro e sem
 * ninguém para responder por ela. Quem decide o que sai é uma pessoa, com o audit log junto.
 *
 * Rascunho abandonado é calculado aqui em vez de marcado antes porque não existe gatilho
 * quando um link simplesmente expira — ninguém chama o sistema para avisar que desistiu.
 */
export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'GET') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  const adminEmail = await requireAdmin(request)
  if (!adminEmail) return apiError(response, 401, 'UNAUTHORIZED', 'Faça login para continuar.', correlationId)

  try {
    const due = await sql`
      SELECT p.id, p.protocol, p.status,
        COALESCE(
          p.retention_due_at,
          p.onboarding_expires_at + MAKE_INTERVAL(months => ${RETENTION_ABANDONED_DRAFT_MONTHS}::int)
        ) AS retention_due_at,
        (SELECT COUNT(*)::int FROM proposal_documents d WHERE d.proposal_id = p.id) AS documents
      FROM credit_proposals p
      WHERE COALESCE(
              p.retention_due_at,
              CASE WHEN p.status = 'DRAFT' AND p.onboarding_expires_at < NOW()
                THEN p.onboarding_expires_at + MAKE_INTERVAL(months => ${RETENTION_ABANDONED_DRAFT_MONTHS}::int) END
            ) < NOW()
      ORDER BY retention_due_at
      LIMIT 500` as DueRow[]

    // Propostas encerradas que deveriam ter data e não têm: sinaliza falha da marcação, não
    // ausência de obrigação. Sem isso a lacuna ficaria invisível até virar achado externo.
    const unmarked = await sql`SELECT COUNT(*)::int AS total FROM credit_proposals
      WHERE retention_due_at IS NULL AND status IN ('APPROVED','REJECTED')` as { total: number }[]

    return json(response, 200, {
      success: true,
      data: {
        dueForReview: due.map((row) => ({
          id: row.id,
          protocol: row.protocol,
          status: row.status,
          retentionDueAt: row.retention_due_at,
          documents: row.documents,
        })),
        unmarkedClosedProposals: unmarked[0]?.total ?? 0,
      },
    })
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'retention_report_failed', requestId: correlationId }))
    return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível gerar o relatório de retenção.', correlationId)
  }
}
