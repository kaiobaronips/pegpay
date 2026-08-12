import { Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router";

import Logo from "@/components/Logo";
import { WHATSAPP_EXIBICAO, WHATSAPP_URL } from "@/lib/contato";

type ColunaLink = { label: string; href: string; interno?: boolean };

const COLUNAS: { titulo: string; links: ColunaLink[] }[] = [
  {
    titulo: "Para você",
    links: [
      { label: "Empréstimo com cartão", href: "/para-voce/emprestimo-com-cartao", interno: true },
      { label: "Consignado CLT", href: "/para-voce/credito-consignado-clt", interno: true },
      { label: "Empréstimo com garantia", href: "/para-voce/emprestimo-com-garantia", interno: true },
      { label: "App PegPay", href: "#app" },
    ],
  },
  {
    titulo: "Institucional",
    links: [
      { label: "Sobre nós", href: "/sobre-nos", interno: true },
      { label: "Renda extra", href: "/renda-extra", interno: true },
      { label: "Garantias", href: "/garantias", interno: true },
      { label: "Como funciona", href: "/#como-funciona" },
    ],
  },
  {
    titulo: "Ajuda",
    links: [
      { label: "Central de ajuda", href: "/ajuda", interno: true },
      { label: "Dúvidas frequentes", href: "/#duvidas" },
      { label: "Segurança", href: "/seguranca", interno: true },
      { label: "Privacidade", href: "/privacidade", interno: true },
    ],
  },
];

function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 4c.7 1.9 2.1 3.4 4 4.2" />
      <path d="M10 11.5a3.5 3.5 0 1 0 3.5 3.5V4h2" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
  { label: "TikTok", href: "https://tiktok.com", icon: TikTokIcon },
];

function AppStoreBadge() {
  return (
    <img
      src="/images/app-store.webp"
      alt="Baixar na App Store"
      className="h-[46px] w-[156px] rounded-[14px] object-cover"
      loading="lazy"
    />
  );
}

function GooglePlayBadge() {
  return (
    <svg viewBox="0 0 320 95" aria-hidden="true" className="h-auto w-[156px]">
      <rect x="1.5" y="1.5" width="317" height="92" rx="18" fill="#fff" stroke="#fff" strokeWidth="3" />
      <path d="M37 24.5c0-2.7 3.1-4.2 5.3-2.8L82.7 48 42.3 74.3c-2.2 1.4-5.3-.1-5.3-2.8V24.5Z" fill="#5C7BC0" />
      <path d="M42.8 21.3c1.6-.9 3.4-.8 5 .1l31.3 18.7-15.5 15.4-26.9-34.2c1.7-.8 4-.8 6.1 0Z" fill="#3CAF49" />
      <path d="M79.1 40.1 97 50.8c3.8 2.3 3.8 7.8 0 10.1L79.1 71.6 63.6 56.1l15.5-16Z" fill="#FDBD10" />
      <path d="M36.7 74.7 63.6 56l15.5 15.6-31.3 18.7c-1.6 1-3.4 1-5 0-2.1-.8-3.5-2.9-3.5-5.6Z" fill="#F42B2C" />
      <text x="116" y="34" fill="#000" fontFamily="Archivo, system-ui, sans-serif" fontSize="11" fontWeight="700">
        DISPONÍVEL NO
      </text>
      <text x="116" y="73" fill="#000" fontFamily="Archivo, system-ui, sans-serif" fontSize="34" fontWeight="700">
        Google Play
      </text>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t-2 border-paper/15 bg-black text-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <Logo variant="light" />
            <p className="mt-5 max-w-[30ch] text-[14px] leading-relaxed text-paper/55">
              Crédito sem enrolação para quem o banco não enxerga. Desde 2019,
              mais de 412 mil pessoas atendidas.
            </p>
            <div className="mt-6">
              <p className="font-archivo text-[14px] font-extrabold text-peg">Siga a gente</p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {SOCIALS.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex h-12 w-12 items-center justify-center text-paper transition-colors hover:text-peg"
                    >
                      <Icon className="h-6 w-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {COLUNAS.map((c) => (
            <nav key={c.titulo} aria-label={c.titulo}>
              <p className="label text-paper/40">{c.titulo}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {l.interno ? (
                      <Link
                        to={l.href}
                        className="text-[14px] text-paper/70 transition-colors hover:text-peg"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        className="text-[14px] text-paper/70 transition-colors hover:text-peg"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="label text-paper/40">Contato</p>
            <p className="mt-4 max-w-[26ch] text-[14px] leading-relaxed text-paper/70">
              A PegPay não tem cadastro por formulário. Fale direto com o time no
              WhatsApp oficial.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block bg-peg px-6 py-3 font-archivo text-[14px] font-extrabold text-paper transition-colors hover:bg-peg-dark"
            >
              Entrar em contato
            </a>
            <p className="tnum mt-3 text-[14px] text-paper/55">{WHATSAPP_EXIBICAO}</p>
          </div>
        </div>

        <div className="mt-14 border-t-2 border-paper/15 pt-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="max-w-[86ch] text-[12px] leading-relaxed text-paper/45">
                PegPay Soluções Digitais · CNPJ 00.000.000/0001-00 · Rua Bom
                Jesus, 212 - Sala 1904, Andar 19 — Curitiba, PR. Não somos
                instituição financeira, atuamos como Correspondente Bancário da
                MOVA S.E.P. S.A. sob Res. CMN 4.935/21, e tomadora de BaaS
                (Res. Conjunta CMN/BCB 16/25) de CELCOIN I.P. S.A. (CNPJ
                13.935.893/0001-09) e DOCK I.P. S.A. (CNPJ 13.370.835/0001-85).
                Crédito, contas e moedas eletrônicas são de responsabilidade das
                parceiras autorizadas pelo BCB.
              </p>
              <p className="mt-4 max-w-[86ch] text-[12px] leading-relaxed text-paper/45">
                A PegPay nunca solicita pagamento antecipado para liberação de
                crédito — desconfie de contatos fora do app ou deste site.
              </p>
              <p className="mt-6 text-[12px] text-paper/40">
                © 2026 PegPay. Todos os direitos reservados.
              </p>
            </div>
            <div id="app" className="scroll-mt-[88px] lg:min-w-[360px]">
              <div className="text-left">
                <p className="font-archivo text-[18px] font-extrabold text-peg">
                  Leve a gente no bolso.
                </p>
                <p className="mt-1 text-[14px] text-paper/65">Baixe o app</p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <AppStoreBadge />
                <GooglePlayBadge />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
