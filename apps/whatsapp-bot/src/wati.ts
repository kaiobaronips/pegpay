import { whatsappCandidates } from './phone.js'
import { config } from './config.js'

export async function sendSessionText(phone: string, message: string): Promise<void> {
  const endpoint = new URL(`${config.watiApiBaseUrl}/api/v1/sendSessionMessage/${encodeURIComponent(phone)}`)
  endpoint.searchParams.set('messageText', message)

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.watiApiToken}`,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(12_000),
  })

  if (!response.ok) throw new Error(`Wati recusou o envio V1: HTTP ${response.status}`)
}

export async function sendInteractiveButtons(phone: string, body: string, buttons: string[]): Promise<void> {
  if (buttons.length < 1 || buttons.length > 3 || buttons.some((label) => label.length > 20) || body.length > 1024) {
    throw new Error('WATI_INTERACTIVE_BUTTONS_INVALID')
  }

  const endpoint = new URL(`${config.watiApiBaseUrl}/api/v1/sendInteractiveButtonsMessage`)
  endpoint.searchParams.set('whatsappNumber', phone)
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.watiApiToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ body, buttons: buttons.map((text) => ({ text })) }),
    signal: AbortSignal.timeout(12_000),
  })

  if (!response.ok) throw new Error(`Wati recusou os botões interativos: HTTP ${response.status}`)
}

export async function sendInteractiveList(phone: string, body: string, buttonText: string, rows: { title: string; description: string }[]): Promise<void> {
  if (rows.length < 1 || rows.length > 10 || body.length > 1024 || buttonText.length > 20 || rows.some((row) => row.title.length > 24 || row.description.length > 72)) {
    throw new Error('WATI_INTERACTIVE_LIST_INVALID')
  }
  const endpoint = new URL(`${config.watiApiBaseUrl}/api/v1/sendInteractiveListMessage`)
  endpoint.searchParams.set('whatsappNumber', phone)
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.watiApiToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      body,
      buttonText,
      sections: [{ title: 'Produtos PegPay', rows }],
    }),
    signal: AbortSignal.timeout(12_000),
  })
  if (!response.ok) throw new Error(`Wati recusou a lista interativa: HTTP ${response.status}`)
}

export async function sendStatusTemplate(phone: string, name: string, protocol: string, status: string, notificationId: string): Promise<void> {
  if (!config.statusTemplateName) throw new Error('WATI_STATUS_TEMPLATE_NOT_CONFIGURED')
  const candidates = whatsappCandidates(phone)
  if (candidates.length === 0) throw new Error('WHATSAPP_NUMBER_EMPTY')

  const failures: string[] = []
  for (const candidate of candidates) {
    try {
      await sendStatusTemplateTo(candidate, name, protocol, status, notificationId)
      return
    } catch (error) {
      // Só vale tentar a outra forma quando a recusa foi sobre o número. Template com erro
      // ou credencial inválida falharia igual nas duas, e insistir só atrasaria o diagnóstico.
      const message = error instanceof Error ? error.message : 'unknown'
      failures.push(`${candidate.length}d:${message}`)
      if (!message.includes('validWhatsAppNumber":false')) break
    }
  }
  throw new Error(`Wati recusou o template: ${failures.join(' | ').slice(0, 400)}`)
}

async function sendStatusTemplateTo(phone: string, name: string, protocol: string, status: string, notificationId: string): Promise<void> {
  const endpoint = new URL(`${config.watiApiBaseUrl}/api/v1/sendTemplateMessage`)
  endpoint.searchParams.set('whatsappNumber', phone)
  const body: Record<string, unknown> = {
    template_name: config.statusTemplateName,
    broadcast_name: `pegpay-status-${notificationId}`,
    parameters: [
      { name: 'nome', value: name },
      { name: 'protocolo', value: protocol },
      { name: 'situacao', value: status },
    ],
  }
  if (config.statusTemplateChannelNumber) body.channel_number = config.statusTemplateChannelNumber

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.watiApiToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12_000),
  })
  // O corpo da resposta carrega o motivo real da recusa. Descartá-lo transformava qualquer
  // falha num "HTTP 400" mudo, impossível de diagnosticar sem tentar de novo às cegas.
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`HTTP ${response.status} ${detail.slice(0, 300)}`.trim())
  }
  // A WATI também responde 200 com result=false quando recusa no nível da aplicação.
  const payload = await response.json().catch(() => null) as { result?: boolean; ok?: boolean } | null
  if (payload && (payload.result === false || payload.ok === false)) {
    throw new Error(JSON.stringify(payload).slice(0, 300))
  }
}

