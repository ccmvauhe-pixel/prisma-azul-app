-- Reproduce el entorno que Supabase da por hecho, para poder aplicar el
-- esquema real sin cambiarle una coma.

create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create role supabase_auth_admin nologin;

create schema if not exists auth;

create table auth.users (
  id                  uuid primary key default gen_random_uuid(),
  email               text,
  is_anonymous        boolean not null default false,
  raw_user_meta_data  jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  last_sign_in_at     timestamptz
);

-- Igual que la de Supabase: lee el `sub` de las claims del JWT, que en las
-- peticiones reales inyecta PostgREST y aquí inyecta el banco de pruebas.
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')::uuid
$$;

grant usage on schema auth to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;

-- ── El automatismo que hace vulnerable el punto de partida ──────────────────
--
-- Supabase configura privilegios por defecto que conceden acceso a todo objeto
-- nuevo del esquema `public`. Es exactamente el comportamiento que la sección 3
-- de la migración 006 cierra, así que el banco de pruebas TIENE que empezar con
-- él puesto o no estaría probando nada.
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on tables to service_role;
grant usage on schema public to anon, authenticated, service_role;
