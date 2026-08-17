# SEO, AEO e GEO — site institucional PegPay

Implementado em 2026-08-14 e **auditado na sequência**, com correções aplicadas. Agentes `pegpay-seo-strategist` e `pegpay-seo-engineer` (`.claude/agents/growth/`), com apoio das skills `searchfit-seo:seo-audit` e `searchfit-seo:schema-markup`.

## Estado atual, verificado

Auditoria executada contra o **build de produção** (`vite preview`), navegando as 10 rotas via roteador SPA:

| Rota | h1 | title | meta desc | Dados estruturados |
| --- | --- | --- | --- | --- |
| `/` | 1 | 30 | 140 | Organization + FAQPage |
| `/para-voce/emprestimo-com-cartao` | 1 | 41 | 143 | Service + BreadcrumbList + FAQPage |
| `/para-voce/credito-consignado-clt` | 1 | 31 | 127 | Service + BreadcrumbList + FAQPage |
| `/para-voce/emprestimo-com-garantia` | 1 | 32 | 143 | Service + BreadcrumbList + FAQPage |
| `/sobre-nos` | 1 | 18 | 135 | Organization + BreadcrumbList |
| `/renda-extra` | 1 | 20 | 123 | Organization + BreadcrumbList |
| `/seguranca` | 1 | 18 | 145 | Organization + BreadcrumbList |
| `/garantias` | 1 | 18 | 132 | Organization + BreadcrumbList |
| `/ajuda` | 1 | 14 | 149 | Organization + BreadcrumbList + FAQPage |
| `/privacidade` | 1 | 20 | 140 | Organization + BreadcrumbList |

Todos os títulos abaixo de 60 caracteres, todas as descriptions abaixo de 155, um `h1` por página, canonical correto por rota, JSON-LD sintaticamente válido em todas, e nenhum script vazando entre navegações SPA.

## O que a auditoria encontrou e corrigiu

Cinco defeitos reais na primeira implementação:

1. **`/sobre-nos` sem nenhum dado estruturado.** A página não usa a casca `PaginaInterna` e não declarava schema próprio — justamente a página institucional, onde `Organization` mais importa. Passou despercebido porque a verificação inicial só olhou Home, um produto e Ajuda.
2. **Dois `<h1>` na home.** O carrossel do Hero renderizava um `<h1>` por slide; ambos ficam no DOM (só a opacidade alterna), entregando dois títulos concorrentes ao crawler. Corrigido envolvendo os slides em um único `<h1>`, com cada slide virando `<span>` — trocar a tag por slide quebraria o crossfade, porque mudar o tipo do elemento faz o React remontar o nó.
3. **`llms.txt` expunha estrutura interna do repositório.** O rodapé do arquivo mandava consultar `docs/growth/` "no repositório" — num arquivo público, servido a qualquer visitante e crawler. Substituído por informação de contato.
4. **Cinco rotas com meta description truncável** (185, 171, 172, 198 e 229 caracteres, contra o limite de ~155 do Google). Como essas descrições vinham do texto visível da página, foi criado um campo opcional `descricaoSeo` (em `PaginaInterna` e no tipo `Produto`) que separa a description do copy que o cliente lê — sem reescrever nada visível.
5. **`Organization` sem `logo`.** Estava registrado como "pendência humana", mas não era: o logo existe como SVG no componente `Logo.tsx`. Exportado para `public/images/logo-pegpay.svg` e referenciado no schema.

Duas melhorias adicionais na mesma revisão:

- **Ligação de entidades por `@id`.** Todas as páginas usam o mesmo `@id` (`.../#organizacao`), para que buscadores e engines generativas resolvam a PegPay como uma entidade só, em vez de uma empresa diferente por página. Em `Service.provider` o `@id` vem acompanhado de `name` e `url` — só a referência deixaria um ponteiro pendurado para quem visse apenas aquela página.
- **`Organization` em toda página interna.** Antes só a home tinha. Um crawler que caísse direto em `/seguranca` não tinha como saber de que empresa a página falava.

E uma correção de higiene: o `useJsonLd` dependia de `JSON.stringify(schema)` dentro do array de dependências com um `eslint-disable`; passou a serializar fora do efeito, o que dá uma dependência estável sem silenciar o linter.

## O que continua deliberadamente de fora

Nada disso é esquecimento — é ausência de dado real:

- **`sameAs`**: os links sociais do rodapé apontam para domínios genéricos (`instagram.com`), não perfis reais. Declarar perfil inexistente como identidade da marca é markup enganoso.
- **`legalName` / `taxID`**: o CNPJ do rodapé é placeholder.
- **`aggregateRating` / `review`**: a PegPay não tem sistema de avaliação pública verificável.
- **`offers` / preço em `Service`**: o site não divulga taxa nem CET (ADR-003).

## Expectativa realista sobre FAQ

O `FAQPage` **não vai gerar rich result de FAQ no Google**. Desde agosto de 2023 o Google restringiu esse formato a sites governamentais e de saúde. O schema continua valendo, mas por outros motivos: é lido por outros motores de resposta, e é uma das formas mais confiáveis de engines generativas extraírem pergunta e resposta com precisão — que é exatamente o objetivo de AEO e GEO aqui. Ninguém deve esperar o card de FAQ na busca do Google.

## Geração estática — resolvido (ADR-005)

Era a principal lacuna de GEO: o site é uma SPA, e `useSeo()`/`useJsonLd()` aplicam meta e JSON-LD via `useEffect`. O Googlebot executa JavaScript e via o resultado, mas crawlers que leem apenas o HTML bruto — comportamento comum entre bots de engines generativas, justamente o público de GEO — recebiam uma casca vazia, sem título, sem descrição e sem nenhum dos schemas.

Resolvido com **geração estática no build**, não com migração de framework: o site tem 10 páginas sem nada que varie por request, então HTML gerado em build equivale a SSR para os efeitos que importam aqui, mantendo Vite, React e o deploy atuais. Detalhes e alternativas descartadas em `docs/architecture/adr/ADR-005`.

Os mesmos hooks alimentam os dois caminhos (via um contexto provido só durante o build), então não existe uma segunda lista de metadados para sair do lugar.

Verificável sem executar JavaScript:

```bash
curl -s https://www.pegpay.com.br/sobre-nos | grep -o "<title>[^<]*</title>"
```

**Rota nova precisa entrar em `src/lib/rotas.ts`** — as de produto derivam de `PRODUTOS` e entram sozinhas; as institucionais são manuais. O build falha se uma rota listada não renderizar ou não definir título.

## Decisões pendentes (humanas)

- Confirmar o CNPJ real da PegPay — destrava `legalName`/`taxID` no schema e corrige o rodapé e a política de privacidade.
- Confirmar ou criar os perfis sociais reais antes de declarar `sameAs`.
- `lastmod` do `sitemap.xml` está fixo; se as páginas passarem a mudar com frequência, vale gerar o sitemap no build a partir de `ROTAS_ESTATICAS`. Não foi feito agora porque carimbar todas as páginas com a data do build seria informação falsa — o Google desconta `lastmod` em quem faz isso.
