import assert from 'node:assert/strict'
import test from 'node:test'
import { blocksNewProposal, resumesExisting } from './proposal-eligibility.js'

test('proposta em análise bloqueia uma segunda', () => {
  for (const status of ['RECEIVED', 'UNDER_REVIEW', 'PENDING']) {
    assert.equal(blocksNewProposal(status), true, status)
  }
})

// Regressão: com o bloqueio valendo também em estado terminal, o cliente que teve proposta
// recusada ficava preso na conversa — o bot respondia "já foi recebida e está em
// processamento" para sempre, e a recompra que o produto persegue era impossível.
test('proposta encerrada libera uma nova', () => {
  for (const status of ['APPROVED', 'REJECTED']) {
    assert.equal(blocksNewProposal(status), false, `${status} deveria permitir recompra`)
  }
})

test('rascunho é retomado, não bloqueado nem duplicado', () => {
  assert.equal(blocksNewProposal('DRAFT'), false)
  assert.equal(resumesExisting('DRAFT'), true)
  for (const status of ['RECEIVED', 'APPROVED', 'REJECTED']) {
    assert.equal(resumesExisting(status), false, status)
  }
})
