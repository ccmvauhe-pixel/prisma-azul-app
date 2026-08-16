# Antes de publicar en App Store y Google Play

Lo que ya está hecho, lo que falta, y en qué orden. Los bloqueos están marcados
con lo que hace falta para desbloquearlos.

---

## 1. Actualizaciones OTA — ✅ listo

`expo-updates@~29.0.19` instalado y configurado. A partir de la primera build,
un fallo de JavaScript se corrige sin pasar por la revisión de las tiendas:

```sh
npx eas update --branch production --message "qué se arregla"
```

Configuración en `app.json`:

| Clave | Valor |
|---|---|
| `updates.url` | `https://u.expo.dev/b8a52e95-4d45-4f18-ade3-0b923b419c5a` |
| `runtimeVersion.policy` | `fingerprint` |
| `extra.eas.projectId` | `b8a52e95-4d45-4f18-ade3-0b923b419c5a` |

Y los canales en `eas.json`: `development`, `preview`, `production`.

### Por qué `fingerprint` y no `appVersion`

`eas update:configure` pone `appVersion` por defecto, que ata la actualización al
número de versión de la app. El problema: si alguien añade una dependencia
**nativa** y no sube `version`, la OTA se entrega igualmente a un binario que no
tiene ese módulo. Resultado: la app se cierra al abrir, en todos los teléfonos, y
la única salida es una build nueva pasando por revisión.

`fingerprint` calcula un hash de las dependencias nativas, así que una OTA
incompatible sencillamente no se entrega. Comprobado en este proyecto:

| Plataforma | Fingerprint | Fuentes |
|---|---|---|
| Android | `c5e6472b0fe2fae291bdca4230fbd75402003740` | 150 |
| iOS | `9420ed9e8466c513ed991ec73975b6659eb6dcfa` | 144 |

Para recalcularlo: `npx expo-updates fingerprint:generate --platform android`

### Dos cosas que conviene saber

**Las OTA no funcionan en Expo Go.** Solo en builds de desarrollo o de
producción. El flujo de trabajo diario no cambia.

**Quien controle la cuenta de EAS puede publicar JavaScript a todas las
instalaciones.** Es la contrapartida de tener OTA: el poder de arreglar en
caliente es el mismo poder de romper en caliente. Dos medidas, por orden de
esfuerzo:

1. **2FA en la cuenta de Expo** (`dany_gutz`). Es lo mínimo y son cinco minutos.
2. **Code signing de EAS Update** — firma cada actualización con una clave
   propia, y el binario rechaza lo que no venga firmado. Cierra el caso de "me
   entraron en la cuenta de Expo". Añade fricción a cada publicación, así que
   vale la pena cuando haya usuarias de verdad, no ahora.

---

## 2. App Links / Universal Links — ⛔ bloqueado

### Por qué importa

La app usa el esquema propio `prismaazul://`. En Android cualquier app puede
declarar el mismo `intent-filter`; en iOS, si dos apps reclaman el esquema, quién
gana es indefinido. O sea: **una app maliciosa instalada en el mismo teléfono
puede interceptar el enlace de recuperación de contraseña.**

Hoy eso no es explotable gracias a PKCE (`supabase.ts:63`): el `code` no sirve
sin el verificador que se quedó en el teléfono legítimo. App Links lo cierra de
raíz, porque el dominio se verifica criptográficamente y nadie más puede
reclamarlo.

### Los tres bloqueos

| # | Falta | Cómo se consigue |
|---|---|---|
| 1 | Un dominio | Sin decidir. Hace falta igualmente para el SMTP (`supabase/CORREO.md`) |
| 2 | Apple Team ID | Cuenta de Apple Developer de pago (99 USD/año) |
| 3 | SHA-256 del certificado Android | Existe tras la primera build: `eas credentials`, o Play Console → App Signing |

El 3 crea un orden obligatorio: **primera build → App Links → publicación**. No
se puede hacer antes.

### Todo listo para pegar

Sustituye `TUDOMINIO.com`, `TEAMID` y `SHA256_DEL_CERTIFICADO`.

**`app.json` → `ios`:**

```json
"associatedDomains": ["applinks:TUDOMINIO.com"]
```

**`app.json` → `android`:**

```json
"intentFilters": [
  {
    "action": "VIEW",
    "autoVerify": true,
    "data": [
      { "scheme": "https", "host": "TUDOMINIO.com", "pathPrefix": "/auth-callback" }
    ],
    "category": ["BROWSABLE", "DEFAULT"]
  }
]
```

**`https://TUDOMINIO.com/.well-known/assetlinks.json`:**

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.prismaazul.app",
      "sha256_cert_fingerprints": ["SHA256_DEL_CERTIFICADO"]
    }
  }
]
```

**`https://TUDOMINIO.com/.well-known/apple-app-site-association`:**

Sin extensión `.json` en el nombre, y servido con
`Content-Type: application/json`. Es el error que más veces rompe esto.

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["TEAMID.com.prismaazul.app"],
        "components": [{ "/": "/auth-callback*" }]
      }
    ]
  }
}
```

### El único cambio de código

`urlDeRetorno()` en `src/lib/auth.ts` devuelve hoy el esquema propio:

```ts
export function urlDeRetorno(): string {
  return Linking.createURL('/auth-callback');   // → prismaazul://auth-callback
}
```

Con App Links debe devolver `https://TUDOMINIO.com/auth-callback` en producción,
manteniendo `createURL()` en desarrollo (Expo Go no resuelve App Links).

**`esRutaCallback()` no hay que tocarla.** Comprobado: ya acepta
`https://TUDOMINIO.com/auth-callback?code=…` y sigue rechazando cualquier otra
ruta del mismo dominio. Compara el último segmento, no el esquema.

Y en Supabase → **Authentication → URL Configuration**, añadir
`https://TUDOMINIO.com/auth-callback` a las Redirect URLs.

---

## 3. Lo que revienta la build si se olvida — ⚠️

**Las variables de entorno en EAS.** `.easignore` excluye `.env` a propósito, y
`src/lib/supabase.ts:30-35` lanza a propósito si faltan en una build de
producción. La build compila igual y **la app se cierra al abrirse**.

```sh
eas env:create --name EXPO_PUBLIC_SUPABASE_URL      --value "..." --environment production
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "..." --environment production
eas env:list
```

---

## 4. Ajustes de Supabase — ✅ hecho el 15/08/2026

**Esta era la sección más importante del documento**, y resultó serlo más de lo
que decía: al ir a aplicarla se descubrió que **las migraciones `004` y `005`
tampoco se habían aplicado nunca**. Faltaban `limitar_altas` (el tope de altas
que §4.2 daba por existente), `purgar_anonimos`, las tres validaciones de forma
y las políticas separadas de `perfiles`.

Ojo con el párrafo que estaba escrito aquí, porque era falso y costó caro: decía
que «el SQL de `supabase/` sí está aplicado, porque se pega a mano en el SQL
Editor». **No des por aplicado nada que no hayas comprobado contra el servidor.**
Consultar `pg_proc`, `pg_policies` y `information_schema.role_table_grants`
cuesta segundos y es la única respuesta fiable.

Lo que sigue siendo cierto: `supabase/config.toml` es la configuración del CLI
para desarrollo **local**. El proyecto de la nube se configura desde el panel, y
el `.toml` no ha hecho nada nunca si nadie lo ha subido.

### Lo que se aplicó y se verificó

- Migraciones `004`, `005` y `006`, por `supabase db query --linked`.
- Las 6 vistas en `security_invoker`; `TRUNCATE` sobre el contenido revocado
  (lo tenía `authenticated`, y RLS no filtra ese verbo); permisos verbo a verbo.
- Las nueve casillas de §4.1, a mano en el panel.
- Hook **Before User Created → `public.limitar_altas`**, activo. Comprobado con
  un alta anónima real contra el proyecto: HTTP 200 y la fila en `auth.users`.

Queda fuera, y no se puede: el índice de `auth.users` (ver `005` §3).

Ninguno de estos cambios rompe la app tal como está hoy, y todos son de
servidor: surten efecto al instante, sin publicar una versión nueva.

### 4.1 Cotejar el panel, casilla por casilla

| Dónde | Qué | Por qué importa |
|---|---|---|
| Authentication → Policies | Mínimo de contraseña **8** | Si está en 6, la regla de 8 vive solo en React, y eso se salta llamando a la API |
| Authentication → Policies | Requisitos `letters_digits` | Ídem |
| Authentication → Providers → Email | **Desactivar** "Enable email signup" | Cierra registro y enumeración de correos mientras `PantallaAcceso` siga desconectada |
| Authentication → Providers → Email | Activar **Confirm email** | |
| Authentication → Providers → Email | Activar **Secure password change** | Exige haber entrado hace poco para cambiar la contraseña |
| Authentication → Rate Limits | Correos: **2**/hora · intervalo **60s** | |
| Authentication → Rate Limits | Anonymous sign-ins: **30**/hora/IP | |
| Authentication → Sessions | Caducidad del OTP: **900s** (15 min) | Es la ventana del enlace de recuperación. Por defecto es 1 hora |
| Authentication → URL Configuration | Quitar `exp://192.168.5.143:8081/--/auth-callback` | Es una IP de una red de desarrollo que hoy es de cualquiera |

### 4.2 Activar el hook que limita las altas — ⚠️ orden obligatorio

`005-tope-de-altas.sql` crea `public.limitar_altas`, el techo de **300 cuentas
anónimas por hora** en total. Aplicar el SQL crea la función; **no hace nada
hasta que se active el hook.** Y hoy ese techo es lo único que impide que crear
cuentas sea gratis e ilimitado, que es de donde salía el hallazgo grave.

El orden no es negociable — al revés, Supabase rechaza TODA alta y, como el
acceso de la app es una sesión anónima que se abre sola, **nadie que instale la
app puede entrar**:

1. Comprobar que la función existe (debe devolver `prosecdef = t`):

   ```sql
   select proname, prosecdef, proconfig from pg_proc where proname = 'limitar_altas';
   ```

2. Y solo entonces: Authentication → Hooks → **Before User Created** →
   `public.limitar_altas`.

3. La prueba que de verdad importa: **desinstala la app, vuelve a instalarla y
   comprueba que abre.** Es el caso que se rompe si el hook está mal puesto.

### 4.3 Aplicar la migración 006

`supabase/migraciones/006-vistas-y-borrado.sql` → SQL Editor → Run. Cierra los
dos hallazgos de la tercera auditoría (vistas que se saltaban RLS, y el DELETE
de `estado_rituales`). Las comprobaciones vienen al final del propio archivo.

Lee su sección 3 antes: cambia el comportamiento por defecto de las tablas que
se creen **a partir de ahora**, incluidas las del editor del panel. Es
deliberado, pero sorprende si no se espera.

---

**No uses `npx supabase config push`** sin comparar antes: sube el fichero
entero, no hay `--dry-run`, y sobrescribiría cualquier ajuste hecho desde el
panel que no esté en el `.toml`.

---

## 5. Decisiones que no son técnicas

### Las cuentas siguen siendo anónimas

Hoy la sesión **es** la cuenta: no hay contraseña ni correo con los que volver.
Desinstalar la app, cambiar de teléfono o borrar datos = se pierde todo, sin
recuperación posible.

Con usuarias reales eso es soporte y malas reseñas. Conectar `PantallaAcceso` es
el cambio que lo resuelve, y arrastra tres cosas que ya están preparadas y
bloqueadas a ese momento:

- **CAPTCHA** — `supabase/config.toml`, sección `[auth.captcha]`
- **`[auth.sessions]`** — hoy desactivado a propósito: con cuentas anónimas, un
  cierre de sesión programado sería un borrado programado de los datos de todos
- **SMTP propio** — `supabase/CORREO.md`

### Requisitos de las tiendas

Se recogen nombre, correo, fecha de nacimiento y analítica de uso (`eventos`), así
que ambas tiendas van a pedir:

- Política de privacidad publicada en una URL
- *Data safety* (Google Play) y *Privacy Nutrition Labels* (Apple)
- Clasificación por edad — la mínima de 13 años ya está impuesta en la base de
  datos (`perfiles_edad_minima`), no solo en el cliente

---

## Orden sugerido

1. 2FA en la cuenta de Expo
2. Variables de entorno en EAS
3. ~~Migraciones y panel de Supabase (§4)~~ — ✅ hecho el 15/08/2026
4. Decidir el dominio → SMTP → **Confirm email** deja de bloquear
5. Primera build de producción → sale el SHA-256
6. App Links (sección 2) + `urlDeRetorno()`
7. Conectar `PantallaAcceso` + CAPTCHA + `[auth.sessions]`
10. Política de privacidad y formularios de las tiendas
