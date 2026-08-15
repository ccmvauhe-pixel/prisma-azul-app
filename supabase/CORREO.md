# Correo: recuperar contraseña

Todo lo que la app manda por correo —recuperar contraseña, confirmar un cambio
de dirección— sale de **Supabase Auth**. Supabase no es el proveedor de correo:
es quien redacta y dispara, pero necesita un servidor SMTP que entregue.

## Cómo está ahora

Supabase incluye un SMTP de cortesía que ya funciona, con dos límites duros:

| | |
|---|---|
| **2 correos por hora** | En total, no por usuaria |
| **Sin garantía de entrega** | Puede caer en spam o no llegar |

Sirve para que tú pruebes el flujo. **No sirve para tus usuarias**: la segunda
persona que pida recuperar su contraseña en una hora se queda sin correo.

Si al probar te sale *"Demasiados intentos, espera un minuto"*, no es un fallo
del código: es este límite.

## Qué proveedor

Cualquier SMTP vale. Recomendación: **[Resend](https://resend.com)**.

| | Resend | SendGrid | Amazon SES |
|---|---|---|---|
| Gratis al mes | 3 000 | 100/día | 3 000 (primer año) |
| Configuración | Muy simple | Media | Compleja |
| Documentado por Supabase | Sí | Sí | Sí |

Resend por sencillez y porque su plan gratuito sobra de largo para empezar.

## Requisito previo: un dominio

**Esto es lo que suele frenar a la gente.** Ningún proveedor serio te deja
enviar correo a desconocidos desde una dirección que no has demostrado
controlar, porque es exactamente lo que hacen los spammers.

Sin dominio propio, Resend solo te deja enviar **a tu propio correo**. Basta
para probar; no para publicar la app.

Un dominio cuesta ~150 MXN al año. Si Gilda ya tiene uno para su negocio, sirve.

## Paso a paso

### 1. Crear la cuenta

Entra en [resend.com](https://resend.com) y regístrate. No pide tarjeta.

### 2. Verificar el dominio

**Domains → Add Domain**. Escribe el dominio (p. ej. `prismaazul.com`).

Resend te dará unos registros DNS —tres o cuatro, tipo `TXT` y `MX`— que hay
que añadir donde compraste el dominio. Tarda entre minutos y unas horas en
verificarse.

> Para probar ya mismo puedes saltarte esto y usar el remitente
> `onboarding@resend.dev`, pero **solo llegará a tu propio correo**.

### 3. Crear la API key

**API Keys → Create API Key**. Permiso: *Sending access*.

Cópiala en cuanto aparezca: **no se vuelve a mostrar**. Empieza por `re_`.

⚠️ Esta clave sí es secreta, al revés que la *publishable key* de Supabase. No
la pegues en un chat ni la subas al repositorio.

### 4. Conectarla a Supabase

Dos caminos. El del panel es más rápido; el del repositorio queda documentado.

**Opción A — Panel de Supabase**

`Project Settings → Authentication → SMTP Settings → Enable Custom SMTP`

| Campo | Valor |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | tu API key (`re_...`) |
| Sender email | `hola@tudominio.com` |
| Sender name | `Prisma Azul` |

Después, en **Rate Limits**, sube *Emails per hour* de 2 a algo razonable (100
está bien para empezar).

**Opción B — Desde el repositorio**

1. Quita los `#` del bloque `[auth.email.smtp]` en `supabase/config.toml` y pon
   ahí tu remitente.
2. Exporta la clave y empuja la configuración:

```powershell
$env:RESEND_API_KEY = "re_tu_clave"
npx supabase config push
```

> **Cuidado con `config push`.** Empuja *toda* la configuración de auth, no solo
> el SMTP. Lo que hayas cambiado a mano en el panel y no esté reflejado en
> `config.toml` se perderá. Revisa el archivo antes de empujar.

### 5. Redirigir de vuelta a la app

En `Authentication → URL Configuration → Redirect URLs` debe estar esta:

```
prismaazul://auth-callback
```

Y **solo** esa. Es la única que hay en `config.toml`.

Aquí había además una de desarrollo, `exp://192.168.5.143:8081/--/auth-callback`,
para probar en Expo Go: allí la app no responde a su propio esquema sino al de
Expo, así que sin ella el enlace abre y no pasa nada.

La auditoría la retiró, y conviene entender por qué antes de volver a añadirla.
Esa IP es de una red local; hoy es la de esta casa y mañana la de una cafetería,
y una URL de redirección es a dónde Supabase acepta mandar un código de sesión.
Dejarla fija apunta a un sitio que ya no controlas.

Si la necesitas para probar el enlace mágico, añádela mientras dure la prueba y
quítala al terminar — no la dejes puesta en el proyecto de producción.

### 6. Poner el correo en español

Por defecto la plantilla viene en inglés y con la voz de Supabase.

`Authentication → Email Templates → Reset Password`

```html
<h2>Recupera tu acceso a Prisma Azul</h2>
<p>Toca el enlace para elegir una contraseña nueva:</p>
<p><a href="{{ .ConfirmationURL }}">Elegir mi contraseña</a></p>
<p>Si no pediste esto, puedes ignorar este correo.</p>
```

`{{ .ConfirmationURL }}` es la variable que Supabase sustituye por el enlace
real. Sin ella el correo llega sin enlace.

## Comprobar que funciona

1. En la app: **Acceso → Olvidé mi contraseña** → tu correo.
2. Abre el enlace **en el mismo teléfono** que lo pidió.
3. Debe aparecer **"Elige tu contraseña"**.

Si el enlace abre el navegador y se queda ahí, falta la Redirect URL del paso 5.

Si el correo no llega, míralo en el panel de Resend: **Logs** te dice si salió,
si rebotó o si nunca se envió.

## Por qué en el mismo teléfono

La app usa **PKCE**: el enlace trae un código de un solo uso que solo sirve
acompañado de un verificador guardado en el dispositivo que lo pidió. Es lo que
impide que alguien que intercepte el enlace pueda entrar en tu cuenta.

El precio es ese: abrir el correo en otro dispositivo no funciona. La pantalla
lo advierte.
