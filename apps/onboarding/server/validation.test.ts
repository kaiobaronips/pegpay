import assert from 'node:assert/strict'
import test from 'node:test'
import { isDocumentKind, parseSubmission } from './validation.js'

const validSubmission = {
  token: 'token-seguro-de-teste',
  fullName: 'Cliente de Teste',
  cpf: '529.982.247-25',
  birthDate: '1990-01-01',
  email: 'cliente@example.com',
  rg: '123456789',
  phone: '11988887777',
  zipCode: '01001000',
  street: 'Rua de Teste',
  addressNumber: '100',
  district: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  receiptMethod: 'BANK',
  bankName: 'Banco de Teste',
  bankBranch: '0001',
  bankAccount: '12345-6',
  bankAccountType: 'corrente',
  consent: true,
}

test('normaliza uma proposta válida', () => {
  const parsed = parseSubmission(validSubmission)
  assert.equal(parsed?.cpf, '52998224725')
  assert.equal(parsed?.email, 'cliente@example.com')
})

test('rejeita CPF inválido e ausência de consentimento', () => {
  assert.equal(parseSubmission({ ...validSubmission, cpf: '111.111.111-11' }), null)
  assert.equal(parseSubmission({ ...validSubmission, consent: false }), null)
})

test('aceita somente os tipos de documento previstos', () => {
  assert.equal(isDocumentKind('SELFIE_WITH_DOCUMENT'), true)
  assert.equal(isDocumentKind('IDENTITY_DOCUMENT_FRONT'), true)
  assert.equal(isDocumentKind('CARD_BACK'), false)
})

test('rejeita data impossível, menor de idade e tipo de conta arbitrário', () => {
  assert.equal(parseSubmission({ ...validSubmission, birthDate: '2099-99-99' }), null)
  assert.equal(parseSubmission({ ...validSubmission, birthDate: new Date().toISOString().slice(0, 10) }), null)
  assert.equal(parseSubmission({ ...validSubmission, bankAccountType: 'qualquer' }), null)
})

test('aceita PIX ou dados bancários e exige endereço válido', () => {
  assert.ok(parseSubmission({ ...validSubmission, receiptMethod: 'PIX', bankName: '', bankBranch: '', bankAccount: '', bankAccountType: '', pixKeyType: 'CPF', pixKey: validSubmission.cpf }))
  assert.equal(parseSubmission({ ...validSubmission, receiptMethod: 'PIX', bankName: '', bankBranch: '', bankAccount: '', bankAccountType: '', pixKeyType: 'EMAIL', pixKey: 'not-an-email' }), null)
  assert.equal(parseSubmission({ ...validSubmission, zipCode: '000' }), null)
})
