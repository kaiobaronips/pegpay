import assert from 'node:assert/strict'
import test from 'node:test'
import { ABANDONED_PENDING_MINUTES, ABANDONED_REVIEW_MINUTES, MAX_REJECTED_ATTEMPTS, kycSessionGate } from './kyc-policy.js'

test('sem verificação anterior, começa', () => {
  const gate = kycSessionGate({ status: null, ageMinutes: null, rejectedAttempts: 0 })
  assert.equal(gate.action, 'START')
  assert.equal(gate.action === 'START' && gate.restartingAbandoned, false)
})

test('aprovado não reinicia e avisa que já está verificado', () => {
  const gate = kycSessionGate({ status: 'APPROVED', ageMinutes: 100_000, rejectedAttempts: 0 })
  assert.equal(gate.action, 'BLOCK')
  assert.equal(gate.action === 'BLOCK' && gate.code, 'KYC_ALREADY_APPROVED')
})

// Regressão do beco sem saída que motivou toda a correção: PENDING não é terminal, e quem
// fecha a aba no meio da Didit nunca gera o webhook que tiraria a linha desse estado.
test('PENDING recente bloqueia, PENDING abandonado recomeça', () => {
  const recente = kycSessionGate({ status: 'PENDING', ageMinutes: ABANDONED_PENDING_MINUTES - 1, rejectedAttempts: 0 })
  assert.equal(recente.action, 'BLOCK')
  assert.equal(recente.action === 'BLOCK' && recente.code, 'KYC_ALREADY_STARTED')

  const abandonado = kycSessionGate({ status: 'PENDING', ageMinutes: ABANDONED_PENDING_MINUTES + 1, rejectedAttempts: 0 })
  assert.equal(abandonado.action, 'START')
  assert.equal(abandonado.action === 'START' && abandonado.restartingAbandoned, true)
})

// A primeira correção consertou PENDING e recriou o mesmo beco sem saída aqui: uma análise
// manual que nunca é concluída deixava a proposta morta, já que o envio exige KYC aprovado.
test('análise manual bloqueia enquanto é plausível e libera quando envelhece', () => {
  const emAnalise = kycSessionGate({ status: 'MANUAL_REVIEW', ageMinutes: ABANDONED_REVIEW_MINUTES - 60, rejectedAttempts: 0 })
  assert.equal(emAnalise.action, 'BLOCK')
  assert.equal(emAnalise.action === 'BLOCK' && emAnalise.code, 'KYC_IN_REVIEW')

  const esquecida = kycSessionGate({ status: 'MANUAL_REVIEW', ageMinutes: ABANDONED_REVIEW_MINUTES + 1, rejectedAttempts: 0 })
  assert.equal(esquecida.action, 'START')
})

test('a janela da análise manual é muito maior que a do abandono', () => {
  assert.ok(ABANDONED_REVIEW_MINUTES > ABANDONED_PENDING_MINUTES * 10)
})

test('recusado e expirado liberam nova tentativa imediatamente', () => {
  for (const status of ['REJECTED', 'EXPIRED'] as const) {
    const gate = kycSessionGate({ status, ageMinutes: 0, rejectedAttempts: 0 })
    assert.equal(gate.action, 'START', `${status} deveria liberar`)
    assert.equal(gate.action === 'START' && gate.restartingAbandoned, false)
  }
})

test('nenhum status conhecido fica sem decisão', () => {
  for (const status of ['PENDING', 'APPROVED', 'REJECTED', 'MANUAL_REVIEW', 'EXPIRED'] as const) {
    for (const ageMinutes of [0, 31, 100_000]) {
      const gate = kycSessionGate({ status, ageMinutes, rejectedAttempts: 0 })
      assert.ok(gate.action === 'BLOCK' || gate.action === 'START', `${status}/${ageMinutes} sem decisão`)
    }
  }
})

test('idade ausente é tratada como recém-criada, nunca como abandonada', () => {
  const gate = kycSessionGate({ status: 'PENDING', ageMinutes: null, rejectedAttempts: 0 })
  assert.equal(gate.action, 'BLOCK')
})

// Retry após recusa é legítimo no público-alvo — foto tremida, reflexo, documento gasto.
// Retry ILIMITADO é document shopping: trocar de documento até um passar.
test('recusas abaixo do teto ainda permitem tentar', () => {
  const gate = kycSessionGate({ status: 'REJECTED', ageMinutes: 5, rejectedAttempts: MAX_REJECTED_ATTEMPTS - 1 })
  assert.equal(gate.action, 'START')
})

test('atingido o teto de recusas, escala para análise humana em vez de nova sessão', () => {
  const gate = kycSessionGate({ status: 'REJECTED', ageMinutes: 5, rejectedAttempts: MAX_REJECTED_ATTEMPTS })
  assert.equal(gate.action, 'ESCALATE')
  assert.equal(gate.action === 'ESCALATE' && gate.code, 'KYC_MANUAL_REVIEW_REQUIRED')
})

test('quem esgotou o teto não recomeça deixando a sessão expirar ou abandonando', () => {
  for (const status of ['EXPIRED', 'PENDING'] as const) {
    const gate = kycSessionGate({ status, ageMinutes: 100_000, rejectedAttempts: MAX_REJECTED_ATTEMPTS })
    assert.equal(gate.action, 'ESCALATE', `${status} deveria escalar`)
  }
})

test('o teto nunca desfaz uma aprovação nem atropela análise em curso', () => {
  const aprovado = kycSessionGate({ status: 'APPROVED', ageMinutes: 10, rejectedAttempts: 99 })
  assert.equal(aprovado.action, 'BLOCK')
  assert.equal(aprovado.action === 'BLOCK' && aprovado.code, 'KYC_ALREADY_APPROVED')

  const emAnalise = kycSessionGate({ status: 'MANUAL_REVIEW', ageMinutes: 10, rejectedAttempts: 99 })
  assert.equal(emAnalise.action, 'BLOCK')
  assert.equal(emAnalise.action === 'BLOCK' && emAnalise.code, 'KYC_IN_REVIEW')
})
