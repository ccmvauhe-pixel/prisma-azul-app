-- ============================================================================
--  Tope global de altas de cuenta
-- ============================================================================
--
--  Cierra la raíz del hallazgo grave: hasta ahora, crear cuentas era gratis e
--  ilimitado en conjunto. `004` puso un techo a lo que se puede ESCRIBIR; esto
--  pone un techo a cuántas CUENTAS pueden nacer, que es de donde venía todo.
--
--  Por qué esto y no CAPTCHA: el CAPTCHA sigue siendo la mejor defensa y sigue
--  pendiente (`config.toml`, sección `[auth.captcha]`), pero necesita cuenta de
--  Cloudflare o hCaptcha, un secreto y un widget en la app — un cambio que no
--  se puede dejar hecho desde el repositorio. Esto sí, y no depende de nadie
--  de fuera.
--
--  Usa el hook `before-user-created` de Supabase Auth: una función que se
--  ejecuta ANTES de crear cada usuario y puede rechazarlo.
--
--  ⚠️ ORDEN OBLIGATORIO. Este archivo primero, el interruptor después:
--
--     1. Aplicar este SQL (SQL Editor → pegar → Run).
--     2. Comprobar que la función existe (consultas del final).
--     3. Y SOLO ENTONCES activar el hook, en el panel
--        (Authentication → Hooks → Before User Created → elegir
--        `public.limitar_altas`) o descomentando el bloque de `config.toml`.
--
--     Al revés —activar el hook antes de que exista la función— Supabase
--     rechaza TODA alta de usuario. Como el acceso de la app es una sesión
--     anónima que se abre sola al arrancar, eso significa que nadie que instale
--     la app puede entrar. Es un apagón autoinfligido y de los caros.
--
--  Aplicar: SQL Editor → pegar → Run. Es idempotente.
-- ============================================================================

-- ── 1. La función del hook ──────────────────────────────────────────────────
--
--  Recibe el evento del alta en jsonb y devuelve jsonb. Devolver el evento tal
--  cual = adelante. Devolver un objeto con `error` = rechazo, y Supabase se lo
--  traslada al cliente con el código HTTP que se le diga.
--
--  TECHO: altas anónimas por hora, EN TOTAL (no por IP: el límite por IP ya lo
--  pone Supabase con `anonymous_users = 30`, y repartirse entre IPs es
--  precisamente lo barato).
--
--  300/hora es deliberadamente holgado: son 7.200 al día, muy por encima de
--  cualquier crecimiento real de esta app, y muy por debajo del ritmo que hace
--  falta para llenar la base. Si algún día se queda corto, sube el número — es
--  una constante, no un rediseño.

create or replace function public.limitar_altas(event jsonb)
returns jsonb
language plpgsql
-- `security definer` porque `supabase_auth_admin` no tiene por qué poder leer
-- `auth.users` a través de esta ruta. `search_path` vacío: una función definer
-- con search_path mutable es escalable a superusuario.
security definer
set search_path = ''
as $$
declare
  TECHO_POR_HORA constant integer := 300;
  recientes integer;
  es_anonima boolean;
begin
  /*
   * Solo se cuentan y se frenan las altas ANÓNIMAS.
   *
   * Un alta con correo cuesta un correo de confirmación y ya está limitada por
   * `email_sent = 2` por hora; meterla en el mismo cubo haría que un ataque de
   * cuentas anónimas dejara fuera a quien intenta registrarse de verdad.
   */
  es_anonima := coalesce((event -> 'user' ->> 'is_anonymous')::boolean, false);

  if not es_anonima then
    return event;
  end if;

  select count(*) into recientes
  from auth.users u
  where u.is_anonymous
    and u.created_at > now() - interval '1 hour';

  if recientes >= TECHO_POR_HORA then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 429,
        'message',  'Demasiadas cuentas nuevas ahora mismo. Inténtalo en un rato.'
      )
    );
  end if;

  return event;
exception
  /*
   * FALLA HACIA ABIERTO, a propósito, y conviene entender por qué.
   *
   * Si esta función revienta —una columna que cambia de nombre en una versión
   * futura de GoTrue, lo que sea— y el fallo se propagara, Supabase rechazaría
   * TODA alta y nadie podría instalar la app. El daño de eso es inmediato,
   * total y silencioso.
   *
   * El daño de dejar pasar altas mientras la función está rota es que vuelve
   * el problema que ya teníamos, con `004` (techo global de eventos + purga)
   * todavía puesto debajo aguantando. Es peor, pero no es un apagón.
   *
   * Entre "nadie puede entrar" y "hay que vigilar el crecimiento unos días",
   * se elige lo segundo. Pero conviene enterarse: ver la consulta 4 del final.
   */
  when others then
    raise warning 'limitar_altas fallo, se deja pasar el alta: %', sqlerrm;
    return event;
end;
$$;

comment on function public.limitar_altas is
  'Hook before-user-created: techo de 300 altas anónimas/hora en total. Falla hacia abierto.';

-- ── 2. Permisos ─────────────────────────────────────────────────────────────
--
--  Quien la llama es `supabase_auth_admin`, el rol interno de Auth, y nadie
--  más. Igual que en `002-endurecer.sql` §1: el EXECUTE de verdad lo tiene
--  `PUBLIC`, así que revocar solo a `anon`/`authenticated` no quitaría nada.
--
--  Que sea invocable desde fuera no permitiría crear cuentas, pero sí sondear
--  cuántas se están creando —y, siendo definer, hacerlo leyendo `auth.users`.
--  No hay motivo para dejarla abierta.

revoke all on function public.limitar_altas(jsonb) from public;
revoke all on function public.limitar_altas(jsonb) from anon, authenticated;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.limitar_altas(jsonb) to supabase_auth_admin;

-- ── 3. Índice para que contar sea barato ────────────────────────────────────
--
--  La cuenta corre en CADA alta. Sin índice es un recorrido de `auth.users`
--  entero, que es justo la tabla que este archivo existe para mantener
--  pequeña.
--
--  Parcial (`where is_anonymous`) porque solo se consultan esas filas: ocupa
--  menos y se mantiene solo.
--
--  Va envuelto porque `auth.users` es de `supabase_auth_admin`, y no todos los
--  roles que aplican este archivo la poseen: el del CLI no. Sin envolver, el
--  error tumba la transacción entera y se pierde la función, que es lo que de
--  verdad importa. El índice es rendimiento; el tope es la seguridad.
--
--  Si sale el aviso, créalo desde el SQL Editor del panel, que corre con más
--  privilegios. Mientras no exista, el tope FUNCIONA igual: solo cuesta un
--  recorrido de `auth.users` en cada alta.
do $$
begin
  execute 'create index if not exists usuarios_anonimos_creado_idx'
       || ' on auth.users (created_at desc) where is_anonymous';
exception when insufficient_privilege then
  raise notice 'Sin permiso para indexar auth.users; créalo desde el panel.';
end;
$$;

-- ============================================================================
--  Comprobación
-- ============================================================================
--
--  1. Que la función existe y es definer con search_path fijo:
--
--     select p.proname, p.prosecdef, p.proconfig
--       from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--      where n.nspname = 'public' and p.proname = 'limitar_altas';
--     -- espera: prosecdef = true, proconfig = {search_path=""}
--
--  2. Que solo `supabase_auth_admin` puede ejecutarla (0 filas):
--
--     select grantee, privilege_type
--       from information_schema.routine_privileges
--      where routine_name = 'limitar_altas'
--        and grantee in ('PUBLIC', 'anon', 'authenticated');
--
--  3. Que deja pasar un alta normal (espera el evento devuelto tal cual):
--
--     select public.limitar_altas(
--       '{"user":{"is_anonymous":true,"email":null}}'::jsonb);
--
--     Y que un alta con correo ni se cuenta:
--
--     select public.limitar_altas(
--       '{"user":{"is_anonymous":false,"email":"a@b.com"}}'::jsonb);
--
--  4. Que NO está fallando en silencio. Si la función se rompiera, deja pasar
--     todo y avisa por el log. Revisar de vez en cuando:
--     Panel → Logs → Postgres Logs → buscar "limitar_altas fallo".
--
--  5. El ritmo real de altas, para saber si 300/hora va sobrado o corto:
--
--     select date_trunc('hour', created_at) as hora, count(*) as altas
--       from auth.users where is_anonymous
--        and created_at > now() - interval '7 days'
--      group by 1 order by 1 desc limit 24;
--
--  6. Y DESPUÉS de activar el hook en el panel, lo único que importa de verdad:
--     desinstala la app, vuelve a instalarla y comprueba que entra. Si el hook
--     estuviera mal configurado, ese es el caso que se rompe.
