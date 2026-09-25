import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONSENT_VERSION } from './consent-version.js'
import { legalInfo } from './legal-info.js'

type DocumentKind = 'SELFIE_WITH_DOCUMENT' | 'IDENTITY_DOCUMENT_FRONT' | 'IDENTITY_DOCUMENT_BACK'
type ProposalStatus = 'DRAFT' | 'RECEIVED' | 'UNDER_REVIEW' | 'PENDING' | 'APPROVED' | 'REJECTED'

interface SessionData { id: string; protocol: string; status: ProposalStatus; amountCents: number | null; installments: number | null; documents: DocumentKind[]; kycStatus?: string }
interface AdminProposal { id: string; protocol: string; status: ProposalStatus; amountCents: number | null; installments: number | null; customer: { fullName: string; cpfMasked: string } | null; documentCount: number; submittedAt: string | null }

interface CustomerFormData {
  fullName: string; cpf: string; birthDate: string; email: string; rg: string; phone: string
  zipCode: string; street: string; addressNumber: string; district: string; city: string; state: string
  receiptMethod: string; pixKeyType: string; pixKey: string; bankName: string; bankBranch: string
  bankAccount: string; bankAccountType: string
}

interface CepAddress { street: string; district: string; city: string; state: string }

const emptyCustomerForm: CustomerFormData = { fullName: '', cpf: '', birthDate: '', email: '', rg: '', phone: '', zipCode: '', street: '', addressNumber: '', district: '', city: '', state: '', receiptMethod: 'BANK', pixKeyType: 'CPF', pixKey: '', bankName: '', bankBranch: '', bankAccount: '', bankAccountType: 'corrente' }

function PegSymbol() {
  return <svg width="38" height="38" viewBox="0 0 100 100" aria-hidden="true"><path d="M0 0H74L100 26V100H0Z" fill="#E94E1B" /><path d="M22 22h16v56H22z M38 22h28v14H38z M52 22h14v42H52z M38 50h28v14H38z" fill="#F3F2F2" /></svg>
}

function Header() {
  return <header className="topbar"><a className="brand" href="https://www.pegpay.com.br" aria-label="PegPay"><PegSymbol /><strong>PegPay</strong></a><span className="secure">AMBIENTE PROTEGIDO</span></header>
}

function Pendente({ campo }: { campo: string }) {
  return <mark className="legal-pending">[ pendente de preenchimento jurídico: {campo} ]</mark>
}

function PrivacyNotice() {
  const l = legalInfo
  return <><Header /><main className="state-page">
    <div className="eyebrow">PRIVACIDADE · VERSÃO {CONSENT_VERSION}</div>
    <h1>Aviso de privacidade.</h1>
    <p>Este aviso explica como a PegPay trata dados pessoais durante o cadastro e a análise de propostas de empréstimo.</p>

    <h2>Quem trata seus dados</h2>
    <p>O controlador dos dados é {l.controllerLegalName ?? <Pendente campo="razão social" />}, inscrito no CNPJ {l.controllerTaxId ?? <Pendente campo="CNPJ" />}, com endereço em {l.controllerAddress ?? <Pendente campo="endereço" />}.</p>
    <p>Encarregado pelo tratamento de dados pessoais (DPO): {l.dataProtectionOfficerName ?? <Pendente campo="nome do encarregado" />}, contato {l.dataProtectionOfficerContact ?? <Pendente campo="contato do encarregado" />}.</p>

    <h2>Dados tratados</h2>
    <p>Dados de identificação e contato, endereço, número de documento, imagem do documento, imagem facial e prova de vida, informações bancárias ou chave PIX, dados da proposta e registros técnicos de segurança, incluindo endereço IP armazenado sob hash.</p>
    <p>A imagem do documento e a prova de vida são <b>dados pessoais sensíveis</b> (dado biométrico) e recebem consentimento específico e destacado, pedido separadamente na etapa de verificação.</p>

    <h2>Para que usamos, e com que base legal</h2>
    <table className="legal-table"><thead><tr><th>Finalidade</th><th>Base legal</th></tr></thead><tbody>
      <tr><td>Receber e analisar sua proposta de empréstimo</td><td>Execução de procedimentos preliminares a contrato, a seu pedido (art. 7º V)</td></tr>
      <tr><td>Confirmar sua identidade por documento e prova de vida</td><td>Consentimento específico para dado biométrico (art. 11 I)</td></tr>
      <tr><td>Prevenir fraude e proteger sua segurança no cadastro</td><td>Legítimo interesse e prevenção à fraude (arts. 7º IX e 11 II “g”)</td></tr>
      <tr><td>Cumprir obrigações legais e regulatórias</td><td>Obrigação legal ou regulatória (art. 7º II)</td></tr>
      <tr><td>Responder solicitações e comunicar o andamento</td><td>Execução de procedimentos preliminares a contrato (art. 7º V)</td></tr>
    </tbody></table>
    <p>A base legal da verificação de identidade é o consentimento, e você pode revogá-lo. A prevenção a fraude se apoia em legítimo interesse e segue mesmo sem consentimento, porque protege você e terceiros contra uso indevido do seu nome.</p>

    <h2>Com quem compartilhamos</h2>
    <p>Com a instituição financeira parceira responsável pela análise e pela operação do empréstimo; com a Didit, fornecedora contratada de verificação de identidade; com a infraestrutura de hospedagem e armazenamento; e com autoridades competentes quando exigido. <b>Não vendemos dados pessoais</b> e não os compartilhamos com anunciantes.</p>

    <h2>Transferência internacional</h2>
    <p>A verificação de identidade é feita pela <b>Didit</b>, fornecedora sediada fora do Brasil. A imagem do seu documento e a prova de vida <b>são transferidas e processadas fora do território nacional</b>, em {l.biometricsHostingCountry ?? <Pendente campo="país de destino" />}.</p>
    <p>A transferência se apoia em {l.internationalTransferMechanism ?? <Pendente campo="mecanismo do art. 33" />}, nos termos dos arts. 33 e 34 da LGPD.</p>

    <h2>Por quanto tempo guardamos</h2>
    <p>Mantemos seus dados pelo prazo necessário às finalidades informadas e às obrigações legais, de prevenção a fraude e de defesa de direitos. Após o encerramento da proposta, o prazo aplicável é de {l.retentionPeriod ?? <Pendente campo="prazo de retenção" />}.</p>

    <h2>Segurança</h2>
    <p>Aplicamos criptografia dos dados pessoais em repouso, controle de acesso, autenticação em duas etapas para a equipe e registro de auditoria das operações críticas.</p>

    <h2>Seus direitos</h2>
    <p>A LGPD garante a você: confirmação da existência de tratamento; acesso aos dados; correção de dados incompletos, inexatos ou desatualizados; anonimização, bloqueio ou <b>eliminação</b> de dados desnecessários ou tratados em desconformidade; <b>portabilidade</b>; informação sobre compartilhamento; informação sobre a possibilidade de não consentir e suas consequências; <b>revogação do consentimento</b>; e revisão de decisões automatizadas.</p>
    <p>Para exercer qualquer um deles, fale com o encarregado pelo contato indicado acima. <b>Não envie CPF, documento ou dado bancário por e-mail</b> — pediremos a confirmação da sua identidade por canal adequado.</p>

    <h2>Revogar o consentimento da verificação</h2>
    <p>Você pode revogar o consentimento do tratamento biométrico a qualquer momento. A revogação não desfaz tratamentos já realizados de forma lícita, e sem a verificação de identidade não é possível seguir com a proposta.</p>

    <p>O envio de uma proposta não representa aprovação do empréstimo.</p>
    <p className="support"><a href="/cookies">Política de cookies</a></p>
  </main></>
}

function CookieNotice() {
  return <><Header /><main className="state-page"><div className="eyebrow">COOKIES · VERSÃO {CONSENT_VERSION}</div><h1>Política de cookies.</h1>
    <p>Esta política explica o que a PegPay guarda no seu navegador quando você usa o portal de cadastro em <b>cadastro.pegpay.com.br</b>. Ela complementa o <a href="/privacidade">Aviso de Privacidade</a>.</p>
    <h2>O que usamos</h2>
    <p>Usamos <b>somente armazenamento estritamente necessário</b> — o que mantém o cadastro funcionando e protegido. Não usamos cookies de publicidade, de redes sociais, de medição de audiência nem de perfilamento. Nenhum dado seu é vendido ou compartilhado com anunciantes.</p>
    <p>Por serem estritamente necessários, esses itens dispensam consentimento prévio. Não há banner a aceitar: sem eles o cadastro simplesmente não funciona.</p>
    <h2>O que fica guardado</h2>
    <table className="cookie-table"><thead><tr><th>Item</th><th>Tipo</th><th>Para que serve</th><th>Validade</th></tr></thead><tbody>
      <tr><td><code>pegpay_proposal_session</code></td><td>Cookie estritamente necessário</td><td>Identificar sua proposta durante o preenchimento e ao voltar da verificação de identidade. É <code>HttpOnly</code>: nenhum script consegue lê-lo.</td><td>24 horas</td></tr>
      <tr><td><code>pegpay_has_proposal</code></td><td>Cookie estritamente necessário</td><td>Sinalizar à página que existe um cadastro em andamento. Não contém dado seu nem credencial.</td><td>24 horas</td></tr>
      <tr><td><code>pegpay_admin_session</code></td><td>Cookie estritamente necessário</td><td>Autenticar a equipe da PegPay no painel interno. Não é criado para clientes.</td><td>8 horas</td></tr>
    </tbody></table>
    <p>Todos trafegam apenas por HTTPS (<code>Secure</code>) e com <code>SameSite</code>, que impede que outro site os use para agir em seu nome. O cookie do painel interno é ainda mais restrito (<code>SameSite=Strict</code>).</p>
    <h2>Verificação de identidade e transferência internacional</h2>
    <p>A verificação de documento e prova de vida acontece em ambiente da <b>Didit</b>, nosso fornecedor contratado. Durante essa etapa você sai do nosso domínio e passa a valer a política de cookies da Didit. Ao concluir, você retorna ao cadastro.</p>
    <p>A Didit é sediada fora do Brasil: a imagem do seu documento e a prova de vida <b>são processadas fora do território nacional</b>. O detalhamento do país de destino e do mecanismo que legitima essa transferência está no <a href="/privacidade">Aviso de Privacidade</a>.</p>

    <h2>O que não é cookie, mas também guardamos</h2>
    <p>Para conter abuso e tentativas automatizadas, registramos seu endereço IP <b>sob hash</b>, junto com a contagem de requisições por janela de tempo. O IP original não é armazenado e o registro não é usado para perfilar você nem para publicidade.</p>
    <h2>Como controlar</h2>
    <p>Você pode apagar esses cookies a qualquer momento pelas configurações do navegador. Apagar durante o preenchimento faz você precisar reabrir o link recebido no WhatsApp.</p>
    <p>Apagar o cookie encerra a sessão <b>neste navegador</b>, mas o link do cadastro continua válido no servidor até expirar. Se você suspeita que seu link foi visto por outra pessoa, fale com a gente para invalidá-lo.</p>
    <h2>Dúvidas</h2>
    <p>Sobre cookies e proteção de dados, escreva para <a href="mailto:privacidade@pegpay.com.br">privacidade@pegpay.com.br</a>. Para dúvidas sobre sua proposta, <a href="mailto:contato@pegpay.com.br">contato@pegpay.com.br</a>. O envio de uma proposta não representa aprovação do empréstimo.</p>
  </main></>
}

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, headers: { 'content-type': 'application/json', ...(options?.headers ?? {}) } })
  const payload = await response.json() as { success?: boolean; data?: T; error?: { message?: string } }
  if (!response.ok || !payload.success || payload.data === undefined) throw new Error(payload.error?.message ?? 'Não foi possível concluir a operação.')
  return payload.data
}

function money(value: number | null): string {
  return value === null ? 'A confirmar' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100)
}

function isValidCpf(value: string): boolean {
  const cpf = value.replace(/\D/g, '')
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
  for (const length of [9, 10]) {
    let sum = 0
    for (let index = 0; index < length; index += 1) sum += Number(cpf[index]) * (length + 1 - index)
    if (((sum * 10) % 11) % 10 !== Number(cpf[length])) return false
  }
  return true
}

function CustomerPortalV2() {
  // O token do link é usado uma única vez, para trocar por um cookie HttpOnly. Daí em diante
  // o navegador não guarda credencial nenhuma e as chamadas seguem sem token.
  const [linkToken] = useState(() => new URLSearchParams(window.location.search).get('token') ?? '')
  const [hasSession, setHasSession] = useState(() => Boolean(linkToken) || document.cookie.includes('pegpay_has_proposal=1'))
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(hasSession)
  const [submitting, setSubmitting] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [message, setMessage] = useState(hasSession ? '' : 'Este link não identifica uma proposta. Volte ao WhatsApp e solicite um novo link.')
  const [successProtocol, setSuccessProtocol] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [documentsReady, setDocumentsReady] = useState(false)
  const [biometricConsent, setBiometricConsent] = useState(false)
  const [cpfError, setCpfError] = useState('')
  const [cepStatus, setCepStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [cepMessage, setCepMessage] = useState('')
  const cepRequest = useRef(0)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [form, setForm] = useState<CustomerFormData>(emptyCustomerForm)

  useEffect(() => {
    if (!hasSession) return
    // O token sai da URL antes de qualquer render, para não sobrar no histórico nem no Referer.
    if (linkToken) window.history.replaceState({}, document.title, window.location.pathname)
    const openSession = linkToken
      ? api<SessionData>('/api/v1/proposals/session', { method: 'POST', body: JSON.stringify({ token: linkToken }) })
      : api<SessionData>('/api/v1/proposals/session')
    openSession
      .then(async (data) => {
        const draft = await api<{ form: Record<string, string> | null; consent: boolean }>('/api/v1/proposals/draft')
        setSession(data)
        if (draft.form) setForm({ ...emptyCustomerForm, ...draft.form })
        if (draft.consent) { setPrivacyAccepted(true); setShowWelcome(false) }
        if (data.status !== 'DRAFT') setSuccessProtocol(data.protocol)
        if (data.kycStatus === 'APPROVED' || data.kycStatus === 'PENDING' || data.kycStatus === 'MANUAL_REVIEW') setStep(4)
      })
      .catch((error: unknown) => { setHasSession(false); setMessage(error instanceof Error ? error.message : 'Link inválido.') })
      .finally(() => setLoading(false))
  }, [hasSession, linkToken])

  useEffect(() => {
    if (showWelcome) return
    window.requestAnimationFrame(() => window.scrollTo(0, 0))
  }, [step, showWelcome])

  function beginRegistration() {
    if (!privacyAccepted) return
    setShowWelcome(false)
  }

  async function lookupCep(cep: string) {
    const currentRequest = ++cepRequest.current
    setCepStatus('loading')
    setCepMessage('Buscando endereço…')
    try {
      const address = await api<CepAddress>(`/api/v1/address/cep?cep=${encodeURIComponent(cep)}`)
      if (currentRequest !== cepRequest.current) return
      setForm((current) => current.zipCode.replace(/\D/g, '') === cep ? {
        ...current,
        street: address.street,
        district: address.district,
        city: address.city,
        state: address.state,
      } : current)
      setCepStatus('success')
      setCepMessage('Endereço encontrado. Informe o número.')
      window.requestAnimationFrame(() => document.getElementById('address-number')?.focus())
    } catch (error) {
      if (currentRequest !== cepRequest.current) return
      setCepStatus('error')
      setCepMessage(error instanceof Error ? error.message : 'Não foi possível consultar o CEP. Preencha o endereço manualmente.')
    }
  }

  function updateZipCode(value: string) {
    const cep = value.replace(/\D/g, '').slice(0, 8)
    setForm((current) => ({ ...current, zipCode: cep }))
    setCepMessage('')
    setCepStatus('idle')
    cepRequest.current += 1
    if (cep.length === 8) void lookupCep(cep)
  }

  async function saveDraft(): Promise<boolean> {
    setMessage('')
    setSavingDraft(true)
    try {
      await api<{ saved: boolean }>('/api/v1/proposals/draft', { method: 'POST', body: JSON.stringify({ ...form, consent: privacyAccepted }) })
      return true
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível salvar os dados do cadastro.')
      return false
    } finally {
      setSavingDraft(false)
    }
  }

  async function continueFromData() {
    if (!isValidCpf(form.cpf)) {
      setCpfError('CPF inválido. Confira os 11 números e tente novamente.')
      setMessage('Corrija o CPF destacado antes de continuar.')
      document.getElementById('customer-cpf')?.focus()
      return
    }
    setCpfError('')
    if (await saveDraft()) setStep(2)
  }

  async function startKyc() {
    try {
      setMessage('')
      if (!await saveDraft()) return
      const result = await api<{ url: string }>('/api/v1/proposals/kyc/session', { method: 'POST', body: JSON.stringify({ biometricConsent }) })
      window.location.assign(result.url)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível iniciar a verificação.') }
  }

  async function refreshKyc() {
    setStep(4)
    try {
      const result = await api<{ kycStatus: string }>('/api/v1/proposals/kyc/status', { method: 'POST' })
      setSession((current) => current ? { ...current, kycStatus: result.kycStatus } : current)
    } catch { /* O status será atualizado pelo próximo ciclo de consulta. */ }
  }

  useEffect(() => {
    if (step !== 4 || (session?.kycStatus !== 'PENDING' && session?.kycStatus !== 'MANUAL_REVIEW')) return
    let stop = false
    const check = () => api<{ kycStatus: string }>('/api/v1/proposals/kyc/status', { method: 'POST' })
      .then((data) => { if (!stop) setSession((current) => current ? { ...current, kycStatus: data.kycStatus } : current) })
      .catch(() => undefined)
    // Quem volta da Didit cai direto aqui: consultar na hora evita 10s olhando "em processamento"
    // num resultado que já saiu.
    void check()
    const timer = window.setInterval(() => void check(), 15_000)
    return () => { stop = true; window.clearInterval(timer) }
  }, [step, session?.kycStatus])

  async function submit(event: FormEvent) {
    event.preventDefault(); setMessage(''); setSubmitting(true)
    try {
      const result = await api<{ protocol: string; status: ProposalStatus }>('/api/v1/proposals/submit', { method: 'POST', body: JSON.stringify({ ...form, consent: privacyAccepted }) })
      setSuccessProtocol(result.protocol)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível enviar a proposta.') }
    finally { setSubmitting(false) }
  }

  if (loading) return <><Header /><main className="state-page"><h1>Carregando proposta…</h1></main></>
  if (successProtocol) {
    const statusCopy: Record<Exclude<ProposalStatus, 'DRAFT'>, [string, string]> = { RECEIVED: ['PROPOSTA RECEBIDA', 'Cadastro enviado com segurança.'], UNDER_REVIEW: ['EM ANÁLISE', 'Sua proposta está sendo analisada.'], PENDING: ['PENDÊNCIA', 'A proposta precisa de informações adicionais. Fale com a PegPay.'], APPROVED: ['PROPOSTA APROVADA', 'Sua proposta foi aprovada. Aguarde as orientações da PegPay.'], REJECTED: ['PROPOSTA NÃO APROVADA', 'A proposta não foi aprovada nesta análise.'] }
    const copy = session?.status && session.status !== 'DRAFT' ? statusCopy[session.status] : statusCopy.RECEIVED
    return <><Header /><main className="state-page success-page"><div className="eyebrow">{copy[0]}</div><h1>{copy[1]}</h1><p>Protocolo: <strong className="tnum">{successProtocol}</strong></p><p>Para acompanhamento, fale com contato@pegpay.com.br. O envio não representa aprovação.</p></main></>
  }
  if (!session) return <><Header /><main className="state-page"><div className="eyebrow">LINK INVÁLIDO</div><h1>Solicite um novo link pelo WhatsApp.</h1>{message && <p className="error" role="alert">{message}</p>}</main></>

  const receiptReady = form.receiptMethod === 'PIX' ? Boolean(form.pixKeyType && form.pixKey) : Boolean(form.bankName && form.bankBranch && form.bankAccount)
  const dataReady = Boolean(form.fullName && form.cpf && form.birthDate && form.email && form.rg && form.phone && form.zipCode && form.street && form.addressNumber && form.district && form.city && form.state && receiptReady)
  const readyToSend = session.kycStatus === 'APPROVED' && dataReady && privacyAccepted
  const stepLabels = ['Dados', 'Documentos', 'Verificação', 'Envio']

  return <main><Header />
    <section className="progress" aria-label="Andamento da proposta">{stepLabels.map((label, index) => <div key={label} className={step === index + 1 ? 'current' : step > index + 1 ? 'complete' : ''}><b>0{index + 1}</b><span>{label}</span></div>)}</section>
    <form className="shell onboarding-flow" onSubmit={submit}>
      {step === 1 && <>
        <section className="form-section"><div className="section-head"><span className="label">DADOS PESSOAIS</span><span className="required">OBRIGATÓRIO</span></div><div className="field-grid">
          <label>Nome completo<input autoComplete="name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label><label>CPF<input id="customer-cpf" inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" value={form.cpf} aria-invalid={Boolean(cpfError)} aria-describedby={cpfError ? 'customer-cpf-error' : undefined} className={cpfError ? 'input-error' : undefined} onChange={(e) => { setForm({ ...form, cpf: e.target.value }); if (cpfError) { setCpfError(''); setMessage('') } }} />{cpfError && <small id="customer-cpf-error" className="field-error" role="alert">{cpfError}</small>}</label><label>RG ou CNH<input value={form.rg} onChange={(e) => setForm({ ...form, rg: e.target.value })} /></label><label>Data de nascimento<input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} /></label><label>Celular<input inputMode="tel" autoComplete="tel" placeholder="11999999999" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><label>E-mail<input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        </div></section>
        <section className="form-section"><div className="section-head"><span className="label">ENDEREÇO</span><span className="required">OBRIGATÓRIO</span></div><div className="field-grid">
          <label>CEP<input inputMode="numeric" autoComplete="postal-code" maxLength={8} placeholder="00000000" value={form.zipCode} aria-describedby={cepMessage ? 'cep-lookup-message' : undefined} aria-invalid={cepStatus === 'error'} onChange={(e) => updateZipCode(e.target.value)} onBlur={() => { const cep = form.zipCode.replace(/\D/g, ''); if (cep.length === 8 && cepStatus === 'idle') void lookupCep(cep) }} />{cepMessage && <small id="cep-lookup-message" className={cepStatus === 'error' ? 'field-error' : 'field-status'} role={cepStatus === 'error' ? 'alert' : 'status'}>{cepMessage}</small>}</label><label>Rua ou avenida<input autoComplete="address-line1" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} /></label><label>Número<input id="address-number" autoComplete="address-line2" value={form.addressNumber} onChange={(e) => setForm({ ...form, addressNumber: e.target.value })} /></label><label>Bairro<input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></label><label>Cidade<input autoComplete="address-level2" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label><label>UF<input autoComplete="address-level1" maxLength={2} placeholder="SP" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} /></label>
        </div></section>
        <section className="form-section"><div className="section-head"><span className="label">RECEBIMENTO</span><span className="required">OBRIGATÓRIO</span></div><div className="field-grid"><label>Forma de recebimento<select value={form.receiptMethod} onChange={(e) => setForm({ ...form, receiptMethod: e.target.value })}><option value="BANK">Conta bancária</option><option value="PIX">Chave PIX</option></select></label>
          {form.receiptMethod === 'PIX' ? <><label>Tipo de chave PIX<select value={form.pixKeyType} onChange={(e) => setForm({ ...form, pixKeyType: e.target.value })}><option value="CPF">CPF</option><option value="CNPJ">CNPJ</option><option value="EMAIL">E-mail</option><option value="PHONE">Celular</option><option value="RANDOM">Aleatória</option></select></label><label>Chave PIX<input value={form.pixKey} onChange={(e) => setForm({ ...form, pixKey: e.target.value })} /></label></> : <><label>Banco<input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} /></label><label>Agência<input inputMode="numeric" value={form.bankBranch} onChange={(e) => setForm({ ...form, bankBranch: e.target.value })} /></label><label>Conta com dígito<input value={form.bankAccount} onChange={(e) => setForm({ ...form, bankAccount: e.target.value })} /></label><label>Tipo de conta<select value={form.bankAccountType} onChange={(e) => setForm({ ...form, bankAccountType: e.target.value })}><option value="corrente">Conta corrente</option><option value="poupanca">Conta poupança</option><option value="pagamento">Conta de pagamento</option></select></label></>}
        </div></section>
        <button type="button" className="continue" disabled={!dataReady || savingDraft} onClick={() => void continueFromData()}>{savingDraft ? 'SALVANDO COM SEGURANÇA…' : 'CONTINUAR'}</button>
      </>}

      {step === 2 && <section className="step-card"><div className="section-head"><span className="label">DOCUMENTOS</span><span className="required">VERIFICAÇÃO SEGURA</span></div><h2>Tenha seu documento em mãos.</h2><p>Você será direcionado para um ambiente protegido, onde usará a câmera para apresentar um RG ou CNH válido e concluir a prova de vida.</p><aside className="notice"><b>Proteção de dados.</b> As imagens do documento e a prova de vida são capturadas diretamente no ambiente de verificação; não envie fotos por WhatsApp.</aside><label className="consent step-consent"><input type="checkbox" checked={documentsReady} onChange={(event) => setDocumentsReady(event.target.checked)} /><span>Confirmo que possuo um documento de identificação válido e que ele está em meu nome.</span></label>
<section className="biometric-consent"><div className="section-head"><span className="label">AUTORIZAÇÃO ESPECÍFICA · DADO SENSÍVEL</span></div>
  <label className="consent"><input type="checkbox" checked={biometricConsent} onChange={(event) => setBiometricConsent(event.target.checked)} /><span>Autorizo a PegPay e a Didit a tratarem a <b>imagem do meu documento e os dados biométricos do meu rosto</b> (prova de vida), com a finalidade única de confirmar que sou eu. Estou ciente de que se trata de dado pessoal sensível, de que o tratamento ocorre <b>fora do Brasil</b>, de que posso revogar esta autorização a qualquer momento, e de que sem ela não é possível seguir com a proposta. Detalhes no <a href="/privacidade" target="_blank" rel="noreferrer">Aviso de Privacidade</a>.</span></label>
</section>
<div className="step-actions"><button type="button" className="secondary" onClick={() => setStep(1)}>VOLTAR</button><button type="button" className="continue" disabled={!documentsReady || !biometricConsent || savingDraft} onClick={() => void startKyc()}>{savingDraft ? 'SALVANDO…' : 'CONTINUAR'}</button></div></section>}

      {step === 3 && <section className="step-card"><div className="section-head"><span className="label">VERIFICAÇÃO DE IDENTIDADE</span><span className="required">OBRIGATÓRIO</span></div>{session.kycStatus === 'APPROVED' ? <><h2>Identidade verificada.</h2><p>Seu resultado foi confirmado. Continue para revisar e enviar a proposta.</p><div className="step-actions"><button type="button" className="secondary" onClick={() => setStep(2)}>VOLTAR</button><button type="button" className="continue" onClick={() => setStep(4)}>CONTINUAR</button></div></> : <><h2>Vamos confirmar sua identidade.</h2><p>A verificação ocorre em ambiente seguro e pode solicitar seu documento e uma prova de vida. Ao concluir, você retornará para esta proposta.</p><aside className="notice"><b>Importante.</b> A aprovação da identidade não representa a aprovação do empréstimo.</aside><div className="step-actions"><button type="button" className="secondary" onClick={() => setStep(2)}>VOLTAR</button>{session.kycStatus === 'PENDING' ? <><button type="button" className="secondary" disabled={savingDraft} onClick={() => void startKyc()}>REINICIAR VERIFICAÇÃO</button><button type="button" className="continue" onClick={() => void refreshKyc()}>JÁ CONCLUÍ</button></> : <button type="button" className="continue" onClick={() => void startKyc()}>CONTINUAR</button>}</div></>}</section>}

      {step === 4 && <section className="step-card"><div className="section-head"><span className="label">ENVIO DA PROPOSTA</span><span className="required">REVISÃO FINAL</span></div><h2>Confira antes de enviar.</h2><div className="review-grid"><div><span>NOME</span><strong>{form.fullName}</strong></div><div><span>RECEBIMENTO</span><strong>{form.receiptMethod === 'PIX' ? 'Chave PIX' : 'Conta bancária'}</strong></div><div><span>VERIFICAÇÃO</span><strong>{session.kycStatus === 'APPROVED' ? 'Identidade confirmada' : 'Em processamento'}</strong></div><div><span>PROTOCOLO</span><strong>{session.protocol}</strong></div></div>{session.kycStatus !== 'APPROVED' && <aside className="notice"><b>Verificação em andamento.</b> Você já pode revisar seus dados. O envio será liberado assim que a confirmação for concluída. Se você fechou a verificação antes do fim, <button type="button" className="linklike" disabled={savingDraft} onClick={() => void startKyc()}>refaça a verificação</button>.</aside>}<p>Ao enviar, sua solicitação seguirá para análise. O envio não garante aprovação do empréstimo.</p><div className="step-actions"><button type="button" className="secondary" onClick={() => setStep(3)}>VOLTAR</button><button className="continue" disabled={!readyToSend || submitting}>{submitting ? 'ENVIANDO COM SEGURANÇA…' : session.kycStatus === 'APPROVED' ? 'ENVIAR PROPOSTA' : 'AGUARDANDO VERIFICAÇÃO'}</button></div></section>}

      {message && <p className="error" role="alert">{message}</p>}
      <p className="support">Dúvidas: <a href="mailto:contato@pegpay.com.br">contato@pegpay.com.br</a> · <a href="tel:+5511992166696">(11) 99216-6696</a> · <a href="/privacidade">Privacidade</a> · <a href="/cookies">Cookies</a></p>
    </form>
    {showWelcome && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="welcome-title"><section className="welcome-card"><div className="eyebrow">CADASTRO SEGURO</div><h1 id="welcome-title">Conclua sua solicitação.</h1><div className="proposal-summary"><div><span>VALOR SOLICITADO</span><strong className="tnum">{money(session.amountCents)}</strong></div><div><span>PARCELAS DESEJADAS</span><strong className="tnum">{session.installments ?? 'A confirmar'}</strong></div></div><aside className="notice"><b>Sua segurança vem primeiro.</b> Nunca informe senha, CVV, token, código SMS ou código do WhatsApp.</aside><label className="consent modal-consent"><input type="checkbox" checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} /><span>Li o <a href="/privacidade" target="_blank" rel="noreferrer">Aviso de Privacidade</a> e autorizo a PegPay a tratar meus dados pessoais para analisar minha solicitação de empréstimo. A verificação de identidade é autorizada em separado, mais adiante. Entendo que o envio não garante aprovação do empréstimo.</span></label><button type="button" className="continue" disabled={!privacyAccepted} onClick={beginRegistration}>INICIAR CADASTRO</button></section></div>}
  </main>
}

function AdminPortal() {
  const [email, setEmail] = useState('contato@pegpay.com.br'); const [password, setPassword] = useState(''); const [proposals, setProposals] = useState<AdminProposal[] | null>(null); const [message, setMessage] = useState('')
  const [mfaChallenge, setMfaChallenge] = useState<string | null>(null); const [mfaCode, setMfaCode] = useState(''); const [mfaSetupKey, setMfaSetupKey] = useState<string | null>(null)
  const [details, setDetails] = useState<Record<string, string> | null>(null); const [detailId, setDetailId] = useState<string | null>(null)
  const load = () => api<{ email: string; proposals: AdminProposal[] }>('/api/v1/admin/proposals').then((data) => setProposals(data.proposals)).catch(() => setProposals(null))
  useEffect(() => { void load() }, [])
  async function login(event: FormEvent) {
    event.preventDefault(); setMessage('')
    try {
      const result = await api<{ email: string; mfaRequired?: boolean; mfaEnrollmentRequired?: boolean; challengeToken?: string; manualEntryKey?: string }>('/api/v1/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      if (!result.challengeToken) throw new Error('Não foi possível iniciar a verificação de segurança.')
      setMfaChallenge(result.challengeToken); setMfaSetupKey(result.mfaEnrollmentRequired ? result.manualEntryKey ?? null : null); setPassword('')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha no login.') }
  }
  async function verifyMfa(event: FormEvent) {
    event.preventDefault(); setMessage('')
    try {
      if (!mfaChallenge) throw new Error('A verificação expirou. Entre novamente.')
      await api<{ email: string }>('/api/v1/admin/mfa/verify', { method: 'POST', body: JSON.stringify({ challengeToken: mfaChallenge, code: mfaCode }) })
      setMfaChallenge(null); setMfaSetupKey(null); setMfaCode(''); await load()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha ao validar o código.') }
  }
  async function activateMfa() {
    setMessage('')
    try {
      const result = await api<{ challengeToken: string; manualEntryKey: string }>('/api/v1/admin/mfa/activate', { method: 'POST' })
      setMfaChallenge(result.challengeToken); setMfaSetupKey(result.manualEntryKey)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível ativar o segundo fator.') }
  }
  async function prepareKyc() { try { await api<{ prepared: boolean }>('/api/v1/admin/kyc/prepare', { method: 'POST' }); setMessage('Estrutura Didit preparada. Faça o teste de webhook antes de ativar clientes.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível preparar o KYC.') } }
  async function setStatus(proposalId: string, status: ProposalStatus) { try { await api<{ status: ProposalStatus }>('/api/v1/admin/status', { method: 'POST', body: JSON.stringify({ proposalId, status }) }); await load() } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha ao atualizar.') } }
  async function showDetails(proposalId: string) { try { const result = await api<{ customer: Record<string, string> }>(`/api/v1/admin/proposal?proposalId=${encodeURIComponent(proposalId)}`); setDetailId(proposalId); setDetails(result.customer) } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha ao consultar os dados.') } }
  const actions = useMemo(() => ({ RECEIVED: ['UNDER_REVIEW'], UNDER_REVIEW: ['PENDING', 'APPROVED', 'REJECTED'], PENDING: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'] } as Partial<Record<ProposalStatus, ProposalStatus[]>>), [])
  if (mfaChallenge || !proposals) return <><Header /><main className="admin-shell"><div className="eyebrow">ACESSO INTERNO</div><h1>Painel de propostas.</h1>{mfaChallenge ? <form className="login-panel" onSubmit={verifyMfa}>{mfaSetupKey ? <><p>Adicione esta chave no Google Authenticator, Microsoft Authenticator ou 1Password. Guarde-a em local seguro; ela é exibida somente agora.</p><label>Chave de configuração<input readOnly value={mfaSetupKey} onFocus={(event) => event.currentTarget.select()} /></label></> : <p>Abra seu aplicativo autenticador e informe o código atual.</p>}<label>Código de seis dígitos<input required inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={mfaCode} onChange={(event) => setMfaCode(event.target.value.replace(/\D/g, ''))} /></label>{message && <p className="error">{message}</p>}<button className="primary">CONFIRMAR SEGUNDO FATOR</button></form> : <form className="login-panel" onSubmit={login}><label>E-mail autorizado<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Senha<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>{message && <p className="error">{message}</p>}<button className="primary">ENTRAR</button></form>}</main></>
  return <><Header /><main className="admin-shell"><div className="eyebrow">ACESSO INTERNO · CONTATO@PEGPAY.COM.BR</div><h1>Propostas recebidas.</h1><div className="admin-actions"><a href="/api/v1/admin/export">BAIXAR PLANILHA CSV</a><button type="button" onClick={() => void activateMfa()}>ATIVAR MFA</button><button type="button" onClick={() => void prepareKyc()}>PREPARAR DIDIT</button><span>H CRED: SANDBOX AINDA NÃO CONFIGURADO</span></div>{message && <p className="error">{message}</p>}<div className="proposal-list">{proposals.length === 0 && <p>Nenhuma proposta enviada.</p>}{proposals.map((proposal) => <article className="proposal-card" key={proposal.id}><div className="proposal-card-head"><strong>{proposal.protocol}</strong><span>{proposal.status}</span></div><div className="admin-grid"><p><small>CLIENTE</small>{proposal.customer?.fullName ?? '—'}</p><p><small>CPF</small>{proposal.customer?.cpfMasked ?? '—'}</p><p><small>VALOR</small>{money(proposal.amountCents)}</p><p><small>PARCELAS</small>{proposal.installments ?? '—'}</p></div>{detailId === proposal.id && details && <div className="admin-grid"><p><small>CPF COMPLETO</small>{details.cpf}</p><p><small>RG/CNH</small>{details.rg}</p><p><small>NASCIMENTO</small>{details.birthDate}</p><p><small>CELULAR</small>{details.phone}</p><p><small>E-MAIL</small>{details.email}</p><p><small>ENDEREÇO</small>{`${details.street}, ${details.addressNumber} · ${details.district} · ${details.city}/${details.state} · ${details.zipCode}`}</p><p><small>RECEBIMENTO</small>{details.receiptMethod === 'PIX' ? `PIX ${details.pixKeyType}: ${details.pixKey}` : `${details.bankName} · Ag. ${details.bankBranch} · Conta ${details.bankAccount} · ${details.bankAccountType}`}</p></div>}<div className="admin-actions"><button type="button" onClick={() => void showDetails(proposal.id)}>VER DADOS</button><a target="_blank" href={`/api/v1/admin/documents?proposalId=${proposal.id}&kind=SELFIE_WITH_DOCUMENT`}>BAIXAR SELFIE</a><a target="_blank" href={`/api/v1/admin/documents?proposalId=${proposal.id}&kind=IDENTITY_DOCUMENT_FRONT`}>BAIXAR FRENTE</a><a target="_blank" href={`/api/v1/admin/documents?proposalId=${proposal.id}&kind=IDENTITY_DOCUMENT_BACK`}>BAIXAR VERSO</a>{(actions[proposal.status] ?? []).map((status) => <button type="button" key={status} onClick={() => void setStatus(proposal.id, status)}>{status}</button>)}</div></article>)}</div></main></>
}

export default function App() { return window.location.pathname === '/admin' ? <AdminPortal /> : window.location.pathname === '/privacidade' ? <PrivacyNotice /> : window.location.pathname === '/cookies' ? <CookieNotice /> : <CustomerPortalV2 /> }
