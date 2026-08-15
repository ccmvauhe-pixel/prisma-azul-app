-- ============================================================================
--  Tope de escritura en `eventos`
-- ============================================================================
--
--  El hueco que cierra: hasta ahora, lo único que limitaba cuántos eventos se
--  escriben vivía en el cliente — `MAX_COLA = 40` y el retardo de 4 s en
--  `analitica.ts`. Eso ordena a la app honesta y no hace nada contra quien no
--  la ejecuta.
--
--  La clave publicable viaja dentro del APK y se saca en un minuto; abrir una
--  sesión anónima no pide correo ni contraseña. Con eso, un `POST` en bucle a
--  `/rest/v1/eventos` pasa RLS sin problema — las filas son suyas, con su
--  `auth.uid()` — y mete millones de filas en una tarde. En el plan gratuito
--  eso agota los 500 MB, y cuando la base se llena deja de escribir para todo
--  el mundo. De paso envenena las vistas de `analitica.sql`, que existen justo
--  para lo contrario.
--
--  `schema.sql` ya limita el TAMAÑO de cada fila (`pg_column_size(detalle) <
--  512`). Lo que faltaba era limitar CUÁNTAS.
--
--  Aplicar: SQL Editor → pegar → Run. Es idempotente.
-- ============================================================================

-- ── 1. El tope, donde el cliente no llega ───────────────────────────────────
--
--  200 por hora y persona. Una sesión real manda decenas al día: abrir cuatro
--  secciones, completar un par de rituales, guardar algo. 200 no lo alcanza
--  nadie usando la app, y corta el bucle en seco.
--
--  Va como trigger y no como restricción CHECK porque una CHECK no puede
--  consultar otras filas de la tabla.

create or replace function public.eventos_limite()
returns trigger
language plpgsql
-- `security definer` para poder contar las filas de la persona sin depender de
-- que su propia política de SELECT exista. Con `search_path` vacío, como
-- `tocar_actualizado_en` y `condensar_eventos`: es la advertencia
-- `function_search_path_mutable` del linter, y aquí además es obligatorio
-- porque una función definer con search_path mutable es escalable a superusuario.
security definer
set search_path = ''
as $$
declare
  recientes integer;
begin
  select count(*) into recientes
  from public.eventos
  where user_id = new.user_id
    and creado_en > now() - interval '1 hour';

  if recientes >= 200 then
    -- `check_violation` (23514) a propósito: `analitica.ts` lo reconoce y tira
    -- la tanda en vez de reintentarla para siempre.
    raise exception 'Demasiados eventos en una hora'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

-- Sobre el EXECUTE a `PUBLIC` que documenta `002-endurecer.sql` §1: aquí NO es
-- explotable como allí. `condensar_eventos` devuelve `integer`, y por eso
-- Supabase la publicaba como endpoint RPC; una función que devuelve `trigger`
-- no se publica, y llamarla a mano falla con "trigger functions can only be
-- called as triggers". Es la misma razón por la que 002 no tocó `crear_perfil`
-- ni `tocar_actualizado_en`, que también son definer.
--
-- Se revoca igualmente. Cuesta dos líneas, no depende de que ese detalle siga
-- siendo cierto en la próxima versión de PostgREST, y deja las cuatro funciones
-- del esquema con la misma postura en vez de una excepción que alguien tenga
-- que volver a razonar dentro de un año.
revoke all on function public.eventos_limite() from public;
revoke all on function public.eventos_limite() from anon, authenticated;

drop trigger if exists eventos_limite_trg on public.eventos;
create trigger eventos_limite_trg
  before insert on public.eventos
  for each row execute function public.eventos_limite();

comment on function public.eventos_limite is
  'Tope de 200 eventos por hora y persona. Lanza check_violation (23514) al pasarse.';

-- ── 2. Índice para que contar sea barato ────────────────────────────────────
--
--  El trigger cuenta en cada INSERT. `eventos_usuario_idx (user_id, creado_en
--  desc)` de `schema.sql` ya sirve para esta consulta, así que no hace falta
--  uno nuevo — se deja anotado para que nadie lo borre pensando que solo lo
--  usaba la analítica.

-- ============================================================================
--  Comprobación
-- ============================================================================
--
--  Que la función quedó cerrada (debe devolver 0 filas):
--
--    select grantee, privilege_type
--      from information_schema.routine_privileges
--     where routine_name = 'eventos_limite'
--       and grantee in ('PUBLIC', 'anon', 'authenticated');
--
--  Que el trigger existe:
--
--    select tgname from pg_trigger where tgname = 'eventos_limite_trg';
--
--  Que el tope muerde (como usuario autenticado, no como service_role, que se
--  salta RLS pero NO los triggers — este cuenta igual para todos):
--
--    insert into public.eventos (user_id, tipo, seccion)
--    select auth.uid(), 'seccion_abierta', 'inicio'
--    from generate_series(1, 250);
--    -- espera: ERROR ... Demasiados eventos en una hora
