import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  // Caminho absoluto: com react-router em rota aninhada (ex.:
  // /para-voce/emprestimo-com-cartao), './' resolveria os assets como
  // /para-voce/assets/... — 404, o rewrite de SPA devolve index.html no
  // lugar do .js, e o navegador recusa por MIME type errado. Ver ADR-001.
  base: '/',
  plugins: [inspectAttr(), react()],
  server: {
    // Porta padrão do Vite. A 3000 fica reservada para a futura API,
    // e evita colisão com outros projetos Next.js na mesma máquina.
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
