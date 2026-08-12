# PegPay — Design System

> Derivado do manual oficial de identidade visual (`docs/design/identidade-visual-oficial.html`, v1 · 2026) e da seção 28 do `docs/context/PEGPAY_BLUEPRINT.md`.
> Em caso de divergência, o manual oficial prevalece. Não recriar o logotipo quando o ativo oficial existir.

## 1. Cor

| Token | Hex | Uso |
| --- | --- | --- |
| Laranja PegPay | `#E94E1B` | Ação, ênfase, pôster, CTA |
| Tinta | `#201E1D` | Texto, réguas, fundo escuro |
| Papel | `#F3F2F2` | Fundo padrão de tudo |

Escala do laranja, 100 → 900:

`#FFF4EC` · `#FFE3D2` · `#FFC8A9` · `#FFA070` · `#F9713A` · **`#E94E1B`** · `#C23C10` · `#8F2B09` · `#5A1F0C`

- **100–300**: preenchimentos, tintas, hovers.
- **600**: o laranja da marca.
- **700–900**: texto sobre fundo claro. **Texto corrido em laranja usa `#8F2B09`, nunca o laranja da marca** — contraste insuficiente.

No site, os tokens vivem em `tailwind.config.js` (`paper`, `ink`, `peg.DEFAULT/dark/deep/soft`) e em `src/index.css`.

## 2. Tipografia

**Archivo**, família única, do display ao rodapé.

| Papel | Peso | Tamanho | Tracking |
| --- | --- | --- | --- |
| Display | 800 | 52–76px | −4,5% |
| Título | 800 | 26–40px | −2% |
| Rótulo | 600 | 12px | +14%, caixa alta |
| Corpo | 400 | 15px / 1.55 | normal |

**Números sempre tabulares** (`font-variant-numeric: tabular-nums`). Valor monetário, parcela, taxa e prazo nunca "dançam" ao atualizar.

## 3. Geometria

- Cantos retos. `border-radius: 0` é o padrão do sistema — **em nenhum lugar**.
- Réguas de 2px organizam a tela.
- Sombra deslocada sem blur (`10px 10px 0 0` na tinta), nunca sombra difusa de card genérico.
- Grid, módulos, alto contraste.

**Proibido:** gradiente · glassmorphism · cantos arredondados · condensar, esticar ou inclinar a marca · marca em cinza claro sobre papel · interface genérica de template de fintech.

## 4. Símbolo

Malha de 100 unidades:

- O "P" começa a **22 un.** de cada borda.
- Haste: **x = 16 un.** Barras horizontais e contraforma quadrada: **14 un.**
- Canto superior direito cortado a 45°, a **26 un.** do canto, nos dois eixos.
- Área de respiro em todos os lados: a largura da haste (**16 un.**). Nada entra nessa faixa.
- Mínimos: símbolo **16px / 6mm**; assinatura horizontal **96px / 24mm**. Abaixo disso, só o símbolo.

Path oficial (ver `src/components/Logo.tsx`):

```
M0 0H74L100 26V100H0Z                                     (bloco)
M22 22h16v56H22z M38 22h28v14H38z M52 22h14v42H52z M38 50h28v14H38z   (P)
```

## 5. Tom de voz

Três regras, do manual:

1. **Frase curta, verbo na frente.** "Simule em 2 minutos." Não: "Realize agora mesmo a sua simulação de crédito."
2. **Número antes do adjetivo.** "1,29% a.m., parcela fixa." Não: "as melhores taxas do mercado."
3. **Custo sempre visível.** CET, prazo e garantia aparecem junto do valor — nunca em letra menor depois.

Linguagem simples, direta, humana. Sem jargão bancário voltado ao cliente. O público é C, D e E.

## 6. UX financeira — obrigatório

Toda interface que envolva dinheiro deve deixar visível, sem precisar de clique:

valor · juros · **CET** · parcelas · prazo · vencimento · taxas · garantia · status

E toda tela precisa cobrir os cinco estados: **loading · vazio · erro · desabilitado · sucesso**.

**Dark patterns são proibidos.** Nada de custo escondido, linguagem propositalmente confusa, etapa desnecessária ou informação relevante em elemento pouco visível.

## 7. Utilitários já implementados no site

`.tnum` (números tabulares) · `.label` (rótulo 600/+14%/caixa alta) · `.rule-t` / `.rule-b` (réguas de 2px) · `.offset-shadow` / `.offset-shadow-sm` · `.waves-ink` / `.waves-peg` (padrão de ondas) · `.reveal` (entrada no scroll, respeita `prefers-reduced-motion`) · `.peg-range` (slider quadrado) · `.faq-panel` (sanfona)

Reaproveitar antes de criar novo.
