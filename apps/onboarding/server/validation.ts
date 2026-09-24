import type { DocumentKind, ProposalStatus } from './db.js'

export const documentKinds: DocumentKind[] = ['SELFIE_WITH_DOCUMENT', 'IDENTITY_DOCUMENT_FRONT', 'IDENTITY_DOCUMENT_BACK']
export const proposalStatuses: ProposalStatus[] = ['RECEIVED', 'UNDER_REVIEW', 'PENDING', 'APPROVED', 'REJECTED']

export interface SubmissionInput {
  token: string
  fullName: string
  cpf: string
  birthDate: string
  email: string
  rg: string
  phone: string
  zipCode: string
  street: string
  addressNumber: string
  district: string
  city: string
  state: string
  receiptMethod: 'BANK' | 'PIX'
  bankName: string
  bankBranch: string
  bankAccount: string
  bankAccountType: string
  pixKeyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM' | null
  pixKey: string | null
  consent: true
}

function stringField(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 && trimmed.length <= max ? trimmed : null
}

function validCpf(value: string): boolean {
  const cpf = value.replace(/\D/g, '')
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
  for (const length of [9, 10]) {
    let sum = 0
    for (let index = 0; index < length; index += 1) sum += Number(cpf[index]) * (length + 1 - index)
    const digit = ((sum * 10) % 11) % 10
    if (digit !== Number(cpf[length])) return false
  }
  return true
}

function validCnpj(value: string): boolean {
  const cnpj = value.replace(/\D/g, '')
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false
  const digit = (length: number): number => {
    const weights = length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const sum = weights.reduce((total, weight, index) => total + Number(cnpj[index]) * weight, 0)
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }
  return digit(12) === Number(cnpj[12]) && digit(13) === Number(cnpj[13])
}

function validPixKey(type: SubmissionInput['pixKeyType'], value: string | null, cpf: string): boolean {
  if (!type || !value) return false
  if (type === 'CPF') return validCpf(value) && value.replace(/\D/g, '') === cpf
  if (type === 'CNPJ') return validCnpj(value)
  if (type === 'EMAIL') return /^\S+@\S+\.\S+$/.test(value)
  if (type === 'PHONE') return /^\d{10,11}$/.test(value.replace(/\D/g, ''))
  return /^(?:[a-f\d]{32}|[a-f\d-]{36})$/i.test(value)
}

export function parseSubmission(value: unknown): SubmissionInput | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const input = value as Record<string, unknown>
  const token = stringField(input.token, 128)
  const fullName = stringField(input.fullName, 160)
  const cpf = stringField(input.cpf, 20)
  const birthDate = stringField(input.birthDate, 10)
  const email = stringField(input.email, 254)
  const rg = stringField(input.rg, 30)
  const phone = stringField(input.phone, 20)
  const zipCode = stringField(input.zipCode, 12)
  const street = stringField(input.street, 160)
  const addressNumber = stringField(input.addressNumber, 20)
  const district = stringField(input.district, 100)
  const city = stringField(input.city, 100)
  const state = stringField(input.state, 2)
  const receiptMethod = input.receiptMethod === 'PIX' ? 'PIX' : input.receiptMethod === 'BANK' ? 'BANK' : null
  const bankName = stringField(input.bankName, 100)
  const bankBranch = stringField(input.bankBranch, 20)
  const bankAccount = stringField(input.bankAccount, 30)
  const bankAccountType = stringField(input.bankAccountType, 30)
  const pixKeyType = ['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'RANDOM'].includes(input.pixKeyType as string) ? input.pixKeyType as SubmissionInput['pixKeyType'] : null
  const pixKey = stringField(input.pixKey, 160)
  const birth = birthDate && /^\d{4}-\d{2}-\d{2}$/.test(birthDate) ? new Date(`${birthDate}T12:00:00Z`) : null
  const today = new Date()
  const adultLimit = new Date(Date.UTC(today.getUTCFullYear() - 18, today.getUTCMonth(), today.getUTCDate(), 23, 59, 59))
  const validBirth = Boolean(birth && !Number.isNaN(birth.getTime()) && birth.toISOString().slice(0, 10) === birthDate && birth <= adultLimit && birth.getUTCFullYear() >= 1900)
  const validAddress = Boolean(rg && phone && /^\d{10,11}$/.test(phone.replace(/\D/g, '')) && zipCode && /^\d{8}$/.test(zipCode.replace(/\D/g, '')) && street && addressNumber && district && city && state && /^[A-Za-z]{2}$/.test(state))
  const validBank = receiptMethod === 'BANK' && bankName && bankBranch && bankAccount && bankAccountType && ['corrente', 'poupanca', 'pagamento'].includes(bankAccountType)
  const normalizedPhone = phone?.replace(/\D/g, '') ?? ''
  const validPix = receiptMethod === 'PIX' && Boolean(cpf) && validPixKey(pixKeyType, pixKey, cpf!.replace(/\D/g, ''))
  if (!token || !fullName || fullName.split(/\s+/).length < 2 || !cpf || !validCpf(cpf) || !birthDate || !validBirth || !email || !/^\S+@\S+\.\S+$/.test(email) || !validAddress || !receiptMethod || (!validBank && !validPix) || input.consent !== true) return null
  return { token, fullName, cpf: cpf.replace(/\D/g, ''), birthDate, email: email.toLowerCase(), rg: rg!, phone: normalizedPhone, zipCode: zipCode!.replace(/\D/g, ''), street: street!, addressNumber: addressNumber!, district: district!, city: city!, state: state!.toUpperCase(), receiptMethod, bankName: bankName ?? '', bankBranch: bankBranch ?? '', bankAccount: bankAccount ?? '', bankAccountType: bankAccountType ?? '', pixKeyType, pixKey, consent: true }
}

export function isDocumentKind(value: unknown): value is DocumentKind {
  return typeof value === 'string' && documentKinds.includes(value as DocumentKind)
}
