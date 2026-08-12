---
name: pegpay-design-system
description: Identidade visual e regras de UX financeira da PegPay — cores, tipografia, geometria, símbolo, tom de voz e transparência de custo. Use ao criar ou revisar qualquer interface do site, app, portal do cliente ou painel administrativo.
---

# PegPay — Design System

Fonte canônica: `docs/design/DESIGN_SYSTEM.md` e o manual oficial em `docs/design/identidade-visual-oficial.html`.

## Cor

| Token | Hex | Uso |
| --- | --- | --- |
| Laranja PegPay | `#E94E1B` | Ação, ênfase, CTA |
| Tinta | `#201E1D` | Texto, réguas, fundo escuro |
| Papel | `#F3F2F2` | Fundo padrão |
| Laranja profundo | `#8F2B09` | **Texto corrido em laranja sobre fundo claro** |

Escala 100→900: `#FFF4EC` `#FFE3D2` `#FFC8A9` `#FFA070` `#F9713A` **`#E94E1B`** `#C23C10` `#8F2B09` `#5A1F0C`

Texto corrido nunca usa o laranja da marca — contraste insuficiente.

## Tipografia

**Archivo**, família única. Display 800/−4,5% · Título 800/−2% · Rótulo 600/+14% caixa alta · Corpo 400 15px/1.55.

**Números sempre tabulares.** Valor, parcela, taxa e prazo não podem "dançar" ao atualizar.

## Geometria

Cantos retos (`border-radius: 0` **em todo lugar**) · réguas de 2px · sombra deslocada sem blur · grid · alto contraste · pouco ornamento.

**Proibido:** gradiente · glassmorphism · canto arredondado · marca condensada, esticada ou inclinada · marca em cinza claro sobre papel · template genérico de fintech.

## Símbolo

Malha de 100 un.: "P" a 22 un. das bordas · haste x = 16 un. · barras e contraforma 14 un. · corte a 45° a 26 un. do canto superior direito · respiro de 16 un. em todos os lados · mínimo 16px (símbolo) e 96px (assinatura horizontal).

Nunca recriar o logotipo quando o ativo oficial existir. Implementação: `src/components/Logo.tsx`.

## Tom de voz

1. **Frase curta, verbo na frente** — "Simule em 2 minutos", não "Realize agora mesmo a sua simulação".
2. **Número antes do adjetivo** — "1,29% a.m., parcela fixa", não "as melhores taxas do mercado".
3. **Custo sempre visível** — CET, prazo e garantia junto do valor, nunca em letra menor depois.

Linguagem simples. Sem jargão bancário para o cliente. Público C, D e E.

## UX financeira — obrigatório

Sempre visível sem clique: **valor · juros · CET · parcelas · prazo · vencimento · taxas · garantia · status**.

Toda tela cobre cinco estados: **loading · vazio · erro · desabilitado · sucesso**.

**Dark patterns são proibidos.** Se o layout só fica bonito escondendo o CET, o layout está errado.

## Utilitários já implementados

`.tnum` · `.label` · `.rule-t` / `.rule-b` · `.offset-shadow` / `-sm` · `.waves-ink` / `.waves-peg` · `.reveal` · `.peg-range` · `.faq-panel`

Reaproveitar antes de criar.
