/**
 * Contenido de la app: los textos de los PDFs de Gilda.
 *
 * Tres capas, en este orden:
 *
 *  1. **Empaquetado** — lo que vive en `src/data/`. Siempre disponible, incluso
 *     en el primer arranque y sin red. Es el suelo: nunca se queda por debajo.
 *  2. **Caché** — lo último que se bajó, en AsyncStorage. Se aplica antes del
 *     primer render, así que no hay parpadeo.
 *  3. **Remoto** — Supabase. Solo se baja una sección si su `version` es mayor
 *     que la que hay en caché, así que el caso normal es una única consulta
 *     ligera a `contenido_version` y nada más.
 *
 * Regla de oro: **ante la duda, lo empaquetado**. Si una sección remota llega
 * vacía o con una forma que no cuadra, se descarta entera y se sigue con la
 * local. Un texto desactualizado es un inconveniente; una pantalla en blanco,
 * un fallo.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import {
  AFIRMACION_CATEGORIAS as AFIRMACIONES_LOCAL,
  type AfirmacionCategoria,
} from '@/data/afirmaciones';
import {
  CARTAS as CARTAS_LOCAL,
  PALOS as PALOS_LOCAL,
  type CartaSignificado,
  type PaloDef,
} from '@/data/baraja';
import {
  CODIGO_CATEGORIAS as CODIGOS_LOCAL,
  type CodigoCategoria,
} from '@/data/codigos';
import { CRUZ_DATA as CRUZ_LOCAL, type CruzData } from '@/data/cruz';
import { ORACULOS as ORACULOS_LOCAL, type Oraculo } from '@/data/oraculo';
import { VIBRA_DIAS as VIBRA_LOCAL, type VibraDia } from '@/data/vibra';
import { supabase } from '@/lib/supabase';

export type Contenido = {
  PALOS: PaloDef[];
  CARTAS: Record<string, CartaSignificado>;
  CODIGO_CATEGORIAS: CodigoCategoria[];
  AFIRMACION_CATEGORIAS: AfirmacionCategoria[];
  ORACULOS: Oraculo[];
  CRUZ_DATA: CruzData;
  VIBRA_DIAS: VibraDia[];
};

export type Seccion = 'baraja' | 'codigos' | 'afirmaciones' | 'oraculo' | 'cruz' | 'vibra';

const EMPAQUETADO: Contenido = {
  PALOS: PALOS_LOCAL,
  CARTAS: CARTAS_LOCAL,
  CODIGO_CATEGORIAS: CODIGOS_LOCAL,
  AFIRMACION_CATEGORIAS: AFIRMACIONES_LOCAL,
  ORACULOS: ORACULOS_LOCAL,
  CRUZ_DATA: CRUZ_LOCAL,
  VIBRA_DIAS: VIBRA_LOCAL,
};

const CLAVE_CACHE = 'pa_contenido_v1';

type Cache = {
  versiones: Partial<Record<Seccion, number>>;
  datos: Partial<Contenido>;
};

let contenido: Contenido = EMPAQUETADO;
let versiones: Partial<Record<Seccion, number>> = {};
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

/** Para componentes: se vuelven a pintar si el contenido cambia. */
export function useContenido(): Contenido {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => contenido,
    () => contenido,
  );
}

/** Para código fuera de React (ayudantes a nivel de módulo). */
export function getContenido(): Contenido {
  return contenido;
}

function aplicar(parcial: Partial<Contenido>): void {
  if (!Object.keys(parcial).length) return;
  contenido = { ...contenido, ...parcial };
  emit();
}

/**
 * Carga la caché. Se llama al arrancar, antes del primer render, para que la
 * app abra ya con el contenido más reciente que tenga.
 */
export async function hidratarContenido(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(CLAVE_CACHE);
    if (!raw) return;
    const cache = JSON.parse(raw) as Cache;
    versiones = cache.versiones ?? {};
    aplicar(cache.datos ?? {});
  } catch {
    // Caché ilegible: se sigue con lo empaquetado y se reescribirá al bajar.
  }
}

async function guardarCache(): Promise<void> {
  try {
    const datos: Partial<Contenido> = {};
    // Solo se guarda lo que difiere de lo empaquetado, para no duplicar en
    // disco los 220 KB que ya viajan dentro de la app.
    for (const k of Object.keys(EMPAQUETADO) as (keyof Contenido)[]) {
      if (contenido[k] !== EMPAQUETADO[k]) {
        (datos as Record<string, unknown>)[k] = contenido[k];
      }
    }
    await AsyncStorage.setItem(CLAVE_CACHE, JSON.stringify({ versiones, datos }));
  } catch {
    // Sin caché la app sigue funcionando; se volverá a bajar la próxima vez.
  }
}

// — Reconstrucción de las formas a partir de las filas —
//
// Cada una devuelve `null` si los datos no cuadran, y entonces la sección se
// descarta y se conserva la empaquetada.

type Fila = Record<string, unknown>;

const txt = (v: unknown): string => (typeof v === 'string' ? v : '');
const num = (v: unknown): number => (typeof v === 'number' ? v : 0);

function armarBaraja(palos: Fila[], cartas: Fila[]): Partial<Contenido> | null {
  if (!palos.length || !cartas.length) return null;
  const PALOS = palos.map((p) => ({
    key: txt(p.key) as PaloDef['key'],
    nombre: txt(p.nombre),
    elemento: txt(p.elemento),
    color: txt(p.color),
    idxColor: txt(p.idx_color),
  }));
  const CARTAS: Record<string, CartaSignificado> = {};
  for (const c of cartas) {
    const extras = Array.isArray(c.extras) ? (c.extras as CartaSignificado['extras']) : [];
    CARTAS[`${txt(c.palo)}-${num(c.num)}`] = {
      general: txt(c.general),
      amor: txt(c.amor),
      trabajo: txt(c.trabajo),
      dinero: txt(c.dinero),
      ...(extras && extras.length ? { extras } : {}),
    };
  }
  return { PALOS, CARTAS };
}

function armarCodigos(cats: Fila[], codigos: Fila[]): Partial<Contenido> | null {
  if (!cats.length || !codigos.length) return null;
  const CODIGO_CATEGORIAS = cats.map((cat) => ({
    key: txt(cat.key),
    nombre: txt(cat.nombre),
    sub: txt(cat.sub),
    palo: txt(cat.palo) as CodigoCategoria['palo'],
    color: txt(cat.color),
    codigos: codigos
      .filter((c) => c.categoria === cat.key)
      .map((c) => ({ c: txt(c.codigo), p: txt(c.proposito) })),
  }));
  // Una categoría sin códigos dejaría la sección rota.
  if (CODIGO_CATEGORIAS.some((c) => c.codigos.length === 0)) return null;
  return { CODIGO_CATEGORIAS };
}

function armarAfirmaciones(cats: Fila[], items: Fila[]): Partial<Contenido> | null {
  if (!cats.length) return null;
  const AFIRMACION_CATEGORIAS = cats.map((cat) => ({
    key: txt(cat.key),
    nombre: txt(cat.nombre),
    sub: txt(cat.sub),
    palo: txt(cat.palo) as AfirmacionCategoria['palo'],
    color: txt(cat.color),
    motif: txt(cat.motif) as AfirmacionCategoria['motif'],
    ...(cat.proximamente ? { proximamente: true } : {}),
    items: items.filter((i) => i.categoria === cat.key).map((i) => txt(i.texto)),
  }));
  // Las categorías marcadas "Próximamente" sí pueden ir vacías; el resto no.
  if (AFIRMACION_CATEGORIAS.some((c) => !c.proximamente && c.items.length === 0)) {
    return null;
  }
  return { AFIRMACION_CATEGORIAS };
}

function armarOraculos(oraculos: Fila[], cartas: Fila[]): Partial<Contenido> | null {
  if (!oraculos.length || !cartas.length) return null;
  const ORACULOS = oraculos.map((o) => ({
    key: txt(o.key),
    nombre: txt(o.nombre),
    sub: txt(o.sub),
    color: txt(o.color),
    palo: txt(o.palo) as Oraculo['palo'],
    tipo: txt(o.tipo) as Oraculo['tipo'],
    cartas: cartas
      .filter((c) => c.oraculo === o.key)
      .map((c) => ({
        id: num(c.carta_id),
        mensaje: txt(c.mensaje),
        ...(c.titulo ? { titulo: txt(c.titulo) } : {}),
        ...(c.claves ? { claves: txt(c.claves) } : {}),
      })),
  }));
  if (ORACULOS.some((o) => o.cartas.length === 0)) return null;
  return { ORACULOS };
}

function armarCruz(
  posiciones: Fila[],
  cats: Fila[],
  preguntas: Fila[],
): Partial<Contenido> | null {
  if (!posiciones.length || !cats.length || !preguntas.length) return null;
  const CRUZ_DATA: CruzData = {
    posiciones: posiciones.map((p) => ({
      key: txt(p.key) as CruzData['posiciones'][number]['key'],
      nombre: txt(p.nombre),
      desc: txt(p.descripcion),
    })),
    // `ids` no es una columna: se deriva agrupando las preguntas por categoría,
    // que es como lo consume la pantalla.
    categorias: cats.map((c) => ({
      key: txt(c.key),
      nombre: txt(c.nombre),
      ids: preguntas.filter((q) => q.categoria === c.key).map((q) => num(q.id)),
    })),
    preguntas: preguntas.map((q) => ({
      id: num(q.id),
      texto: txt(q.texto),
      cat: txt(q.categoria),
      rep: q.rep as CruzData['preguntas'][number]['rep'],
      ...(q.resp ? { resp: q.resp as CruzData['preguntas'][number]['resp'] } : {}),
      ...(q.grupos ? { grupos: q.grupos as CruzData['preguntas'][number]['grupos'] } : {}),
    })),
  };
  if (CRUZ_DATA.categorias.some((c) => c.ids.length === 0)) return null;
  if (CRUZ_DATA.preguntas.some((q) => !q.rep)) return null;
  return { CRUZ_DATA };
}

function armarVibra(dias: Fila[]): Partial<Contenido> | null {
  if (dias.length !== 7) return null;
  return {
    VIBRA_DIAS: dias.map((d) => ({
      dia: txt(d.dia),
      planeta: txt(d.planeta),
      simbolo: txt(d.simbolo),
      color: txt(d.color),
      titulo: txt(d.titulo),
      msg: txt(d.msg),
    })),
  };
}

/**
 * Baja del servidor las secciones cuya versión haya subido.
 *
 * No bloquea nada: se lanza en segundo plano al arrancar y, si falla, la app se
 * queda con lo que ya tenía.
 */
export async function sincronizarContenido(): Promise<void> {
  if (!supabase) return;

  try {
    const { data, error } = await supabase
      .from('contenido_version')
      .select('seccion, version');
    if (error || !data) return;

    const remotas = new Map<Seccion, number>(
      data.map((r) => [r.seccion as Seccion, r.version as number]),
    );

    const pendientes = [...remotas.entries()].filter(
      ([seccion, version]) => (versiones[seccion] ?? 0) < version,
    );
    if (!pendientes.length) return;

    const nuevo: Partial<Contenido> = {};

    for (const [seccion, version] of pendientes) {
      const armado = await bajarSeccion(seccion);
      if (armado) {
        Object.assign(nuevo, armado);
        versiones[seccion] = version;
      }
      // Si `armado` es null la versión NO se sube: se reintentará la próxima
      // vez en lugar de quedarse pegado con datos rotos.
    }

    if (Object.keys(nuevo).length) {
      aplicar(nuevo);
      await guardarCache();
    }
  } catch {
    // Sin red o con el esquema aún sin aplicar: se sigue con lo empaquetado.
  }
}

async function bajarSeccion(seccion: Seccion): Promise<Partial<Contenido> | null> {
  // En una constante local: dentro del closure, TypeScript ya no puede saber
  // que `supabase` sigue sin ser null.
  const sb = supabase;
  if (!sb) return null;
  const sel = (t: string, orden: string) =>
    sb.from(t).select('*').order(orden, { ascending: true });

  try {
    switch (seccion) {
      case 'baraja': {
        const [p, c] = await Promise.all([sel('palos', 'orden'), sel('cartas', 'num')]);
        return armarBaraja(p.data ?? [], c.data ?? []);
      }
      case 'codigos': {
        const [cat, cod] = await Promise.all([
          sel('codigo_categorias', 'orden'),
          sel('codigos', 'orden'),
        ]);
        return armarCodigos(cat.data ?? [], cod.data ?? []);
      }
      case 'afirmaciones': {
        const [cat, items] = await Promise.all([
          sel('afirmacion_categorias', 'orden'),
          sel('afirmaciones', 'orden'),
        ]);
        return armarAfirmaciones(cat.data ?? [], items.data ?? []);
      }
      case 'oraculo': {
        const [o, c] = await Promise.all([
          sel('oraculos', 'orden'),
          sel('oraculo_cartas', 'carta_id'),
        ]);
        return armarOraculos(o.data ?? [], c.data ?? []);
      }
      case 'cruz': {
        const [pos, cat, q] = await Promise.all([
          sel('cruz_posiciones', 'orden'),
          sel('cruz_categorias', 'orden'),
          sel('cruz_preguntas', 'orden'),
        ]);
        return armarCruz(pos.data ?? [], cat.data ?? [], q.data ?? []);
      }
      case 'vibra': {
        const d = await sel('vibra_dias', 'orden');
        return armarVibra(d.data ?? []);
      }
    }
  } catch {
    return null;
  }
}
