# Prisma Azul — Insumos para una propuesta de negocio

> **Cómo usar este archivo:** pégalo completo en Claude (chat) y pídele la cotización o
> propuesta. Todo lo que hay aquí son datos medidos, no estimaciones, salvo donde
> dice explícitamente "estimado". Al final hay una sección con lo que falta por
> decidir: eso es lo que tú tienes que responder, no Claude.

---

## 1. Qué es el producto

**Prisma Azul** — aplicación móvil de lecturas espirituales con la baraja española,
en español, para la tarotista Gilda. Android e iOS desde una sola base de código.

Seis rituales, cada uno con su propio temporizador y su contenido:

| Ritual | Ritmo | Contenido |
|---|---|---|
| Cruz de Vida | 1 lectura gratis al mes | 14 preguntas en 3 categorías, tirada de 5 cartas |
| Oráculo del día | cada 24 h | 195 cartas de oráculo |
| Código sagrado | 1 por semana | 231 códigos |
| Afirmaciones | 1 por semana | 119 afirmaciones |
| Día de mayor vibración | semanal | 7 días |
| La Baraja | siempre | 40 cartas con su significado |

Más: perfil de usuario, onboarding con cuestionario, notificaciones
personalizadas por sección, y analítica de uso.

**Origen del contenido:** los textos son de Gilda, transcritos de sus PDFs. El
diseño visual también viene de un handoff suyo (`diseño-app`). Eso es aporte de
ella, no del desarrollo — conviene que la propuesta lo reconozca explícitamente.

---

## 2. Trabajo ya realizado — medición real

### 2.1 Consumo de tokens

Extraído del transcript de la sesión de trabajo (`b562f53e-…jsonl`, 9,46 MB):

| Concepto | Tokens |
|---|---:|
| Entrada (sin caché) | 37 318 |
| **Salida (generación)** | **1 592 691** |
| Escritura de caché | 6 661 407 |
| Lectura de caché | 565 035 907 |
| **Total procesado** | **573 327 323** |

- Periodo registrado: **25 al 27 de julio de 2026** (~53 horas de calendario)
- 1 655 respuestas del modelo · 41 turnos del usuario
- Modelo: **Claude Opus 5** en el 100 % de las respuestas

### 2.2 Costo real de ese cómputo

Tarifas Opus 5 (USD por millón de tokens): entrada $5 · salida $25 ·
escritura de caché (TTL 1 h) $10 · lectura de caché $0,50.

| Concepto | Tokens | USD |
|---|---:|---:|
| Entrada | 37 318 | $0,19 |
| Salida | 1 592 691 | $39,82 |
| Escritura de caché | 6 661 407 | $66,61 |
| Lectura de caché | 565 035 907 | $282,52 |
| **TOTAL** | | **≈ $389 USD** |

> ⚠️ **Advertencia importante y honesta:** esa cifra cubre **solo** la ventana
> registrada del 25 al 27 de julio. El trabajo anterior — construcción original de
> la app, transcripción del contenido de los PDFs, implementación del diseño de
> Gilda — ocurrió en sesiones cuyos transcripts ya no están en disco. **El costo
> real acumulado es mayor, probablemente 2–3× esta cifra.** No lo puedo medir, así
> que no lo inventes: preséntalo como "≥ $389 USD verificados, más sesiones
> previas no instrumentadas".

### 2.3 Qué se construyó en esa ventana

1. Migración completa de Expo SDK 57 → SDK 54 (compatibilidad con el Expo Go de la tienda)
2. Cinco cambios de producto (entrega automática de códigos, ritmo de animación de la Cruz, paso de categorías, política de "solo el último guardado", color de índices)
3. Reordenamiento del menú principal
4. **Integración completa de Supabase**: esquema, RLS, sincronización local-first, semillas de contenido
5. **Onboarding nuevo** de tres pasos + sección de perfil
6. Sistema de notificaciones personalizadas por nombre y por sección
7. **Capa de analítica** con seis vistas de reporte y función de condensación
8. Paso de diseño: escala tipográfica unificada, piso de legibilidad, poda de texto redundante

### 2.4 Inventario de código

| Área | Archivos | Líneas |
|---|---:|---:|
| `src/app` (pantallas) | 8 | 4 704 |
| `src/components` | 14 | 3 319 |
| `src/lib` (lógica y datos) | 10 | 2 117 |
| `src/data` (contenido de Gilda) | 7 | 3 057 |
| `src/theme` | 1 | 121 |
| `supabase` (esquema, RLS, analítica) | 5 | 2 107 |
| `scripts` | 1 | 285 |
| **Total** | **46** | **15 710** |

### 2.5 Base de datos en producción

- **17 tablas**, 6 políticas RLS, 6 vistas de analítica
- Contenido cargado: 4 palos · 40 cartas · 231 códigos · 119 afirmaciones · 195 cartas de oráculo · 14 preguntas de Cruz · 7 días
- Peso medido por evento de analítica: **112 bytes** (~200 bytes con índices)
- Función `condensar_eventos(dias)` que resume el histórico y evita crecimiento indefinido

### 2.6 Arquitectura (lo que sostiene el valor técnico)

- **Local-first**: la app abre y funciona sin red; Supabase sincroniza detrás
- **Regla de fusión "gana lo más restrictivo"**: reinstalar la app no regala lecturas de pago
- **Contenido en tres capas** (empaquetado → caché → remoto): los textos se pueden actualizar sin publicar una versión nueva en las tiendas
- **RLS verificada adversarialmente**: el contenido es inmutable desde el cliente y los datos de una persona son invisibles para las demás
- Vistas de analítica con permisos revocados a `anon`/`authenticated` (cerrando un agujero real de Postgres)

---

## 3. Lo que falta — trabajo pendiente

Ordenado por bloques, con el estado real de cada uno.

### 3.1 Seguridad y cuentas (parcialmente hecho)

| Ítem | Estado |
|---|---|
| RLS en todas las tablas | ✅ hecho y verificado |
| Claves públicas separadas de secretas, `.env` fuera de git | ✅ hecho |
| Vistas de analítica sin fuga de datos | ✅ hecho |
| **Autenticación con contraseña** | ⏸️ código escrito, sin conectar |
| **Recuperación de contraseña por correo** | ❌ bloqueado: requiere dominio propio |
| **SMTP propio (Resend u otro)** | ❌ bloqueado: requiere dominio propio |
| Login con Google / Apple | ❌ no empezado (Apple lo exige si hay login social) |
| Auditoría de seguridad previa a publicación | ❌ no empezado |

> Hoy las sesiones son **anónimas**: funcionan, aíslan datos correctamente y
> permiten añadir contraseña después sin que nadie pierda información. Pero
> mientras no haya contraseña, **si alguien pierde el teléfono pierde su cuenta**.
> Esto es lo primero que hay que cerrar antes de publicar.

### 3.2 Pruebas

| Ítem | Estado |
|---|---|
| Verificación de tipos (`tsc`) y linting | ✅ integrados, limpios |
| Pruebas manuales en Expo Go | ✅ continuas |
| **Suite de pruebas automatizadas** | ❌ no existe |
| **Pruebas en dispositivos reales** (varias pantallas/versiones) | ❌ no empezado |
| Pruebas de carga / concurrencia en Supabase | ❌ no empezado |
| Beta cerrada con usuarias reales (TestFlight / Play interno) | ❌ no empezado |

### 3.3 Publicación en tiendas

| Ítem | Estado |
|---|---|
| Cuenta de desarrollador Apple | ❌ **$99 USD/año** |
| Cuenta de desarrollador Google Play | ❌ **$25 USD pago único** |
| Compilaciones de producción (EAS Build) | ❌ no empezado |
| Iconos, splash, capturas, textos de ficha | ❌ no empezado |
| **Política de privacidad** (obligatoria en ambas tiendas) | ❌ no empezado |
| **Términos y condiciones** | ❌ no empezado |
| Declaración de recolección de datos (Data Safety / Privacy Nutrition Labels) | ❌ no empezado |
| Revisión de las tiendas (1–2 semanas, con posibles rechazos) | ❌ pendiente |

### 3.4 Cumplimiento legal (importante y a menudo olvidado)

La app **recolecta datos personales**: nombre, correo, fecha de nacimiento e
intereses declarados. Eso obliga a:

- Aviso de privacidad conforme a la ley mexicana (LFPDPPP) — y GDPR si hay usuarias en Europa
- Mecanismo para que una persona **borre su cuenta y sus datos** (Apple lo exige desde 2022)
- Bloqueo de menores de 13 años → ✅ ya implementado
- Consentimiento explícito para notificaciones → ✅ ya implementado

### 3.5 Mantenimiento continuo (post-lanzamiento)

- **Actualizaciones forzadas de SDK**: Expo publica versión nueva ~2 veces al año, y las tiendas obligan a actualizar el target de Android cada año. Ignorarlo saca la app de la tienda.
- Soporte a usuarias y corrección de fallos reportados
- Carga de contenido nuevo de Gilda (ya hay script para exportarlo)
- Monitoreo del uso de Supabase y ejecución periódica de `condensar_eventos()`
- Lectura e interpretación de la analítica → informes para decisiones de producto
- Copias de seguridad y plan de recuperación

---

## 4. Costos recurrentes de operación

| Servicio | Nivel gratuito | Cuándo hay que pagar | Costo |
|---|---|---|---|
| **Supabase** | 500 MB DB, 50 000 usuarios activos/mes | al superarlo | $25 USD/mes (Pro) |
| **Apple Developer** | — | siempre, para publicar en iOS | $99 USD/año |
| **Google Play** | — | una sola vez | $25 USD |
| **Dominio** | — | necesario para correos de recuperación | ~$12–15 USD/año |
| **Resend** (correo) | 3 000 correos/mes | al superarlo | $20 USD/mes |
| **EAS Build** (compilaciones) | limitado | si se compila con frecuencia | $0–99 USD/mes |

**Piso realista para operar el primer año: ≈ $140–160 USD** (Apple + Play +
dominio, todo lo demás en nivel gratuito). Si la app crece a más de 50 000
usuarias activas al mes, sube a **≈ $700 USD/año**.

**Proyección de almacenamiento medida** (a 200 bytes/evento con índices):

| Escenario | Al mes | Al año |
|---|---:|---:|
| 100 personas activas | 3 MB | 36 MB |
| 1 000 personas activas | 30 MB | 360 MB |

Con 1 000 personas activas diarias se aguanta cerca de un año en el plan gratuito
antes de acercarse al límite de 500 MB.

---

## 5. Aportes de cada parte (esto es el corazón de la negociación)

### Aporta Gilda
- **Todo el contenido**: 231 códigos sagrados, 119 afirmaciones, 195 cartas de oráculo, significados de las 40 cartas, 14 preguntas de la Cruz — material propio, resultado de su práctica
- **El diseño visual completo** (handoff `diseño-app`): paleta, tipografías, emblemas, composición de pantallas
- **La marca y la audiencia**: el nombre Prisma Azul, su reputación y su público existente
- Validación del producto y dirección editorial

### Aporta Danny
- **Toda la construcción técnica**: 15 710 líneas, 46 archivos, arquitectura local-first, base de datos, sincronización, notificaciones, analítica
- **El costo de cómputo ya pagado**: ≥ $389 USD verificados (probablemente 2–3× más contando sesiones previas)
- ~53 horas de calendario solo en la ventana medida, más el trabajo anterior
- Infraestructura, cuentas y publicación en tiendas
- Mantenimiento y actualizaciones futuras (compromiso continuo, no puntual)

---

## 6. Lo que TÚ tienes que decidir antes de pedir la propuesta

Claude no puede responder esto por ti. Contéstalo y pásaselo junto con el archivo:

1. **La meta de reparto.** Escribiste "irnos 50/50 y quedar en 49/50". Lo interpreto
   como: **anclar en 50/50 y aceptar bajar hasta 49/51** como piso. Confírmalo o
   corrígelo, porque cambia por completo el tono de la propuesta.

2. **¿Reparto de qué?** No es lo mismo repartir:
   - las utilidades netas (ingresos menos costos)
   - los ingresos brutos
   - la propiedad de la empresa o de la app como activo

3. **¿Cómo va a generar dinero la app?** Hoy no tiene monetización. Opciones:
   suscripción, lecturas adicionales de pago, publicidad, gratuita como imán para
   consultas privadas de Gilda. La propuesta cambia radicalmente según esto.

4. **¿Quién repone los costos ya pagados?** ¿El cómputo y las cuentas se
   descuentan de los primeros ingresos antes de repartir, o se asumen como aporte
   a fondo perdido?

5. **¿Qué pasa si alguien se va?** ¿Quién se queda el código? ¿Quién se queda el
   contenido? ¿Se puede seguir operando sin la otra parte?

6. **¿El mantenimiento futuro está incluido en el 50 %, o se cobra aparte?** Es la
   pregunta que más conflictos genera a los seis meses.

---

## 7. Instrucción sugerida para Claude

> Con base en el documento anterior, redacta una propuesta de sociedad al 50/50
> entre Danny (desarrollo y tecnología) y Gilda (contenido, diseño y marca) para
> la aplicación Prisma Azul.
>
> Debe incluir: resumen ejecutivo, descripción de aportes de cada parte con los
> datos medidos, valoración del trabajo ya realizado, plan de trabajo pendiente
> con fases, estructura de costos recurrentes, propuesta de reparto, y cláusulas
> de mantenimiento, salida y propiedad intelectual.
>
> Tono profesional pero cercano, en español de México. Usa las cifras exactas del
> documento y marca claramente lo que es estimación. No inventes números que no
> estén aquí.

---

*Documento generado con datos medidos del repositorio y de los transcripts de
trabajo. Última actualización: 27 de julio de 2026.*
