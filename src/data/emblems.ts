/**
 * Emblemas de los palos + corona.
 * Portados literalmente de `card-data-oscura.js` (window.CARD_OSCURA), que en el
 * bundle venían como data-URIs SVG. Aquí quedan como XML para `react-native-svg`.
 * Es el único asset gráfico del diseño; todo lo demás se dibuja con estilos.
 */

export const emblems = {
  oros: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="g" x1="20" y1="8" x2="80" y2="92" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f7e6b6"></stop><stop offset=".5" stop-color="#dcb869"></stop><stop offset="1" stop-color="#b78a3e"></stop>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="44" fill="none" stroke="url(#g)" stroke-width="3"></circle>
  <circle cx="50" cy="50" r="38" fill="none" stroke="url(#g)" stroke-width="1.2" opacity=".8"></circle>
  <circle cx="50" cy="50" r="27" fill="none" stroke="url(#g)" stroke-width="2"></circle>
  <g stroke="url(#g)" stroke-width="2" stroke-linecap="round">
    <path d="M50 12 L50 22 M50 78 L50 88 M12 50 L22 50 M78 50 L88 50"></path>
    <path d="M23.5 23.5 L30.5 30.5 M69.5 69.5 L76.5 76.5 M76.5 23.5 L69.5 30.5 M30.5 69.5 L23.5 76.5" opacity=".7"></path>
  </g>
  <g fill="url(#g)">
    <path d="M50 31 L54 46 L69 50 L54 54 L50 69 L46 54 L31 50 L46 46 Z"></path>
  </g>
  <circle cx="50" cy="50" r="4.5" fill="#0b0726" stroke="url(#g)" stroke-width="1.6"></circle>
</svg>`,

  copas: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" fill="none">
  <defs>
    <linearGradient id="g" x1="20" y1="6" x2="80" y2="116" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f7e6b6"></stop><stop offset=".5" stop-color="#dcb869"></stop><stop offset="1" stop-color="#b78a3e"></stop>
    </linearGradient>
  </defs>
  <g stroke="url(#g)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" fill="none">
    <path d="M22 16 H78 C78 48 66 60 50 60 C34 60 22 48 22 16 Z"></path>
    <path d="M22 16 H78"></path>
    <path d="M30 26 C36 40 64 40 70 26" stroke-width="1.6" opacity=".75"></path>
    <path d="M50 60 V84"></path>
    <path d="M36 84 C40 90 60 90 64 84"></path>
    <path d="M30 104 C30 96 40 92 50 92 C60 92 70 96 70 104 Z"></path>
    <path d="M26 110 H74" stroke-width="3.5"></path>
  </g>
  <circle cx="50" cy="34" r="5" fill="url(#g)"></circle>
  <path d="M50 6 L52.6 13.5 L60 14 L54 19 L56 26.5 L50 22 L44 26.5 L46 19 L40 14 L47.4 13.5 Z" fill="url(#g)" opacity=".9"></path>
</svg>`,

  espadas: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" fill="none">
  <defs>
    <linearGradient id="g" x1="20" y1="6" x2="80" y2="116" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f7e6b6"></stop><stop offset=".5" stop-color="#dcb869"></stop><stop offset="1" stop-color="#b78a3e"></stop>
    </linearGradient>
  </defs>
  <g stroke="url(#g)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
    <path d="M50 8 L57 22 V74 H43 V22 Z" fill="none"></path>
    <path d="M50 8 L50 74" stroke-width="1.4" opacity=".7"></path>
    <path d="M22 76 C34 70 66 70 78 76 C70 82 64 84 64 84 H36 C36 84 30 82 22 76 Z" fill="url(#g)" stroke="url(#g)"></path>
    <rect x="45" y="84" width="10" height="22" rx="2" fill="none"></rect>
    <path d="M45 90 H55 M45 96 H55" stroke-width="1.4" opacity=".7"></path>
    <circle cx="50" cy="112" r="6" fill="url(#g)" stroke="url(#g)"></circle>
  </g>
</svg>`,

  bastos: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" fill="none">
  <defs>
    <linearGradient id="g" x1="20" y1="6" x2="80" y2="116" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f7e6b6"></stop><stop offset=".5" stop-color="#dcb869"></stop><stop offset="1" stop-color="#b78a3e"></stop>
    </linearGradient>
  </defs>
  <g stroke="url(#g)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" fill="none">
    <path d="M38 110 L62 14"></path>
    <path d="M44 86 L66 92 M40 70 L60 64 M48 50 L70 54 M44 36 L62 30"></path>
    <path d="M58 8 C64 8 70 12 70 18 C70 24 64 26 60 24 C64 22 64 16 58 16 Z" fill="url(#g)"></path>
    <ellipse cx="36" cy="112" rx="9" ry="7" fill="url(#g)"></ellipse>
    <path d="M30 108 Q36 104 42 108" stroke-width="1.4" opacity=".7"></path>
  </g>
</svg>`,

  corona: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 70" fill="none">
  <defs>
    <linearGradient id="g" x1="10" y1="6" x2="110" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f7e6b6"></stop><stop offset=".5" stop-color="#dcb869"></stop><stop offset="1" stop-color="#b78a3e"></stop>
    </linearGradient>
  </defs>
  <g stroke="url(#g)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M16 56 L24 20 L44 42 L60 12 L76 42 L96 20 L104 56 Z" fill="none"></path>
    <path d="M14 56 H106" stroke-width="3.4"></path>
  </g>
  <g fill="url(#g)">
    <circle cx="24" cy="18" r="5"></circle><circle cx="60" cy="9" r="5.5"></circle><circle cx="96" cy="18" r="5"></circle>
    <circle cx="44" cy="48" r="3"></circle><circle cx="76" cy="48" r="3"></circle>
  </g>
</svg>`,
} as const;

export type EmblemName = keyof typeof emblems;

/** Relación de aspecto de cada emblema, tomada de su viewBox */
export const emblemRatio: Record<EmblemName, number> = {
  oros: 100 / 100,
  copas: 100 / 120,
  espadas: 100 / 120,
  bastos: 100 / 120,
  corona: 120 / 70,
};
