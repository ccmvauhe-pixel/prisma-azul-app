# Handoff: Prisma Azul — App mística de lecturas (Cruz de Vida, Oráculo, Códigos Sagrados, Afirmaciones, Baraja)

## Overview
App móvil (430px de ancho de referencia) de lecturas espirituales con baraja española, creada para la tarotista Gilda. Un menú principal ("Mi Camino") funciona como tablero: muestra el día de mayor vibración de la semana, la afirmación del día, el código sagrado activo, el estado del oráculo y de la Cruz de Vida, con temporizadores de renovación visibles. Desde ahí se navega a cada ritual. Monetización: la Cruz de Vida incluye un paywall de lecturas adicionales (máx. 3/mes).

## About the Design Files
Los archivos de este paquete son **referencias de diseño creadas en HTML** (prototipos que muestran el look & feel y el comportamiento esperado), **no código de producción**. La tarea es **recrear estos diseños en el entorno del codebase destino** (React Native, Flutter, Swift, React web, etc.) usando sus patrones y librerías existentes — o, si aún no existe un proyecto, elegir el framework más adecuado (es una app móvil: React Native/Expo o Flutter son buenas opciones) e implementar ahí.

Los archivos `.dc.html` se abren directamente en un navegador (junto con `support.js` y los `*-data.js` en la misma carpeta) para ver el prototipo funcionando. La lógica de cada pantalla vive en el `<script data-dc-script>` al final de cada archivo, como clase estilo React (`renderVals()` produce los valores del template).

## Fidelity
**High-fidelity (hifi).** Colores, tipografía, espaciados, copys y animaciones son finales. Recrear la UI con fidelidad de píxel. Los textos de contenido (preguntas, respuestas, códigos, afirmaciones) provienen de los PDFs de Gilda y son el contenido real: **no reescribirlos**.

## Screens / Views

### 1. Mi Camino (menú principal) — `Prisma Azul.dc.html`
- **Propósito**: tablero de estado + navegación. No hay tab bar; todo se navega tocando tarjetas y cada pantalla regresa con "‹".
- **Layout**: columna con padding 26px 22px 40px sobre fondo `radial-gradient(135% 80% at 50% -10%, #241a4f 0%, #150d34 46%, #0a0720 100%)` con estrellitas (radial-gradients de 1px).
  1. **Header**: emblema corona 46px + "Prisma Azul" (10.5px, tracking .3em, mayúsculas, `rgba(205,189,242,.6)`) sobre "Mi Camino" (Cormorant Garamond 600, 32px, `#e7cf9b`); fecha del día a la derecha (11px, `es-MX` weekday/day/month).
  2. **Grid 2×2** (`grid-template-columns:1fr 1fr; gap:12px`):
     - **Día que vibras más alto** (izq. arriba): tarjeta degradado `#241a4f→#150d34`, borde `rgba(231,207,155,.45)`, radio 20px. Círculo 46px con símbolo planetario (☽♂☿♃♀♄☉) en el color del día + halo radial; etiqueta "Tu día más alto esta semana"; nombre del día (Cormorant 700, 28px, `#e7cf9b`); título en mayúsculas 9.5px en color del día; mensaje en itálica Cormorant 14.5px; pie "Día de la Luna" etc. **Sin temporizador.** El día se elige aleatoriamente una vez por semana (persistido con la fecha del lunes como llave).
     - **Afirmación** (der. arriba): tarjeta estándar (ver tokens) con acento rosa `#e79ab4`. Píldora de estado (countdown "Nueva en X h" o "Disponible"), kicker "AFIRMACIÓN", texto de la afirmación en itálica Cormorant 16.5px entre comillas (si >150 caracteres se recorta a ~120 y el CTA cambia a "Leer completa"), etiqueta "AFIRMACIÓN DE AMOR/DINERO" en rosa, CTA inferior con "›".
     - **Código sagrado** (izq. abajo): acento dorado `#ecc874`. Número del código en grande (Cormorant 700, 36px, tracking .08em, `#ecc874`, `text-shadow 0 0 18px rgba(236,200,116,.4)`), categoría en mayúsculas, significado truncado (~95 chars), píldora con countdown semanal, CTA "Ver mi código"/"Activar un código". Estado vacío: "Aún no has activado un código".
     - **Oráculo del día** (der. abajo): acento lavanda `#cdbdf2`. **No muestra contenido de la lectura**, solo "Tu último oráculo te espera · {nombre}" + "Toca para volver a leer tus tres mensajes." Píldora con countdown de 24 h.
  3. **Cruz de Vida** (tarjeta ancha): acento rosa, fondo ligeramente más rico (`linear-gradient(150deg,rgba(42,31,87,.75),rgba(21,13,52,.6))`). Kicker "CRUZ DE VIDA · MENSUAL", píldora ("Disponible" / "Gratis en X d X h"), título "Tu última lectura te espera" (sin contenido de la lectura; se lee dentro de la pantalla de la Cruz), fila de 2 botones: "Ir a la Cruz" (dorado relleno) y "Más lecturas" (outline, abre paywall), línea de uso "N de M lecturas usadas este mes · Máximo 3".
  4. **La Baraja** (rectángulo inferior): acento azul `#8db0ec`, emblema espadas 40px, "La Baraja" + "Los significados de las 40 cartas · Siempre disponible".
  5. Nota final: "Nuevos rituales llegarán con las próximas lunas ✦".
- Todos los countdowns se actualizan cada segundo (tick de 1 s activo solo en esta vista).

### 2. Cruz de Vida — `Cruz de Vida.dc.html`
- Lectura mensual con paywall. Flujo: intro (cruz de 5 cartas + pasos I/II/III + **tarjeta "Tu última lectura"** con pregunta, posición, carta y texto completo) → quién consulta (mujer/hombre; define carta central Diez/Rey de Copas) → elegir pregunta (14 preguntas agrupadas Amor / Dinero y trabajo / Salud y energía) → concentración → tirada animada (baraja, reparto en cruz con volteos 3D por rondas hasta aparecer la carta representante) → resultado (solo la posición donde cayó se interpreta, texto completo del PDF).
- Posiciones: arriba=Pensamiento, izquierda=Camino, abajo=Realización, derecha=Lo que se deja atrás.
- Paywall (bottom sheet): "+1 lectura $49" / "+2 lecturas $79" (**precios placeholder, pendientes de definir**), máx. 3 lecturas/mes.

### 3. Oráculo del día — `Oráculo.dc.html`
- 4 oráculos (Tiempo Sagrado, Situación Sentimental, Alma, Contacto Cero). Flujo: elegir → barajado animado (~2.4 s) → abanico de 12 cartas, elegir 3 → revelación con volteo 3D escalonado → bloqueo 24 h con countdown, notificación simulada y toggle "Avisarme cada 24 horas", historial ("Guardar en mi historial") y "Restablecer (demo)".
- La tarjeta de mensaje crece con el contenido (cara frontal `position:relative; min-height:128px`) — el texto nunca debe desbordar el rectángulo.

### 4. Códigos Sagrados — `Códigos Sagrados.dc.html`
- 5 categorías de códigos numéricos; mismo ritual de selección; revela un código (número + propósito + instrucción de repetirlo 45 veces al día). Bloqueo semanal con countdown y notificación simulada.

### 5. Afirmaciones — `Afirmaciones.dc.html`
- 4 categorías: **Amor** y **Dinero** activas; **Trabajo** y **Salud** marcadas "Próximamente" (atenuadas al 55%, sin interacción; contenido pendiente).
- Flujo: elegir categoría → "Canalizando tu energía…" (~2.3 s, emblema pulsante en círculo con glow) → revelación de una afirmación aleatoria (evita repetir la última) → bloqueo 24 h.
- **Tarjeta de revelación** (diseño distintivo): tarjeta con halo radial del color de la categoría, doble borde dorado interior, motivo central animado con latido (`@keyframes afBeat`):
  - **Amor**: corazón CSS (cuadrado 44px rotado 45° + dos círculos via ::before/::after) en degradado rosa `#f0b9cd→#e79ab4→#c9769a` con `drop-shadow(0 0 20px rgba(231,154,180,.65))`.
  - **Dinero**: moneda de oro 72px (`radial-gradient(circle at 35% 28%, #f6e2a8, #ecc874 48%, #b98a3e)`, borde `#f0d488`, anillo interior, emblema de oros oscurecido al centro, glow dorado).
  - Comilla decorativa, afirmación en Cormorant itálica 600 24px centrada, separador degradado dorado de 44px, sello "PRISMA AZUL".
- Bloqueado: countdown grande + "Tu afirmación de hoy" con el texto completo + notificación simulada + reset demo.

### 6. La Baraja / Significados — `Significados.dc.html` + `Carta.dc.html`
- Libre, siempre disponible. 40 cartas (1–7, Sota, Caballo, Rey × 4 palos; sin 8 ni 9). Detalle con tabs General/Amor/Trabajo/Dinero (+ Salud y Energía en Espadas). `Carta.dc.html` es el componente visual de naipe reutilizable.

## Interactions & Behavior
- Navegación: estado `vista` en el hub; cada pantalla recibe un callback `onExit` que su botón "‹" invoca cuando está en su paso raíz.
- Animaciones clave: barajado (`orShufA/B`, .5–.7s alternado), volteo de cartas `rotateY` .7s `cubic-bezier(.35,.1,.25,1)` escalonado 750ms, glow pulsante en bloqueos (3.4s), latido del corazón/moneda (2.6s), entrada `afRise` .6s.
- Toasts: píldora fija arriba centrada, borde dorado, 2.2–2.4 s.
- Botón primario: degradado `linear-gradient(135deg,#f0d488,#ecc874 55%,#d9ab55)`, texto `#1c1338` 700, radio 999px, alto 54px (44px en tarjetas), sombra `0 10px 26px rgba(236,200,116,.28)`. Secundario: outline `rgba(231,207,155,.4)`, texto `#e7cf9b`. Deshabilitado: fondo `rgba(205,189,242,.14)`, texto `rgba(205,189,242,.4)`.
- Píldoras de estado: "Disponible" = degradado dorado con texto `#1c1338`; bloqueado = outline `rgba(205,189,242,.35)` con countdown en texto lavanda.
- Targets táctiles ≥44px.

## State Management (persistencia — hoy en localStorage, migrar al storage/back-end de la app)
| Llave | Contenido |
|---|---|
| `pa_vibra` | `{week: 'YYYY-M-D' (lunes), idx: 0–6}` día aleatorio semanal |
| `pa_afirmacion_lock` | timestamp de desbloqueo (+24 h) |
| `pa_afirmacion_last` | `{cat, idx, texto, nombre, fecha}` |
| `pa_afirmacion_hist` | historial (máx. 60) |
| `pa_oraculo_lock` | timestamp (+24 h) |
| `pa_oraculo_last` | `{key, ids[3], fecha}` |
| `pa_oraculo_hist` | historial (máx. 60) |
| `pa_codigo_activo` | `{cat, idx, unlockAt}` (+7 días) |
| `pa_cruz_last` | `{pregunta, pos, carta, texto, fecha}` |
| `pa_cruz_next` | timestamp de próxima lectura gratis (+30 días) |
| `pa_cruz_mes` | `{ym: 'YYYY-M', usadas, compradas}` (compras del paywall, máx. +2) |

Los temporizadores derivan de estos timestamps; tick de 1 s solo en vistas visibles.

## Design Tokens
- **Colores**: fondo base `#0a0720`; degradado de escena `#241a4f → #150d34 → #0a0720`; dorado principal `#e7cf9b`; dorado botón `#f0d488/#ecc874/#d9ab55`; texto claro `#f3ecdc`; lavanda `#cdbdf2` (secundario en rgba .5–.78); acentos de palo: copas/amor `#e79ab4`, oros/dinero `#ecc874`, espadas `#8db0ec`, bastos/salud `#86cf9e`; texto sobre dorado `#1c1338`.
- **Tipografía**: Cormorant Garamond (500–700, itálicas) para títulos, números de código y frases místicas; Hanken Grotesk (400–700) para UI y cuerpo. Kickers: 10–11px, 600, tracking .16–.3em, mayúsculas.
- **Tarjeta estándar**: radio 18–20px, borde `1px solid rgba(231,207,155,.28)`, fondo `rgba(21,13,52,.55)`, acento `box-shadow: inset 3px 0 0 <color>`.
- **Espaciado**: padding de pantalla 18–26px lateral 22px; gap entre tarjetas 12px; radio de botones 999px.
- **Naipes**: proporción 5/7, radio 6–10px, dorso `linear-gradient(160deg,#2a1f57,#150d34 60%,#0b0726)` con tramado diagonal dorado/lavanda y marco interior dorado.

## Assets
- `card-data-oscura.js`: emblemas de los palos + corona como data-URIs (`window.CARD_OSCURA.{oros,copas,espadas,bastos,corona}`). Único asset gráfico; todo lo demás es CSS.
- Google Fonts: Cormorant Garamond, Hanken Grotesk.
- Símbolos planetarios: caracteres Unicode (☽ ♂ ☿ ♃ ♀ ♄ ☉).

## Contenido (fuente: PDFs de Gilda — no editar los textos)
- `cruz-data.js`: 14 preguntas con carta representante y 4 respuestas por posición.
- `oraculo-data.js`: 4 oráculos con sus cartas/mensajes.
- `codigos-data.js`: 5 categorías de códigos sagrados.
- `afirmaciones-data.js`: afirmaciones de Amor (53) y Dinero (66); Trabajo y Salud vacías (`proximamente:true`).
- `baraja-data.js`: significados de las 40 cartas.
- `vibra-data.js`: los 7 días de vibración (día, planeta, símbolo, color, título, mensaje).
Estos archivos están diseñados para crecer: agregar un elemento al array basta para que la UI lo muestre.

## Pendientes conocidos
- Precios reales del paywall ($49/$79 son placeholders).
- Afirmaciones de Trabajo y Salud (llegarán después).
- Notificaciones push reales (hoy son maquetas visuales con toggle).

## Files
- `Prisma Azul.dc.html` — hub "Mi Camino" + navegación + paywall.
- `Cruz de Vida.dc.html`, `Oráculo.dc.html`, `Códigos Sagrados.dc.html`, `Afirmaciones.dc.html`, `Significados.dc.html` — pantallas.
- `Carta.dc.html` — componente naipe.
- `support.js` — runtime del prototipo (solo para abrir los HTML en navegador; no portar).
- `*-data.js` — contenido (portar tal cual).
