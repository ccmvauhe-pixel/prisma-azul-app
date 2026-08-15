/**
 * Banco de pruebas de seguridad de Prisma Azul.
 *
 * Levanta un Postgres real (PGlite/WASM), reproduce el entorno de Supabase
 * (roles, auth.users, auth.uid(), privilegios por defecto), aplica el esquema
 * TAL CUAL está en el repositorio y comprueba cada control desde el papel de
 * quien tiene la clave pública y una sesión.
 *
 * Dos escenarios:
 *   A) base nueva  — schema + analitica + migraciones, incluida la 006.
 *   B) base existente — igual, pero reintroduciendo el estado ANTERIOR a la 006
 *      para comprobar (a) que las pruebas detectan el fallo, y (b) que la 006
 *      lo cierra.
 */
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';

// Relativo a este archivo, no a dónde se lance el comando.
const REPO = new URL('../../', import.meta.url);
const leer = (p) => readFileSync(new URL(p, REPO), 'utf8');
const bootstrap = readFileSync(new URL('./bootstrap.sql', import.meta.url), 'utf8');

const UA = '11111111-1111-1111-1111-111111111111';
const UB = '22222222-2222-2222-2222-222222222222';
const UC = '33333333-3333-3333-3333-333333333333';

let db;
const resultados = [];
let escenarioActual = '';

function check(nombre, ok, detalle = '') {
  resultados.push({ escenario: escenarioActual, nombre, ok, detalle });
  const icono = ok ? '  ✅' : '  ❌';
  console.log(`${icono} ${nombre}${detalle && !ok ? `\n        → ${detalle}` : ''}`);
}

/** Ejecuta como `postgres` (superusuario), para montar el escenario. */
async function sudo(sql, etiqueta = '') {
  try {
    return await db.exec(sql);
  } catch (e) {
    // Sin esto, PGlite escupe el archivo SQL entero y no se ve el error.
    throw new Error(`[${etiqueta || 'sudo'}] ${e.code ?? ''} ${String(e.message ?? e).split('\n')[0]}`);
  }
}

/**
 * Ejecuta como un rol concreto, con las claims que tendría una petición real.
 * No lanza: devuelve el resultado o el SQLSTATE, que es lo que se comprueba.
 */
async function como(rol, uid, sql, params = []) {
  const claims = uid ? JSON.stringify({ sub: uid, role: rol }) : '';
  await db.query(`select set_config('request.jwt.claims', $1, false)`, [claims]);
  await db.exec(`set role ${rol}`);
  try {
    const res = await db.query(sql, params);
    return { ok: true, filas: res.rows, n: res.rows.length, afectadas: res.affectedRows };
  } catch (e) {
    return { ok: false, code: e.code ?? null, msg: String(e.message ?? e).split('\n')[0] };
  } finally {
    await db.exec('reset role');
  }
}

// ── Montaje ─────────────────────────────────────────────────────────────────

async function montar({ conMigracion006 }) {
  db = await PGlite.create({ extensions: { pgcrypto } });
  await sudo(bootstrap, 'bootstrap');
  await sudo(leer('supabase/schema.sql'), 'schema.sql');
  await sudo(leer('supabase/analitica.sql'), 'analitica.sql');
  // 001 está explícitamente superada por 002: su propia cabecera dice que no se
  // vuelva a ejecutar.
  for (const m of ['002-endurecer', '003-limite-eventos', '004-cuentas-y-validacion', '005-tope-de-altas']) {
    await sudo(leer(`supabase/migraciones/${m}.sql`), m);
  }
  if (conMigracion006) await sudo(leer('supabase/migraciones/006-vistas-y-borrado.sql'), '006');

  // Contenido y personas de prueba. El disparador `crear_perfil` crea los
  // perfiles solo, igual que en producción.
  await sudo(`
    insert into public.palos (key, nombre, elemento, color, idx_color)
      values ('oros','Oros','Tierra','#e0b','#e0b') on conflict do nothing;
    insert into public.cartas (palo, num, general, amor, trabajo, dinero)
      values ('oros', 1, 'g','a','t','d') on conflict do nothing;
    insert into auth.users (id, is_anonymous) values
      ('${UA}', true), ('${UB}', true), ('${UC}', true) on conflict do nothing;
    update public.perfiles set fecha_nacimiento = '1990-01-01', onboarding_completo = true;
  `);
}

/** Devuelve la base al estado ANTERIOR a la 006, para probar que la 006 sirve. */
async function reintroducirEstadoAntiguo() {
  await sudo(`
    drop policy if exists "estado propio: borrar" on public.estado_rituales;
    create policy "estado propio: borrar" on public.estado_rituales
      for delete to authenticated using (auth.uid() = user_id);
    grant all on public.estado_rituales, public.eventos, public.perfiles
      to anon, authenticated;

    alter view public.v_demografia        reset (security_invoker);
    alter view public.v_resumen           reset (security_invoker);
    alter view public.v_actividad_diaria  reset (security_invoker);
    alter view public.v_embudo_secciones  reset (security_invoker);
    alter view public.v_interes_vs_uso    reset (security_invoker);
    alter view public.v_contenido_popular reset (security_invoker);

    -- El revoke del final de analitica.sql que alguien se deja al añadir una
    -- vista, que es el caso que la 006 existe para cubrir.
    grant select on public.v_demografia to anon, authenticated;

    alter default privileges in schema public grant all on tables to anon, authenticated;
  `);
}

// ── Comprobaciones ──────────────────────────────────────────────────────────

/** HALLAZGO #1 — las vistas no pueden saltarse RLS. */
async function probarVistas({ esperandoVulnerable = false } = {}) {
  const opts = await db.query(`
    select c.relname, coalesce(array_to_string(c.reloptions, ','), '') as op
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relkind = 'v' order by 1`);
  const conInvoker = opts.rows.filter((r) => r.op.includes('security_invoker=on'));

  if (esperandoVulnerable) {
    check('CONTROL NEGATIVO: las vistas se saltan RLS antes de la 006',
      conInvoker.length === 0, `${conInvoker.length}/6 ya tenían security_invoker`);
    // La prueba de fondo: con el SELECT concedido por error, ¿se ven los datos
    // de TODO el mundo? `v_resumen` lo dice con un número: `personas` cuenta
    // las filas de `perfiles`, y hay 3 en la base.
    await sudo('grant select on public.v_resumen to authenticated');
    const fuga = await como('authenticated', UA, 'select personas from public.v_resumen');
    check('CONTROL NEGATIVO: `authenticated` contaba a las 3 personas, no solo a la suya',
      fuga.ok && Number(fuga.filas?.[0]?.personas) === 3, `personas=${fuga.filas?.[0]?.personas ?? fuga.code}`);
    return;
  }

  check('Las 6 vistas tienen security_invoker = on',
    conInvoker.length === 6, `solo ${conInvoker.length}/6: ${opts.rows.map((r) => `${r.relname}[${r.op}]`).join(' ')}`);

  const sinPermiso = await como('authenticated', UA, 'select * from public.v_demografia');
  check('`authenticated` no tiene ni acceso a las vistas (1ª barrera)',
    !sinPermiso.ok && sinPermiso.code === '42501', `${sinPermiso.code ?? 'leyó ' + sinPermiso.n + ' filas'}`);

  // La barrera que importa: aunque alguien conceda el SELECT por error, la
  // vista solo puede enseñar lo que RLS deja ver a quien pregunta. `personas`
  // cuenta las filas de `perfiles`: hay 3 en la base, y solo 1 es suya.
  await sudo('grant select on public.v_resumen to authenticated');
  const conPermiso = await como('authenticated', UA, 'select personas from public.v_resumen');
  check('Con el SELECT concedido por error, la vista solo cuenta lo propio (2ª barrera)',
    conPermiso.ok && Number(conPermiso.filas?.[0]?.personas) === 1,
    `personas=${conPermiso.filas?.[0]?.personas ?? conPermiso.code} (deberían ser 1 de 3)`);
  await sudo('revoke select on public.v_resumen from authenticated');

  const panel = await como('service_role', null, 'select personas from public.v_resumen');
  check('`service_role` (el panel) sigue viendo a las 3 personas',
    panel.ok && Number(panel.filas?.[0]?.personas) === 3, `personas=${panel.filas?.[0]?.personas ?? panel.code}`);

  // Privilegio por defecto cerrado: una vista nueva ya no nace abierta.
  await sudo('create view public.v_prueba as select 1 as x');
  await sudo('create table public.t_prueba (x int)');
  const vNueva = await db.query(`select has_table_privilege('anon','public.v_prueba','select') as v`);
  const tNueva = await db.query(`select has_table_privilege('anon','public.t_prueba','select') as v`);
  check('Una VISTA nueva ya no nace legible por `anon`', vNueva.rows[0].v === false);
  check('Una TABLA nueva ya no nace legible por `anon`', tNueva.rows[0].v === false);
  await sudo('drop view public.v_prueba; drop table public.t_prueba');
}

/** HALLAZGO #2 — `estado_rituales` no se puede borrar desde el cliente. */
async function probarBorrado({ esperandoVulnerable = false } = {}) {
  const futuro = new Date(Date.now() + 7 * 864e5).toISOString();
  await sudo(`insert into public.estado_rituales (user_id, cruz_next)
              values ('${UA}', '${futuro}')
              on conflict (user_id) do update set cruz_next = excluded.cruz_next`);

  const del = await como('authenticated', UA, `delete from public.estado_rituales where user_id = '${UA}'`);
  const quedan = await db.query(`select count(*)::int as n from public.estado_rituales where user_id = '${UA}'`);

  if (esperandoVulnerable) {
    check('CONTROL NEGATIVO: se podía borrar el propio estado y resetear los temporizadores',
      del.ok && quedan.rows[0].n === 0, `borrado.ok=${del.ok} quedan=${quedan.rows[0].n}`);
    return;
  }

  check('El cliente NO puede borrar su fila de `estado_rituales`',
    !del.ok && del.code === '42501', `${del.code ?? 'lo borró'}`);
  check('Los temporizadores siguen ahí tras el intento de borrado',
    quedan.rows[0].n === 1, `quedan ${quedan.rows[0].n} filas`);

  const pol = await db.query(
    `select count(*)::int as n from pg_policies where tablename='estado_rituales' and cmd='DELETE'`);
  check('No queda ninguna política DELETE en `estado_rituales`', pol.rows[0].n === 0);

  const priv = await db.query(
    `select has_table_privilege('authenticated','public.estado_rituales','delete') as v`);
  check('`authenticated` no tiene el privilegio DELETE en `estado_rituales`', priv.rows[0].v === false);
}

/** Que nada de lo que ya funcionaba se haya roto. */
async function probarRegresiones() {
  // — Contenido —
  const contenidoAnon = await como('anon', null, 'select * from public.cartas');
  check('REGRESIÓN: `anon` sigue leyendo el contenido (cartas)',
    contenidoAnon.ok && contenidoAnon.n > 0, `${contenidoAnon.code ?? contenidoAnon.n + ' filas'}`);

  const versionAnon = await como('anon', null, 'select * from public.contenido_version');
  check('REGRESIÓN: `anon` sigue leyendo `contenido_version`',
    versionAnon.ok, `${versionAnon.code ?? 'ok'}`);

  // — Aislamiento entre personas —
  const perfilPropio = await como('authenticated', UA, `select * from public.perfiles`);
  check('REGRESIÓN: se lee el perfil propio, y solo ese',
    perfilPropio.ok && perfilPropio.n === 1, `devolvió ${perfilPropio.n ?? perfilPropio.code}`);

  const perfilAjeno = await como('authenticated', UA, `select * from public.perfiles where id = '${UB}'`);
  check('AISLAMIENTO: no se ve el perfil de otra persona',
    perfilAjeno.ok && perfilAjeno.n === 0, `devolvió ${perfilAjeno.n}`);

  const perfilesAnon = await como('anon', null, 'select * from public.perfiles');
  check('AISLAMIENTO: sin sesión no se ve ningún perfil', perfilesAnon.n === 0 || !perfilesAnon.ok);

  const eventosAnon = await como('anon', null, 'select * from public.eventos');
  check('AISLAMIENTO: sin sesión no se ve ningún evento', eventosAnon.n === 0 || !eventosAnon.ok);

  const escribirAjeno = await como('authenticated', UA,
    `update public.perfiles set nombre = 'secuestrado' where id = '${UB}'`);
  check('AISLAMIENTO: no se puede escribir en el perfil de otra persona',
    !escribirAjeno.ok || escribirAjeno.afectadas === 0, `afectadas=${escribirAjeno.afectadas}`);

  // — `estado_rituales`: lo que la app sí hace —
  const upsert = await como('authenticated', UA,
    `insert into public.estado_rituales (user_id, oraculo_lock) values ('${UA}', now())
       on conflict (user_id) do update set oraculo_lock = excluded.oraculo_lock`);
  check('REGRESIÓN: el upsert de `sync.ts` sigue funcionando', upsert.ok, `${upsert.code ?? ''} ${upsert.msg ?? ''}`);

  // — `cruz_extras`: la moneda del futuro —
  const sembrar = await como('authenticated', UC,
    `insert into public.estado_rituales (user_id, cruz_extras) values ('${UC}', 5)`);
  check('`cruz_extras` no se puede sembrar al insertar',
    !sembrar.ok, `${sembrar.code ?? 'lo insertó'}`);

  const regalar = await como('authenticated', UA,
    `update public.estado_rituales set cruz_extras = 99 where user_id = '${UA}'`);
  check('`cruz_extras` no se puede subir al actualizar',
    !regalar.ok || regalar.afectadas === 0, `${regalar.code ?? 'afectadas=' + regalar.afectadas}`);

  // — `guardados`: aquí sí se borra —
  const g = await como('authenticated', UA,
    `insert into public.guardados (user_id, tipo, fecha, datos)
       values ('${UA}', 'oraculo', now(), '{"x":1}'::jsonb)`);
  check('REGRESIÓN: se puede guardar una lectura', g.ok, `${g.code ?? ''}`);

  const gDel = await como('authenticated', UA, `delete from public.guardados where user_id = '${UA}'`);
  check('REGRESIÓN: `sync.ts` sigue pudiendo borrar de `guardados`', gDel.ok, `${gDel.code ?? ''}`);

  // — `eventos`: se escribe y se lee, no se reescribe —
  const ev = await como('authenticated', UA,
    `insert into public.eventos (user_id, tipo, seccion) values ('${UA}', 'seccion_abierta', 'inicio')`);
  check('REGRESIÓN: la analítica puede escribir', ev.ok, `${ev.code ?? ''}`);

  const evUpd = await como('authenticated', UA, `update public.eventos set seccion = 'cruz'`);
  check('La analítica no se puede reescribir', !evUpd.ok && evUpd.code === '42501', `${evUpd.code}`);

  const evDel = await como('authenticated', UA, `delete from public.eventos`);
  check('La analítica no se puede borrar', !evDel.ok && evDel.code === '42501', `${evDel.code}`);

  // — `perfiles` sin DELETE (arreglo de la 004) —
  const pDel = await como('authenticated', UA, `delete from public.perfiles where id = '${UA}'`);
  check('El perfil propio no se puede borrar (004 §3 sigue en pie)',
    !pDel.ok || pDel.afectadas === 0, `${pDel.code ?? 'afectadas=' + pDel.afectadas}`);

  // — Validación en el servidor, no en React —
  const menor = await como('authenticated', UA,
    `update public.perfiles set fecha_nacimiento = current_date - interval '10 years' where id = '${UA}'`);
  check('La edad mínima de 13 se impone en la base', !menor.ok && menor.code === '23514', `${menor.code}`);

  const correoMalo = await como('authenticated', UA,
    `update public.perfiles set correo = 'no-es-un-correo' where id = '${UA}'`);
  check('El formato del correo se impone en la base', !correoMalo.ok && correoMalo.code === '23514', `${correoMalo.code}`);

  const interesMalo = await como('authenticated', UA,
    `update public.perfiles set intereses = array['inventado'] where id = '${UA}'`);
  check('Los intereses están acotados en la base', !interesMalo.ok && interesMalo.code === '23514', `${interesMalo.code}`);

  const detalleGrande = await como('authenticated', UA,
    `insert into public.eventos (user_id, tipo, detalle)
       values ('${UA}', 'contenido', jsonb_build_object('x', repeat('a', 600)))`);
  check('`eventos.detalle` no puede pasar de 512 bytes', !detalleGrande.ok, `${detalleGrande.code}`);

  const detalleArray = await como('authenticated', UA,
    `insert into public.eventos (user_id, tipo, detalle) values ('${UA}', 'contenido', '[1,2,3]'::jsonb)`);
  check('`eventos.detalle` tiene que ser un objeto', !detalleArray.ok, `${detalleArray.code}`);

  const tipoInventado = await como('authenticated', UA,
    `insert into public.eventos (user_id, tipo) values ('${UA}', 'inventado')`);
  check('No se puede envenenar la analítica con tipos inventados', !tipoInventado.ok, `${tipoInventado.code}`);

  const suplantar = await como('authenticated', UA,
    `insert into public.eventos (user_id, tipo) values ('${UB}', 'seccion_abierta')`);
  check('SUPLANTACIÓN: no se pueden escribir eventos a nombre de otra persona',
    !suplantar.ok && suplantar.code === '42501', `${suplantar.code}`);

  // — Las funciones peligrosas siguen cerradas —
  const rpc = await db.query(`
    select count(*)::int as n from information_schema.routine_privileges
     where routine_name in ('condensar_eventos','purgar_anonimos','eventos_limite','limitar_altas')
       and grantee in ('PUBLIC','anon','authenticated')`);
  check('Ninguna función `security definer` es invocable desde la clave pública',
    rpc.rows[0].n === 0, `${rpc.rows[0].n} permisos abiertos`);

  const borrar = await como('authenticated', UA, `select public.condensar_eventos(30)`);
  check('`condensar_eventos` no se puede llamar desde una sesión', !borrar.ok, `${borrar.code}`);

  const purgar = await como('authenticated', UA, `select public.purgar_anonimos(30)`);
  check('`purgar_anonimos` no se puede llamar desde una sesión', !purgar.ok, `${purgar.code}`);

  // — El tope de escritura de la analítica —
  await sudo(`delete from public.eventos`);
  const carga = await como('authenticated', UA,
    `insert into public.eventos (user_id, tipo, seccion)
       select '${UA}', 'seccion_abierta', 'inicio' from generate_series(1, 205)`);
  check('El tope de 200 eventos/hora corta el bucle', !carga.ok && carga.code === '23514', `${carga.code ?? 'metió las 205'}`);
}

// ── Ejecución ───────────────────────────────────────────────────────────────

console.log('\n╔══════════════════════════════════════════════════════════════════╗');
console.log('║  ESCENARIO A — base nueva (schema + analitica + 002…006)        ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');
escenarioActual = 'A';
await montar({ conMigracion006: true });
console.log('── Hallazgo #1: vistas ─────────────────────────────────────────────');
await probarVistas();
console.log('\n── Hallazgo #2: borrado de `estado_rituales` ───────────────────────');
await probarBorrado();
console.log('\n── Regresiones: que nada de lo que funcionaba se haya roto ─────────');
await probarRegresiones();
await db.close();

console.log('\n\n╔══════════════════════════════════════════════════════════════════╗');
console.log('║  ESCENARIO B — base existente: estado anterior → aplicar 006    ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');
escenarioActual = 'B';
await montar({ conMigracion006: false });
await reintroducirEstadoAntiguo();
console.log('── Control negativo: ¿detectan las pruebas el fallo? ───────────────');
await probarVistas({ esperandoVulnerable: true });
await probarBorrado({ esperandoVulnerable: true });
console.log('\n── Se aplica 006-vistas-y-borrado.sql ──────────────────────────────\n');
await sudo(leer('supabase/migraciones/006-vistas-y-borrado.sql'));
console.log('── Hallazgo #1: vistas ─────────────────────────────────────────────');
await probarVistas();
console.log('\n── Hallazgo #2: borrado de `estado_rituales` ───────────────────────');
await probarBorrado();
console.log('\n── Regresiones ─────────────────────────────────────────────────────');
await probarRegresiones();
await db.close();

console.log('\n\n╔══════════════════════════════════════════════════════════════════╗');
console.log('║  ESCENARIO C — aplicabilidad suelta e idempotencia              ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');
escenarioActual = 'C';

// `schema.sql` tiene que poder aplicarse SOLO, sin `analitica.sql`. Es como
// arranca una base nueva, y es justo lo que rompió la primera vuelta.
db = await PGlite.create({ extensions: { pgcrypto } });
try {
  await sudo(bootstrap, 'bootstrap');
  await sudo(leer('supabase/schema.sql'), 'schema.sql');
  check('`schema.sql` se aplica solo, sin `analitica.sql`', true);
} catch (e) {
  check('`schema.sql` se aplica solo, sin `analitica.sql`', false, e.message);
}

// Y la 006 tiene que poder aplicarse sobre eso, también sin `analitica.sql`.
try {
  await sudo(leer('supabase/migraciones/006-vistas-y-borrado.sql'), '006');
  check('La 006 se aplica sin `analitica.sql` (sin vistas que tocar)', true);
} catch (e) {
  check('La 006 se aplica sin `analitica.sql` (sin vistas que tocar)', false, e.message);
}

// Idempotencia: los cinco archivos prometen poder reejecutarse. Se comprueba.
const archivos = [
  ['supabase/schema.sql', 'schema.sql'],
  ['supabase/analitica.sql', 'analitica.sql'],
  ['supabase/migraciones/002-endurecer.sql', '002'],
  ['supabase/migraciones/003-limite-eventos.sql', '003'],
  ['supabase/migraciones/004-cuentas-y-validacion.sql', '004'],
  ['supabase/migraciones/005-tope-de-altas.sql', '005'],
  ['supabase/migraciones/006-vistas-y-borrado.sql', '006'],
];
for (const [ruta, nombre] of archivos) {
  try {
    await sudo(leer(ruta), nombre);
    await sudo(leer(ruta), nombre); // dos veces seguidas
    check(`\`${nombre}\` es idempotente (aplicado 2 veces)`, true);
  } catch (e) {
    check(`\`${nombre}\` es idempotente (aplicado 2 veces)`, false, e.message);
  }
}

// Tras reaplicarlo todo, los dos arreglos tienen que seguir en pie: es el caso
// de "alguien vuelve a pegar schema.sql dentro de un año".
await sudo(`insert into auth.users (id, is_anonymous) values ('${UA}', true) on conflict do nothing`);
const polTrasReaplicar = await db.query(
  `select count(*)::int as n from pg_policies where tablename='estado_rituales' and cmd='DELETE'`);
check('Tras reaplicarlo todo, `estado_rituales` sigue sin DELETE', polTrasReaplicar.rows[0].n === 0);

const vistasTrasReaplicar = await db.query(`
  select count(*)::int as n from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname='public' and c.relkind='v'
     and coalesce(array_to_string(c.reloptions, ','),'') like '%security_invoker=on%'`);
check('Tras reaplicarlo todo, las 6 vistas siguen en modo invocador',
  vistasTrasReaplicar.rows[0].n === 6, `${vistasTrasReaplicar.rows[0].n}/6`);
await db.close();

// ── Resumen ─────────────────────────────────────────────────────────────────
const fallos = resultados.filter((r) => !r.ok);
console.log('\n\n════════════════════════════════════════════════════════════════════');
console.log(`  ${resultados.length - fallos.length}/${resultados.length} comprobaciones pasan`);
if (fallos.length) {
  console.log(`\n  ❌ ${fallos.length} FALLOS:`);
  for (const f of fallos) console.log(`     [${f.escenario}] ${f.nombre}\n        ${f.detalle}`);
} else {
  console.log('  ✅ Todo verde en los dos escenarios.');
}
console.log('════════════════════════════════════════════════════════════════════\n');
process.exit(fallos.length ? 1 : 0);
