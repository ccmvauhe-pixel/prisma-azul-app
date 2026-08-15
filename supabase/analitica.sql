-- ============================================================================
--  Prisma Azul — vistas de analítica
-- ============================================================================
--
--  Convierten la tabla `eventos` (cruda, una fila por acción) en preguntas ya
--  respondidas. Se consultan desde el SQL Editor del panel.
--
--  SEGURIDAD — esto importa, y son DOS barreras, no una:
--
--   1. `security_invoker = on` en cada vista. Por defecto una vista se ejecuta
--      con los permisos de quien la creó, no de quien la consulta: se salta RLS
--      y devuelve los datos de todo el mundo. Con esto pasa a ejecutarse como
--      quien pregunta, así que RLS de las tablas de debajo sí se aplica y
--      `anon` vería cero filas aunque llegara a tener el SELECT.
--   2. El `revoke` del final: `anon` y `authenticated` no tienen ni acceso.
--
--  La 2 es la que corta hoy; la 1 es la que sigue cortando el día que alguien
--  añada una vista y se olvide de la 2. Ver `006-vistas-y-borrado.sql`.
--
--  `service_role` no se ve afectado: se salta RLS por su propia condición, así
--  que el panel sigue viendo lo mismo de siempre.
--
--  Aplicar: SQL Editor → pegar → Run. Es idempotente.
-- ============================================================================

-- ── 1. Embudo por sección ───────────────────────────────────────────────────
-- La pregunta de fondo: ¿cuánta gente entra, cuánta llega hasta el final y
-- cuánta considera el resultado digno de guardar?
create or replace view public.v_embudo_secciones
  with (security_invoker = on) as
select
  seccion,
  count(*) filter (where tipo = 'seccion_abierta')                    as aperturas,
  count(*) filter (where tipo = 'ritual_completado')                  as completados,
  count(*) filter (where tipo = 'guardado')                           as guardados,
  count(distinct user_id)                                             as personas,
  count(distinct user_id) filter (where tipo = 'ritual_completado')   as personas_completaron,
  -- Cuántos de los que entran terminan el ritual.
  round(
    100.0 * count(*) filter (where tipo = 'ritual_completado')
    / nullif(count(*) filter (where tipo = 'seccion_abierta'), 0)
  , 1)                                                                as pct_completan,
  -- Y cuántos de los que terminan deciden conservarlo. Es la señal más fuerte
  -- de valor: guardar cuesta un gesto deliberado.
  round(
    100.0 * count(*) filter (where tipo = 'guardado')
    / nullif(count(*) filter (where tipo = 'ritual_completado'), 0)
  , 1)                                                                as pct_guardan
from public.eventos
where seccion is not null
group by seccion
order by aperturas desc;

comment on view public.v_embudo_secciones is
  'Aperturas, finalizaciones y guardados por sección. La columna que decide qué sección crece o se quita.';

-- ── 2. Lo que dicen querer vs lo que usan ───────────────────────────────────
-- La pregunta que motivó el cuestionario del onboarding: ¿lo que la gente dice
-- buscar coincide con lo que acaba usando?
create or replace view public.v_interes_vs_uso
  with (security_invoker = on) as
with declarado as (
  select unnest(intereses) as interes, count(*) as personas
  from public.perfiles
  where onboarding_completo
  group by 1
),
usado as (
  select
    -- Traduce la sección a las áreas del cuestionario.
    case e.seccion
      when 'afirmaciones' then 'amor'
      when 'codigos'      then 'dinero'
      when 'cruz'         then 'amor'
      else e.seccion
    end                       as area,
    e.seccion,
    count(*)                  as acciones,
    count(distinct e.user_id) as personas
  from public.eventos e
  where e.tipo in ('seccion_abierta', 'ritual_completado')
  group by 1, 2
)
select
  d.interes,
  d.personas          as lo_declaran,
  coalesce(sum(u.acciones), 0)  as acciones_relacionadas,
  coalesce(max(u.personas), 0)  as personas_que_lo_usan
from declarado d
left join usado u on u.area = d.interes
group by d.interes, d.personas
order by d.personas desc;

comment on view public.v_interes_vs_uso is
  'Cruza lo que cada quien dijo querer manifestar con lo que después usa de verdad.';

-- ── 3. Demografía ───────────────────────────────────────────────────────────
create or replace view public.v_demografia
  with (security_invoker = on) as
select
  case
    when fecha_nacimiento is null then 'sin dato'
    when extract(year from age(fecha_nacimiento)) < 18 then '13-17'
    when extract(year from age(fecha_nacimiento)) < 25 then '18-24'
    when extract(year from age(fecha_nacimiento)) < 35 then '25-34'
    when extract(year from age(fecha_nacimiento)) < 45 then '35-44'
    when extract(year from age(fecha_nacimiento)) < 60 then '45-59'
    else '60+'
  end                                                    as rango_edad,
  count(*)                                               as personas,
  count(*) filter (where onboarding_completo)            as completaron_onboarding,
  round(100.0 * count(*) / sum(count(*)) over (), 1)     as pct
from public.perfiles
group by 1
order by 1;

comment on view public.v_demografia is 'Reparto por edad de quienes se registran.';

-- ── 4. Actividad diaria ─────────────────────────────────────────────────────
create or replace view public.v_actividad_diaria
  with (security_invoker = on) as
select
  creado_en::date            as dia,
  count(*)                   as eventos,
  count(distinct user_id)    as personas_activas,
  count(*) filter (where tipo = 'ritual_completado') as rituales,
  count(*) filter (where tipo = 'guardado')          as guardados
from public.eventos
group by 1
order by 1 desc;

comment on view public.v_actividad_diaria is 'Pulso diario: cuánta gente vuelve y qué hace.';

-- ── 5. Contenido concreto más visto ─────────────────────────────────────────
-- Qué códigos tocan, qué cartas consultan, qué preguntas de la Cruz eligen.
-- Sirve para saber qué contenido pide la gente y cuál nadie mira.
create or replace view public.v_contenido_popular
  with (security_invoker = on) as
select
  seccion,
  coalesce(
    detalle ->> 'codigo',
    detalle ->> 'carta',
    detalle ->> 'oraculo',
    detalle ->> 'categoria',
    (detalle ->> 'pregunta_id')
  )                          as elemento,
  count(*)                   as veces,
  count(distinct user_id)    as personas
from public.eventos
where tipo = 'contenido'
group by 1, 2
having coalesce(
    detalle ->> 'codigo', detalle ->> 'carta', detalle ->> 'oraculo',
    detalle ->> 'categoria', (detalle ->> 'pregunta_id')
  ) is not null
order by veces desc;

comment on view public.v_contenido_popular is
  'Qué contenido concreto se consulta más: códigos, cartas, oráculos, preguntas.';

-- ── 6. Resumen de una mirada ────────────────────────────────────────────────
create or replace view public.v_resumen
  with (security_invoker = on) as
select
  (select count(*) from public.perfiles)                                as personas,
  (select count(*) from public.perfiles where onboarding_completo)      as onboarding_completo,
  (select count(*) from public.eventos)                                 as eventos,
  (select count(distinct user_id) from public.eventos
     where creado_en > now() - interval '7 days')                       as activos_7d,
  (select count(distinct user_id) from public.eventos
     where creado_en > now() - interval '30 days')                      as activos_30d,
  (select count(*) from public.eventos where tipo = 'ritual_completado') as rituales_completados,
  (select count(*) from public.eventos where tipo = 'guardado')          as guardados,
  (select pg_size_pretty(pg_total_relation_size('public.eventos')))      as peso_eventos;

comment on view public.v_resumen is 'Una sola fila con el estado general de la app.';

-- ============================================================================
--  CONDENSAR: mantener la tabla pequeña sin perder la historia
-- ============================================================================
--
--  Los eventos crudos crecen sin parar; los recuentos por día, no. La idea es
--  guardar el resumen diario para siempre y tirar el detalle pasado un tiempo.
--  Un día concreto de hace ocho meses no aporta nada como filas sueltas.

create table if not exists public.eventos_diarios (
  dia       date not null,
  tipo      text not null,
  seccion   text,
  eventos   integer not null,
  personas  integer not null,
  primary key (dia, tipo, seccion)
);

alter table public.eventos_diarios enable row level security;

/**
 * Resume en `eventos_diarios` todo lo anterior a `dias_a_conservar` y borra el
 * detalle. Devuelve cuántas filas crudas se eliminaron.
 *
 * Ejecutar de vez en cuando (o programado):
 *   select public.condensar_eventos(90);
 */
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
  -- Sin este tope, un `0` o un negativo ponen el corte en hoy o más adelante y
  -- la función se lleva por delante la tabla entera. Es `security definer`, así
  -- que se salta RLS: el argumento tiene que ser incapaz de hacer eso.
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
  'Resume los eventos antiguos en recuentos diarios y borra el detalle. Devuelve las filas eliminadas.';

-- ============================================================================
--  PERMISOS
-- ============================================================================
--
--  Las vistas ya llevan `security_invoker = on` arriba, así que aunque alguien
--  les conceda el SELECT por error devuelven cero filas a `anon`. Esto es la
--  otra barrera: que no tengan ni acceso. Solo el panel, que usa
--  `service_role`, debe poder verlas.
--
--  Las dos por separado, y a propósito. La de arriba protege de un permiso mal
--  dado; esta, de una vista mal escrita.

do $$
declare v text;
begin
  foreach v in array array[
    'v_embudo_secciones', 'v_interes_vs_uso', 'v_demografia',
    'v_actividad_diaria', 'v_contenido_popular', 'v_resumen'
  ]
  loop
    execute format('revoke all on public.%I from anon, authenticated', v);
  end loop;
end;
$$;

revoke all on public.eventos_diarios from anon, authenticated;

-- Y que ninguna vista ni tabla futura nazca abierta, igual que se hizo abajo
-- con las funciones. Supabase concede SELECT por defecto sobre todo objeto
-- nuevo de `public` a `anon` y `authenticated`; para las tablas da igual
-- (tienen RLS), pero una vista no tiene RLS. Ver `006-vistas-y-borrado.sql` §3.
alter default privileges in schema public
  revoke all on tables from anon, authenticated;

-- OJO con las funciones: no basta con revocar a `anon` y `authenticated`.
--
-- Al crear una función, PostgreSQL le concede EXECUTE a `PUBLIC`. Esos dos roles
-- no tienen permiso propio — lo heredan de ahí — así que revocárselo a ellos no
-- quita nada y la función sigue publicada como endpoint RPC. Siendo
-- `security definer`, cualquiera con la clave pública podía borrar `eventos`.
--
-- Con las vistas de arriba no pasa: las tablas y vistas no nacen con permiso
-- para `PUBLIC`, así que ahí el revoke sí surte efecto.
revoke all on function public.condensar_eventos(integer) from public;
revoke all on function public.condensar_eventos(integer) from anon, authenticated;
grant execute on function public.condensar_eventos(integer) to service_role;

-- Que ninguna función futura nazca abierta.
alter default privileges in schema public revoke execute on functions from public;
