# Banco de pruebas de seguridad

Comprueba que el esquema hace de verdad lo que dicen sus comentarios: que cada
quien solo ve lo suyo, que lo que el cliente no debe poder tocar no lo toca, y
que las validaciones viven donde no se pueden saltar.

No hace falta Docker ni una base de datos instalada. Levanta un **Postgres real
compilado a WebAssembly** ([PGlite](https://pglite.dev)) dentro de Node, le
monta encima el entorno que Supabase da por hecho (los roles `anon`,
`authenticated`, `service_role`, la tabla `auth.users`, la función `auth.uid()`)
y aplica **los archivos de `supabase/` tal cual están**, sin copias ni versiones
recortadas. Si cambias el esquema, esto prueba el cambio.

## Cómo se ejecuta

```sh
npm i -D @electric-sql/pglite      # ~30 MB, solo la primera vez
node supabase/pruebas/test-seguridad.mjs
```

Sale `0` si todo pasa y `1` si algo falla, así que sirve tal cual en un hook o
en CI.

No está en `package.json` a propósito: es una dependencia grande para una app
que corre en un teléfono, y esto se ejecuta a mano cuando se toca el esquema.
Si algún día se quiere en CI, ahí sí conviene añadirla.

## Qué comprueba

**Escenario A — base nueva.** Aplica `schema.sql`, `analitica.sql` y las
migraciones `002`…`006` de cero, y pasa la batería entera.

**Escenario B — base existente.** Lo mismo, pero antes **reintroduce el estado
anterior a la `006`** (las vistas saltándose RLS, la política de DELETE) y
comprueba que las pruebas *detectan* el fallo. Solo entonces aplica la `006` y
vuelve a pasarlo todo.

Ese control negativo es la mitad importante: una prueba que nunca ha visto el
fallo que dice vigilar no demuestra nada. Si alguien deshace la `006`, estas
pruebas se ponen rojas — y ya se sabe que se ponen rojas, porque se ha visto.

**Escenario C — aplicabilidad e idempotencia.** Que `schema.sql` se puede
aplicar solo (sin `analitica.sql`), y que los siete archivos aguantan
ejecutarse dos veces seguidas, que es lo que sus cabeceras prometen.

### La batería

| Grupo | Qué se comprueba |
|---|---|
| Vistas | Las 6 tienen `security_invoker = on`; `authenticated` no llega a ellas; y aun concediéndole el SELECT por error, solo cuenta sus propias filas. `service_role` sigue viéndolo todo |
| Privilegio por defecto | Una tabla o una vista nueva ya no nace legible por `anon` |
| `estado_rituales` | No hay política de DELETE, no hay privilegio de DELETE, y el intento falla con `42501` dejando los temporizadores intactos |
| Aislamiento | No se lee ni se escribe el perfil de otra persona; sin sesión no se ve ningún perfil ni evento; no se pueden escribir eventos a nombre de otra |
| `cruz_extras` | No se puede sembrar al insertar ni subir al actualizar |
| Analítica | Se puede escribir, pero no reescribir ni borrar; el tope de 200/hora corta el bucle |
| Validación | Edad mínima de 13, formato del correo, intereses acotados, tamaño y forma de los `jsonb`, tipos de evento |
| Funciones | Ninguna `security definer` es invocable desde una sesión |
| Regresiones | El contenido se sigue leyendo sin sesión, el upsert de `sync.ts` funciona, y `guardados` se sigue pudiendo borrar |

## Lo que NO cubre

Todo lo que no vive en SQL:

- Los ajustes de `[auth]` (longitud mínima de contraseña, registro por correo,
  límites por IP). Viven en el panel de Supabase, no en la base. Se cotejan a
  mano con la lista de `PUBLICACION.md` §4.1.
- El hook `before-user-created`. La función se prueba aquí; que esté **activada**
  solo se ve en el panel (`PUBLICACION.md` §4.2).
- El flujo de PKCE y el manejo del enlace de recuperación, que son del cliente.

Dicho de otro modo: esto cubre lo que un atacante puede hacer con la clave
publicable y una sesión abierta. Es la mayor parte de la superficie, pero no
toda.
