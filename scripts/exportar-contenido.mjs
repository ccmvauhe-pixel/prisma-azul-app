/**
 * Vuelca el contenido de `src/data/*.ts` a `supabase/seed.sql`.
 *
 *   node scripts/exportar-contenido.mjs
 *
 * Por qué por regex y no importando los módulos: son TypeScript y traen
 * `import type`, así que Node no los ejecuta sin compilar. Pero se generaron a
 * partir de JSON —las claves van entre comillas dobles— y el literal es JSON
 * válido, así que se extrae y se parsea. Si algún día se editan a mano con
 * comillas simples o comentarios dentro, esto avisará en vez de fallar callado.
 *
 * El objetivo es que los textos lleguen a la base de datos EXACTAMENTE como
 * están en los PDFs de Gilda: aquí no se corrige, no se recorta y no se
 * reformatea nada.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Extrae el literal exportado de un fichero de datos y lo parsea como JSON. */
function leer(fichero, nombreExport) {
  const src = readFileSync(join(raiz, 'src', 'data', fichero), 'utf8');
  const marca = `export const ${nombreExport}`;
  const desde = src.indexOf(marca);
  if (desde === -1) throw new Error(`No encontré ${nombreExport} en ${fichero}`);

  const igual = src.indexOf('=', desde + marca.length);
  const inicio = src.slice(igual + 1).search(/[[{]/) + igual + 1;
  const abre = src[inicio];
  const cierra = abre === '[' ? ']' : '}';

  // Recorre contando llaves, ignorando las que van dentro de una cadena.
  let nivel = 0;
  let enCadena = false;
  let escapado = false;
  let fin = -1;
  for (let i = inicio; i < src.length; i++) {
    const c = src[i];
    if (enCadena) {
      if (escapado) escapado = false;
      else if (c === '\\') escapado = true;
      else if (c === '"') enCadena = false;
      continue;
    }
    if (c === '"') enCadena = true;
    else if (c === abre) nivel++;
    else if (c === cierra) {
      nivel--;
      if (nivel === 0) {
        fin = i + 1;
        break;
      }
    }
  }
  if (fin === -1) throw new Error(`Literal sin cerrar en ${fichero}`);

  try {
    return JSON.parse(src.slice(inicio, fin));
  } catch (e) {
    throw new Error(`${fichero} → ${nombreExport} no es JSON válido: ${e.message}`);
  }
}

// — Utilidades SQL —

/** Cadena SQL con las comillas escapadas. `null` para lo ausente. */
const S = (v) =>
  v === undefined || v === null ? 'NULL' : `'${String(v).replaceAll("'", "''")}'`;

const B = (v) => (v ? 'TRUE' : 'FALSE');
const J = (v) =>
  v === undefined || v === null
    ? 'NULL'
    : `'${JSON.stringify(v).replaceAll("'", "''")}'::jsonb`;

const lineas = [];
const w = (t = '') => lineas.push(t);

// — Carga —
const PALOS = leer('baraja.ts', 'PALOS');
const CARTAS = leer('baraja.ts', 'CARTAS');
const CODIGO_CATEGORIAS = leer('codigos.ts', 'CODIGO_CATEGORIAS');
const AFIRMACION_CATEGORIAS = leer('afirmaciones.ts', 'AFIRMACION_CATEGORIAS');
const ORACULOS = leer('oraculo.ts', 'ORACULOS');
const CRUZ_DATA = leer('cruz.ts', 'CRUZ_DATA');
const VIBRA_DIAS = leer('vibra.ts', 'VIBRA_DIAS');

w('-- ============================================================================');
w('--  Prisma Azul — contenido');
w('-- ============================================================================');
w('--');
w('--  GENERADO POR scripts/exportar-contenido.mjs — NO EDITAR A MANO.');
w('--  Para regenerarlo:  node scripts/exportar-contenido.mjs');
w('--');
w('--  Textos de los PDFs de Gilda, volcados literalmente. Aplícalo DESPUÉS de');
w('--  schema.sql, en el SQL Editor de Supabase. Es idempotente: reejecutarlo');
w('--  actualiza lo que cambió y respeta el resto.');
w('-- ============================================================================');
w();
w('begin;');
w();

// — Palos —
w('-- Palos ---------------------------------------------------------------------');
PALOS.forEach((p, i) => {
  w(
    `insert into public.palos (key, nombre, elemento, color, idx_color, orden) values ` +
      `(${S(p.key)}, ${S(p.nombre)}, ${S(p.elemento)}, ${S(p.color)}, ${S(p.idxColor)}, ${i})`,
  );
  w(
    `  on conflict (key) do update set nombre = excluded.nombre, elemento = excluded.elemento, ` +
      `color = excluded.color, idx_color = excluded.idx_color, orden = excluded.orden;`,
  );
});
w();

// — Cartas —
w('-- Significado de las 40 cartas ----------------------------------------------');
for (const [clave, c] of Object.entries(CARTAS)) {
  const guion = clave.lastIndexOf('-');
  const palo = clave.slice(0, guion);
  const num = Number(clave.slice(guion + 1));
  w(
    `insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ` +
      `(${S(palo)}, ${num}, ${S(c.general)}, ${S(c.amor)}, ${S(c.trabajo)}, ${S(c.dinero)}, ${J(c.extras ?? [])})`,
  );
  w(
    `  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, ` +
      `trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;`,
  );
}
w();

// — Códigos —
w('-- Códigos sagrados ----------------------------------------------------------');
CODIGO_CATEGORIAS.forEach((cat, i) => {
  w(
    `insert into public.codigo_categorias (key, nombre, sub, palo, color, orden) values ` +
      `(${S(cat.key)}, ${S(cat.nombre)}, ${S(cat.sub)}, ${S(cat.palo)}, ${S(cat.color)}, ${i})`,
  );
  w(
    `  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, ` +
      `palo = excluded.palo, color = excluded.color, orden = excluded.orden;`,
  );
  cat.codigos.forEach((c, j) => {
    w(
      `insert into public.codigos (categoria, codigo, proposito, orden) values ` +
        `(${S(cat.key)}, ${S(c.c)}, ${S(c.p)}, ${j})`,
    );
    w(
      `  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;`,
    );
  });
});
w();

// — Afirmaciones —
w('-- Afirmaciones --------------------------------------------------------------');
AFIRMACION_CATEGORIAS.forEach((cat, i) => {
  w(
    `insert into public.afirmacion_categorias (key, nombre, sub, palo, color, motif, proximamente, orden) values ` +
      `(${S(cat.key)}, ${S(cat.nombre)}, ${S(cat.sub)}, ${S(cat.palo)}, ${S(cat.color)}, ${S(cat.motif)}, ${B(cat.proximamente)}, ${i})`,
  );
  w(
    `  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, palo = excluded.palo, ` +
      `color = excluded.color, motif = excluded.motif, proximamente = excluded.proximamente, orden = excluded.orden;`,
  );
});
// Las afirmaciones no tienen clave natural (son frases sueltas), así que se
// reemplaza el bloque entero de cada categoría en vez de hacer upsert una a una.
w(`delete from public.afirmaciones;`);
AFIRMACION_CATEGORIAS.forEach((cat) => {
  cat.items.forEach((texto, j) => {
    w(
      `insert into public.afirmaciones (categoria, texto, orden) values (${S(cat.key)}, ${S(texto)}, ${j});`,
    );
  });
});
w();

// — Oráculos —
w('-- Oráculos ------------------------------------------------------------------');
ORACULOS.forEach((o, i) => {
  w(
    `insert into public.oraculos (key, nombre, sub, color, palo, tipo, orden) values ` +
      `(${S(o.key)}, ${S(o.nombre)}, ${S(o.sub)}, ${S(o.color)}, ${S(o.palo)}, ${S(o.tipo)}, ${i})`,
  );
  w(
    `  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, color = excluded.color, ` +
      `palo = excluded.palo, tipo = excluded.tipo, orden = excluded.orden;`,
  );
  o.cartas.forEach((c) => {
    w(
      `insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ` +
        `(${S(o.key)}, ${c.id}, ${S(c.mensaje)}, ${S(c.titulo)}, ${S(c.claves)})`,
    );
    w(
      `  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, ` +
        `titulo = excluded.titulo, claves = excluded.claves;`,
    );
  });
});
w();

// — Cruz de Vida —
w('-- Cruz de Vida --------------------------------------------------------------');
CRUZ_DATA.posiciones.forEach((p, i) => {
  w(
    `insert into public.cruz_posiciones (key, nombre, descripcion, orden) values ` +
      `(${S(p.key)}, ${S(p.nombre)}, ${S(p.desc)}, ${i})`,
  );
  w(
    `  on conflict (key) do update set nombre = excluded.nombre, descripcion = excluded.descripcion, orden = excluded.orden;`,
  );
});
CRUZ_DATA.categorias.forEach((c, i) => {
  w(
    `insert into public.cruz_categorias (key, nombre, orden) values (${S(c.key)}, ${S(c.nombre)}, ${i})`,
  );
  w(`  on conflict (key) do update set nombre = excluded.nombre, orden = excluded.orden;`);
});
CRUZ_DATA.preguntas.forEach((q, i) => {
  w(
    `insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values ` +
      `(${q.id}, ${S(q.cat)}, ${S(q.texto)}, ${J(q.rep)}, ${J(q.resp)}, ${J(q.grupos)}, ${i})`,
  );
  w(
    `  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, ` +
      `rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;`,
  );
});
w();

// — Vibra —
w('-- Día que vibras más alto ---------------------------------------------------');
VIBRA_DIAS.forEach((d, i) => {
  w(
    `insert into public.vibra_dias (dia, planeta, simbolo, color, titulo, msg, orden) values ` +
      `(${S(d.dia)}, ${S(d.planeta)}, ${S(d.simbolo)}, ${S(d.color)}, ${S(d.titulo)}, ${S(d.msg)}, ${i})`,
  );
  w(
    `  on conflict (dia) do update set planeta = excluded.planeta, simbolo = excluded.simbolo, ` +
      `color = excluded.color, titulo = excluded.titulo, msg = excluded.msg, orden = excluded.orden;`,
  );
});
w();

// — Versiones —
w('-- Versión de cada bloque ----------------------------------------------------');
w('-- Sube estos números a mano tras editar textos: la app solo vuelve a');
w('-- descargar un bloque si su versión es mayor que la que tiene en caché.');
for (const s of ['baraja', 'codigos', 'afirmaciones', 'oraculo', 'cruz', 'vibra']) {
  w(
    `insert into public.contenido_version (seccion, version) values (${S(s)}, 1) ` +
      `on conflict (seccion) do nothing;`,
  );
}
w();
w('commit;');
w();

mkdirSync(join(raiz, 'supabase'), { recursive: true });
const salida = join(raiz, 'supabase', 'seed.sql');
writeFileSync(salida, lineas.join('\n'), 'utf8');

// — Resumen, para poder cotejar contra los ficheros de origen —
const totalCodigos = CODIGO_CATEGORIAS.reduce((n, c) => n + c.codigos.length, 0);
const totalAfirm = AFIRMACION_CATEGORIAS.reduce((n, c) => n + c.items.length, 0);
const totalOraculo = ORACULOS.reduce((n, o) => n + o.cartas.length, 0);

console.log(`Escrito: supabase/seed.sql`);
console.log(`  palos               ${PALOS.length}`);
console.log(`  cartas              ${Object.keys(CARTAS).length}`);
console.log(`  cat. de códigos     ${CODIGO_CATEGORIAS.length}`);
console.log(`  códigos             ${totalCodigos}`);
console.log(`  cat. afirmaciones   ${AFIRMACION_CATEGORIAS.length}`);
console.log(`  afirmaciones        ${totalAfirm}`);
console.log(`  oráculos            ${ORACULOS.length}`);
console.log(`  cartas de oráculo   ${totalOraculo}`);
console.log(`  posiciones cruz     ${CRUZ_DATA.posiciones.length}`);
console.log(`  preguntas cruz      ${CRUZ_DATA.preguntas.length}`);
console.log(`  días de vibración   ${VIBRA_DIAS.length}`);
