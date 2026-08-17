import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

// O HTML pré-gerado no build já traz o JSON-LD da rota no <head>. Assim que
// o React assume, `useJsonLd` injeta o dele — então o do prerender sai, ou a
// página ficaria com o mesmo schema duas vezes.
document
  .querySelectorAll('script[type="application/ld+json"][data-prerender]')
  .forEach((el) => el.remove())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
