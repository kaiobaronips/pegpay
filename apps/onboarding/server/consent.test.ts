import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { CONSENT_VERSION } from './consent.js'

// O front mantém uma cópia da constante para não arrastar `config` e as variáveis de ambiente
// do servidor para o bundle. Se as duas divergirem, o sistema grava consentimento para uma
// versão de aviso que o titular nunca leu — o registro deixa de valer.
test('a versão de consentimento do front não diverge da do servidor', () => {
  const front = readFileSync(new URL('../../src/consent-version.ts', import.meta.url), 'utf8')
  const match = /CONSENT_VERSION = '([^']+)'/.exec(front)
  assert.ok(match, 'não encontrei CONSENT_VERSION em src/consent-version.ts')
  assert.equal(match[1], CONSENT_VERSION)
})
