import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import {
  RETENTION_CONTRACTED_MONTHS, RETENTION_UNCONTRACTED_MONTHS,
  isClosed, retentionMonths,
} from './retention.js'

test('só proposta encerrada liga o relógio de retenção', () => {
  for (const status of ['APPROVED', 'REJECTED'] as const) assert.ok(isClosed(status), status)
  for (const status of ['DRAFT', 'RECEIVED', 'UNDER_REVIEW', 'PENDING'] as const) {
    assert.equal(isClosed(status), false, status)
    assert.equal(retentionMonths(status), null, `${status} não deveria ter prazo`)
  }
})

test('contratada retém 5 anos, não contratada retém 6 meses', () => {
  assert.equal(retentionMonths('APPROVED'), 60)
  assert.equal(retentionMonths('REJECTED'), 6)
})

// A LGPD pede o mínimo necessário (arts. 15 e 16): guardar o mesmo tempo de quem contratou
// e de quem foi recusado seria retenção excessiva para o segundo.
test('quem não contratou retém muito menos que quem contratou', () => {
  assert.ok(RETENTION_UNCONTRACTED_MONTHS * 5 < RETENTION_CONTRACTED_MONTHS)
})

// O sistema não pode guardar por mais tempo do que o aviso promete ao titular. Já houve
// divergência entre constante do servidor e texto exibido, e o titular consente sobre o texto.
test('os prazos do código batem com os publicados no aviso de privacidade', () => {
  const aviso = readFileSync(new URL('../../src/legal-info.ts', import.meta.url), 'utf8')
  const match = /retentionPeriod:\s*'([^']+)'/.exec(aviso)
  assert.ok(match, 'retentionPeriod não encontrado em src/legal-info.ts')
  const texto = match[1] ?? ''
  assert.match(texto, new RegExp(`${RETENTION_CONTRACTED_MONTHS / 12} anos`))
  assert.match(texto, new RegExp(`${RETENTION_UNCONTRACTED_MONTHS} meses`))
})
