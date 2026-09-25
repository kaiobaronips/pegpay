# PegPay Soluções Digitais — Blueprint Institucional

> **Documento oficial de contexto do projeto**
> Versão: **3.0** · Substitui a v2.0 de 2026
> Ano-base: 2026 · Status: blueprint institucional e estratégico
> Empresa: **PegPay Soluções Digitais**

---

## 0. Como utilizar este documento

Este arquivo é a **fonte oficial de contexto institucional e estratégico da PegPay**.

Use-o como referência para: posicionamento, definição de produtos, experiência do cliente, arquitetura de negócio, integração com parceiros, estratégia de dados, jornadas digitais, comunicação de marca, roadmap, documentos institucionais, sites, aplicativos, sistemas internos, APIs e apresentações.

Quando houver conflito entre uma interpretação genérica sobre fintechs e uma definição explícita deste documento, **priorize este documento**.

Não invente fatos, métricas, integrações, parceiros, licenças, produtos ou funcionalidades que não estejam definidos aqui ou em outro documento oficial do projeto.

### O que mudou da v2.0 para a v3.0

A v2.0 ainda descrevia a PegPay como dona da análise e da decisão de crédito. Essa atribuição foi corrigida.

A PegPay é uma **correspondente bancária**. Ela capta e atende clientes, realiza cadastro e KYC, prepara propostas e acompanha a jornada. A instituição financeira parceira é responsável pelo produto, análise, decisão, condições, contratação, liberação e cobrança.

---

# 1. Identidade da empresa

**PegPay Soluções Digitais.** Nome de marca: **PegPay**.

Empresa brasileira de tecnologia e **correspondência bancária**, digital-first, orientada por atendimento, dados e automação.

Fundada em **2019** por Kaio Baroni e Felipe Boim.

---

# 2. Definição institucional

A PegPay é uma correspondente bancária brasileira criada para ampliar o acesso a crédito oferecido por instituições financeiras parceiras, de forma simples, rápida e digital.

A empresa utiliza tecnologia, atendimento e dados cadastrais para conectar públicos historicamente subatendidos pelo sistema financeiro tradicional — predominantemente as faixas de renda **C, D e E** — aos produtos de crédito das instituições parceiras.

A PegPay acredita que crédito oferecido de maneira responsável, transparente e compatível com a capacidade financeira do cliente funciona como instrumento de inclusão financeira, autonomia e desenvolvimento econômico. A avaliação dessa capacidade e a decisão de conceder ou recusar crédito pertencem à instituição financeira parceira.

---

# 3. Quem somos

## PegPay — Crédito que acompanha a vida real

Desde 2019, a PegPay trabalha para construir uma relação diferente entre pessoas e crédito.

Enquanto parte relevante do mercado ainda usa jornadas que deixam milhões de brasileiros à margem, a PegPay desenvolve tecnologia e processos de atendimento capazes de acolher diferentes perfis, comportamentos e realidades financeiras.

O objetivo não é simplesmente conceder crédito. É **criar acesso**.

### Indicadores institucionais oficiais

- Mais de **412 mil pessoas atendidas**;
- Aproximadamente **35% dos clientes tiveram na PegPay o primeiro acesso ao crédito formal**.

> Estes são os **únicos** números institucionais oficiais. Não devem ser alterados nem extrapolados sem atualização deste documento. Qualquer outro número que apareça em site, apresentação ou material é dado de exemplo até ser incorporado aqui.

> **Se o cliente tem pressa, a PegPay também tem.**

---

# 4. Propósito

## Democratizar o acesso ao crédito por meio de uma jornada simples, humana e digital.

A PegPay conecta pessoas a oportunidades financeiras que permitam resolver necessidades do presente, reorganizar a vida financeira, acessar bens e serviços e construir possibilidades para o futuro.

---

# 5. Missão

Conectar clientes a produtos de crédito das instituições financeiras parceiras por meio de uma jornada **simples, rápida, transparente e responsável**.

---

# 6. Visão

Ser uma das principais **plataformas digitais de correspondência bancária do Brasil**, reconhecida por combinar:

**inclusão financeira + tecnologia + experiência + atendimento.**

A visão de longo prazo é acompanhar a evolução da vida financeira do cliente dentro da jornada de crédito, apresentando novas possibilidades das instituições parceiras quando forem adequadas.

---

# 7. Posicionamento

## Correspondente bancária acessível, digital e orientada por tecnologia.

A PegPay não compete apenas por taxa. Compete por: acesso · simplicidade · experiência · velocidade · tecnologia · recorrência · relacionamento · qualidade do atendimento · transparência na apresentação das condições.

A PegPay ocupa o espaço entre os grandes bancos tradicionais e as necessidades financeiras reais de milhões de brasileiros.

---

# 8. Proposta de valor

## Crédito simples para pessoas reais.

| Pilar | O que significa |
| --- | --- |
| **Acessibilidade** | Alternativas para quem tem dificuldade de acesso às instituições tradicionais |
| **Simplicidade** | Menos burocracia, jornada digital intuitiva |
| **Velocidade** | Menos tempo entre solicitação, análise, aprovação e liberação |
| **Personalização** | Jornada e atendimento adequados a cada perfil; as condições são definidas pela instituição parceira |
| **Recorrência** | Relacionamento contínuo: o cliente pode conhecer novas oportunidades dos parceiros quando fizer sentido |

---

# 9. Público-alvo

Brasileiros predominantemente das classes **C, D e E**:

- trabalhadores CLT;
- profissionais autônomos e prestadores de serviços;
- trabalhadores informais;
- pequenos empreendedores;
- consumidores com pouco histórico financeiro;
- pessoas buscando o primeiro acesso ao crédito;
- quem precisa de crédito emergencial;
- quem quer reorganizar compromissos financeiros.

A PegPay busca compreender o consumidor para além de uma análise exclusivamente baseada em score tradicional.

**Consequência prática para produto e tecnologia:** aparelho modesto, conexão instável e pouca familiaridade com jargão bancário são o caso comum, não a exceção. Isso é requisito técnico, não observação sociológica.

---

# 10. O que a PegPay é — e o que não é

Esta seção prevalece sobre qualquer interpretação genérica de "fintech".

## É

Uma **correspondente bancária** que capta clientes, conduz o atendimento, coleta dados e documentos, realiza cadastro e KYC, prepara propostas e acompanha a jornada junto às instituições financeiras parceiras.

## Não é

**Não é banco digital. Não é internet banking. Não é conta digital.**

Estão **fora do escopo**, hoje e no horizonte planejado:

```
conta          saldo           extrato        Pix
transferência  pagamento de contas            boleto emitido por nós
cartão próprio carteira digital               benefícios
cashback       seguros         gestão financeira
```

Se um pedido, requisito ou ideia soar como função de banco, ele está fora do escopo — levante isso antes de construir.

## Divisão de responsabilidade sobre dinheiro

A PegPay atua como **correspondente bancário**. Isso significa uma divisão clara:

| Responsabilidade | De quem |
| --- | --- |
| Captação, atendimento, cadastro, KYC, proposta e acompanhamento | **PegPay** |
| Produto, elegibilidade, análise de risco, aprovação ou recusa, taxa, limite, prazo, CET e contratação | **Instituição financeira parceira** |
| Liberação do dinheiro, cobrança e recebimento das parcelas | **Instituição financeira parceira** |

A PegPay não decide, não aprova e não recusa crédito. Também não custodia nem movimenta dinheiro.

> Isso não relaxa nenhum padrão de rigor: errar um centavo na parcela ou no CET de um cliente classe D causa o mesmo dano, independentemente de quem transfere o dinheiro.

---

# 11. Produtos de crédito

Três modalidades comercializadas pela PegPay em nome das instituições financeiras parceiras. A disponibilidade, a elegibilidade e as condições de cada uma são definidas pelo parceiro responsável pela operação.

## 11.1 Empréstimo com cartão de crédito

Converte o limite disponível no cartão de crédito do cliente em recurso para uso imediato, conforme regras operacionais, comerciais e regulatórias aplicáveis.

- **Limitante:** limite livre no cartão.
- **Diferencial de acesso:** não exige nome limpo.
- **Objetivos:** velocidade, simplicidade, parcelamento, baixo atrito.

## 11.2 Empréstimo CLT com desconto em folha

Para trabalhadores com vínculo empregatício formal. A parcela é descontada diretamente da folha de pagamento.

- **Limitante:** vínculo formal e margem consignável.
- **Efeito:** desconto automático reduz o risco, permitindo condições mais competitivas.
- **Papel estratégico:** pode se tornar uma das principais verticais, pela previsibilidade de renda, recorrência e possibilidade de modelos de risco específicos.

## 11.3 Crédito com garantia

O cliente usa um bem que já possui como garantia e paga menos juros por isso. O bem fica **alienado**, mas continua no nome e no uso do cliente durante todo o contrato.

**Garantia de veículo** — carro, moto ou caminhão. Amplia ticket médio, reduz risco relativo, permite prazos maiores.

**Garantia de imóvel** — residencial ou comercial. Operações de maior valor, prazos mais longos, custo potencialmente inferior a modalidades sem garantia.

> As condições comerciais publicadas no site institucional para esta modalidade são **estimativas de vitrine**. A política real de taxa, prazo e limite ainda não foi definida e é decisão humana de negócio e risco.

---

# 12. Arquitetura de canais

A PegPay opera por três canais, com papéis distintos e não intercambiáveis.

```
┌──────────────┐   lead    ┌──────────────────┐
│    SITE      ├──────────►│   ATENDIMENTO    │
│ institucional│           │      HUMANO      │
│  + captação  │           │   (RD Station)   │
└──────────────┘           └────────▲─────────┘
                                    │
                           ┌────────┴─────────┐
                           │       APP        │
                           │ cadastro         │
                           │ verificação      │
                           │ acompanhamento   │
                           │ RECORRÊNCIA      │
                           └──────────────────┘
```

## 12.1 Site — institucional e captador de leads

O site existe para que a pessoa **entenda o que é a PegPay** e para **capturar o lead**, entregando-o ao atendimento humano.

Não tem cadastro, não tem área logada, não tem operação. O simulador público é vitrine com valores estimados.

## 12.2 App — cadastro, verificação e recorrência

O aplicativo é o principal ponto de relacionamento contínuo. Ele:

- cadastra o cliente;
- realiza as verificações necessárias (KYC);
- origina novos pedidos de empréstimo;
- permite acompanhar contrato, parcelas e vencimentos;
- **mantém o cliente dentro do sistema para pedir novos empréstimos.**

> **O app não é vitrine. É motor de recorrência.** Existe para gerar o segundo e o terceiro empréstimo. A métrica que importa é **recompra**, não conversão de lead.

## 12.3 Atendimento humano — onde a operação acontece

O atendimento humano conduz a operação. O software é o **intermediário** entre cliente e atendente, não o executor.

Consequência de arquitetura: toda decisão de produto deve perguntar **como isso ajuda o atendente**, e não apenas como isso automatiza o cliente.

**CRM em uso: RD Station.** A plataforma integra; não substitui.

---

# 13. Jornada do cliente

Quatro princípios: **SIMPLES → RÁPIDA → DIGITAL → TRANSPARENTE**

| Etapa | O que acontece | Canal |
| --- | --- | --- |
| **Descoberta** | Cliente chega por canais digitais | Site |
| **Captação** | Lead registrado e encaminhado | Site → CRM → atendimento |
| **Cadastro** | CPF, celular, e-mail, dados pessoais | App |
| **Identidade** | KYC, documento, selfie, prova de vida | App |
| **Análise** | Instituição parceira avalia a proposta | Instituição financeira parceira |
| **Oferta** | Instituição parceira define produto, limite, taxa, prazo, parcela e CET | App / atendimento |
| **Contratação** | Formalização conforme o fluxo da instituição parceira | App / atendimento / parceiro |
| **Liberação** | Recursos disponibilizados | Instituição parceira |
| **Relacionamento** | Acompanhamento, histórico, novas ofertas | App |

---

# 14. Recorrência

A recorrência não é um item da lista de funcionalidades — é o **modelo de negócio**.

Um cliente pode começar com uma operação pequena. Conforme constrói histórico positivo, poderá conhecer novas oportunidades e modalidades disponibilizadas pelas instituições parceiras, sempre sujeitas à análise e às condições do parceiro.

```
PRIMEIRO CRÉDITO → HISTÓRICO POSITIVO → NOVA OPORTUNIDADE
→ CONDIÇÕES DEFINIDAS PELO PARCEIRO → OUTRA MODALIDADE
→ RELACIONAMENTO DE LONGO PRAZO
```

A evolução do cliente é métrica estratégica. O custo de adquirir um cliente já foi pago na primeira operação; a segunda é onde a economia da empresa se resolve.

---

# 15. Integração com instituições financeiras parceiras

A PegPay não possui motor próprio de risco ou decisão de crédito. Ela prepara e encaminha a proposta, com os dados e documentos necessários, para a instituição financeira responsável pelo produto.

## 15.1 Dados da jornada

| Categoria | Uso pela PegPay |
| --- | --- |
| **Cadastrais** | Cadastro, contato e identificação do cliente |
| **Documentais** | KYC e composição da proposta conforme o fluxo aplicável |
| **Comportamentais** | Melhorar atendimento, comunicação e acompanhamento da jornada |
| **Operacionais** | Acompanhar o status informado pela instituição parceira |

O compartilhamento de dados observa consentimento, LGPD, finalidade informada e os contratos aplicáveis.

## 15.2 Fluxo de proposta

```
CAPTAÇÃO → ATENDIMENTO → CADASTRO → KYC → PROPOSTA
→ ENVIO À INSTITUIÇÃO PARCEIRA → ANÁLISE DO PARCEIRO
→ RESULTADO → FORMALIZAÇÃO → LIBERAÇÃO PELO PARCEIRO → ACOMPANHAMENTO
```

## 15.3 Rastreabilidade

A PegPay deve registrar a origem do lead, o atendimento, os documentos enviados, o aceite e os status recebidos da instituição parceira. O resultado da análise deve identificar o parceiro que o informou e o momento da atualização.

## 15.4 Limites

- A PegPay não cria políticas de crédito, scores, regras de aprovação, taxas, limites ou pricing.
- IA generativa pode apoiar comunicação, classificação e operação, mas não pode se apresentar como instituição financeira nem afirmar aprovação, recusa ou condições antes do retorno do parceiro.
- A PegPay apresenta condições completas ao cliente antes da formalização, conforme recebidas da instituição parceira.

---

# 16. Inteligência de dados

Dados são um ativo operacional para melhorar captação, atendimento, cadastro, KYC, acompanhamento, comunicação e recorrência. Eles não substituem nem reproduzem a análise de risco e a decisão da instituição parceira.

## Ciclo de melhoria

```
MAIS CLIENTES → MELHOR ATENDIMENTO → JORNADA MAIS CLARA
→ MENOS ABANDONO → MAIOR SATISFAÇÃO → MAIOR RECORRÊNCIA
```

---

# 17. KYC e antifraude

O onboarding deve estar preparado para: identidade · CPF · CNPJ quando aplicável · telefone · e-mail · endereço · documento · selfie · biometria · prova de vida · validação de identidade e os requisitos cadastrais exigidos para a proposta.

A arquitetura **não deve depender rigidamente de um único fornecedor**. Integrações externas ficam atrás de adapters:

```
KYCProvider
├── verifyIdentity()
├── validateDocument()
├── performLiveness()
└── getRiskSignals()
```

> Nenhum fornecedor de KYC está contratado. Fornecedor citado em documento não significa integração existente.

---

# 18. Experiência digital

Cinco princípios:

1. **Simplicidade** — poucos passos por ação.
2. **Velocidade** — respostas rápidas em toda a jornada.
3. **Clareza** — informação financeira compreensível.
4. **Confiança** — design, comunicação, segurança e operação transmitindo credibilidade.
5. **Proximidade** — comunicação humana, acessível, objetiva.

---

# 19. Princípios de UX financeira

Sempre visível, sem exigir clique:

**valor · juros · CET · parcelas · prazo · vencimento · taxas · garantia · status**

Toda tela cobre cinco estados: **loading · vazio · erro · desabilitado · sucesso**.

**Proibido:** dark patterns · informação financeira escondida · linguagem propositalmente confusa · custo relevante em elemento pouco visível · etapa desnecessária.

Se um layout só funciona escondendo o CET, o layout está errado.

---

# 20. Modelo de receita

Fontes potenciais, coerentes com o escopo definido na seção 10:

- comissionamento pago pelas instituições financeiras parceiras pelas operações intermediadas;
- remuneração comercial prevista nos contratos de correspondente bancário;
- parcerias comerciais compatíveis com o escopo e com as regras aplicáveis.

> Seguros, produtos de proteção e serviços financeiros adicionais constavam da v1.0 e **saíram do escopo**. O modelo financeiro definitivo deve ser detalhado em documento específico de Business Plan / Unit Economics — não presuma números.

---

# 21. Estratégia de crescimento

| Fase | Foco |
| --- | --- |
| **01 · Core de correspondência** | Plataforma, onboarding, integrações com parceiros, produtos prioritários, controles básicos e validação da operação |
| **02 · Captação** | Base de clientes, canais digitais, CAC, funil, conversão de lead |
| **03 · Recorrência** | Retenção, recompra, LTV, progressão de limite e oferta |
| **04 · Escala** | Volume, eficiência operacional, automação do que hoje é manual |
| **05 · Inteligência** | Melhoria da jornada, eficiência operacional, dados de atendimento e integração mais qualificada com os parceiros |

> A v1.0 tinha uma fase "Ecossistema" com pagamentos, benefícios e seguros. **Removida** — ver seção 10.

---

# 22. Métricas estratégicas

As métricas definitivas serão definidas pelas áreas de Risco, Produto, Growth e Financeiro.

| Área | Métricas |
| --- | --- |
| **Captação** | CAC, leads, cadastro iniciado, cadastro concluído, taxa de ativação |
| **Operação** | Propostas enviadas, status recebidos, ticket médio, prazo médio e volume intermediado |
| **Qualidade da jornada** | Cadastro concluído, pendências, tempo de resposta do parceiro, abandono e satisfação |
| **Produto** | Conversão, tempo de análise, tempo de contratação, tempo de liberação, abandono |
| **Recorrência** | **Recompra, tempo até o 2º empréstimo, operações por cliente, retenção, LTV** |
| **Cliente** | NPS, CSAT, satisfação com atendimento |
| **Financeiro** | Receita, margem, custo de capital, margem de contribuição, unit economics, payback de CAC |

**A métrica que define o sucesso do app é recompra, sempre condicionada à disponibilidade de produtos e à decisão das instituições parceiras.**

---

# 23. Princípios da PegPay

- **Cliente primeiro** — toda decisão considera a experiência do cliente.
- **Simplicidade sempre** — produto financeiro não precisa ser complicado.
- **Velocidade importa** — o cliente precisa de resposta, não de burocracia.
- **Crédito responsável** — crescimento sustentável depende de uma jornada clara e da atuação responsável de todos os envolvidos.
- **Dados geram inteligência** — cada operação melhora a próxima jornada e o atendimento.
- **Tecnologia transforma** — automação e dados são pilares estruturais.
- **Inclusão gera oportunidade** — ampliar o acesso transforma trajetórias.
- **O humano decide** — a tecnologia serve o atendimento, não o substitui.

---

# 24. Valores

**Acesso** · **Transparência** · **Agilidade** · **Inovação** · **Responsabilidade** · **Segurança** · **Proximidade**

---

# 25. Marca

## Personalidade

Digital · acessível · moderna · segura · humana · otimista.

## Tom de voz

Simples, direto, claro, humano, seguro, acessível, objetivo, sem excesso de jargão.

Três regras:

1. **Frase curta, verbo na frente.** "Simule em 2 minutos", não "Realize agora mesmo a sua simulação de crédito".
2. **Número antes do adjetivo.** "1,29% a.m., parcela fixa", não "as melhores taxas do mercado".
3. **Custo sempre visível.** CET, prazo e garantia junto do valor — nunca em letra menor depois.

Evitar: promessa vaga · superlativo sem evidência · jargão bancário voltado ao cliente.

## Identidade visual

| Token | Hex | Uso |
| --- | --- | --- |
| Laranja PegPay | `#E94E1B` | Ação, ênfase, destaque |
| Tinta | `#201E1D` | Texto, linhas, contraste |
| Papel | `#F3F2F2` | Fundo institucional |

Tipografia: **Archivo**, família única, títulos pesados, hierarquia forte, **números tabulares**.

Geometria: cantos retos, grids, réguas, bordas fortes, alto contraste.

**Evitar:** gradiente · excesso de sombra · canto arredondado · elemento visual genérico de fintech.

## Símbolo

Símbolo geométrico laranja com "P" estilizado em negativo e canto superior cortado a 45°; wordmark PegPay em tipografia escura e pesada.

Manter proporção, área de respiro, contraste e consistência. **Nunca recriar o logotipo quando o ativo oficial existir.**

Especificação completa: `docs/design/DESIGN_SYSTEM.md`.

---

# 26. Manifesto

O Brasil é feito por pessoas que fazem muito com pouco.

Pessoas que trabalham, empreendem, consomem, constroem famílias e movimentam todos os dias uma das maiores economias do mundo.

Mas nem sempre o sistema financeiro consegue enxergar todo esse potencial.

A PegPay nasceu para ajudar a mudar essa realidade.

Acreditamos que tecnologia pode ampliar acesso.

Que dados podem criar decisões melhores.

Que crédito pode ser mais simples.

Que serviços financeiros podem falar a língua das pessoas.

E que uma oportunidade no momento certo pode fazer diferença.

Por isso, estamos construindo uma nova experiência de crédito.

Mais digital. Mais rápida. Mais próxima. Mais inteligente.

Uma plataforma que entende que cada pessoa possui uma história financeira diferente.

E que boas histórias também podem começar com uma oportunidade.

> **PegPay. Crédito para quem faz acontecer.**

---

# 27. Ambição

Construir uma das principais plataformas de **crédito digital** do Brasil — capaz de conhecer profundamente seus clientes, compreender sua capacidade financeira, avaliar risco com inteligência, oferecer o produto adequado a cada momento e construir relacionamento de longo prazo.

Não é ambição de virar banco. É ambição de ser a melhor porta de entrada ao crédito para quem o sistema tradicional não enxerga.

---

# 28. PegPay em uma frase

> **Uma plataforma digital de crédito criada para ampliar o acesso financeiro através de tecnologia, dados e simplicidade.**

---

# 29. Plataforma tecnológica — visão macro

Componentes que o ecossistema tecnológico poderá incluir progressivamente:

**Existe hoje:** site institucional.

**Planejado:** captação de leads · integração com RD Station · aplicativo mobile · API de domínio · painel de apoio ao atendimento · onboarding · KYC · gestão de propostas · gestão documental · acompanhamento de parcelas · notificações · integrações com instituições financeiras parceiras · analytics · observabilidade · automações.

**Fora do escopo:** qualquer componente de conta, saldo, Pix, pagamento, boleto próprio ou carteira.

Detalhamento e ordem de construção: `docs/roadmap/PEGPAY_MVP_TECH_ROADMAP.md`.

---

# 30. Regras para o Claude dentro deste projeto

1. Trate a PegPay como uma fintech real em construção.
2. Não transforme o projeto em exemplo genérico.
3. Preserve os nomes oficiais dos produtos.
4. Preserve o posicionamento de inclusão financeira.
5. Mantenha o cliente no centro da experiência.
6. Mantenha tecnologia e dados como pilares estratégicos.
7. **Não invente números financeiros.** Os únicos oficiais estão na seção 3.
8. **Não invente parceiros.**
9. **Não invente integrações já contratadas.** Nenhuma existe.
10. Não declare funcionalidade futura como existente.
11. Diferencie sempre **atual · planejado · possível · hipótese**.
12. Considere segurança, LGPD, risco e auditoria em decisões técnicas.
13. Considere o público C, D e E na UX e na comunicação.
14. Evite linguagem bancária excessivamente técnica em conteúdo voltado ao cliente.
15. Em interfaces financeiras, priorize clareza de valores, taxas, parcelas, prazos e condições.
16. **Nunca proponha função de banco** — seção 10.
17. Lembre que o **atendimento humano** conduz a operação; o software é o intermediário.
18. Lembre que o app existe para gerar **recorrência**.
19. Ao criar código ou arquitetura, consulte `docs/context/CTO_PROJECT_MEMORY.md` e os ADRs.
20. Ao criar design, respeite `docs/design/DESIGN_SYSTEM.md`.
21. Ao propor funcionalidade nova, explique quando for recomendação e não definição oficial.
22. Não altere a essência deste Blueprint sem solicitação explícita.

---

# 31. Glossário

| Termo | Significado |
| --- | --- |
| **Instituição financeira parceira** | Empresa responsável pelo produto, análise, decisão, condições, contratação, liberação e cobrança da operação |
| **KYC** | *Know Your Customer* — identificação e validação do cliente |
| **Antifraude** | Mecanismos para detectar e reduzir comportamento fraudulento |
| **CET** | Custo Efetivo Total — juros, IOF e tarifas |
| **Margem consignável** | Parcela da folha que pode ser comprometida no consignado |
| **Alienação** | Bem fica em garantia, mas continua no nome e no uso do cliente |
| **Correspondente bancário** | Papel regulatório da PegPay: a operação é da instituição parceira |
| **Lead** | Pessoa que demonstrou interesse e ainda não é cliente |
| **Recorrência** | Cliente voltar a contratar depois da primeira operação |
| **Recompra** | Métrica principal do app: segunda operação e seguintes |
| **LTV** | *Lifetime Value* do cliente |
| **CAC** | Custo de aquisição de cliente |
| **Open Finance** | Compartilhamento padronizado de dados financeiros mediante consentimento |
| **Audit Log** | Registro estruturado e imutável de ações críticas |

---

# 32. Resumo executivo

A PegPay Soluções Digitais é uma correspondente bancária brasileira, fundada em 2019 por Kaio Baroni e Felipe Boim.

Amplia o acesso ao crédito para consumidores predominantemente das classes C, D e E, com três produtos: **empréstimo com cartão de crédito**, **empréstimo CLT com desconto em folha** e **crédito com garantia de veículo ou imóvel**.

**Não é banco digital nem instituição financeira.** Atua como correspondente bancária: capta, atende, cadastra, realiza KYC, prepara propostas e acompanha o cliente. O parceiro define o produto e faz a análise, a decisão, a contratação, a liberação e a cobrança.

Opera por três canais: **site** que capta leads, **app** que cadastra, verifica e gera recorrência, e **atendimento humano** que conduz a operação, apoiado pelo RD Station.

A qualidade do atendimento, a jornada digital e a integração confiável com as instituições financeiras parceiras são os componentes estratégicos centrais.

A experiência deve ser **simples, rápida, digital e transparente**. A marca deve ser percebida como **digital, acessível, moderna, segura, humana e otimista**.

---

# 33. Histórico de versões

| Versão | Data | Mudança |
| --- | --- | --- |
| 1.0 | 2026 | Documento original. Descrevia ecossistema financeiro amplo (Pix, pagamentos, benefícios, seguros, gestão financeira) |
| 2.0 | 12/08/2026 | Escopo corrigido para fornecedora de crédito. Ecossistema financeiro removido. |
| **3.0** | **24/09/2026** | Modelo corrigido para correspondente bancária. A PegPay capta, atende, cadastra, realiza KYC, prepara propostas e acompanha; a instituição financeira parceira é responsável pelos produtos, análise, decisão, condições, contratação, liberação e cobrança. |

A v1.0 está preservada no histórico do git.

---

**PegPay Soluções Digitais**
Brasil · Desde 2019

> **PegPay. Crédito para quem faz acontecer.**
