# Supabase — puesta en marcha

Todo lo de esta carpeta se aplica desde el **SQL Editor** del panel de Supabase.

| Archivo | Qué es |
|---|---|
| `schema.sql` | Tablas, políticas de seguridad (RLS), disparadores e índices. |
| `seed.sql` | El contenido de los PDFs de Gilda. **Generado**, no editar a mano. |

Para regenerar el contenido tras tocar `src/data/`:

```sh
node scripts/exportar-contenido.mjs
```

## 1. Crear el proyecto

1. Entra en [supabase.com](https://supabase.com) y crea una cuenta.
2. **New project**. Elige un nombre (p. ej. `prisma-azul`) y una contraseña de
   base de datos — **guárdala**, no se puede recuperar después.
3. Región: la más cercana a tus usuarias. Para México, `us-east-1` o `us-west-1`.
4. El plan gratuito sobra para este tamaño: el contenido entero ocupa ~220 KB.

Tarda un par de minutos en aprovisionarse.

## 2. Aplicar el esquema

En el panel: **SQL Editor → New query**.

1. Pega el contenido de `schema.sql` y pulsa **Run**.
2. Nueva consulta: pega `seed.sql` y **Run**.
3. Nueva consulta: pega `migraciones/003-limite-eventos.sql` y **Run**.

Los tres son idempotentes: puedes reejecutarlos sin duplicar nada.

> **El paso 3 no es opcional.** `schema.sql` ya incluye todo lo de
> `001-cruz-semanal.sql` y `002-endurecer.sql`, pero **no** el tope de escritura
> de `003`. Sin él, `eventos` no tiene límite de filas por persona: la clave
> publicable va dentro del APK y abrir una sesión anónima no pide nada, así que
> cualquiera puede llenar la base hasta agotar el plan — y cuando se llena, deja
> de escribir para todo el mundo. Los `MAX_COLA` y retardos de `analitica.ts`
> son del cliente y no frenan a quien no ejecuta la app.
>
> Las migraciones `001` y `002` **no** hay que ejecutarlas en una base nueva, y
> `001` no debe ejecutarse nunca después de `002` (lo explica su cabecera).

Para comprobar que entró todo, en **Table Editor** deberías ver:

| Tabla | Filas |
|---|---|
| `palos` | 4 |
| `cartas` | 40 |
| `codigo_categorias` | 5 |
| `codigos` | 231 |
| `afirmacion_categorias` | 4 |
| `afirmaciones` | 119 |
| `oraculos` | 4 |
| `oraculo_cartas` | 195 |
| `cruz_preguntas` | 14 |
| `vibra_dias` | 7 |

## 3. Configurar el acceso por enlace mágico

En **Authentication → Providers → Email**:

- Deja **Enable Email provider** activado.
- Deja **Confirm email** **activado**.

> Antes aquí ponía justo lo contrario: que lo desactivaras para que el primer
> enlace ya iniciara sesión. Es cómodo y es un agujero. El correo es el único
> factor de recuperación que tiene la app —no hay MFA ni teléfono—, así que sin
> confirmar, cualquiera se registra con una dirección ajena y el buzón que puede
> recuperar esa cuenta es de otra persona. Pesa más de lo que parece porque el
> plan es usar `perfiles.correo` para convertir las cuentas anónimas de hoy en
> cuentas de verdad (`schema.sql`, líneas 166-169).
>
> Con **Confirm email** activo hace falta SMTP propio antes de abrir el registro
> de verdad: el de cortesía de Supabase son 2 correos por hora **en total**. Ver
> `CORREO.md`.

En **Authentication → URL Configuration → Redirect URLs**, en producción basta
con la primera:

```
prismaazul://auth-callback
```

Para desarrollo con Expo Go, añade además la que corresponda **solo en tu
proyecto local**, sin dejarla en la lista de producción:

```
exp://127.0.0.1:8081/--/auth-callback
```

La primera es la app instalada; `prismaazul` es el `scheme` declarado en
`app.json`. La segunda es para **Expo Go durante el desarrollo**, y es un punto
que sorprende: en Expo Go la app no corre bajo su propio esquema sino bajo el de
Expo, así que sin esta entrada el enlace mágico abre y no inicia sesión.

> Si pruebas por red local, la URL de Expo Go lleva tu IP
> (`exp://192.168.5.143:8081/--/auth-callback`). Añádela también, o usa el
> túnel, que da una URL estable.

El correo de plantilla por defecto sirve para empezar. Cuando quieras el texto
en español y con la voz de Prisma Azul, se cambia en **Authentication → Email
Templates**.

## 4. Conectar la app

Copia `.env.example` a `.env` en la raíz del proyecto y rellena:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Los dos valores están en **Settings → API**: *Project URL* y la clave
**`anon` `public`**.

Después hay que **reiniciar Metro**: las variables `EXPO_PUBLIC_` se incrustan
en el bundle al compilar, así que un recargado normal no las recoge.

```sh
npx expo start --go --lan --port 8081 --max-workers 2 --clear
```

Sin `.env`, la app funciona igual que hasta ahora, solo que sin sincronizar
(ver `haySupabase` en `src/lib/supabase.ts`).

## Sobre la seguridad

**La clave `anon` es pública a propósito.** Va incrustada en el bundle y
cualquiera puede extraerla; eso no es un fallo. Quien protege los datos es
**RLS**: cada fila de `guardados` y `estado_rituales` solo es visible para su
dueño, comprobado por la base de datos en cada consulta, no por la app.

**La clave `service_role` nunca debe tocar este repositorio.** Se salta RLS por
completo. Solo tiene sentido en un servidor, y aquí no hay ninguno.

Las tablas de contenido tienen RLS activo con una única política de lectura. Al
no existir política de escritura, nadie puede modificarlas desde la app —
editarlas es cosa del panel, que usa `service_role` y por eso sí puede.

**Y la otra cara de eso, que conviene decidir a sabiendas:** esa política de
lectura es `using (true)` para `anon`, así que el contenido entero —las 40
cartas, los 231 códigos, las 119 afirmaciones, los 195 mensajes de oráculo y las
14 preguntas de la Cruz— lo descarga cualquiera con un `curl` y la clave
publicable, sin instalar la app ni crear cuenta. No hay dato personal en juego,
solo los textos de los PDFs de Gilda.

Es inherente a que la app hable directamente con la base y no haya servidor en
medio: la clave va en el APK y `anon` tiene que poder leer para que la app
funcione sin registro. `max_rows = 1000` en `config.toml` limita cada respuesta,
lo que ralentiza el copiado pero no lo impide.

Si algún día el contenido se cobra, la solución no es retocar RLS —es meter una
Edge Function que sirva el contenido solo a quien haya pagado. Mientras tanto,
esto es una decisión tomada, no un descuido.

**Tope de escritura en `eventos`.** `003-limite-eventos.sql` limita a 200
eventos por hora y persona con un trigger. Es lo único que impide que alguien
con la clave publicable llene la base; los límites de `analitica.ts` son del
cliente y no cuentan. Si añades tablas nuevas donde la app escriba, piensa en
ellas igual: RLS dice *quién* escribe, no *cuánto*.

## Editar el contenido más adelante

Gilda puede corregir textos desde **Table Editor** sin publicar una versión
nueva de la app. Después de editar, sube el número en `contenido_version` de la
sección tocada: la app guarda el contenido en caché y solo vuelve a bajarlo si
esa versión es mayor que la suya.

```sql
update public.contenido_version
   set version = version + 1, actualizado_en = now()
 where seccion = 'codigos';
```
