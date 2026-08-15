-- ============================================================================
--  Prisma Azul — esquema de base de datos
-- ============================================================================
--
--  Cómo aplicarlo: panel de Supabase → SQL Editor → pega este archivo → Run.
--  Es idempotente: puedes volver a ejecutarlo sin romper nada.
--
--  Dos mundos separados, con reglas opuestas:
--
--   1. CONTENIDO — los textos de los PDFs de Gilda. Los lee todo el mundo,
--      no los escribe nadie desde la app. Editarlos es tarea del panel de
--      Supabase, que usa `service_role` y por tanto se salta RLS.
--
--   2. USUARIO — lo guardado y los temporizadores de cada persona. Cada quien
--      ve y toca únicamente lo suyo, garantizado por RLS.
--
--  Nota sobre RLS: si una tabla tiene RLS activo y ninguna política que
--  permita escribir, nadie puede escribir con la clave `anon` — ni siquiera
--  autenticado. Es justo lo que queremos para el contenido.
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
--  1. CONTENIDO
-- ============================================================================

-- Los cuatro palos de la baraja española -------------------------------------
create table if not exists public.palos (
  key        text primary key,          -- oros | copas | espadas | bastos
  nombre     text not null,
  elemento   text not null,             -- "Tierra · Prosperidad"
  color      text not null,
  idx_color  text not null,
  orden      integer not null default 0
);

-- Significado de cada una de las 40 cartas -----------------------------------
create table if not exists public.cartas (
  palo      text not null references public.palos(key) on delete cascade,
  num       integer not null,           -- 1-7, 10, 11, 12 (no hay 8 ni 9)
  general   text not null,
  amor      text not null,
  trabajo   text not null,
  dinero    text not null,
  -- Secciones extra que solo traen algunas cartas (Salud, Energía negativa):
  -- [{ "t": "titulo", "x": "texto" }]
  extras    jsonb not null default '[]'::jsonb,
  primary key (palo, num)
);

-- Códigos sagrados -----------------------------------------------------------
create table if not exists public.codigo_categorias (
  key     text primary key,
  nombre  text not null,
  sub     text not null,
  palo    text not null references public.palos(key),
  color   text not null,
  orden   integer not null default 0
);

create table if not exists public.codigos (
  id         bigint generated always as identity primary key,
  categoria  text not null references public.codigo_categorias(key) on delete cascade,
  codigo     text not null,             -- el número sagrado, como texto
  proposito  text not null,
  orden      integer not null default 0,
  unique (categoria, codigo)
);

-- Afirmaciones ---------------------------------------------------------------
create table if not exists public.afirmacion_categorias (
  key           text primary key,
  nombre        text not null,
  sub           text not null,
  palo          text not null references public.palos(key),
  color         text not null,
  motif         text not null,          -- corazon | moneda | estrella
  proximamente  boolean not null default false,
  orden         integer not null default 0
);

create table if not exists public.afirmaciones (
  id         bigint generated always as identity primary key,
  categoria  text not null references public.afirmacion_categorias(key) on delete cascade,
  texto      text not null,
  orden      integer not null default 0
);

-- Oráculos -------------------------------------------------------------------
create table if not exists public.oraculos (
  key     text primary key,
  nombre  text not null,
  sub     text not null,
  color   text not null,
  palo    text not null references public.palos(key),
  tipo    text not null check (tipo in ('frase', 'titulo')),
  orden   integer not null default 0
);

create table if not exists public.oraculo_cartas (
  oraculo   text not null references public.oraculos(key) on delete cascade,
  carta_id  integer not null,           -- el `id` que ya traía el PDF
  mensaje   text not null,
  titulo    text,
  claves    text,
  primary key (oraculo, carta_id)
);

-- Cruz de Vida ---------------------------------------------------------------
create table if not exists public.cruz_posiciones (
  key          text primary key,        -- arriba | izquierda | abajo | derecha
  nombre       text not null,
  descripcion  text not null,
  orden        integer not null default 0
);

create table if not exists public.cruz_categorias (
  key     text primary key,             -- amor | dinero | salud
  nombre  text not null,
  orden   integer not null default 0
);

create table if not exists public.cruz_preguntas (
  id         integer primary key,       -- el id original del PDF
  categoria  text not null references public.cruz_categorias(key) on delete cascade,
  texto      text not null,
  -- `rep` es una unión de tres formas (fija | genero | multi) y `grupos` es un
  -- diccionario por palo. Modelarlas en columnas obligaría a inventar un
  -- esquema que el contenido no tiene; en jsonb se guardan tal cual vinieron.
  rep        jsonb not null,
  resp       jsonb,                     -- respuestas por posición
  grupos     jsonb,                     -- solo en preguntas de tipo `multi`
  orden      integer not null default 0
);

-- Día que vibras más alto ----------------------------------------------------
create table if not exists public.vibra_dias (
  dia      text primary key,            -- Lunes … Domingo
  planeta  text not null,
  simbolo  text not null,
  color    text not null,
  titulo   text not null,
  msg      text not null,
  orden    integer not null default 0
);

-- Versión de cada bloque de contenido ----------------------------------------
-- La app guarda el contenido en caché y solo vuelve a descargarlo si aquí hay
-- una versión más alta. Sube `version` a mano tras editar textos.
create table if not exists public.contenido_version (
  seccion        text primary key,      -- baraja | codigos | afirmaciones | …
  version        integer not null default 1,
  actualizado_en timestamptz not null default now()
);

-- ============================================================================
--  2. DATOS DE USUARIO
-- ============================================================================

-- Perfil: lo que se recoge en el onboarding.
--
-- El correo vive aquí y no en `auth.users` porque hoy las sesiones son
-- anónimas: no hay contraseña, no se envía nada y por tanto Supabase no tiene
-- correo que gobernar. Se pide en el onboarding como un dato más.
--
-- Cuando llegue el acceso con contraseña, este correo es el que se usará para
-- convertir la cuenta anónima en una de verdad, sin perder nada.
create table if not exists public.perfiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  nombre               text,
  correo               text,
  fecha_nacimiento     date,
  -- Lo que desea manifestar: amor | trabajo | dinero | salud | limpieza
  intereses            text[] not null default '{}',
  interes_principal    text,
  -- Preparado para un tema claro que hoy no existe en el diseño.
  tema                 text not null default 'noche' check (tema in ('noche', 'dia', 'sistema')),
  onboarding_completo  boolean not null default false,
  creado_en            timestamptz not null default now(),
  actualizado_en       timestamptz not null default now()
);

-- Para bases ya creadas con la versión anterior de la tabla: `create table if
-- not exists` no toca lo que ya existe, así que las columnas nuevas se añaden
-- aparte. Todo es idempotente.
alter table public.perfiles
  add column if not exists nombre              text,
  add column if not exists correo              text,
  add column if not exists fecha_nacimiento    date,
  add column if not exists intereses           text[] not null default '{}',
  add column if not exists interes_principal   text,
  add column if not exists tema                text not null default 'noche',
  add column if not exists onboarding_completo boolean not null default false,
  add column if not exists actualizado_en      timestamptz not null default now();

do $$
begin
  alter table public.perfiles
    add constraint perfiles_tema_valido check (tema in ('noche', 'dia', 'sistema'));
exception
  when duplicate_object then null;
end;
$$;

-- Analítica de uso.
--
-- Para qué: saber qué secciones se usan de verdad y así decidir cuáles crecen,
-- cuáles se afinan y cuáles sobran. Cada quien solo puede escribir y leer sus
-- propios eventos; las cuentas agregadas se hacen desde el panel.
--
-- Sin datos personales dentro de `detalle`: solo qué se hizo, no textos ni
-- respuestas de lecturas.
create table if not exists public.eventos (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  -- seccion_abierta | ritual_completado | guardado | contenido
  tipo       text not null,
  -- cruz | oraculo | codigos | afirmaciones | baraja | perfil
  seccion    text,
  detalle    jsonb not null default '{}'::jsonb,
  creado_en  timestamptz not null default now()
);

-- Temporizadores y progreso de los rituales. Una fila por persona.
create table if not exists public.estado_rituales (
  user_id            uuid primary key references auth.users(id) on delete cascade,

  vibra_semana       text,              -- llave del lunes de esa semana
  vibra_idx          integer,

  afirmacion_lock    timestamptz,
  oraculo_lock       timestamptz,

  codigo_categoria   text,
  codigo_idx         integer,
  codigo_unlock_at   timestamptz,

  cruz_next          timestamptz,
  -- Llave del lunes de la semana en curso (YYYY-M-D), igual que `semanaKey()`.
  cruz_semana_wk     text,
  cruz_semana_usadas integer not null default 0,
  -- Lecturas adicionales sin usar. El cliente NUNCA la escribe: hoy nada la
  -- incrementa, y RLS impide que cambie de valor en un UPDATE.
  cruz_extras        integer not null default 0,

  -- { "afirmacion": true, "codigo": true, "oraculo": true, "cruz": true }
  notif              jsonb not null default '{"afirmacion":true,"codigo":true,"oraculo":true,"cruz":true}'::jsonb,

  actualizado_en     timestamptz not null default now()
);

-- Para bases creadas antes del cambio de ritmo de la Cruz (mensual → semanal).
-- `create table if not exists` no toca lo que ya existe, así que las columnas
-- nuevas se añaden aparte. Todo es idempotente.
alter table public.estado_rituales
  add column if not exists cruz_semana_wk     text,
  add column if not exists cruz_semana_usadas integer not null default 0,
  add column if not exists cruz_extras        integer not null default 0;

alter table public.estado_rituales
  drop column if exists cruz_mes_ym,
  drop column if exists cruz_mes_usadas;

do $$
begin
  alter table public.estado_rituales
    add constraint cruz_extras_no_negativo check (cruz_extras >= 0);
exception
  when duplicate_object then null;
end;
$$;

-- Lo que el usuario decidió conservar.
--
-- La clave primaria es (user_id, tipo) a propósito: en esta app ninguna sección
-- acumula historial, solo sobrevive la entrega más reciente. Así la regla vive
-- en la base de datos y no depende de que el cliente se acuerde de borrar.
create table if not exists public.guardados (
  user_id         uuid not null references auth.users(id) on delete cascade,
  tipo            text not null check (tipo in ('afirmacion', 'codigo', 'oraculo', 'cruz')),
  fecha           timestamptz not null,
  -- Solo el oráculo caduca: al llegar su temporizador a 0 desaparece, se haya
  -- guardado uno nuevo o no.
  expira          timestamptz,
  -- El cuerpo de la entrada, con la forma que ya usa el cliente.
  datos           jsonb not null,
  actualizado_en  timestamptz not null default now(),
  primary key (user_id, tipo)
);

-- --- Límites de lo que el cliente puede escribir ----------------------------
--
-- RLS garantiza que cada quien solo toca lo suyo. Esto es lo otro: *cuánto* y
-- de *qué forma*. Sin ello, `detalle` y `datos` son jsonb libre y `tipo` es
-- texto sin restringir, así que con la clave pública se puede inflar la base o
-- envenenar las vistas de analítica con secciones inventadas — justo lo
-- contrario de para lo que existen.
--
-- `not valid` afecta solo a las filas ya existentes; las escrituras nuevas se
-- comprueban desde el primer momento. Es para que reejecutar este archivo sobre
-- una base con datos viejos no falle.

do $$
begin
  -- 13 es el umbral que exigen las tiendas para tratar datos de menores sin
  -- consentimiento parental. En el cliente se puede saltar; aquí no.
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
  -- La forma, no solo la longitud. `CORREO_VALIDO` vive en `auth.ts`, o sea en
  -- React, y eso se salta llamando a la API directamente. Importa por lo que
  -- viene: este correo es el que convertirá la cuenta anónima en una de verdad.
  --
  -- Deliberadamente laxa, la misma que en el cliente: validar correos con
  -- precisión es un pozo sin fondo y aquí solo hace falta que no entre texto
  -- libre.
  alter table public.perfiles
    add constraint perfiles_correo_con_forma
    check (
      correo is null
      or correo ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    ) not valid;
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

do $$
begin
  -- Regla 2 de `analitica.ts`: aquí no van textos de lecturas. Si `detalle`
  -- crece, es que se coló contenido que no debería estar.
  alter table public.eventos
    add constraint eventos_detalle_pequeno
    check (pg_column_size(detalle) < 512) not valid;
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

-- Tamaño y forma son cosas distintas: las dos columnas jsonb tenían tope de
-- bytes pero valían igual un número suelto, una cadena o un array. `sync.ts`
-- hace `{ ...(f.datos as object) }` al bajar, así que un array se esparce como
-- índices numéricos dentro del estado de la app. Es daño a la propia cuenta,
-- pero impedirlo es gratis.

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
--  3. AUTOMATISMOS
-- ============================================================================

-- Perfil automático al registrarse.
create or replace function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- El nombre viaja en los metadatos del registro, así que el perfil nace ya
  -- con él y la app no tiene que hacer una segunda escritura.
  insert into public.perfiles (id, nombre)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'nombre'), ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil();

-- `actualizado_en` siempre al día, sin depender del cliente.
create or replace function public.tocar_actualizado_en()
returns trigger
language plpgsql
-- Igual que `crear_perfil`: con `search_path` fijo. Es la advertencia
-- `function_search_path_mutable` del linter de Supabase.
set search_path = ''
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists tocar_estado_rituales on public.estado_rituales;
create trigger tocar_estado_rituales
  before update on public.estado_rituales
  for each row execute function public.tocar_actualizado_en();

drop trigger if exists tocar_guardados on public.guardados;
create trigger tocar_guardados
  before update on public.guardados
  for each row execute function public.tocar_actualizado_en();

drop trigger if exists tocar_perfiles on public.perfiles;
create trigger tocar_perfiles
  before update on public.perfiles
  for each row execute function public.tocar_actualizado_en();

-- ============================================================================
--  4. SEGURIDAD (RLS)
-- ============================================================================

-- --- Contenido: lo lee cualquiera, no lo escribe nadie desde la app ---------
alter table public.palos                 enable row level security;
alter table public.cartas                enable row level security;
alter table public.codigo_categorias     enable row level security;
alter table public.codigos               enable row level security;
alter table public.afirmacion_categorias enable row level security;
alter table public.afirmaciones          enable row level security;
alter table public.oraculos              enable row level security;
alter table public.oraculo_cartas        enable row level security;
alter table public.cruz_posiciones       enable row level security;
alter table public.cruz_categorias       enable row level security;
alter table public.cruz_preguntas        enable row level security;
alter table public.vibra_dias            enable row level security;
alter table public.contenido_version     enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'palos', 'cartas', 'codigo_categorias', 'codigos',
    'afirmacion_categorias', 'afirmaciones', 'oraculos', 'oraculo_cartas',
    'cruz_posiciones', 'cruz_categorias', 'cruz_preguntas', 'vibra_dias',
    'contenido_version'
  ]
  loop
    execute format('drop policy if exists "lectura publica" on public.%I', t);
    execute format(
      'create policy "lectura publica" on public.%I for select to anon, authenticated using (true)',
      t
    );
  end loop;
end;
$$;

-- --- Datos de usuario: cada quien, lo suyo ---------------------------------
alter table public.perfiles         enable row level security;
alter table public.estado_rituales  enable row level security;
alter table public.guardados        enable row level security;

-- `perfiles` va por verbos separados, y DELETE no está. No es un olvido.
--
-- Con `for all` el cliente podía borrar su propia fila. Eso no borra la de
-- `auth.users`, y `crear_perfil` solo dispara al crearse el usuario, así que no
-- vuelve a nacer. `_layout.tsx` decide si enseñar el onboarding con `perfil &&
-- !perfil.onboardingCompleto`: sin fila esa condición es falsa y la compuerta se
-- salta entera — incluida la edad mínima que la sección de límites mueve al
-- servidor justo para que no se pueda saltar.
--
-- Borrar la cuenta de verdad es cosa de `auth.users`; de ahí el `on delete
-- cascade` de la clave foránea ya se lleva el perfil por delante.
drop policy if exists "perfil propio" on public.perfiles;

drop policy if exists "perfil propio: leer" on public.perfiles;
create policy "perfil propio: leer" on public.perfiles
  for select to authenticated
  using (auth.uid() = id);

-- El INSERT normal lo hace el disparador `crear_perfil`, que es definer y no
-- pasa por aquí. Esta política es la red por si no llegó a correr.
drop policy if exists "perfil propio: insertar" on public.perfiles;
create policy "perfil propio: insertar" on public.perfiles
  for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "perfil propio: actualizar" on public.perfiles;
create policy "perfil propio: actualizar" on public.perfiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- `estado_rituales` va por verbos separados y no con un `for all`, y el motivo
-- no se ve a simple vista: las políticas permisivas se combinan con OR, así que
-- un `for all` que cubra UPDATE deja pasar cualquier escritura y anula la
-- política de abajo que protege `cruz_extras`. Un `for all` aquí no es un atajo
-- equivalente: desactiva el control.
drop policy if exists "estado propio" on public.estado_rituales;

drop policy if exists "estado propio: leer" on public.estado_rituales;
create policy "estado propio: leer" on public.estado_rituales
  for select to authenticated
  using (auth.uid() = user_id);

-- En un INSERT no hay fila previa contra la que comparar, así que las extras
-- solo pueden nacer a cero. `sync.ts` hace upsert: sin esto, la primera
-- escritura de una cuenta nueva podría sembrar el número que quisiera.
drop policy if exists "estado propio: insertar" on public.estado_rituales;
create policy "estado propio: insertar" on public.estado_rituales
  for insert to authenticated
  with check (auth.uid() = user_id and cruz_extras = 0);

-- DELETE no está, y no es un olvido: es el arreglo de `006-vistas-y-borrado.sql`.
--
-- La app nunca borra de esta tabla — `sync.ts` solo borra de `guardados`. Y la
-- fila remota es el suelo sobre el que se apoya la regla de fusión de `sync.ts`
-- ("gana lo más restrictivo"), que existe para que reinstalar la app no regale
-- lecturas. Si el cliente puede borrarla, quita el suelo: borrar la fila, borrar
-- los datos de la app y reabrir dejaba todos los temporizadores a cero, tantas
-- veces como se quisiera.
--
-- Borrar la cuenta de verdad es cosa de `auth.users`; el `on delete cascade` de
-- la clave foránea ya se lleva esta fila por delante.
drop policy if exists "estado propio: borrar" on public.estado_rituales;

-- El cliente no puede tocar `cruz_extras`. Aunque hoy nada las conceda, la
-- protección va desde el principio: el día que valgan dinero, bastaría un
-- UPDATE para regalárselas. Es más fácil no abrir el hueco que cerrarlo luego.
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

drop policy if exists "guardados propios" on public.guardados;
create policy "guardados propios" on public.guardados
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.eventos enable row level security;

-- Los eventos se escriben y se leen, pero no se modifican ni se borran: un
-- registro de uso que el propio cliente puede reescribir no vale para decidir
-- nada. Las cuentas agregadas se hacen desde el panel, con `service_role`.
drop policy if exists "eventos propios: escribir" on public.eventos;
create policy "eventos propios: escribir" on public.eventos
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "eventos propios: leer" on public.eventos;
create policy "eventos propios: leer" on public.eventos
  for select to authenticated
  using (auth.uid() = user_id);

-- ============================================================================
--  5. ÍNDICES
-- ============================================================================

create index if not exists codigos_categoria_idx      on public.codigos (categoria, orden);
create index if not exists afirmaciones_categoria_idx on public.afirmaciones (categoria, orden);
create index if not exists oraculo_cartas_oraculo_idx on public.oraculo_cartas (oraculo);
create index if not exists cruz_preguntas_cat_idx     on public.cruz_preguntas (categoria, orden);
create index if not exists cartas_palo_idx            on public.cartas (palo, num);

-- Analítica: se consulta por persona y por periodo, y en agregado por sección.
create index if not exists eventos_usuario_idx on public.eventos (user_id, creado_en desc);
create index if not exists eventos_seccion_idx on public.eventos (tipo, seccion, creado_en desc);

-- Para el techo global de `eventos_limite` (ver `004-cuentas-y-validacion.sql`).
-- No sirve `eventos_usuario_idx`: ese empieza por `user_id` y la consulta del
-- cortacircuitos no filtra por persona. Sin este índice, cada inserción haría
-- un recorrido secuencial de la tabla.
create index if not exists eventos_creado_idx on public.eventos (creado_en desc);

-- ============================================================================
--  6. PERMISOS
-- ============================================================================
--
--  RLS decide QUÉ FILAS se ven. Esto decide a QUÉ TABLAS se llega, que es una
--  pregunta distinta y anterior: en PostgREST hacen falta las dos cosas. El
--  GRANT dice "puedes tocar esta tabla"; la política dice "y solo estas filas".
--  Sin GRANT, la política ni se evalúa.
--
--  Antes esto no estaba escrito en ningún sitio: funcionaba porque Supabase
--  concede SELECT por defecto sobre todo objeto nuevo de `public` a `anon` y
--  `authenticated`. `006-vistas-y-borrado.sql` §3 cerró ese automatismo —una
--  vista nueva no tiene RLS y nacía legible por cualquiera—, así que a partir
--  de ahí los permisos hay que darlos a mano. Esta sección es esa lista.
--
--  Si algún día el contenido de la app aparece vacío y la base tiene datos,
--  mira aquí antes que en ningún otro sitio: `contenido.ts` se cae con
--  elegancia a los textos empaquetados, así que un permiso que falte no da
--  ningún error — simplemente deja de llegar lo nuevo.

grant usage on schema public to anon, authenticated;

-- Se quita todo primero, y luego se da lo justo.
--
-- El `revoke` es la mitad que importa: en Supabase las tablas NACEN con todos
-- los privilegios concedidos a `anon` y `authenticated`. Sin quitarlos, el
-- GRANT sobrante convive con la ausencia de política, y entonces un DELETE o un
-- UPDATE que no debería poder hacerse no falla — RLS lo filtra y devuelve "0
-- filas afectadas", en silencio. El dato está a salvo, pero la única defensa es
-- la política. Quitando el privilegio hay dos, y el intento falla con un 42501
-- que se ve.
revoke all on
  public.palos, public.cartas,
  public.codigo_categorias, public.codigos,
  public.afirmacion_categorias, public.afirmaciones,
  public.oraculos, public.oraculo_cartas,
  public.cruz_posiciones, public.cruz_categorias, public.cruz_preguntas,
  public.vibra_dias, public.contenido_version,
  public.perfiles, public.estado_rituales, public.guardados, public.eventos
from anon, authenticated;

-- Contenido: lo lee todo el mundo, incluso sin sesión. No lo escribe nadie
-- desde la app; editarlo es cosa del panel, que usa `service_role`.
grant select on
  public.palos, public.cartas,
  public.codigo_categorias, public.codigos,
  public.afirmacion_categorias, public.afirmaciones,
  public.oraculos, public.oraculo_cartas,
  public.cruz_posiciones, public.cruz_categorias, public.cruz_preguntas,
  public.vibra_dias, public.contenido_version
to anon, authenticated;

-- Datos de usuario: hace falta sesión, y RLS acota a las filas propias. Los
-- verbos son exactamente los de las políticas de la sección 4 — ni uno más.
grant select, insert, update on public.perfiles          to authenticated;
grant select, insert, update on public.estado_rituales   to authenticated;
grant select, insert, update, delete on public.guardados to authenticated;
grant select, insert on public.eventos                   to authenticated;

-- Lo que queda fuera, y por qué:
--
--   `estado_rituales` DELETE — ver la nota de la sección 4.
--   `eventos` UPDATE/DELETE  — un registro de uso que el cliente puede
--                              reescribir no vale para decidir nada.
--   `perfiles` DELETE        — ver `004-cuentas-y-validacion.sql` §3.
--   `eventos_diarios`        — es del panel (`service_role`).
--   Las vistas de `analitica.sql` — ídem, y además con `security_invoker = on`.
--
-- `eventos_diarios` y las vistas nacen en `analitica.sql`, que es un archivo
-- aparte y puede no haberse aplicado todavía. De ahí el `if exists`: sin él,
-- este archivo deja de ser aplicable por sí solo en una base nueva.
do $$
begin
  if to_regclass('public.eventos_diarios') is not null then
    revoke all on public.eventos_diarios from anon, authenticated;
  end if;
end;
$$;

-- Y que nada futuro nazca abierto. Es el mismo gesto que `002-endurecer.sql`
-- §1 hizo con las funciones, para tablas y vistas.
alter default privileges in schema public
  revoke all on tables from anon, authenticated;
