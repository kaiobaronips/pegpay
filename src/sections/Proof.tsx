import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

interface NumProps {
  alvo: number;
  prefixo?: string;
  sufixo?: string;
  decimais?: number;
  rotulo: string;
}

function CountUp({ alvo, prefixo = "", sufixo = "", decimais = 0, rotulo }: NumProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      const t0 = performance.now();
      const dur = 1600;
      const tick = (t: number) => {
        const p = Math.min(1, Math.max(0, (t - t0) / dur));
        const eased = 1 - Math.pow(1 - p, 4);
        setValor(alvo * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      start();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        start();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [alvo]);

  const fmt = valor.toLocaleString("pt-BR", {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  });

  return (
    <div>
      <span
        ref={ref}
        className="tnum block font-archivo text-[44px] font-extrabold leading-none tracking-[-0.03em] text-paper md:text-[56px]"
      >
        {prefixo}
        {fmt}
        {sufixo}
      </span>
      <span className="label mt-3 block text-paper/60">{rotulo}</span>
    </div>
  );
}

export default function Proof() {
  return (
    <section className="bg-peg">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-20">
        <Reveal>
          <p className="max-w-[40ch] font-archivo text-[22px] font-extrabold leading-snug tracking-[-0.015em] text-paper md:text-[26px]">
            Quem tem garantia não aceita taxa de mercado. Nem a gente.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t-2 border-paper/30 pt-10 md:grid-cols-4">
          <CountUp alvo={1.4} prefixo="R$ " sufixo=" bi" decimais={1} rotulo="liberados em crédito" />
          <CountUp alvo={412} sufixo=" mil" rotulo="clientes em todo o Brasil" />
          <CountUp alvo={92} sufixo="%" rotulo="dos contratos liberados em 2 dias" />
          <CountUp alvo={4.8} sufixo="/5" decimais={1} rotulo="nota média de atendimento" />
        </div>
      </div>
    </section>
  );
}
