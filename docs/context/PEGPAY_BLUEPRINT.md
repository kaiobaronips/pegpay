# PegPay Soluções Digitais — Blueprint Institucional

> **Documento oficial de contexto do projeto**
> Versão: **2.0** · Substitui a v1.0 de 2026
> Ano-base: 2026 · Status: blueprint institucional e estratégico
> Empresa: **PegPay Soluções Digitais**

---

## 0. Como utilizar este documento

Este arquivo é a **fonte oficial de contexto institucional e estratégico da PegPay**.

Use-o como referência para: posicionamento, definição de produtos, experiência do cliente, arquitetura de negócio, motor de crédito, estratégia de dados, jornadas digitais, comunicação de marca, roadmap, documentos institucionais, sites, aplicativos, sistemas internos, APIs e apresentações.

Quando houver conflito entre uma interpretação genérica sobre fintechs e uma definição explícita deste documento, **priorize este documento**.

Não invente fatos, métricas, integrações, parceiros, licenças, produtos ou funcionalidades que não estejam definidos aqui ou em outro documento oficial do projeto.

### O que mudou da v1.0 para a v2.0

A v1.0 descrevia um ecossistema financeiro amplo — Pix, transferências, pagamento de contas, boletos, benefícios, cashback, seguros e gestão financeira. **Esse escopo foi retirado.**

A PegPay é uma **fornecedora de crédito**, não um banco digital. A v2.0 corrige o documento para descrever o produto que será efetivamente construído, e detalha o papel real de cada canal: site, aplicativo e atendimento humano.

A decisão técnica correspondente está em `docs/architecture/adr/ADR-002-escopo-da-plataforma.md`.

---

# 1. Identidade da empresa

**PegPay Soluções Digitais.** Nome de marca: **PegPay**.

Fintech brasileira de **soluções de crédito**, digital-first, orientada por tecnologia, dados e automação.

Fundada em **2019** por Kaio Baroni e Felipe Boim.

---

# 2. Definição institucional

A PegPay é uma fintech brasileira especializada em soluções de crédito, criada para ampliar o acesso a serviços financeiros de forma simples, rápida e digital.

A empresa utiliza tecnologia, dados e novos modelos de análise de risco para desenvolver alternativas de crédito voltadas principalmente a públicos historicamente subatendidos pelo sistema financeiro tradicional — predominantemente as faixas de renda **C, D e E**.

A PegPay acredita que o crédito, quando oferecido de maneira responsável, transparente e compatível com a capacidade financeira do cliente, funciona como instrumento de inclusão financeira, autonomia e desenvolvimento econômico.

---

# 3. Quem somos

## PegPay — Crédito que acompanha a vida real

Desde 2019, a PegPay trabalha para construir uma relação diferente entre pessoas e crédito.

Enquanto parte relevante do mercado ainda usa modelos que deixam milhões de brasileiros à margem, a PegPay desenvolve tecnologia e processos capazes de compreender melhor diferentes perfis, comportamentos e realidades financeiras.

O objetivo não é simplesmente conceder crédito. É **criar acesso**.

### Indicadores institucionais oficiais

- Mais de **412 mil pessoas atendidas**;
- Aproximadamente **35% dos clientes tiveram na PegPay o primeiro acesso ao crédito formal**.

> Estes são os **únicos** números institucionais oficiais. Não devem ser alterados nem extrapolados sem atualização deste documento. Qualquer outro número que apareça em site, apresentação ou material é dado de exemplo até ser incorporado aqui.

> **Se o cliente tem pressa, a PegPay também tem.**

---

# 4. Propósito

## Democratizar o acesso ao crédito através da tecnologia.

A PegPay conecta pessoas a oportunidades financeiras que permitam resolver necessidades do presente, reorganizar a vida financeira, acessar bens e serviços e construir possibilidades para o futuro.

---

# 5. Missão

Desenvolver soluções digitais que proporcionem acesso **simples, rápido, transparente e responsável** ao crédito, com produtos compatíveis com a realidade financeira de cada cliente.

---

# 6. Visão

Ser uma das principais **plataformas digitais de crédito do Brasil**, reconhecida por combinar:

**inclusão financeira + tecnologia + experiência + inteligência de crédito.**

A visão de longo prazo é acompanhar a evolução da vida financeira do cliente **dentro do crédito** — do primeiro empréstimo pequeno até operações maiores, com melhores condições, à medida que ele constrói histórico.

---

# 7. Posicionamento

## Fintech de crédito acessível, digital e orientada por tecnologia.

A PegPay não compete apenas por taxa. Compete por: acesso · simplicidade · experiência · velocidade · tecnologia · recorrência · relacionamento · capacidade de análise · capacidade de aprovação responsável.

A PegPay ocupa o espaço entre os grandes bancos tradicionais e as necessidades financeiras reais de milhões de brasileiros.

---

# 8. Proposta de valor

## Crédito simples para pessoas reais.

| Pilar | O que significa |
| --- | --- |
| **Acessibilidade** | Alternativas para quem tem dificuldade de acesso às instituições tradicionais |
| **Simplicidade** | Menos burocracia, jornada digital intuitiva |
| **Velocidade** | Menos tempo entre solicitação, análise, aprovação e liberação |
| **Personalização** | Dados para oferecer condições adequadas a cada perfil |
| **Recorrência** | Relacionamento contínuo: bons clientes acessam novos produtos, limites e condições |

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

Uma **fornecedora de crédito** que origina, analisa, **decide** e acompanha operações de empréstimo, apoiada por tecnologia própria e por atendimento humano.

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
| Captação, cadastro, verificação e relacionamento | **PegPay** |
| Análise, política de risco, **decisão de crédito**, taxa e limite | **PegPay** |
| Proposta e contrato | **PegPay** |
| Liberação do dinheiro e recebimento das parcelas | **Instituição financeira parceira** |

A PegPay **decide** o crédito, mas **não custodia nem movimenta** dinheiro.

> Isso não relaxa nenhum padrão de rigor: errar um centavo na parcela ou no CET de um cliente classe D causa o mesmo dano, independentemente de quem transfere o dinheiro.

---

# 11. Produtos de crédito

Três modalidades. Cada uma tem lógica própria de elegibilidade, mas todas compartilham proposta, contrato e relacionamento.

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
| **Análise** | Motor de crédito avalia e decide | PegPay |
| **Oferta** | Produto, limite, taxa, prazo, parcela, CET | App / atendimento |
| **Contratação** | Aceite, contrato, assinatura eletrônica | App / atendimento |
| **Liberação** | Recursos disponibilizados | Instituição parceira |
| **Relacionamento** | Acompanhamento, histórico, novas ofertas | App |

---

# 14. Recorrência

A recorrência não é um item da lista de funcionalidades — é o **modelo de negócio**.

Um cliente pode começar com uma operação pequena. Conforme constrói histórico positivo, poderá acessar novos limites, melhores condições e outras modalidades de crédito.

```
PRIMEIRO CRÉDITO → HISTÓRICO POSITIVO → NOVO LIMITE
→ MELHORES CONDIÇÕES → OUTRA MODALIDADE → CRÉDITO DE MAIOR VALOR
→ RELACIONAMENTO DE LONGO PRAZO
```

A evolução do cliente é métrica estratégica. O custo de adquirir um cliente já foi pago na primeira operação; a segunda é onde a economia da empresa se resolve.

---

# 15. Motor de crédito

**É o principal ativo tecnológico da PegPay, e a decisão é nossa** — não do parceiro.

O objetivo é evoluir de modelos baseados predominantemente em cadastro e score externo para uma abordagem orientada por múltiplas fontes.

## 15.1 Fontes de dado

| Categoria | Exemplos |
| --- | --- |
| **Cadastrais** | CPF, idade, região, profissão, renda declarada ou validada, vínculo |
| **Financeiros** | Capacidade de pagamento, comprometimento de renda, Open Finance (com consentimento) |
| **Comportamentais** | Histórico na plataforma, pontualidade, recorrência, engajamento |
| **Externos** | Bureaus, bases cadastrais, dados públicos permitidos, provedores de identidade e risco |

## 15.2 Pipeline

```
INPUT → VALIDAÇÃO → ENRIQUECIMENTO → ANTIFRAUDE → POLÍTICAS DE RISCO
→ SCORE / MODELOS → DECISION ENGINE → PRICING → OFERTA → CONTRATAÇÃO → MONITORAMENTO
```

## 15.3 Rastreabilidade

**Toda decisão de crédito deve ser rastreável.** Registrar: dados utilizados · fontes consultadas · política aplicada · versão da política · score · resultado · motivos · regras aplicadas · modelo e sua versão · data · contexto.

Decisão não se sobrescreve — cria-se nova versão.

## 15.4 Limites

- Políticas críticas **nunca** ficam hardcoded no frontend ou no app.
- **IA generativa nunca é autoridade única** para aprovar ou recusar crédito. Pode auxiliar em classificação, leitura documental, resumo e apoio operacional.
- Ampliar acesso **não significa** aprovar quem não tem capacidade de pagamento. Crédito irresponsável é dano ao cliente e à empresa.
- **Nenhuma política real está definida.** Taxa, limite e corte de score são decisão humana de negócio e risco.

---

# 16. Inteligência de dados

Dados são ativo estratégico. Mais operações geram mais dados; mais dados podem gerar melhor compreensão do cliente, melhores políticas, maior precisão, menos fraude, melhor pricing e maior capacidade de decisão.

O acúmulo de histórico deve melhorar progressivamente a qualidade do motor de crédito.

## Flywheel

```
MAIS CLIENTES → MAIS OPERAÇÕES → MAIS DADOS → MELHORES MODELOS
→ MELHOR ANÁLISE → MELHORES OFERTAS → APROVAÇÃO MAIS RESPONSÁVEL
→ MAIOR SATISFAÇÃO → MAIOR RECORRÊNCIA → MAIS CLIENTES
```

---

# 17. KYC e antifraude

O onboarding deve estar preparado para: identidade · CPF · CNPJ quando aplicável · telefone · e-mail · endereço · documento · selfie · biometria · prova de vida · validação de identidade · análise de fraude · consulta cadastral.

A arquitetura **não deve depender rigidamente de um único fornecedor**. Integrações externas ficam atrás de adapters:

```
KYCProvider
├── verifyIdentity()
├── validateDocument()
├── performLiveness()
└── getRiskSignals()
```

> Nenhum fornecedor de KYC, antifraude ou bureau está contratado. Fornecedor citado em documento não significa integração existente.

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

- receita das operações de crédito;
- comissionamento na atuação como correspondente bancário;
- taxas de serviço, quando aplicáveis e permitidas;
- parcerias comerciais.

> Seguros, produtos de proteção e serviços financeiros adicionais constavam da v1.0 e **saíram do escopo**. O modelo financeiro definitivo deve ser detalhado em documento específico de Business Plan / Unit Economics — não presuma números.

---

# 21. Estratégia de crescimento

| Fase | Foco |
| --- | --- |
| **01 · Core de crédito** | Plataforma, onboarding, motor de crédito, produtos prioritários, controles básicos, validação da operação |
| **02 · Captação** | Base de clientes, canais digitais, CAC, funil, conversão de lead |
| **03 · Recorrência** | Retenção, recompra, LTV, progressão de limite e oferta |
| **04 · Escala** | Volume, eficiência operacional, automação do que hoje é manual |
| **05 · Inteligência** | Modelos próprios, melhor risco, melhor pricing, dados proprietários como diferencial |

> A v1.0 tinha uma fase "Ecossistema" com pagamentos, benefícios e seguros. **Removida** — ver seção 10.

---

# 22. Métricas estratégicas

As métricas definitivas serão definidas pelas áreas de Risco, Produto, Growth e Financeiro.

| Área | Métricas |
| --- | --- |
| **Captação** | CAC, leads, cadastro iniciado, cadastro concluído, taxa de ativação |
| **Crédito** | Aprovação, reprovação, ticket médio, limite médio, taxa média, prazo médio, volume originado |
| **Risco** | Inadimplência, atraso, default, fraude, roll rate, vintage, perda esperada, recuperação |
| **Produto** | Conversão, tempo de análise, tempo de contratação, tempo de liberação, abandono |
| **Recorrência** | **Recompra, tempo até o 2º empréstimo, operações por cliente, retenção, LTV** |
| **Cliente** | NPS, CSAT, satisfação com atendimento |
| **Financeiro** | Receita, margem, custo de capital, margem de contribuição, unit economics, payback de CAC |

**A métrica que define o sucesso do app é recompra.**

---

# 23. Princípios da PegPay

- **Cliente primeiro** — toda decisão considera a experiência do cliente.
- **Simplicidade sempre** — produto financeiro não precisa ser complicado.
- **Velocidade importa** — o cliente precisa de resposta, não de burocracia.
- **Crédito responsável** — crescimento sustentável depende da qualidade da concessão.
- **Dados geram inteligência** — cada operação melhora a próxima decisão.
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

**Planejado:** captação de leads · integração com RD Station · aplicativo mobile · API de domínio · painel de apoio ao atendimento · onboarding · KYC · antifraude · motor de crédito · gestão de propostas · gestão de contratos · assinatura eletrônica · gestão documental · acompanhamento de parcelas · notificações · integrações com instituição parceira e bureaus · analytics · observabilidade · automações.

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
| **Motor de crédito** | Sistema que processa dados, políticas, scores e regras para decidir crédito. Da PegPay |
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

A PegPay Soluções Digitais é uma fintech brasileira de crédito, fundada em 2019 por Kaio Baroni e Felipe Boim.

Amplia o acesso ao crédito para consumidores predominantemente das classes C, D e E, com três produtos: **empréstimo com cartão de crédito**, **empréstimo CLT com desconto em folha** e **crédito com garantia de veículo ou imóvel**.

**Não é banco digital.** Origina, analisa e **decide** crédito; a liberação e o recebimento são da instituição financeira parceira.

Opera por três canais: **site** que capta leads, **app** que cadastra, verifica e gera recorrência, e **atendimento humano** que conduz a operação, apoiado pelo RD Station.

O **motor de crédito** e a capacidade de usar dados para melhorar decisões são os componentes estratégicos centrais.

A experiência deve ser **simples, rápida, digital e transparente**. A marca deve ser percebida como **digital, acessível, moderna, segura, humana e otimista**.

---

# 33. Histórico de versões

| Versão | Data | Mudança |
| --- | --- | --- |
| 1.0 | 2026 | Documento original. Descrevia ecossistema financeiro amplo (Pix, pagamentos, benefícios, seguros, gestão financeira) |
| **2.0** | **12/08/2026** | Escopo corrigido para fornecedora de crédito. Ecossistema financeiro removido. Papel de site, app e atendimento humano detalhado. Recorrência elevada a modelo de negócio. Divisão de responsabilidade com a instituição parceira explicitada. RD Station registrado como CRM em uso. Ver `ADR-002` |

A v1.0 está preservada no histórico do git.

---

**PegPay Soluções Digitais**
Brasil · Desde 2019

> **PegPay. Crédito para quem faz acontecer.**
