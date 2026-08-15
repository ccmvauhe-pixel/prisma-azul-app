-- ============================================================================
--  Endurecimiento tras la auditoría de seguridad
-- ============================================================================
--
--  Cierra los huecos encontrados al revisar el esquema. Ninguno exponía datos
--  de nadie: los cuatro son controles que estaban escritos pero no llegaban a
--  aplicarse, cada uno por una regla de PostgreSQL que no se ve a simple vista.
--
--  Aplicar: SQL Editor → pegar → Run. Es idempotente.
--
--  ⚠️ Después de esto, NO volver a ejecutar `001-cruz-semanal.sql`: su política
--     de UPDATE es la que este archivo sustituye. `schema.sql` ya viene
--     corregido y sí se puede reejecutar cuando haga falta.
-- ============================================================================

-- ── 1. `condensar_eventos` estaba al alcance de cualquiera ──────────────────
--
--  El problema: al crear una función, PostgreSQL le concede EXECUTE a `PUBLIC`.
--  `anon` y `authenticated` no tenían permiso propio — lo heredaban de ahí — así
--  que el `revoke ... from anon, authenticated` original no quitaba nada.
--
--  Y como Supabase publica toda función del esquema `public` como endpoint RPC,
--  cualquiera con la clave pública podía llamarla. Al ser `security definer`, se
--  salta RLS: una sola petición borraba la tabla `eventos` entera.

revoke all on function public.condensar_eventos(integer) from public;
revoke all on function public.condensar_eventos(integer) from anon, authenticated;
grant execute on function public.condensar_eventos(integer) to service_role;

-- Que nada creado a partir de ahora nazca abierto por defecto.
alter default privileges in schema public revoke execute on functions from public;

-- Segunda barrera: aunque alguien recupere el permiso, el argumento ya no puede
-- convertir la función en un borrado total. `0` o un negativo ponían el corte en
-- hoy o más adelante, y se llevaban por delante hasta los eventos del día.
create or replace function public.condensar_eventos(dias_a_conservar integer default 90)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  corte date;
  borradas integer;
begin
  if dias_a_conservar is null or dias_a_conservar < 30 then
    raise exception 'dias_a_conservar debe ser 30 o más (recibido: %)', dias_a_conservar;
  end if;

  corte := (now() - make_interval(days => dias_a_conservar))::date;

  insert into public.eventos_diarios (dia, tipo, seccion, eventos, personas)
  select creado_en::date, tipo, seccion, count(*), count(distinct user_id)
  from public.eventos
  where creado_en::date < corte
  group by 1, 2, 3
  on conflict (dia, tipo, seccion) do update
    set eventos = excluded.eventos, personas = excluded.personas;

  delete from public.eventos where creado_en::date < corte;
  get diagnostics borradas = row_count;
  return borradas;
end;
$$;

comment on function public.condensar_eventos is
  'Resume los eventos antiguos en recuentos diarios y borra el detalle. Solo service_role; mínimo 30 días.';

-- Reejecutar `create or replace` reabre el permiso de PUBLIC, así que se vuelve
-- a cerrar después de redefinirla. El orden importa.
revoke all on function public.condensar_eventos(integer) from public;
revoke all on function public.condensar_eventos(integer) from anon, authenticated;
grant execute on function public.condensar_eventos(integer) to service_role;

-- ── 2. La protección de `cruz_extras` no llegaba a aplicarse ────────────────
--
--  `001` añadió una política de UPDATE que fija `cruz_extras` a su valor
--  guardado. Pero la política `"estado propio"` de `schema.sql` es `for all`, y
--  también cubre UPDATE.
--
--  Las políticas permisivas se combinan con OR: a una escritura le basta con
--  cumplir UNA. La de `for all` pasaba siempre, así que la restricción de
--  `cruz_extras` no se comprobaba nunca.
--
--  La solución es que ninguna política siga cubriendo UPDATE "por lo ancho":
--  se parte la de `for all` en verbos separados.

drop policy if exists "estado propio" on public.estado_rituales;

drop policy if exists "estado propio: leer" on public.estado_rituales;
create policy "estado propio: leer" on public.estado_rituales
  for select to authenticated
  using (auth.uid() = user_id);

-- En el INSERT no hay fila previa contra la que comparar, así que las extras
-- solo pueden nacer a cero. `sync.ts` hace upsert: sin esto, la primera
-- escritura de una cuenta nueva podía sembrar el número que quisiera.
drop policy if exists "estado propio: insertar" on public.estado_rituales;
create policy "estado propio: insertar" on public.estado_rituales
  for insert to authenticated
  with check (auth.uid() = user_id and cruz_extras = 0);

-- La política de DELETE que había aquí la quitó `006-vistas-y-borrado.sql` §2:
-- la app nunca borra de esta tabla, y poder borrarla dejaba resetear todos los
-- temporizadores. Se deja el `drop` —no el `create`— para que reejecutar este
-- archivo no reabra el agujero.
drop policy if exists "estado propio: borrar" on public.estado_rituales;

drop policy if exists "estado propio: actualizar" on public.estado_rituales;
create policy "estado propio: actualizar" on public.estado_rituales
  for update to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and cruz_extras = (
      select e.cruz_extras from public.estado_rituales e where e.user_id = auth.uid()
    )
  );

-- ── 3. `search_path` fijo en el disparador ──────────────────────────────────
--
--  No es `security definer`, así que el riesgo es bajo, pero es la advertencia
--  `function_search_path_mutable` del linter de Supabase y `crear_perfil` ya lo
--  hacía bien. Que las dos sigan el mismo patrón evita copiar el flojo.

create or replace function public.tocar_actualizado_en()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

-- ── 4. La edad mínima se comprueba donde no se puede saltar ─────────────────
--
--  `EDAD_MINIMA = 13` vivía solo en el componente de React. Con la clave
--  pública se podía escribir cualquier fecha, o marcar el onboarding como
--  terminado sin dar ninguna — y 13 es el umbral que exigen las tiendas.
--
--  `not valid` afecta solo a las filas que ya existen: las nuevas escrituras sí
--  se comprueban desde ya. Es para que la migración no falle si alguien entró
--  con una fecha imposible mientras el control estaba únicamente en el cliente.

do $$
begin
  alter table public.perfiles
    add constraint perfiles_edad_minima
    check (
      fecha_nacimiento is null
      or fecha_nacimiento <= (current_date - interval '13 years')
    ) not valid;
exception when duplicate_object then null;
end;
$$;

do $$
begin
  alter table public.perfiles
    add constraint perfiles_onboarding_con_fecha
    check (not onboarding_completo or fecha_nacimiento is not null) not valid;
exception when duplicate_object then null;
end;
$$;

-- ── 5. Límites a lo que el cliente puede escribir ───────────────────────────
--
--  RLS ya garantiza que cada quien solo toca lo suyo, y eso no cambia. Lo que
--  faltaba era un tope a *cuánto* y de *qué forma*: `detalle` y `datos` eran
--  jsonb libre, y `tipo`/`seccion` texto sin restringir.
--
--  Importa por dos motivos: el almacenamiento del plan gratuito, y que las
--  vistas de analítica se pueden envenenar con secciones inventadas — que es
--  justo lo contrario de para lo que existen.

do $$
begin
  alter table public.eventos
    add constraint eventos_tipo_valido
    check (tipo in ('seccion_abierta', 'ritual_completado', 'guardado', 'contenido')) not valid;
exception when duplicate_object then null;
end;
$$;

do $$
begin
  alter table public.eventos
    add constraint eventos_seccion_valida
    check (
      seccion is null
      or seccion in ('cruz', 'oraculo', 'codigos', 'afirmaciones', 'baraja', 'perfil', 'inicio')
    ) not valid;
exception when duplicate_object then null;
end;
$$;

-- Regla 2 de `analitica.ts`: aquí no van textos de lecturas. Si `detalle` crece,
-- es que se coló contenido que no debería estar.
do $$
begin
  alter table public.eventos
    add constraint eventos_detalle_pequeno
    check (pg_column_size(detalle) < 512) not valid;
exception when duplicate_object then null;
end;
$$;

do $$
begin
  alter table public.perfiles
    add constraint perfiles_nombre_corto
    check (nombre is null or length(nombre) <= 80) not valid;
exception when duplicate_object then null;
end;
$$;

do $$
begin
  alter table public.perfiles
    add constraint perfiles_correo_corto
    check (correo is null or length(correo) <= 254) not valid;
exception when duplicate_object then null;
end;
$$;

do $$
begin
  alter table public.perfiles
    add constraint perfiles_intereses_acotados
    check (intereses <@ array['amor', 'trabajo', 'dinero', 'salud', 'limpieza']::text[]) not valid;
exception when duplicate_object then null;
end;
$$;

do $$
begin
  alter table public.guardados
    add constraint guardados_datos_acotados
    check (pg_column_size(datos) < 8192) not valid;
exception when duplicate_object then null;
end;
$$;

-- ============================================================================
--  Comprobación
-- ============================================================================
--
--  Con los datos ya limpios, se pueden validar las restricciones para el
--  histórico. Si alguna falla, dice qué fila la incumple:
--
--    alter table public.perfiles validate constraint perfiles_edad_minima;
--    alter table public.eventos  validate constraint eventos_tipo_valido;
--
--  Y para confirmar que la función quedó cerrada (debe devolver 0 filas):
--
--    select grantee, privilege_type
--      from information_schema.routine_privileges
--     where routine_name = 'condensar_eventos'
--       and grantee in ('PUBLIC', 'anon', 'authenticated');
