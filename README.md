# Prisma Azul

App móvil de lecturas espirituales con baraja española, hecha para la tarotista
Gilda. Expo SDK 57 + React Native + expo-router; funciona en iOS, Android y web
desde el mismo código.

## Arrancar

```sh
npm install
npm run web       # en el navegador, sin nada más que instalar
npx expo start    # servidor de desarrollo para móvil
```

### En el móvil hace falta una build de desarrollo

**Expo Go no sirve con este proyecto.** Expo Go incluye dentro una versión fija del
runtime nativo y solo ejecuta proyectos de ese SDK; este va con SDK 57 y React
Native 0.86. Da `Incompatible SDK version` y no hay actualización que lo arregle.

La build de desarrollo se hace una sola vez y después vale para siempre: solo hay
que rehacerla si cambian las dependencias nativas, no por cambios de código.

En la nube, sin instalar Android Studio (requiere cuenta gratuita en Expo):

```sh
npm i -g eas-cli
eas login
eas build --platform android --profile development
```

Si el proyecto todavía no está bajo git, hay que anteponer `EAS_NO_VCS=1`
(en PowerShell: `$env:EAS_NO_VCS = "1"`), porque EAS usa git para saber qué
empaquetar. El `.easignore` deja fuera `diseño-app/` y `animaciones/`, que juntas
pesan ~48 MB y no intervienen en la compilación.

En local, si prefieres no subir nada, hacen falta JDK y Android Studio y después
`npx expo run:android`.

Las notificaciones locales necesitan la build de desarrollo en Android; en el
navegador no existen.

## Estructura

```
src/
  app/                 Rutas (expo-router). Una pantalla por ritual.
    _layout.tsx        Fuentes, hidratación del estado y reprogramación de avisos
    index.tsx          Mi Camino — menú principal y tablero de estado
    cruz.tsx           Cruz de Vida (mensual)
    oraculo.tsx        Oráculo del día (24 h)
    codigos.tsx        Códigos Sagrados (semanal)
    afirmaciones.tsx   Afirmaciones (semanal)
    baraja.tsx         Los significados de las 40 cartas (libre)
  components/          Piezas compartidas (naipe, barajado, volteo, tarjetas…)
  data/                Contenido de los PDFs de Gilda, portado a TypeScript
  lib/                 Estado persistente, temporizadores y notificaciones
  theme/tokens.ts      Colores, tipografías y medidas del diseño
```

## Rituales y sus tiempos

| Sección | Ritmo | Llave de estado |
|---|---|---|
| Cruz de Vida | 1 lectura gratis al mes | `cruzMes`, `cruzNext`, `cruzLast` |
| Oráculo del día | cada 24 h | `oraculoLock`, `oraculoLast` |
| Códigos Sagrados | 1 por semana | `codigoActivo` |
| Afirmaciones | 1 por semana | `afirmacionLock`, `afirmacionLast` |
| Día que vibras más alto | se sortea 1 vez por semana | `vibra` |
| La Baraja | siempre disponible | — |

## Guardar es lo que conserva

Al terminar cualquier ritual aparece un botón de guardar. **Solo lo guardado
sobrevive**: lo que no se guarda no vuelve a aparecer en ninguna parte, ni
siquiera durante el periodo activo de su temporizador. Todo vive en `guardados`
(máx. 60 entradas) y se consulta desde la propia sección:

| Sección | Qué conserva |
|---|---|
| Afirmaciones | la última afirmación guardada |
| Códigos Sagrados | el código guardado, mientras sea el de la semana en curso |
| Oráculo | **solo la última** lectura, y **caduca con su temporizador** |
| Cruz de Vida | listado de todas las lecturas guardadas |

Las tarjetas de Mi Camino leen de ahí: si no hay nada guardado muestran su estado
vacío, y las de Oráculo y Cruz ofrecen un CTA para ver lo guardado.

Dos reglas viven en `lib/store.ts` y son fáciles de mover a otras secciones:

- `SOLO_ULTIMO` — tipos que no acumulan: al guardar uno nuevo se descarta el
  anterior. Hoy solo el Oráculo.
- El campo `expira` de una entrada — si lo declara, se descarta al vencer y se
  limpia del almacenamiento al arrancar. Hoy solo el Oráculo lo usa.

Cada entrega se guarda **una sola vez**: el botón lanza un destello con chispas,
queda apagado, y vuelve a activarse cuando el temporizador trae una entrega nueva.

Excepción deliberada: en Códigos Sagrados, durante la sesión en que se activa el
código este sigue a la vista para poder guardarlo. Al salir y volver, solo queda
lo guardado.

## Notificaciones

`src/lib/notifications.ts` programa dos cosas y se recalcula solo en cada cambio
de estado:

1. **Avisos de desbloqueo** — cuando un ritual con temporizador vuelve a estar
   disponible.
2. **Recordatorios aleatorios** — cuatro momentos al azar repartidos dentro de la
   ventana activa de la afirmación y el código, entre las 9:00 y las 21:00,
   invitando a repetirlos.

Cada ritual tiene su propio interruptor en la pantalla bloqueada.

## Sobre el diseño

La carpeta `diseño-app/` es el bundle de handoff de Claude Design: prototipos
HTML/CSS/JS de alta fidelidad. **Los nombres de archivo del bundle no coinciden
con su contenido** (llegaron rotados). En `diseño-app/_resolved/` está el mismo
material con los nombres correctos —incluido `HANDOFF.md`, el documento maestro—
y es la referencia a consultar.

Los colores, tipografías, espaciados, copys y animaciones son finales. Los textos
de contenido (preguntas, respuestas, códigos, afirmaciones, significados) vienen
de los PDFs de Gilda y **no deben reescribirse**: se portaron literalmente a
`src/data/` con un script, para garantizar fidelidad.

## Animaciones

`animaciones/` trae las animaciones originales en HTML. **Sus nombres también
llegaron rotados**; la copia con nombres correctos está en `animaciones/_resolved/`,
junto al `HANDOFF-animaciones.md` que las describe.

| Animación | Dónde se usa | Componente |
|---|---|---|
| Barajeo 3D | Cruz de Vida, Oráculo, Códigos, Afirmaciones | `components/Barajado.tsx` |
| Abanico de selección | Oráculo | `components/AbanicoOraculo.tsx` |
| Volteo de carta | todas | `components/Volteo.tsx` |

Dos apuntes al portarlas a React Native:

- **No existe `translateZ` ni `preserve-3d`.** Donde el original usa profundidad
  se calcula a mano con `escala = perspectiva / (perspectiva − z)`.
- **No hay ordenado por profundidad.** CSS decide qué carta va delante según su Z
  real; React Native pinta en orden de montaje. Por eso el barajeo asigna un
  `zIndex` derivado de la profundidad; sin él, la última carta tapaba a todas.

En el barajeo, el apilado del mazo y los keyframes van en **elementos distintos**
(igual que el original): el externo lleva la posición dentro del mazo y el interno
la animación. Fusionarlos aplana el mazo.

La demo `ruleta-codigos.html` no llegó en el paquete (se perdió en la rotación de
nombres); su descripción sí está en el handoff, por si se quiere implementar.

### Diferencias deliberadas respecto al prototipo

- **Sin paywall.** El prototipo ofrecía lecturas adicionales de la Cruz de Vida a
  $49/$79 (máx. 3 al mes). Aquí la Cruz da una lectura gratis al mes y nada más.
- **Afirmaciones semanales, no diarias.** El prototipo las bloqueaba 24 h; los
  copys se ajustaron ("de hoy" → "de la semana", "cada 24 horas" → "cada semana").
- **Guardar decide qué sobrevive.** En el prototipo el contenido persistía solo,
  y "Guardar" apenas alimentaba un historial invisible. Aquí guardar es la única
  forma de conservar algo, y el historial se ve dentro de cada sección.
- **Notificaciones reales.** En el prototipo el interruptor era decorativo.
- **Botones y medidas adaptativos.** El diseño es de ancho fijo (430 px); aquí
  naipes, rejillas y botones se calculan sobre el ancho disponible y crecen en
  tablet (ver `lib/layout.ts` y `useMedidaBoton`).

## Pendientes conocidos

- Afirmaciones de Trabajo y Salud: las categorías existen y aparecen como
  "Próximamente"; su contenido todavía no llega.
- Los 8 y 9 no existen en la baraja española de 40 cartas, por diseño.
- Notificaciones personalizadas con el nombre del usuario: el enganche está listo
  en `MENSAJES_RECORDATORIO`, falta capturar el nombre (no hay pantalla de
  onboarding en el diseño).
