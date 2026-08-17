/**
 * Geração estática (SSG) do site.
 *
 * Roda depois do build do cliente e do bundle de servidor: renderiza cada
 * rota em Node e grava um `index.html` próprio, já com conteúdo, título,
 * descrição, canonical e JSON-LD no HTML entregue na primeira resposta.
 *
 * Motivo: o site é uma SPA. Sem isso, o HTML servido é uma casca vazia e
 * todo o conteúdo depende de JavaScript rodar no navegador — o Googlebot
 * executa, mas boa parte dos crawlers de engines generativas não. Ver
 * ADR-005.
 *
 * O runtime continua sendo o mesmo SPA: o HTML pré-gerado é ponto de
 * partida, e o React reassume a página no navegador.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raizApp = dirname(dirname(fileURLToPath(import.meta.url)));
const dirCliente = join(raizApp, "dist");
const dirServidor = join(raizApp, "dist-ssr");

const { render, ROTAS_ESTATICAS } = await import(join(dirServidor, "entry-server.js"));

const template = await readFile(join(dirCliente, "index.html"), "utf-8");

/** Escapa `<` para o JSON-LD não poder fechar a tag script que o contém. */
function jsonLdSeguro(schema) {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

function escaparAtributo(texto) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function trocarMeta(html, seletorAtributo, valor) {
  // Casa a tag <meta> que tenha o atributo identificador e substitui só o
  // valor do seu content.
  const re = new RegExp(`(<meta[^>]*${seletorAtributo}[^>]*content=")[^"]*(")`, "i");
  return re.test(html) ? html.replace(re, `$1${escaparAtributo(valor)}$2`) : html;
}

function montarHtml(rota, { html, coletor }) {
  let saida = template;

  if (coletor.titulo) {
    saida = saida.replace(/<title>[^<]*<\/title>/i, `<title>${escaparAtributo(coletor.titulo)}</title>`);
    saida = trocarMeta(saida, 'property="og:title"', coletor.titulo);
  }

  if (coletor.descricao) {
    saida = trocarMeta(saida, 'name="description"', coletor.descricao);
    saida = trocarMeta(saida, 'property="og:description"', coletor.descricao);
  }

  if (coletor.canonical) {
    saida = saida.replace(
      /(<link[^>]*rel="canonical"[^>]*href=")[^"]*(")/i,
      `$1${escaparAtributo(coletor.canonical)}$2`,
    );
    saida = trocarMeta(saida, 'property="og:url"', coletor.canonical);
  }

  // `data-prerender` permite ao main.tsx remover estes scripts quando o
  // React assume, evitando o schema duplicado.
  const scripts = coletor.schemas
    .map((schema) => `    <script type="application/ld+json" data-prerender>${jsonLdSeguro(schema)}</script>`)
    .join("\n");

  if (scripts) saida = saida.replace("</head>", `${scripts}\n  </head>`);

  return saida.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
}

let falhas = 0;

for (const rota of ROTAS_ESTATICAS) {
  try {
    const resultado = render(rota);

    if (!resultado.html.trim()) throw new Error("render devolveu HTML vazio");
    if (!resultado.coletor.titulo) throw new Error("rota não definiu título (useSeo não foi chamado?)");

    const destino =
      rota === "/" ? join(dirCliente, "index.html") : join(dirCliente, rota, "index.html");

    await mkdir(dirname(destino), { recursive: true });
    await writeFile(destino, montarHtml(rota, resultado));

    const kb = (Buffer.byteLength(resultado.html) / 1024).toFixed(0);
    console.log(`  ${rota.padEnd(36)} ${String(kb).padStart(4)} kB · ${resultado.coletor.schemas.length} schema(s)`);
  } catch (erro) {
    falhas += 1;
    console.error(`  ${rota.padEnd(36)} FALHOU: ${erro.message}`);
  }
}

if (falhas > 0) {
  console.error(`\nPrerender falhou em ${falhas} rota(s). Build interrompido.`);
  process.exit(1);
}

console.log(`\n✓ ${ROTAS_ESTATICAS.length} rotas geradas estaticamente`);
