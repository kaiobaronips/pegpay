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
