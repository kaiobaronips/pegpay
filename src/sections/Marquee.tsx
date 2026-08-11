const ITEMS = [
  "Crédito sem enrolação",
  "Simule em 2 minutos",
  "Parcela fixa",
  "Taxa a partir de 1,29% a.m.",
  "100% seguro, 100% digital",
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="waves-peg overflow-hidden border-y-2 border-ink py-4" aria-hidden="true">
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center whitespace-nowrap font-archivo text-[18px] font-extrabold uppercase tracking-[0.02em] text-paper"
              >
                <span className="px-6">{item}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0">
                  <path d="M0 0h10l4 4v10H0z" fill="#201E1D" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
