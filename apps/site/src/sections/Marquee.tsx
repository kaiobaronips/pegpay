// ADR-003: nenhuma menção a taxa. O letreiro carrega promessa de
// experiência, não condição comercial.
const ITENS = [
  "Crédito sem enrolação",
  "Fale com gente de verdade",
  "Parcela fixa",
  "Sem fila, sem agência",
  "100% seguro, 100% digital",
];

export default function Marquee() {
  const linha = [...ITENS, ...ITENS];

  return (
    <div className="overflow-hidden border-y-2 border-ink bg-ink py-4 text-paper">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {linha.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10">
            <span className="label text-paper">{item}</span>
            <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
              <path d="M0 0h9l3 3v9H0z" fill="#E94E1B" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
