-- ============================================================================
--  Cuentas anónimas, permisos de perfil y validación de forma
-- ============================================================================
--
--  Cierra los cinco huecos que quedaban tras la segunda auditoría. Ninguno
--  exponía datos de nadie; el primero sí podía dejar la app sin escribir para
--  todo el mundo.
--
--  Aplicar: SQL Editor → pegar → Run. Es idempotente.
--
--  ⚠️ Esto NO cierra el hueco entero de la sección 1. La pieza que falta —
--     CAPTCHA en el alta de sesiones anónimas — vive en el panel de Supabase
--     (Authentication → Attack Protection) y en `auth.ts`, no en SQL. Lo de
--     aquí es el techo que aguanta mientras tanto. Ver `config.toml`.
-- ============================================================================

-- ── 1. Un techo global para `eventos` ───────────────────────────────────────
--
--  El problema: `003-limite-eventos.sql` puso un tope de 200 eventos por hora
--  y persona. Está bien, pero mide el denominador equivocado: las cuentas
--  anónimas son gratis e ilimitadas en conjunto.
--
--  La cuenta que lo explica: la clave publicable se saca del APK en un minuto,
--  y abrir una sesión anónima no pide correo ni contraseña. Supabase limita a
--  30 altas por hora y por IP, pero las cuentas NO caducan: se acumulan. Desde
--  una sola IP, a la hora hay 30 cuentas × 200 eventos = 6.000 eventos; a las
--  doce horas hay 360 cuentas escribiendo 72.000 eventos por hora. Con hasta
--  512 bytes de `detalle` cada uno, eso son ~40 MB/hora creciendo en línea
--  recta: el plan gratuito (500 MB) se llena en menos de un día desde una sola
--  máquina. Y cuando la base se llena, deja de escribir PARA TODO EL MUNDO.
--
--  El tope por persona sigue siendo el control fino y no se toca. Esto es un
--  cortacircuitos: no reparte cuota, solo impide que la tabla crezca más
--  rápido de lo que ninguna app real necesita.
--
--  2.000 por minuto = 120.000/hora ≈ 12.000 personas activas a la vez usando
--  la app de verdad. Está muy por encima del tráfico real y muy por debajo de
--  un llenado deliberado. Si algún día se queda corto, sube TECHO_GLOBAL: es
--  un número, no un rediseño.

-- Contar por ventana de tiempo sin mirar `user_id` no puede apoyarse en
-- `eventos_usuario_idx (user_id, creado_en desc)`, que empieza por la persona.
-- Sin este índice el cortacircuitos haría un recorrido secuencial en CADA
-- inserción, que es peor que el problema que resuelve.
create index if not exists eventos_creado_idx on public.eventos (creado_en desc);

create or replace function public.eventos_limite()
returns trigger
language plpgsql
-- `security definer` para poder contar sin depender de la política de SELECT
-- de quien inserta. Con `search_path` vacío: una función definer con
-- search_path mutable es escalable a superusuario.
security definer
set search_path = ''
as $$
declare
  -- Por persona: el control fino de `003`. Nadie usando la app lo alcanza.
  TOPE_PERSONA constant integer := 200;
  -- Global: el cortacircuitos. Existe porque las cuentas son gratis.
  TECHO_GLOBAL constant integer := 2000;
  recientes integer;
  globales  integer;
begin
  select count(*) into recientes
  from public.eventos
  where user_id = new.user_id
    and creado_en > now() - interval '1 hour';

  if recientes >= TOPE_PERSONA then
    -- `check_violation` (23514) a propósito: `analitica.ts` lo reconoce y tira
    -- la tanda en vez de reintentarla para siempre.
    raise exception 'Demasiados eventos en una hora'
      using errcode = 'check_violation';
  end if;

  select count(*) into globales
  from public.eventos
  where creado_en > now() - interval '1 minute';

  if globales >= TECHO_GLOBAL then
    -- Mismo código: para el cliente honesto es indistinguible del tope
    -- personal, y la reacción correcta es la misma — soltar la tanda y seguir.
    raise exception 'Analitica saturada'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

-- `create or replace` vuelve a conceder EXECUTE a PUBLIC, así que hay que
-- revocar DESPUÉS de redefinir. El orden importa (ver `002-endurecer.sql` §1).
revoke all on function public.eventos_limite() from public;
revoke all on function public.eventos_limite() from anon, authenticated;

drop trigger if exists eventos_limite_trg on public.eventos;
create trigger eventos_limite_trg
  before insert on public.eventos
  for each row execute function public.eventos_limite();

comment on function public.eventos_limite is
  'Tope de 200 eventos/hora por persona y techo global de 2000/minuto. Lanza check_violation (23514).';

-- ── 2. Purga de cuentas anónimas abandonadas ────────────────────────────────
--
--  Cada sesión anónima deja fila en `auth.users` y, por el disparador
--  `crear_perfil`, otra en `perfiles`. Hoy no las borra nadie: el coste de
--  cada cuenta creada es permanente, y eso es la mitad del problema de arriba.
--
--  La condición `not exists (... guardados ...)` es la importante: quien haya
--  guardado algo NO se toca, nunca. Con cuentas anónimas atadas al dispositivo,
--  borrar una cuenta es borrar los datos de una persona — no una limpieza.
--  Se va únicamente lo que se creó, no se usó y lleva semanas sin volver.

create or replace function public.purgar_anonimos(dias integer default 30)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  borradas integer;
begin
  -- Mismo patrón que `condensar_eventos`: el argumento no puede convertir la
  -- función en un borrado masivo. Es definer, así que se salta RLS.
  if dias is null or dias < 7 then
    raise exception 'dias debe ser 7 o más (recibido: %)', dias;
  end if;

  delete from auth.users u
  where u.is_anonymous
    and u.created_at < now() - make_interval(days => dias)
    -- `last_sign_in_at` puede ser null si la sesión nunca se refrescó; ahí
    -- manda `created_at`, que siempre existe.
    and coalesce(u.last_sign_in_at, u.created_at) < now() - make_interval(days => dias)

    -- ── Las tres condiciones de abajo son lo que separa una cuenta de robot
    --    de una persona. Cualquiera de ellas salva la cuenta.
    --
    --    La primera versión de esta función solo miraba `guardados`, y estaba
    --    MAL: se puede completar el onboarding, elegir intereses y usar los
    --    temporizadores sin haber pulsado nunca "guardar". Esa persona existe,
    --    tiene sus datos aquí, y a los 30 días sin abrir la app se la llevaba
    --    por delante. Borrar por inactividad a quien nunca guardó nada es
    --    exactamente el fallo que esta app no se puede permitir: con cuentas
    --    anónimas atadas al dispositivo, la cuenta ES los datos.

    -- 1. Guardó algo.
    and not exists (select 1 from public.guardados g where g.user_id = u.id)
    -- 2. Terminó el onboarding: dio nombre, correo y fecha. Es una persona.
    and not exists (
      select 1 from public.perfiles p
       where p.id = u.id
         and (p.onboarding_completo
              or p.nombre is not null
              or p.correo is not null
              or p.fecha_nacimiento is not null)
    )
    -- 3. Llegó a usar algún ritual. Un robot que solo escribe en `eventos` no
    --    deja rastro aquí; quien abrió una lectura, sí.
    and not exists (
      select 1 from public.estado_rituales e
       where e.user_id = u.id
         and (e.cruz_next is not null
              or e.afirmacion_lock is not null
              or e.oraculo_lock is not null
              or e.codigo_unlock_at is not null
              or e.vibra_semana is not null)
    );

  get diagnostics borradas = row_count;
  return borradas;
end;
$$;

-- Igual que `condensar_eventos`: PUBLIC es quien tiene el EXECUTE de verdad,
-- así que revocarlo solo a `anon`/`authenticated` no quitaría nada. Siendo
-- definer y borrando de `auth.users`, dejarla abierta sería el peor hueco de
-- todo el esquema.
revoke all on function public.purgar_anonimos(integer) from public;
revoke all on function public.purgar_anonimos(integer) from anon, authenticated;
grant execute on function public.purgar_anonimos(integer) to service_role;

comment on function public.purgar_anonimos is
  'Borra cuentas anónimas sin nada guardado e inactivas N días (mínimo 7). Solo service_role.';

-- ── 3. `perfiles` ya no admite DELETE ───────────────────────────────────────
--
--  La política era `for all`, que incluye DELETE — un verbo que la app no usa
--  en ningún sitio (lo único que borra el cliente es `guardados`, en
--  `sync.ts`).
--
--  Por qué importa: borrar la propia fila de `perfiles` no borra la de
--  `auth.users`, y `crear_perfil` solo dispara al CREARSE el usuario, así que
--  no vuelve a nacer. `_layout.tsx` decide si enseñar el onboarding con
--  `perfil && !perfil.onboardingCompleto`: sin fila, esa condición es falsa y
--  la compuerta se salta entera — incluida la comprobación de edad mínima que
--  `002-endurecer.sql` §4 movió al servidor justo para que no se pudiera
--  saltar. Es un rodeo a un requisito de las tiendas.
--
--  Se parte por verbos, como `estado_rituales`, y DELETE simplemente no está.
--  Borrar la cuenta de verdad es cosa de `auth.users`, y de ahí el `on delete
--  cascade` de la clave foránea ya se lleva el perfil por delante.

drop policy if exists "perfil propio" on public.perfiles;

drop policy if exists "perfil propio: leer" on public.perfiles;
create policy "perfil propio: leer" on public.perfiles
  for select to authenticated
  using (auth.uid() = id);

-- El INSERT normal lo hace el disparador `crear_perfil`, que es definer y no
-- pasa por aquí. Esta política es la red por si el disparador no llegó a
-- correr (una cuenta creada antes de que existiera, por ejemplo).
drop policy if exists "perfil propio: insertar" on public.perfiles;
create policy "perfil propio: insertar" on public.perfiles
  for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "perfil propio: actualizar" on public.perfiles;
create policy "perfil propio: actualizar" on public.perfiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Sin política de DELETE a propósito. No es un olvido: es el arreglo.

-- ── 4. El correo se valida donde no se puede saltar ─────────────────────────
--
--  `perfiles_correo_corto` solo miraba la longitud (≤254). La comprobación de
--  forma vivía únicamente en `CORREO_VALIDO`, dentro de `auth.ts` — es decir,
--  en React, que se salta llamando a la API directamente. Mismo agujero que
--  `002` §4 cerró para la edad.
--
--  Hoy el daño es pequeño: es la propia fila y nada lo pinta como HTML. Importa
--  por lo que viene: `perfil.ts` y `schema.sql` dicen los dos que ese correo es
--  el que convertirá la cuenta anónima en una de verdad. Texto libre en esa
--  columna es un problema que se hereda.
--
--  La expresión es deliberadamente laxa, la misma que `CORREO_VALIDO`: validar
--  correos con precisión es un pozo sin fondo, y lo que hace falta aquí es que
--  no entre cualquier cosa, no certificar que la dirección existe.

do $$
begin
  alter table public.perfiles
    add constraint perfiles_correo_con_forma
    check (
      correo is null
      or correo ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    ) not valid;
exception when duplicate_object then null;
end;
$$;

-- ── 5. `datos` y `detalle` tienen que ser objetos ───────────────────────────
--
--  Las dos columnas jsonb tenían tope de TAMAÑO (`pg_column_size`) pero no de
--  FORMA: valían un número suelto, una cadena o un array.
--
--  `sync.ts` hace `{ ...(f.datos as object) }` al bajar, así que una fila con
--  `datos` = `[1,2,3]` se esparce como índices numéricos dentro del estado de
--  la app. Es daño a la propia cuenta, no a terceros — pero es gratis
--  impedirlo, y deja las dos columnas con la misma garantía mínima que el
--  resto del esquema ya da.

do $$
begin
  alter table public.guardados
    add constraint guardados_datos_objeto
    check (jsonb_typeof(datos) = 'object') not valid;
exception when duplicate_object then null;
end;
$$;

do $$
begin
  alter table public.eventos
    add constraint eventos_detalle_objeto
    check (jsonb_typeof(detalle) = 'object') not valid;
exception when duplicate_object then null;
end;
$$;

-- ============================================================================
--  Comprobación
-- ============================================================================
--
--  1. Que las dos funciones quedaron cerradas (debe devolver 0 filas):
--
--     select routine_name, grantee, privilege_type
--       from information_schema.routine_privileges
--      where routine_name in ('eventos_limite', 'purgar_anonimos')
--        and grantee in ('PUBLIC', 'anon', 'authenticated');
--
--  2. Que `perfiles` ya no admite DELETE (deben salir leer/insertar/actualizar
--     y NINGUNA con cmd = 'DELETE'):
--
--     select policyname, cmd from pg_policies
--      where tablename = 'perfiles' order by cmd;
--
--  3. Que las restricciones nuevas existen:
--
--     select conname, convalidated from pg_constraint
--      where conname in ('perfiles_correo_con_forma',
--                        'guardados_datos_objeto',
--                        'eventos_detalle_objeto');
--
--  4. Que el correo malo se rechaza (como usuario autenticado; espera 23514):
--
--     update public.perfiles set correo = 'no-es-un-correo' where id = auth.uid();
--
--  5. Que el DELETE de perfil ya no pasa (espera 0 filas afectadas, no error —
--     RLS filtra, no lanza):
--
--     delete from public.perfiles where id = auth.uid();
--
--  6. Que el índice nuevo está y el cortacircuitos lo usa:
--
--     explain analyze select count(*) from public.eventos
--      where creado_en > now() - interval '1 minute';
--     -- espera: Index Only Scan using eventos_creado_idx
--
--  7. Validar las restricciones para el histórico, con los datos ya limpios.
--     Si alguna falla, dice qué fila la incumple:
--
--     alter table public.perfiles  validate constraint perfiles_correo_con_forma;
--     alter table public.guardados validate constraint guardados_datos_objeto;
--     alter table public.eventos   validate constraint eventos_detalle_objeto;
--
--  8. La purga, EN SECO primero. Esto NO borra: cuenta a cuántas afectaría.
--     Mira el número antes de ejecutar nada. Si no es aproximadamente el de
--     cuentas basura que esperas, NO sigas.
--
--     select count(*) from auth.users u
--      where u.is_anonymous
--        and u.created_at < now() - interval '30 days'
--        and coalesce(u.last_sign_in_at, u.created_at) < now() - interval '30 days'
--        and not exists (select 1 from public.guardados g where g.user_id = u.id)
--        and not exists (
--          select 1 from public.perfiles p where p.id = u.id
--            and (p.onboarding_completo or p.nombre is not null
--                 or p.correo is not null or p.fecha_nacimiento is not null))
--        and not exists (
--          select 1 from public.estado_rituales e where e.user_id = u.id
--            and (e.cruz_next is not null or e.afirmacion_lock is not null
--                 or e.oraculo_lock is not null or e.codigo_unlock_at is not null
--                 or e.vibra_semana is not null));
--
--     Contraste útil — cuántas cuentas anónimas hay en total y cuántas se
--     salvan por cada motivo:
--
--     select count(*) filter (where is_anonymous)                     as anonimas,
--            (select count(*) from public.perfiles
--              where onboarding_completo)                             as con_onboarding,
--            (select count(distinct user_id) from public.guardados)    as con_guardados
--       from auth.users;
--
--     Y solo cuando el número cuadre:  select public.purgar_anonimos(30);
