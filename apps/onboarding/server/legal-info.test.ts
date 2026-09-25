import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

// Lido como texto em vez de importado: `src/` compila com o tsconfig do browser, sem os tipos
// de Node, e arrastá-lo para cá misturaria os dois projetos.
const source = readFileSync(new URL('../../src/legal-info.ts', import.meta.url), 'utf8')
const body = source.slice(source.indexOf('export const legalInfo'))
const field = (name: string): string | null => {
  const match = new RegExp(`${name}:\\s*(null|'((?:[^'\\\\]|\\\\.)*)')`).exec(body)
  assert.ok(match, `campo ${name} não encontrado em src/legal-info.ts`)
  return match[1] === 'null' ? null : match[2] ?? null
}

const required = [
  'controllerLegalName', 'controllerTaxId', 'controllerAddress',
  'dataProtectionOfficerName', 'dataProtectionOfficerContact',
  'biometricsHostingCountry', 'internationalTransferMechanism', 'retentionPeriod',
]

// O aviso renderiza campo vazio como "[ pendente de preenchimento jurídico ]", visível ao
// cliente. Isso é rede de segurança durante a construção, não estado aceitável em produção:
// um cliente lendo isso no aviso de uma correspondente bancária perde a confiança, e a
// divulgação continua faltando perante a ANPD.
test('nenhum campo jurídico obrigatório ficou pendente', () => {
  const pendentes = required.filter((name) => field(name) === null)
  assert.deepEqual(pendentes, [], `campos ainda em branco: ${pendentes.join(', ')}`)
})

test('CNPJ do controlador está no formato da Receita', () => {
  assert.match(field('controllerTaxId') ?? '', /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
})

// A sigla é LGPD. Já veio trocada uma vez; publicada num aviso legal, o pedido do titular
// quica numa caixa inexistente enquanto o prazo de resposta corre.
test('o contato do encarregado é um e-mail do domínio da PegPay, sem erro de digitação', () => {
  const contact = field('dataProtectionOfficerContact') ?? ''
  assert.match(contact, /^[^@\s]+@pegpay\.com\.br$/)
  assert.doesNotMatch(contact, /lgdp/i)
})
