// utils/metaPixel.ts

// ⚠️ IMPORTANTE: Este ID ahora se lee desde variables de entorno.
// Configura VITE_META_PIXEL_ID en tu .env.local o en Vercel.
export const DEFAULT_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

// Inicializar el Pixel con Opciones Avanzadas
export const initPixel = () => {
  // Prioridad: 1. LocalStorage (para pruebas del admin) -> 2. Variable de entorno -> 3. Hardcoded Default
  const storedId = typeof window !== 'undefined' ? localStorage.getItem('FENIX_PIXEL_ID') : null;
  const PIXEL_ID = storedId || DEFAULT_PIXEL_ID;

  if (typeof window !== 'undefined') {
    if (window.fbq) return; // Evitar doble inicialización

    // Código Base Estándar de Meta (Facebook)
    let n: any = window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };

    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];

    const t = document.createElement('script');
    t.async = !0;
    t.src = 'https://connect.facebook.net/en_US/fbevents.js';

    const s = document.getElementsByTagName('script')[0];
    if (s && s.parentNode) {
      s.parentNode.insertBefore(t, s);
    }

    // Inicialización
    // 'autoConfig': true permite a Meta leer metadatos de la web para mejorar el matching (emails, tels, etc.)
    window.fbq('init', PIXEL_ID, {
      autoConfig: true,
      agent: 'plfenixacademy' // Identificador interno opcional
    });

    // PageView estándar
    window.fbq('track', 'PageView');

    console.log(`🔷 Pixel Initialized: ${PIXEL_ID} ${storedId ? '(Admin Override Active)' : ''}`);
  }
};

// Rastrear eventos estándar (Standard Events)
// Docs: https://developers.facebook.com/docs/meta-pixel/reference
export const trackEvent = (event: string, data?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, data);

    // Log para desarrollo (solo si estamos en localhost o debug)
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
      console.log(`🔷 FB Event: [${event}]`, data);
    }
  }
};

// Rastrear eventos personalizados (Custom Events)
export const trackCustomEvent = (event: string, data?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', event, data);
  }
};
