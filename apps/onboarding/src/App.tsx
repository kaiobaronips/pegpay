import { upload } from '@vercel/blob/client'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'

type CameraStatus = 'idle' | 'active' | 'captured' | 'error'
type DocumentKind = 'SELFIE_WITH_DOCUMENT' | 'IDENTITY_DOCUMENT_FRONT' | 'IDENTITY_DOCUMENT_BACK'
type ProposalStatus = 'DRAFT' | 'RECEIVED' | 'UNDER_REVIEW' | 'PENDING' | 'APPROVED' | 'REJECTED'

interface SessionData { id: string; protocol: string; status: ProposalStatus; amountCents: number | null; installments: number | null; documents: DocumentKind[] }
interface AdminProposal { id: string; protocol: string; status: ProposalStatus; amountCents: number | null; installments: number | null; customer: { fullName: string; cpfMasked: string } | null; documentCount: number; submittedAt: string | null }

function PegSymbol() {
  return <svg width="38" height="38" viewBox="0 0 100 100" aria-hidden="true"><path d="M0 0H74L100 26V100H0Z" fill="#E94E1B" /><path d="M22 22h16v56H22z M38 22h28v14H38z M52 22h14v42H52z M38 50h28v14H38z" fill="#F3F2F2" /></svg>
}

function Header() {
  return <header className="topbar"><a className="brand" href="https://www.pegpay.com.br" aria-label="PegPay"><PegSymbol /><strong>PegPay</strong></a><span className="secure">AMBIENTE PROTEGIDO</span></header>
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

function CustomerPortal() {
  const [token] = useState(() => new URLSearchParams(window.location.search).get('token') ?? '')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle')
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  const [documentFrontFile, setDocumentFrontFile] = useState<File | null>(null)
  const [documentBackFile, setDocumentBackFile] = useState<File | null>(null)
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(Boolean(token))
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(token ? '' : 'Este link não identifica uma proposta. Volte ao WhatsApp e solicite um novo link.')
  const [successProtocol, setSuccessProtocol] = useState<string | null>(null)
  const [form, setForm] = useState({ fullName: '', cpf: '', birthDate: '', email: '', rg: '', phone: '', zipCode: '', street: '', addressNumber: '', district: '', city: '', state: '', receiptMethod: 'BANK', pixKeyType: 'CPF', pixKey: '', bankName: '', bankBranch: '', bankAccount: '', bankAccountType: 'corrente', consent: false })

  const stopCamera = () => { streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null }
  useEffect(() => () => stopCamera(), [])
  useEffect(() => {
    if (!token) return
    window.history.replaceState({}, document.title, window.location.pathname)
    api<SessionData>(`/api/v1/proposals/session?token=${encodeURIComponent(token)}`)
      .then((data) => { setSession(data); if (data.status !== 'DRAFT') setSuccessProtocol(data.protocol) })
      .catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Link inválido.'))
      .finally(() => setLoading(false))
  }, [token])
  useEffect(() => () => { if (selfiePreview) URL.revokeObjectURL(selfiePreview) }, [selfiePreview])

  async function startCamera() {
    setMessage('')
    if (!navigator.mediaDevices?.getUserMedia) { setCameraStatus('error'); setMessage('Este navegador não permite usar a câmera.'); return }
    try {
      stopCamera()
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraStatus('active')
    } catch { setCameraStatus('error'); setMessage('Não foi possível acessar a câmera. Verifique a permissão.') }
  }

  function captureSelfie() {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return
    const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight
    const context = canvas.getContext('2d'); if (!context) return
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) return
      if (selfiePreview) URL.revokeObjectURL(selfiePreview)
      const file = new File([blob], 'selfie-documento.jpg', { type: 'image/jpeg' })
      setSelfieFile(file); setSelfiePreview(URL.createObjectURL(file)); stopCamera(); setCameraStatus('captured')
    }, 'image/jpeg', 0.86)
  }

  async function uploadDocument(kind: DocumentKind, file: File): Promise<void> {
    if (!session) throw new Error('Proposta não carregada.')
    if (file.size > 4 * 1024 * 1024) throw new Error('Cada arquivo deve ter no máximo 4 MB.')
    const extension = file.type === 'application/pdf' ? 'pdf' : file.type === 'image/png' ? 'png' : 'jpg'
    const pathname = `proposals/${session.id}/${kind.toLowerCase()}/${crypto.randomUUID()}.${extension}`
    const blob = await upload(pathname, file, { access: 'private', handleUploadUrl: '/api/v1/uploads', clientPayload: JSON.stringify({ token, kind }) })
    await api<{ kind: DocumentKind }>('/api/v1/proposals/confirm-upload', { method: 'POST', body: JSON.stringify({ token, kind, pathname: blob.pathname }) })
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setMessage(''); setSubmitting(true)
    try {
      const existing = new Set(session?.documents ?? [])
      if (selfieFile) await uploadDocument('SELFIE_WITH_DOCUMENT', selfieFile)
      else if (!existing.has('SELFIE_WITH_DOCUMENT')) throw new Error('Tire a selfie com o documento.')
      if (documentFrontFile) await uploadDocument('IDENTITY_DOCUMENT_FRONT', documentFrontFile)
      else if (!existing.has('IDENTITY_DOCUMENT_FRONT')) throw new Error('Selecione a frente do RG ou da CNH.')
      if (documentBackFile) await uploadDocument('IDENTITY_DOCUMENT_BACK', documentBackFile)
      else if (!existing.has('IDENTITY_DOCUMENT_BACK')) throw new Error('Selecione o verso do RG ou da CNH.')
      const result = await api<{ protocol: string; status: ProposalStatus }>('/api/v1/proposals/submit', { method: 'POST', body: JSON.stringify({ token, ...form }) })
      setSuccessProtocol(result.protocol)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível enviar a proposta.') }
    finally { setSubmitting(false) }
  }

  if (loading) return <><Header /><main className="state-page"><h1>Carregando proposta…</h1></main></>
  if (successProtocol) {
    const statusCopy: Record<Exclude<ProposalStatus, 'DRAFT'>, [string, string]> = {
      RECEIVED: ['PROPOSTA RECEBIDA', 'Cadastro enviado com segurança.'],
      UNDER_REVIEW: ['EM ANÁLISE', 'Sua proposta está sendo analisada.'],
      PENDING: ['PENDÊNCIA', 'A proposta precisa de informações adicionais. Fale com a PegPay.'],
      APPROVED: ['PROPOSTA APROVADA', 'Sua proposta foi aprovada. Aguarde as orientações da PegPay.'],
      REJECTED: ['PROPOSTA NÃO APROVADA', 'A proposta não foi aprovada nesta análise.'],
    }
    const copy = session?.status && session.status !== 'DRAFT' ? statusCopy[session.status] : statusCopy.RECEIVED
    return <><Header /><main className="state-page success-page"><div className="eyebrow">{copy[0]}</div><h1>{copy[1]}</h1><p>Protocolo: <strong className="tnum">{successProtocol}</strong></p><p>Para acompanhamento, fale com contato@pegpay.com.br. O envio não representa aprovação.</p></main></>
  }
  if (!session) return <><Header /><main className="state-page"><div className="eyebrow">LINK INVÁLIDO</div><h1>Solicite um novo link pelo WhatsApp.</h1>{message && <p className="error" role="alert">{message}</p>}</main></>

  const hasSelfie = session.documents.includes('SELFIE_WITH_DOCUMENT') || Boolean(selfieFile)
  const hasDocumentFront = session.documents.includes('IDENTITY_DOCUMENT_FRONT') || Boolean(documentFrontFile)
  const hasDocumentBack = session.documents.includes('IDENTITY_DOCUMENT_BACK') || Boolean(documentBackFile)
  const receiptReady = form.receiptMethod === 'PIX' ? form.pixKeyType && form.pixKey : form.bankName && form.bankBranch && form.bankAccount
  const ready = hasSelfie && hasDocumentFront && hasDocumentBack && form.fullName && form.cpf && form.birthDate && form.email && form.rg && form.phone && form.zipCode && form.street && form.addressNumber && form.district && form.city && form.state && receiptReady && form.consent

  return <main><Header /><section className="progress" aria-label="Andamento da proposta"><div className="current"><b>01</b><span>Dados</span></div><div className="current"><b>02</b><span>Documentos</span></div><div className="current"><b>03</b><span>Verificação</span></div><div><b>04</b><span>Envio</span></div></section>
    <form className="shell" onSubmit={submit}><div className="eyebrow">CADASTRO SEGURO · {session.protocol}</div><h1>Conclua sua proposta.</h1>
      <div className="proposal-summary"><div><span>VALOR SOLICITADO</span><strong className="tnum">{money(session.amountCents)}</strong></div><div><span>PARCELAS DESEJADAS</span><strong className="tnum">{session.installments ?? 'A confirmar'}</strong></div></div>
      <aside className="notice"><b>Sua segurança vem primeiro.</b> Nunca informe senha, CVV, token, código SMS ou código do WhatsApp.</aside>
      <section className="form-section"><div className="section-head"><span className="label">01 · DADOS PESSOAIS</span><span className="required">OBRIGATÓRIO</span></div><div className="field-grid">
        <label>Nome completo<input required autoComplete="name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label><label>CPF<input required inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} /></label><label>RG ou CNH<input required value={form.rg} onChange={(e) => setForm({ ...form, rg: e.target.value })} /></label><label>Data de nascimento<input required type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} /></label><label>Celular<input required inputMode="tel" autoComplete="tel" placeholder="11999999999" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><label>E-mail<input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      </div></section>
      <section className="form-section"><div className="section-head"><span className="label">02 · ENDEREÇO</span><span className="required">OBRIGATÓRIO</span></div><div className="field-grid">
        <label>CEP<input required inputMode="numeric" placeholder="00000000" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} /></label><label>Rua ou avenida<input required autoComplete="street-address" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} /></label><label>Número<input required value={form.addressNumber} onChange={(e) => setForm({ ...form, addressNumber: e.target.value })} /></label><label>Bairro<input required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></label><label>Cidade<input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label><label>UF<input required maxLength={2} placeholder="SP" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} /></label>
      </div></section>
      <section className="form-section"><div className="section-head"><span className="label">03 · RECEBIMENTO</span><span className="required">OBRIGATÓRIO</span></div><div className="field-grid"><label>Forma de recebimento<select value={form.receiptMethod} onChange={(e) => setForm({ ...form, receiptMethod: e.target.value })}><option value="BANK">Conta bancária</option><option value="PIX">Chave PIX</option></select></label>
        {form.receiptMethod === 'PIX' ? <><label>Tipo de chave PIX<select value={form.pixKeyType} onChange={(e) => setForm({ ...form, pixKeyType: e.target.value })}><option value="CPF">CPF</option><option value="CNPJ">CNPJ</option><option value="EMAIL">E-mail</option><option value="PHONE">Celular</option><option value="RANDOM">Aleatória</option></select></label><label>Chave PIX<input required value={form.pixKey} onChange={(e) => setForm({ ...form, pixKey: e.target.value })} /></label></> : <><label>Banco<input required value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} /></label><label>Agência<input required inputMode="numeric" value={form.bankBranch} onChange={(e) => setForm({ ...form, bankBranch: e.target.value })} /></label><label>Conta com dígito<input required value={form.bankAccount} onChange={(e) => setForm({ ...form, bankAccount: e.target.value })} /></label><label>Tipo de conta<select value={form.bankAccountType} onChange={(e) => setForm({ ...form, bankAccountType: e.target.value })}><option value="corrente">Conta corrente</option><option value="poupanca">Conta poupança</option><option value="pagamento">Conta de pagamento</option></select></label></>}
      </div></section>
      <section className="form-section"><div className="section-head"><span className="label">04 · DOCUMENTOS</span><span className="required">OBRIGATÓRIO</span></div><div className="capture-grid">
        <section className="panel"><div className="panel-head"><span className="label">SELFIE COM DOCUMENTO</span><span className="required">{hasSelfie ? 'PRONTO' : 'PENDENTE'}</span></div><div className="camera-stage">{selfiePreview ? <img src={selfiePreview} alt="Selfie capturada" /> : <video ref={videoRef} autoPlay playsInline muted />}{!selfiePreview && cameraStatus !== 'active' && <span className="camera-empty">Segure o RG ou a CNH ao lado do rosto.</span>}</div><div className="actions">{cameraStatus === 'active' ? <button type="button" className="primary" onClick={captureSelfie}>TIRAR FOTO</button> : <button type="button" className="primary" onClick={startCamera}>{hasSelfie ? 'TIRAR OUTRA FOTO' : 'ABRIR CÂMERA'}</button>}</div></section>
        <section className="panel"><div className="panel-head"><span className="label">RG OU CNH · FRENTE</span><span className="required">{hasDocumentFront ? 'PRONTO' : 'PENDENTE'}</span></div><label className="upload" htmlFor="document-front-upload"><span className="upload-mark">+</span><strong>{documentFrontFile?.name ?? (hasDocumentFront ? 'ARQUIVO RECEBIDO' : 'SELECIONE A FRENTE')}</strong><small>JPG, PNG ou PDF · máximo de 4 MB.</small></label><input id="document-front-upload" type="file" accept="image/jpeg,image/png,application/pdf" capture="environment" onChange={(event) => setDocumentFrontFile(event.target.files?.[0] ?? null)} /></section>
        <section className="panel"><div className="panel-head"><span className="label">RG OU CNH · VERSO</span><span className="required">{hasDocumentBack ? 'PRONTO' : 'PENDENTE'}</span></div><label className="upload" htmlFor="document-back-upload"><span className="upload-mark">+</span><strong>{documentBackFile?.name ?? (hasDocumentBack ? 'ARQUIVO RECEBIDO' : 'SELECIONE O VERSO')}</strong><small>JPG, PNG ou PDF · máximo de 4 MB.</small></label><input id="document-back-upload" type="file" accept="image/jpeg,image/png,application/pdf" capture="environment" onChange={(event) => setDocumentBackFile(event.target.files?.[0] ?? null)} /></section>
      </div></section>
      <label className="consent"><input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} /><span>Confirmo que os dados e as imagens são meus e autorizo seu uso para cadastro, prevenção a fraude e análise da proposta. Entendo que o envio não garante aprovação.</span></label>
      {message && <p className="error" role="alert">{message}</p>}<button className="continue" disabled={!ready || submitting}>{submitting ? 'ENVIANDO COM SEGURANÇA…' : 'CONTINUAR PROPOSTA'}</button><p className="support">Dúvidas: <a href="mailto:contato@pegpay.com.br">contato@pegpay.com.br</a> · <a href="tel:+5511992166696">(11) 99216-6696</a></p>
    </form></main>
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
  async function setStatus(proposalId: string, status: ProposalStatus) { try { await api<{ status: ProposalStatus }>('/api/v1/admin/status', { method: 'POST', body: JSON.stringify({ proposalId, status }) }); await load() } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha ao atualizar.') } }
  async function showDetails(proposalId: string) { try { const result = await api<{ customer: Record<string, string> }>(`/api/v1/admin/proposal?proposalId=${encodeURIComponent(proposalId)}`); setDetailId(proposalId); setDetails(result.customer) } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha ao consultar os dados.') } }
  const actions = useMemo(() => ({ RECEIVED: ['UNDER_REVIEW'], UNDER_REVIEW: ['PENDING', 'APPROVED', 'REJECTED'], PENDING: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'] } as Partial<Record<ProposalStatus, ProposalStatus[]>>), [])
  if (mfaChallenge || !proposals) return <><Header /><main className="admin-shell"><div className="eyebrow">ACESSO INTERNO</div><h1>Painel de propostas.</h1>{mfaChallenge ? <form className="login-panel" onSubmit={verifyMfa}>{mfaSetupKey ? <><p>Adicione esta chave no Google Authenticator, Microsoft Authenticator ou 1Password. Guarde-a em local seguro; ela é exibida somente agora.</p><label>Chave de configuração<input readOnly value={mfaSetupKey} onFocus={(event) => event.currentTarget.select()} /></label></> : <p>Abra seu aplicativo autenticador e informe o código atual.</p>}<label>Código de seis dígitos<input required inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={mfaCode} onChange={(event) => setMfaCode(event.target.value.replace(/\D/g, ''))} /></label>{message && <p className="error">{message}</p>}<button className="primary">CONFIRMAR SEGUNDO FATOR</button></form> : <form className="login-panel" onSubmit={login}><label>E-mail autorizado<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Senha<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>{message && <p className="error">{message}</p>}<button className="primary">ENTRAR</button></form>}</main></>
  return <><Header /><main className="admin-shell"><div className="eyebrow">ACESSO INTERNO · CONTATO@PEGPAY.COM.BR</div><h1>Propostas recebidas.</h1><div className="admin-actions"><a href="/api/v1/admin/export">BAIXAR PLANILHA CSV</a><button type="button" onClick={() => void activateMfa()}>ATIVAR MFA</button><span>H CRED: SANDBOX AINDA NÃO CONFIGURADO</span></div>{message && <p className="error">{message}</p>}<div className="proposal-list">{proposals.length === 0 && <p>Nenhuma proposta enviada.</p>}{proposals.map((proposal) => <article className="proposal-card" key={proposal.id}><div className="proposal-card-head"><strong>{proposal.protocol}</strong><span>{proposal.status}</span></div><div className="admin-grid"><p><small>CLIENTE</small>{proposal.customer?.fullName ?? '—'}</p><p><small>CPF</small>{proposal.customer?.cpfMasked ?? '—'}</p><p><small>VALOR</small>{money(proposal.amountCents)}</p><p><small>PARCELAS</small>{proposal.installments ?? '—'}</p></div>{detailId === proposal.id && details && <div className="admin-grid"><p><small>CPF COMPLETO</small>{details.cpf}</p><p><small>RG/CNH</small>{details.rg}</p><p><small>NASCIMENTO</small>{details.birthDate}</p><p><small>CELULAR</small>{details.phone}</p><p><small>E-MAIL</small>{details.email}</p><p><small>ENDEREÇO</small>{`${details.street}, ${details.addressNumber} · ${details.district} · ${details.city}/${details.state} · ${details.zipCode}`}</p><p><small>RECEBIMENTO</small>{details.receiptMethod === 'PIX' ? `PIX ${details.pixKeyType}: ${details.pixKey}` : `${details.bankName} · Ag. ${details.bankBranch} · Conta ${details.bankAccount} · ${details.bankAccountType}`}</p></div>}<div className="admin-actions"><button type="button" onClick={() => void showDetails(proposal.id)}>VER DADOS</button><a target="_blank" href={`/api/v1/admin/documents?proposalId=${proposal.id}&kind=SELFIE_WITH_DOCUMENT`}>BAIXAR SELFIE</a><a target="_blank" href={`/api/v1/admin/documents?proposalId=${proposal.id}&kind=IDENTITY_DOCUMENT_FRONT`}>BAIXAR FRENTE</a><a target="_blank" href={`/api/v1/admin/documents?proposalId=${proposal.id}&kind=IDENTITY_DOCUMENT_BACK`}>BAIXAR VERSO</a>{(actions[proposal.status] ?? []).map((status) => <button type="button" key={status} onClick={() => void setStatus(proposal.id, status)}>{status}</button>)}</div></article>)}</div></main></>
}

export default function App() { return window.location.pathname === '/admin' ? <AdminPortal /> : <CustomerPortal /> }
