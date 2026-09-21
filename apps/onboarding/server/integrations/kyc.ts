export type KycStatus = 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW' | 'UNAVAILABLE'

export interface KycSession {
  providerReference: string
  status: KycStatus
  redirectUrl?: string
}

export interface KycProvider {
  createSession(input: { proposalId: string; callbackUrl: string }): Promise<KycSession>
  getVerification(providerReference: string): Promise<KycSession>
}

/**
 * Deliberately inert until a contracted provider supplies its API contract.
 * The future adapter must use a provider-hosted capture flow whenever possible;
 * PegPay should persist only provider references and final verification status.
 */
export class UnconfiguredKycProvider implements KycProvider {
  async createSession(): Promise<KycSession> {
    return { providerReference: '', status: 'UNAVAILABLE' }
  }

  async getVerification(): Promise<KycSession> {
    return { providerReference: '', status: 'UNAVAILABLE' }
  }
}
