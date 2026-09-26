import assert from 'node:assert/strict'
import test from 'node:test'
import { whatsappCandidates } from './phone.js'

// Caso real de produção: o cliente digitou 43 98425-4609 e o WhatsApp conhece o contato como
// 554384254609, sem o nono dígito. Enviar só a forma longa devolvia validWhatsAppNumber:false
// e a notificação sumia sem ninguém perceber.
test('celular com nono dígito oferece também a forma curta', () => {
  assert.deepEqual(whatsappCandidates('5543984254609'), ['5543984254609', '554384254609'])
})

test('celular sem nono dígito oferece também a forma longa', () => {
  assert.deepEqual(whatsappCandidates('554384254609'), ['554384254609', '5543984254609'])
})

test('a forma digitada é sempre tentada primeiro', () => {
  for (const number of ['5511987654321', '551187654321']) {
    assert.equal(whatsappCandidates(number)[0], number)
  }
})

// Um oito depois do DDD é número real, não nono dígito: tirar o 8 geraria um número de outra
// pessoa, e mandar dado de proposta para terceiro é pior que não mandar.
test('não confunde o primeiro dígito do assinante com o nono dígito', () => {
  const candidates = whatsappCandidates('5543884254609')
  assert.deepEqual(candidates, ['5543884254609'])
})

test('entrada vazia ou fora do padrão brasileiro não inventa variante', () => {
  assert.deepEqual(whatsappCandidates(''), [])
  assert.deepEqual(whatsappCandidates('1555512345'), ['1555512345'])
})
