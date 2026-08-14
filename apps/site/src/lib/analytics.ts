/**
 * Carregadores de GA4 (via Google Consent Mode v2) e Meta Pixel.
 *
 * Nenhum dos dois dispara sem consentimento do usuário, e nenhum dos dois
 * dispara sem um ID real configurado — não há credencial inventada aqui.
 * Configure VITE_GA_MEASUREMENT_ID / VITE_META_PIXEL_ID em .env quando as
 * propriedades reais existirem (ver .env.example). Até lá, estas funções
 * são no-op: nenhuma requisição sai para Google ou Meta.
 */
import type { PreferenciasConsentimento } from "@/lib/consent";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string };
    _fbq?: Window["fbq"];
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

let gaScriptInjetado = false;
let pixelInjetado = false;

/** Injeta gtag.js e inicia o GA4 — só chamado depois de consentimento em analytics. */
function carregarGA4() {
  if (gaScriptInjetado || !GA_MEASUREMENT_ID) return;
  gaScriptInjetado = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
}

/** Injeta o Meta Pixel — só chamado depois de consentimento em marketing. */
function carregarMetaPixel() {
  if (pixelInjetado || !META_PIXEL_ID) return;
  pixelInjetado = true;

  // Snippet padrão do Meta Pixel, adaptado para TS: a fila de chamadas feitas
  // antes de fbevents.js terminar de carregar é drenada pelo próprio script.
  const fbq = function (...args: unknown[]) {
    (fbq.queue ??= []).push(args);
  } as NonNullable<Window["fbq"]>;
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window._fbq = fbq;
  window.fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
}

/**
 * Sincroniza o estado de consentimento com o Google Consent Mode e, na
 * primeira vez que uma categoria é liberada, carrega o script correspondente.
 */
export function aplicarConsentimento(preferencias: PreferenciasConsentimento) {
  gtag("consent", "update", {
    analytics_storage: preferencias.analytics ? "granted" : "denied",
    ad_storage: preferencias.marketing ? "granted" : "denied",
    ad_user_data: preferencias.marketing ? "granted" : "denied",
    ad_personalization: preferencias.marketing ? "granted" : "denied",
  });

  if (preferencias.analytics) carregarGA4();
  if (preferencias.marketing) carregarMetaPixel();
}

/** Chamado uma vez no boot da aplicação para reaplicar uma decisão anterior. */
export function inicializarAnalytics(preferencias: PreferenciasConsentimento) {
  if (preferencias.analytics || preferencias.marketing) {
    aplicarConsentimento(preferencias);
  }
}
