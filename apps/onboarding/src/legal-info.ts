/**
 * Dados jurídicos que a LGPD exige divulgar e que NÃO podem ser inventados por quem escreve
 * código. Cada campo `null` aparece na tela como pendência visível, em vermelho — de propósito:
 * é melhor o cliente ver "pendente de preenchimento" do que ler um dado errado, e é melhor a
 * equipe tropeçar no aviso do que publicar uma razão social chutada.
 *
 * Preencher com a assessoria jurídica antes de considerar o fluxo pronto para cliente real.
 * Ao preencher, atualize também CONSENT_VERSION em server/consent.ts.
 */
export interface LegalInfo {
  /** Razão social completa do controlador. */
  controllerLegalName: string | null
  /** CNPJ do controlador, formatado. */
  controllerTaxId: string | null
  /** Endereço completo do controlador. */
  controllerAddress: string | null
  /** Nome do encarregado pelo tratamento de dados (DPO) — LGPD art. 41 §1º. */
  dataProtectionOfficerName: string | null
  /** Canal de contato do encarregado. Não deve ser o mesmo e-mail de atendimento geral. */
  dataProtectionOfficerContact: string | null
  /** País onde a Didit armazena e processa documento e biometria. */
  biometricsHostingCountry: string | null
  /**
   * Mecanismo que legitima a transferência internacional — LGPD art. 33.
   * Ex.: cláusulas contratuais padrão, decisão de adequação, garantias específicas.
   */
  internationalTransferMechanism: string | null
  /** Prazo de retenção após o encerramento da proposta, em texto. */
  retentionPeriod: string | null
}

export const legalInfo: LegalInfo = {
  controllerLegalName: null,
  controllerTaxId: null,
  controllerAddress: null,
  dataProtectionOfficerName: null,
  dataProtectionOfficerContact: null,
  biometricsHostingCountry: null,
  internationalTransferMechanism: null,
  retentionPeriod: null,
}

export const pendingLegalFields = (Object.keys(legalInfo) as (keyof LegalInfo)[])
  .filter((field) => legalInfo[field] === null)
