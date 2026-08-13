import { Link } from "react-router";

interface LogoProps {
  /** "dark" = símbolo laranja sobre papel · "light" = símbolo papel sobre laranja para fundos escuros */
  variant?: "dark" | "light";
  compact?: boolean;
  className?: string;
  /** Tamanho do símbolo em px. Padrão 36 — mantém o rodapé como está. */
  size?: number;
  /** Tamanho do wordmark "PegPay" em px. Padrão 24. */
  wordSize?: number;
}

/**
 * Símbolo PegPay — malha de 100 un.:
 * haste x = 16 un., barras e contraforma quadrada de 14 un.,
 * canto superior do bloco cortado a 45° (26 un. do canto).
 */
export function PegSymbol({
  tile = "#E94E1B",
  glyph = "#F3F2F2",
  size = 36,
}: {
  tile?: string;
  glyph?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="block shrink-0"
    >
      <path d="M0 0H74L100 26V100H0Z" fill={tile} />
      <path
        d="M22 22h16v56H22z M38 22h28v14H38z M52 22h14v42H52z M38 50h28v14H38z"
        fill={glyph}
      />
    </svg>
  );
}

export default function Logo({
  variant = "dark",
  compact = false,
  className = "",
  size = 36,
  wordSize = 24,
}: LogoProps) {
  const wordColor = variant === "dark" ? "text-ink" : "text-paper";
  return (
    <Link
      to="/"
      onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label="PegPay — início"
    >
      <PegSymbol size={size} />
      {!compact && (
        <span
          style={{ fontSize: wordSize }}
          className={`font-archivo font-extrabold leading-none tracking-[-0.02em] ${wordColor}`}
        >
          PegPay
        </span>
      )}
    </Link>
  );
}
