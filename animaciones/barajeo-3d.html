# Animaciones — Prisma Azul (handoff para Claude Code)

Paleta: fondo #0b0726/#150d34/#2a1f57 · dorado #e7cf9b/#f0d488/#d9ab55 · lila #cdbdf2 · tinta #1c1338.
Tipografías: Cormorant Garamond (títulos/frases) + Hanken Grotesk (UI).
Emblemas de palo: `card-emblems.js` expone `window.CARD_OSCURA` = { oros, copas, espadas, bastos, corona } como data-URIs SVG. El dorso de carta se compone SIEMPRE de: gradiente #2a1f57→#150d34→#0b0726 + retícula diagonal dorada/lila + marco interior dorado + emblema del palo centrado.

## Archivos (cada demo es autocontenida, vanilla JS/CSS)

### 1. barajeo-3d.html — Barajeo de cartas (Cruz de Vida y Oráculo)
- 8 cartas en mazo con perspectiva (contenedor `perspective:850px`, mesa inclinada `rotateX(30deg)`).
- Keyframes `pzShufL` / `pzShufR`: cartas alternas saltan a izquierda/derecha con giro rotateY y se reinsertan; delay escalonado `i*0.135s`, duración 1.1s (modo ágil: 0.85s, delay i*0.1s).
- Sombra elíptica animada (`pzDeckShadow`) bajo el mazo.
- **Diseño por sección**: Cruz de Vida usa emblema `oros`; el Oráculo usa el palo del oráculo elegido (botones en la demo para probar los 4).

### 2. oraculo-seleccion.html — Selección en abanico (solo Oráculo)
- Abanico de 12 cartas (rotate -46°..+46°, origen 50% 118%).
- Al tocar una carta: vuela hacia adelante (translateY(-152px) translateZ(80px) scale(1.12)) a una fila superior de elegidas, con borde/glow dorado.
- **La baraja se reduce**: los ángulos del abanico se recalculan solo sobre las cartas restantes (se cierra el hueco). Tocar una elegida la devuelve. Máx. 3.
- Transición: .55s cubic-bezier(.25,.8,.25,1.05).

### 3. ruleta-codigos.html — Ruleta (Códigos Sagrados)
- Tambor 3D de 12 caras (rotateX(-k*30deg) translateZ(114px)) dentro de marco dorado con ventana central, degradados arriba/abajo y rombos que brillan (`csTickGlow`).
- Giro: 3 vueltas + parada en la cara 7 (el código elegido), `transform 3.6s cubic-bezier(.12,.72,.14,1)` (ágil: 2.2s).
- El código ganador se pinta #f0d488.

### 4. papelito-afirmaciones.html — Papelito (Afirmaciones / frases)
- Papel pergamino (#f6eedb con rayas tenues) que cae (`afDropIn`) y se desdobla en 3D: solapa superior (rotateX -178°→0), luego inferior (178°→0), con caras traseras #eadec2 y sombra de pliegue.
- La frase aparece al final como tinta: blur(5px)+opacity 0 → nítida (.9s).
- Tiempos: caída 0.7s → solapa 1 a 550ms → solapa 2 a 1250ms → tinta a 1900ms (ágil: 350/750/1150ms).

## Integración
- Todo es CSS transforms + transiciones; sin librerías. Respetar `transform-style:preserve-3d` y los contenedores `perspective` — sin ellos el 3D se aplana.
- Los tiempos "ágil" corresponden al ajuste ritmoTirada/ritmo de la app.
