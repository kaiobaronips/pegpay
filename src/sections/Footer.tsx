import Logo from "@/components/Logo";

const COLUNAS = [
  {
    titulo: "Produto",
    links: ["Garantia de veículo", "Garantia de imóvel", "Simulador", "App PegPay"],
  },
  {
    titulo: "Empresa",
    links: ["Sobre a PegPay", "Carreiras", "Imprensa", "Parceiros"],
  },
  {
    titulo: "Ajuda",
    links: ["Central de ajuda", "Dúvidas frequentes", "Segurança", "Privacidade"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-paper/15 bg-ink text-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <Logo variant="light" />
            <p className="mt-5 max-w-[30ch] text-[14px] leading-relaxed text-paper/55">
              Crédito com garantia para quem já tem patrimônio. Simulação em dois
              minutos, parcela fixa, custo na cara.
            </p>
          </div>
          {COLUNAS.map((c) => (
            <nav key={c.titulo} aria-label={c.titulo}>
              <p className="label text-paper/40">{c.titulo}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#topo"
                      className="text-[14px] text-paper/70 transition-colors hover:text-peg"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 border-t-2 border-paper/15 pt-8">
          <p className="max-w-[86ch] text-[12px] leading-relaxed text-paper/45">
            PegPay Instituição de Pagamento S.A. · CNPJ 00.000.000/0001-00 · Av.
            Paulista, 1000 — São Paulo, SP. A PegPay atua como correspondente
            bancário nos termos da Resolução CMN nº 4.935/2021. A PegPay nunca
            solicita pagamento antecipado para liberação de crédito — desconfie de
            contatos fora do app ou deste site.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[12px] text-paper/40">
              © 2026 PegPay. Todos os direitos reservados.
            </p>
            <p className="label text-paper/40">Feito com régua: nenhum canto arredondado.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
