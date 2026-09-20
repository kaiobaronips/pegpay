import type { DocumentKind, ProposalStatus } from './db.js'

export const documentKinds: DocumentKind[] = ['SELFIE_WITH_DOCUMENT', 'IDENTITY_DOCUMENT_FRONT', 'IDENTITY_DOCUMENT_BACK']
export const proposalStatuses: ProposalStatus[] = ['RECEIVED', 'UNDER_REVIEW', 'PENDING', 'APPROVED', 'REJECTED']

export interface SubmissionInput {
  token: string
  fullName: string
  cpf: string
  birthDate: string
  email: string
  bankName: string
  bankBranch: string
  bankAccount: string
  bankAccountType: string
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

export function parseSubmission(value: unknown): SubmissionInput | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const input = value as Record<string, unknown>
  const token = stringField(input.token, 128)
  const fullName = stringField(input.fullName, 160)
  const cpf = stringField(input.cpf, 20)
  const birthDate = stringField(input.birthDate, 10)
  const email = stringField(input.email, 254)
  const bankName = stringField(input.bankName, 100)
  const bankBranch = stringField(input.bankBranch, 20)
  const bankAccount = stringField(input.bankAccount, 30)
  const bankAccountType = stringField(input.bankAccountType, 30)
  const birth = birthDate && /^\d{4}-\d{2}-\d{2}$/.test(birthDate) ? new Date(`${birthDate}T12:00:00Z`) : null
  const today = new Date()
  const adultLimit = new Date(Date.UTC(today.getUTCFullYear() - 18, today.getUTCMonth(), today.getUTCDate(), 23, 59, 59))
  const validBirth = Boolean(birth && !Number.isNaN(birth.getTime()) && birth.toISOString().slice(0, 10) === birthDate && birth <= adultLimit && birth.getUTCFullYear() >= 1900)
  if (!token || !fullName || fullName.split(/\s+/).length < 2 || !cpf || !validCpf(cpf) || !birthDate || !validBirth || !email || !/^\S+@\S+\.\S+$/.test(email) || !bankName || !bankBranch || !bankAccount || !bankAccountType || !['corrente', 'poupanca', 'pagamento'].includes(bankAccountType) || input.consent !== true) return null
  return { token, fullName, cpf: cpf.replace(/\D/g, ''), birthDate, email: email.toLowerCase(), bankName, bankBranch, bankAccount, bankAccountType, consent: true }
}

export function isDocumentKind(value: unknown): value is DocumentKind {
  return typeof value === 'string' && documentKinds.includes(value as DocumentKind)
}
