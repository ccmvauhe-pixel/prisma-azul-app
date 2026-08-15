-- ============================================================================
--  Vistas que respetan RLS, y `estado_rituales` sin DELETE
-- ============================================================================
--
--  Cierra los dos hallazgos de la tercera auditoría. Ninguno expone datos hoy:
--  el primero está tapado por un `revoke` que sí funciona, y el segundo solo
--  permite hacerse trampas a uno mismo. Los dos son huecos que se abren solos
--  con el tiempo si no se cierran ahora.
--
--  Aplicar: SQL Editor → pegar → Run. Es idempotente.
--
--  ⚠️ LEE LA SECCIÓN 3 ANTES DE EJECUTAR. Cambia el comportamiento por defecto
--     de las tablas que se creen A PARTIR DE AHORA, incluidas las que se hagan
--     desde el editor de tablas del panel.
-- ============================================================================

-- ── 1. Las vistas se ejecutan como quien pregunta, no como quien las creó ────
--
--  El problema: una vista en Postgres corre con los permisos de su dueño
--  (`postgres`), así que se salta RLS. `v_demografia` lee la fecha de
--  nacimiento de TODO el mundo; `v_resumen` y `v_actividad_diaria`, la tabla
--  `eventos` entera.
--
--  Hoy eso no se puede leer desde fuera porque `analitica.sql` revoca el acceso
--  a `anon` y `authenticated` al final del archivo. Y funciona. Pero la
--  seguridad depende de acordarse de ese `revoke`:
--
--    - una vista nueva que alguien añada sin repetirlo nace abierta;
--    - un `drop view` + `create` que no llegue al bloque de permisos del final
--      la reabre;
--    - y el fallo es silencioso. Nada se rompe, nada avisa.
--
--  `security_invoker = on` invierte eso: la vista pasa a ejecutarse con los
--  permisos de quien la consulta, así que RLS de las tablas de debajo SÍ se
--  aplica. Con eso, aunque alguien conceda el SELECT por error, `anon` ve cero
--  filas en vez de las de todos.
--
--  `service_role` no se entera: se salta RLS por su propia condición, así que
--  las consultas del panel siguen devolviendo lo mismo que hoy.
--
--  Se usa `alter view` y no `create or replace` para no duplicar aquí el cuerpo
--  de las seis vistas: lo que cambia es cómo se ejecutan, no qué devuelven.

do $$
declare v text;
begin
  foreach v in array array[
    'v_embudo_secciones', 'v_interes_vs_uso', 'v_demografia',
    'v_actividad_diaria', 'v_contenido_popular', 'v_resumen'
  ]
  loop
    -- `if exists` para poder aplicar este archivo en una base donde todavía no
    -- se haya corrido `analitica.sql`.
    if to_regclass('public.' || v) is not null then
      execute format('alter view public.%I set (security_invoker = on)', v);
      -- El revoke sigue siendo la primera barrera; esto es la segunda.
      execute format('revoke all on public.%I from anon, authenticated', v);
    end if;
  end loop;
end;
$$;

-- ── 2. `estado_rituales` ya no admite DELETE ────────────────────────────────
--
--  Mismo caso que `perfiles` en `004` §3: un verbo que la app no usa en ningún
--  sitio. `sync.ts` solo borra de `guardados` (línea 291); esta tabla nunca.
--
--  Por qué importa, y no se ve a simple vista: toda la sincronización se apoya
--  en la regla de fusión de `sync.ts` — "gana lo más restrictivo, no lo más
--  reciente". Esa regla existe para que reinstalar la app no regale lecturas:
--  se toma siempre el bloqueo mayor y el contador más alto, así que un estado
--  local en blanco no puede pisar los temporizadores del servidor.
--
--  La regla da por hecho que la fila remota es un suelo que no se mueve. Con
--  DELETE, el suelo se quita:
--
--    DELETE /rest/v1/estado_rituales?user_id=eq.<uno mismo>
--    → borrar datos de la app → abrir
--    → `bajar()` no encuentra fila, lo local está en blanco, y `cruz_next`,
--      `afirmacion_lock`, `oraculo_lock`, `codigo_unlock_at` y
--      `cruz_semana_usadas` vuelven todos a cero. Repetible sin límite.
--
--  Es exactamente el caso que la regla de fusión existe para impedir, entrando
--  por otra puerta.
--
--  Borrar la cuenta de verdad sigue siendo cosa de `auth.users`: el `on delete
--  cascade` de la clave foránea ya se lleva esta fila por delante.

drop policy if exists "estado propio: borrar" on public.estado_rituales;

-- Sin política de DELETE, a propósito. No es un olvido: es el arreglo.

-- ── 3. Que nada nazca abierto ───────────────────────────────────────────────
--
--  `002` §1 hizo esto mismo para las funciones:
--
--    alter default privileges in schema public revoke execute on functions from public;
--
--  Faltaba el equivalente para tablas y vistas. Supabase configura privilegios
--  por defecto que conceden SELECT sobre todo objeto nuevo del esquema `public`
--  a `anon` y `authenticated`. Para las TABLAS da igual —todas tienen RLS y sin
--  política no se ve nada—, pero una VISTA no tiene RLS: hasta la sección 1 de
--  este archivo, una vista nueva era legible por cualquiera con la clave
--  pública, con los datos de todo el mundo dentro.
--
--  ⚠️ EFECTO SECUNDARIO, y hay que saberlo: a partir de aquí, una tabla creada
--     desde el editor del panel NO será legible por la app hasta que se le
--     conceda el permiso a mano. Es lo que queremos —cerrado por defecto, se
--     abre a propósito— pero sorprende si no se espera. El `grant` explícito
--     que hace falta está en `schema.sql` §6, con la lista de las que hay hoy.
--
--  Sobre las tablas que YA existen: esto no las toca. `alter default
--  privileges` solo afecta a lo que se cree después, así que aplicar este
--  archivo no puede dejar la app sin leer nada.

alter default privileges in schema public
  revoke all on tables from anon, authenticated;

-- ── 4. Los permisos de hoy, explícitos ──────────────────────────────────────
--
--  Con la sección 3 puesta, depender del privilegio por defecto para las tablas
--  que ya existen sería frágil: en una base nueva (o si alguien recrea una
--  tabla) el permiso ya no vendría solo, la política de RLS seguiría ahí, y la
--  app se quedaría sin contenido sin dar ningún error — `contenido.ts` se cae
--  con elegancia a lo empaquetado, así que ni se notaría.
--
--  Así que se conceden a mano. Es la misma lista que ya describen las políticas
--  de `schema.sql` §4, solo que dicha en voz alta.
--
--  Recordatorio de cómo encaja: en PostgREST hacen falta LAS DOS cosas, el
--  GRANT y la política. El GRANT dice "puedes tocar esta tabla"; RLS dice "y
--  solo estas filas". Sin GRANT, la política no llega ni a evaluarse.

grant usage on schema public to anon, authenticated;

-- Primero se quita todo, y luego se da lo justo.
--
-- El `revoke` no es de adorno y es la mitad que faltaba: en Supabase las tablas
-- NACEN con todos los privilegios concedidos a `anon` y `authenticated`, así
-- que `estado_rituales` tenía el DELETE dado desde el primer día. La sección 2
-- quita la política, pero el privilegio seguía ahí.
--
-- Con el privilegio puesto y sin política, un DELETE no falla: RLS lo filtra y
-- devuelve "0 filas afectadas". El dato está a salvo, pero el cliente no se
-- entera de que no puede, y la única defensa es la política. Quitando además el
-- privilegio, el intento se corta antes y con un error claro (42501): dos
-- barreras en vez de una, y un `\dp` que se puede leer y auditar de un vistazo.
revoke all on
  public.palos, public.cartas,
  public.codigo_categorias, public.codigos,
  public.afirmacion_categorias, public.afirmaciones,
  public.oraculos, public.oraculo_cartas,
  public.cruz_posiciones, public.cruz_categorias, public.cruz_preguntas,
  public.vibra_dias, public.contenido_version,
  public.perfiles, public.estado_rituales, public.guardados, public.eventos
from anon, authenticated;

-- Contenido: lo lee todo el mundo, no lo escribe nadie desde la app.
grant select on
  public.palos, public.cartas,
  public.codigo_categorias, public.codigos,
  public.afirmacion_categorias, public.afirmaciones,
  public.oraculos, public.oraculo_cartas,
  public.cruz_posiciones, public.cruz_categorias, public.cruz_preguntas,
  public.vibra_dias, public.contenido_version
to anon, authenticated;

-- Datos de usuario: solo con sesión, y RLS acota a las filas propias.
-- Los verbos son exactamente los que tiene cada tabla en `schema.sql` §4.
grant select, insert, update on public.perfiles         to authenticated;
grant select, insert, update on public.estado_rituales  to authenticated;  -- sin delete (§2)
grant select, insert, update, delete on public.guardados to authenticated; -- `sync.ts` sí borra aquí
grant select, insert on public.eventos                   to authenticated;  -- no se modifica ni se borra

-- `eventos_diarios` y las seis vistas se quedan fuera a propósito: son del
-- panel, que usa `service_role` y no pasa por estos permisos.
--
-- Con `if exists` porque `eventos_diarios` nace en `analitica.sql`, que es otro
-- archivo: este debe poder aplicarse aunque aquel no se haya corrido.
do $$
begin
  if to_regclass('public.eventos_diarios') is not null then
    revoke all on public.eventos_diarios from anon, authenticated;
  end if;
end;
$$;

-- ============================================================================
--  Comprobación
-- ============================================================================
--
--  1. Que las seis vistas quedaron en modo invocador (espera 6 filas, todas
--     con `security_invoker=on` dentro de `reloptions`):
--
--     select c.relname, c.reloptions
--       from pg_class c join pg_namespace n on n.oid = c.relnamespace
--      where n.nspname = 'public' and c.relkind = 'v'
--      order by 1;
--
--  2. Que `estado_rituales` ya no admite DELETE (deben salir leer/insertar/
--     actualizar y NINGUNA con cmd = 'DELETE'):
--
--     select policyname, cmd from pg_policies
--      where tablename = 'estado_rituales' order by cmd;
--
--  3. Que el privilegio por defecto quedó cerrado (no debe aparecer `anon` ni
--     `authenticated` con SELECT sobre tablas):
--
--     select defaclrole::regrole, defaclobjtype, defaclacl
--       from pg_default_acl d join pg_namespace n on n.oid = d.defaclnamespace
--      where n.nspname = 'public';
--
--  4. Que los permisos explícitos están puestos (espera `t` en las cuatro):
--
--     select has_table_privilege('anon',          'public.cartas',          'select') as contenido_anon,
--            has_table_privilege('authenticated', 'public.guardados',       'delete') as guardados_delete,
--            has_table_privilege('authenticated', 'public.estado_rituales', 'update') as estado_update,
--            not has_table_privilege('authenticated', 'public.estado_rituales', 'delete') as estado_sin_delete;
--
--  5. Que una vista nueva ya NO nace abierta. Crea una de prueba y comprueba:
--
--     create view public.v_prueba_permisos as select 1 as x;
--     select has_table_privilege('anon', 'public.v_prueba_permisos', 'select');
--     -- espera: f
--     drop view public.v_prueba_permisos;
--
--  6. Y lo único que importa de verdad: abre la app y comprueba que el
--     contenido carga, que se puede guardar una lectura y que los
--     temporizadores siguen donde estaban.
