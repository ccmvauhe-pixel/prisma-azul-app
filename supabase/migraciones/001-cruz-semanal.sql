-- ============================================================================
--  Cruz de Vida: de mensual a semanal
-- ============================================================================
--
--  Cambia el ritmo de la Cruz: antes 1 lectura al mes, ahora 1 gratis por
--  semana con un tope de 3 en total.
--
--  Las dos adicionales todavía no se pueden conseguir por ningún medio: el
--  contador existe y se queda en cero. Se deja preparado para no tener que
--  volver a tocar el esquema cuando haya una forma de concederlas.
--
--  Aplicar: SQL Editor → pegar → Run. Es idempotente.
--
--  ⚠️ SUPERADO POR `002-endurecer.sql`. No volver a ejecutar este archivo.
--     La política de la sección 3 no llegaba a aplicarse: convivía con la
--     `"estado propio"` de tipo `for all` de `schema.sql`, y las políticas
--     permisivas se combinan con OR — bastaba con cumplir la otra. `002` parte
--     esa política por verbos y `schema.sql` ya viene con el estado final.
-- ============================================================================

-- ── 1. Columnas nuevas ──────────────────────────────────────────────────────

alter table public.estado_rituales
  add column if not exists cruz_semana_wk     text,
  add column if not exists cruz_semana_usadas integer not null default 0,
  add column if not exists cruz_extras        integer not null default 0
    constraint cruz_extras_no_negativo check (cruz_extras >= 0);

comment on column public.estado_rituales.cruz_semana_wk is
  'Llave del lunes de la semana en curso (YYYY-M-D), igual que semanaKey() en la app.';
comment on column public.estado_rituales.cruz_extras is
  'Lecturas adicionales sin usar. El cliente NUNCA la escribe: hoy nada la incrementa.';

-- ── 2. Migrar lo que hubiera del esquema mensual ────────────────────────────
--
--  El cupo mensual no se traduce a semanas, así que se descarta: quien tuviera
--  su lectura del mes gastada entra a la semana en curso con la suya libre.
--  Es a favor del usuario a propósito — el cambio de reglas es nuestro.

update public.estado_rituales
set cruz_semana_wk     = null,
    cruz_semana_usadas = 0,
    cruz_next          = null
where cruz_semana_wk is null;

alter table public.estado_rituales
  drop column if exists cruz_mes_ym,
  drop column if exists cruz_mes_usadas;

-- ── 3. El cliente no puede tocar `cruz_extras` ──────────────────────────────
--
--  Aunque hoy nadie las conceda, la protección va desde el principio: si el
--  cliente pudiera escribir esa columna, el día que valga dinero bastaría con
--  un UPDATE para regalarse lecturas. Es más fácil no abrir el hueco que
--  acordarse de cerrarlo después.

drop policy if exists "estado propio: actualizar" on public.estado_rituales;

create policy "estado propio: actualizar"
  on public.estado_rituales
  for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and cruz_extras = (
      select e.cruz_extras from public.estado_rituales e where e.user_id = auth.uid()
    )
  );
