# ADR-003 — Site multipágina e exibição de custo no simulador

- **Status:** **Aceito, com a decisão de custo revertida para a alternativa A em 2026-08-16** — ver "Atualização" ao final
- **Data:** 2026-08-12 · atualizado em 2026-08-16
- **Decisores:** Kaio Pirolo (decisão) · CTO Orchestrator (alerta e implementação)

## Contexto

O site era uma landing page única. A direção pediu um site institucional completo, com páginas por produto, que induza o cliente ao download do app ou ao atendimento humano — coerente com o ADR-002, que define o site como captador de leads.

Duas regras foram dadas em conjunto e entram em conflito:

1. **"O site não deve informar taxa em nenhuma página."**
2. **"Todas as subpáginas de produto devem ter um simulador próprio, com taxas próprias."**

Um simulador que exibe parcela deriva essa parcela de uma taxa. Exibir a parcela sem exibir a taxa informa a condição sem informar o custo.

## Alternativas

### A. Qualificador sem número de crédito

Cliente escolhe produto e valor; o resultado é "você pode pedir até R$ X — fale com a gente". Sem parcela, sem taxa, sem CET.

- **A favor:** nenhuma condição de crédito é anunciada, então não há dever de informar CET; coerente com o papel de captador de leads; sem conflito com o manual.
- **Contra:** entrega menos informação ao cliente; menos persuasivo.

### B. Exibe parcela, oculta taxa e CET *(escolhida)*

- **A favor:** atende literalmente as duas instruções; mais concreto para o cliente do que uma faixa de valor.
- **Contra:** é o padrão que o manual de identidade da PegPay classifica como **dark pattern** — a seção 06 do manual e a seção 19 do Blueprint exigem "custo sempre visível: CET, prazo e garantia junto do valor, nunca em letra menor depois". Além disso, anunciar condição de crédito sem CET tem exposição regulatória no Brasil.

### C. Simulador completo com taxa e CET

- **A favor:** alinhado ao manual e ao padrão de transparência.
- **Contra:** contraria a instrução de não informar taxa.

## Decisão

**Alternativa B**, por decisão da direção, tomada com o alerta acima explicitado antes da escolha.

### Mitigação aplicada

O simulador exibe valor, prazo e parcela estimada, e traz o aviso:

> "Valor estimado. As condições completas, incluindo taxa e CET, são apresentadas pelo nosso time antes de qualquer contratação."

O aviso **não informa taxa** — respeita a instrução — mas diz ao cliente onde a informação existe e que aquilo não é a condição final. Reduz a distância entre a peça e a exigência de transparência sem violar a regra dada.

## Consequências

- O manual de identidade e o Blueprint §19 continuam exigindo custo visível **na jornada de contratação**. Esta exceção vale **apenas para o simulador do site institucional**, que é vitrine e captação. **No app, na proposta e no contrato, CET e taxa são obrigatórios** — lá não há exceção.
- Registrar como dívida de compliance: quando houver validação jurídica do material do site, revisar esta decisão junto.
- **As taxas usadas no cálculo são provisórias.** Estão isoladas em `apps/site/src/lib/produtos.ts`, marcadas como não-oficiais. Nenhuma política real de crédito foi definida (Blueprint §11 e §15.4). Antes de o site ir ao ar com esses números, a área de Risco precisa fornecer as taxas reais — a parcela exibida hoje deriva de valor provisório.

## Decisão acessória: estrutura do site

Nove páginas, com navegação por seção:

```
/                                       Home institucional
/para-voce/emprestimo-com-cartao        produto + simulador
/para-voce/credito-consignado-clt       produto + simulador
/para-voce/emprestimo-com-garantia      produto + simulador
/sobre-nos                              institucional
/renda-extra                            programa de indicação
/seguranca                              segurança e golpes
/garantias                              regras e riscos da garantia
/ajuda                                  FAQ e contato
/privacidade                            política (minuta)
```

`/central-de-ajuda` está indexada em produção e passa a **redirecionar** para `/ajuda`, para não quebrar link existente.

### Referência visual

O Jeitto foi usado como inspiração de **composição** — cards sobre foto, blocos temáticos, hierarquia da home. **Não** de linguagem visual: o Jeitto usa cantos muito arredondados, e o manual da PegPay proíbe canto arredondado em qualquer lugar. Mantida a geometria PegPay: canto reto, régua de 2px, sombra deslocada sem blur.

### Destino dos CTAs

O app ainda não existe. Todos os botões de "baixar o app" e "quero meu crédito" apontam para o **WhatsApp oficial** por enquanto, centralizado em `apps/site/src/lib/contato.ts`. Quando o app for publicado, muda-se um arquivo.

---

## Atualização — 2026-08-16: parcela retirada do simulador

**Decisão original mantida no que diz respeito à estrutura do site e à não exibição de taxa. O que mudou foi a exibição da parcela: passou da alternativa B para a alternativa A, que já estava analisada acima.**

### O que motivou

A seção "Consequências" desta ADR registrava uma condição explícita:

> "**As taxas usadas no cálculo são provisórias.** […] Antes de o site ir ao ar com esses números, a área de Risco precisa fornecer as taxas reais — a parcela exibida hoje deriva de valor provisório."

O site foi ao ar mesmo assim, e em 2026-08-16 constatou-se que `www.pegpay.com.br` estava publicamente exibindo, nas três páginas de produto, uma parcela em reais (`12× de R$ 289,42`) derivada de taxas que nunca foram política oficial de crédito.

Pela ordem de prioridade do projeto, **integridade financeira é 2**, atrás apenas de segurança e à frente de compliance, confiabilidade e experiência. Um valor de dinheiro apresentado ao cliente precisa ser verdadeiro ou não existir.

### O que foi feito

Adotada a **alternativa A** desta própria ADR — "qualificador sem número de crédito":

- O simulador mantém os controles de valor e prazo e o CTA para o WhatsApp, que já leva valor e prazo na mensagem. O que ele mostra agora é o pedido do próprio cliente ("Você quer pegar R$ 3.000 em 12 parcelas"), não um número calculado pela PegPay.
- `taxaProvisoria` foi **removida** de `lib/produtos.ts`, nos três produtos. Taxa falsa parada no repositório é armadilha: basta alguém religar o cálculo.
- `calcularParcela` foi removida. Além de operar sobre números não-oficiais, cálculo de parcela é autoridade do backend — o `CLAUDE.md` é explícito em que o frontend nunca é autoridade sobre crédito, pricing ou limite.
- O aviso passou a dizer que **o valor da parcela** e as condições completas são apresentados pelo time antes da contratação.

### Consequência

O conflito que originou esta ADR deixou de existir na prática: sem parcela exibida, não há condição de crédito anunciada, e portanto não há a exposição regulatória de anunciar condição sem CET — que era o argumento contra a alternativa B.

**Para voltar a exibir parcela**, é preciso, nesta ordem: (1) Risco definir a política real de taxa; (2) essa política viver no backend, não no site; (3) reavaliar, com o manual de identidade em mãos, se exibir parcela sem CET ainda é aceitável — a seção 06 do manual e a §19 do Blueprint continuam exigindo custo visível.
