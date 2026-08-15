/**
 * Mi Camino — menú principal.
 *
 * Tablero de estado y navegación: día de mayor vibración, afirmación, código
 * sagrado, oráculo, Cruz de Vida y la baraja, con sus temporizadores visibles.
 * No hay barra de pestañas; todo se abre tocando las tarjetas.
 *
 * Diferencia respecto al prototipo: no incluye el paywall de lecturas
 * adicionales dentro de la app — la Cruz ofrece una gratis por semana.
 */
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Emblem } from '@/components/Emblem';
import { Halo } from '@/components/Halo';
import { Screen } from '@/components/Screen';
import {
  BotonPrimario,
  EnlaceTenue,
  Kicker,
  Pildora,
  Tarjeta,
  Toast,
} from '@/components/ui';
import { VibraDia } from '@/data/vibra';
import {
  estadoCruz,
  guardadosDe,
  restablecerLecturas,
  semanaKey,
  setState,
  type State,
  ultimoGuardado,
  useStore,
} from '@/lib/store';
import { fechaHoy, fmtCorto, recortar, useTick } from '@/lib/time';
import {
  color,
  creamDim,
  font,
  fs,
  goldDim,
  lavenderDim,
  radius,
  suitColor,
  text,
} from '@/theme/tokens';
import { usePerfil } from '@/lib/perfil';
import { avisarAhora } from '@/lib/notifications';
import { getContenido, useContenido } from '@/lib/contenido';

export default function MiCamino() {
  const router = useRouter();
  const s = useStore();
  const now = useTick(true);
  const perfil = usePerfil();
  const [toast, setToast] = useState<string | null>(null);

  /** Solo el primer nombre: "Hola, María Fernanda" no cabe en la cabecera. */
  const nombrePila = perfil?.nombre?.trim().split(/\s+/)[0] ?? '';

  const vibra = useVibraDelDia(s);

  const afirmLock = Math.max(0, s.afirmacionLock - now);
  const codLock = Math.max(0, (s.codigoActivo?.unlockAt ?? 0) - now);
  const oraLock = Math.max(0, s.oraculoLock - now);

  // Solo se muestra lo que el usuario decidió guardar: lo demás no sobrevive.
  const afirmGuardada = ultimoGuardado(s, 'afirmacion');
  const codGuardado = ultimoGuardado(s, 'codigo');
  // El oráculo guardado caduca con su temporizador; por eso se filtra con `now`.
  const oraGuardados = guardadosDe(s, 'oraculo', now);
  const cruzGuardadas = guardadosDe(s, 'cruz', now);

  // — Afirmación —
  let afirmTexto = 'Aún no has guardado ninguna afirmación.';
  let afirmNombre = '';
  let afirmCta = afirmLock > 0 ? 'Ver afirmaciones' : 'Recibir la mía';
  if (afirmGuardada) {
    // Mismo motivo que `codDesc`: el cuerpo creció con `ESCALA_TEXTO`, así que
    // el umbral y el recorte bajan en la misma proporción (150→130, 120→104).
    const larga = afirmGuardada.texto.length > 130;
    afirmTexto = `“${larga ? recortar(afirmGuardada.texto, 104) : afirmGuardada.texto}”`;
    afirmNombre = afirmGuardada.categoria
      ? `Afirmación de ${afirmGuardada.categoria}`
      : '';
    afirmCta = larga
      ? 'Leer completa'
      : afirmLock > 0
        ? 'Ver afirmaciones'
        : 'Recibir una nueva';
  }

  // — Código sagrado —
  const codNum = codGuardado?.numero ?? '';
  const codCat = codGuardado?.categoria ?? '';
  // Se recorta más corto que antes porque el cuerpo creció: en media tarjeta,
  // 95 caracteres a 12,5 px empujaban el pie fuera de la celda. Con la escala
  // en 1.15 el cuerpo va a 14,5 px, así que baja otra vez — 68 → 58.
  const codDesc = codGuardado ? recortar(codGuardado.proposito, 58) : '';

  // — Oráculo (nunca muestra el contenido de la lectura desde aquí) —
  let oraTitulo = 'Aún no has pedido tu oráculo';
  let oraBody = 'Tres mensajes que tu alma necesita, cada 24 horas.';
  let oraCta = oraLock > 0 ? 'Ver el oráculo' : 'Recibir mi oráculo';
  if (oraGuardados.length > 0) {
    // Del Oráculo solo se conserva la última lectura guardada.
    oraTitulo = 'Tu oráculo guardado te espera';
    // Sin segunda línea, igual que en la Cruz: decía qué oráculo era y que se
    // tocara para leerlo, y las dos cosas están ya en la tarjeta — el oráculo
    // se ve al abrirlo y el "tocar" lo dice el pie.
    oraBody = '';
    oraCta = 'Ver mi oráculo guardado';
  }

  // — Cruz de Vida: una gratis por semana, hasta 3 con las compradas —
  const cruz = estadoCruz(s, now);
  const cruzDisponible = cruz.puedeLeer;
  const cruzNextMs = Math.max(0, s.cruzNext - now);

  function mostrarToast(mensaje: string) {
    setToast(mensaje);
    setTimeout(() => setToast(null), 2400);
  }

  return (
    <Screen>
      {/* Cabecera */}
      <View style={styles.header}>
        <Emblem name="corona" size={46} glow="rgba(236,200,116,.5)" />
        <View style={{ flex: 1 }}>
          <Text style={styles.marca}>Prisma Azul</Text>
          {/* Con nombre, el saludo es personal; sin él, el título de siempre.
              Un nombre largo partiría el saludo en dos líneas y descuadraría la
              cabecera, así que encoge antes de romperse. */}
          <Text style={styles.titulo} numberOfLines={1} adjustsFontSizeToFit>
            {nombrePila ? `Hola, ${nombrePila}` : 'Mi Camino'}
          </Text>
          <Text style={styles.fecha}>{fechaHoy(now)}</Text>
        </View>
        <BotonPerfil onPress={() => router.push('/perfil')} />
      </View>

      {/*
        Una sola columna, todas las tarjetas al mismo ancho y con la misma
        separación. Antes había una rejilla 2×2 en medio (vibra + afirmación /
        código + oráculo) y tres anchos distintos conviviendo en la pantalla.

        El orden es el del recorrido que se quiere: primero el día, luego la
        lectura mayor, después las tres lecturas cortas y al final la baraja,
        que es consulta y no lectura.

        La separación vive en el `gap` de la pila y no en el `marginTop` de cada
        tarjeta: así no se puede descuadrar al reordenarlas.
      */}
      <View style={styles.pila}>
        <TarjetaVibra vibra={vibra} />

        {/* Cruz de Vida — la lectura mayor */}
        <Tarjeta acento={suitColor.copas} style={styles.cruz}>
          <View style={styles.cardTop}>
            <Emblem name="copas" size={24} glow="rgba(231,154,180,.5)" />
            <View style={{ flex: 1 }}>
              <Kicker style={{ letterSpacing: 1.8 } as never}>Cruz de Vida · Semanal</Kicker>
            </View>
            <Pildora
              bloqueado={!cruzDisponible}
              label={
                // Tener extras compradas cambia el mensaje: no es lo mismo "espera"
                // que "puedes leer ya, gastando una de las tuyas".
                cruz.gratisDisponible
                  ? 'Disponible'
                  : cruz.puedeLeer
                    ? `${cruz.extras} compradas`
                    : cruz.cupoRestante === 0
                      ? 'Tope semanal'
                      : cruzNextMs > 0
                        ? `Gratis en ${fmtCorto(cruzNextMs)}`
                        : 'Disponible'
              }
            />
          </View>
          {/*
            Solo se conserva la última lectura guardada; las previas se descartan.

            Con lectura guardada va solo el titular, centrado sobre el botón: la
            línea de debajo ("Del 15 de agosto · Toca para volver a leerla")
            decía dos cosas que ya se saben — la fecha la enseña la propia
            lectura al abrirla, y que se toca para leerla lo dice el botón.
          */}
          <Text style={[styles.cardTitulo, styles.centrado]}>
            {cruzGuardadas.length > 0
              ? 'Tu lectura guardada te espera'
              : 'Aún no tienes una lectura guardada'}
          </Text>
          {cruzGuardadas.length === 0 ? (
            <Text style={[styles.cardBody, styles.centrado]}>
              Haz tu pregunta y deja que la cruz te responda.
            </Text>
          ) : null}
          {/*
            La Cruz conserva su botón mientras las demás llevan el pie con "›".
            No es una inconsistencia: es la lectura mayor y la única que se
            reserva la acción explícita.
          */}
          {/*
            La tarjeta termina en el botón. Debajo iba el ritmo de la lectura
            ("una gratis cada semana · hasta 3 en total"), que repetía lo que ya
            dice la píldora de arriba y alargaba la tarjeta empujando hacia
            abajo a Afirmación y Código.
          */}
          <BotonPrimario alto={44} onPress={() => router.push('/cruz')} style={{ marginTop: 14 }}>
            {cruzGuardadas.length > 0 ? 'Ver mi lectura guardada' : 'Ir a la Cruz'}
          </BotonPrimario>
        </Tarjeta>

        {/* Afirmación */}
        <Tarjeta acento={suitColor.copas} onPress={() => router.push('/afirmaciones')}>
          <View style={styles.cardTop}>
            <Emblem name="copas" size={24} glow="rgba(231,154,180,.5)" />
            <View style={{ flex: 1 }}>
              <Kicker style={{ letterSpacing: 1.8 } as never}>Afirmación · Semanal</Kicker>
            </View>
            <Pildora
              bloqueado={afirmLock > 0}
              label={afirmLock > 0 ? `Nueva en ${fmtCorto(afirmLock)}` : 'Disponible'}
            />
          </View>
          {/*
            El tipo va ARRIBA y la afirmación debajo. Antes era al revés y se
            leía como un pie de foto: primero la cita y luego, en pequeño, de qué
            era. Puesto delante funciona como encabezado y da contexto antes de
            leer la frase.
          */}
          {afirmNombre ? (
            <Text style={[styles.afirmNombre, styles.centrado]}>{afirmNombre}</Text>
          ) : null}
          <Text style={[styles.afirmTexto, styles.centrado]}>{afirmTexto}</Text>
          <PieTarjeta cta={afirmCta} />
        </Tarjeta>

        {/* Código sagrado */}
        <Tarjeta acento={suitColor.oros} onPress={() => router.push('/codigos')}>
          <View style={styles.cardTop}>
            <Emblem name="oros" size={24} glow="rgba(236,200,116,.5)" />
            <View style={{ flex: 1 }}>
              <Kicker style={{ letterSpacing: 1.8 } as never}>Código sagrado · Semanal</Kicker>
            </View>
            <Pildora
              bloqueado={codLock > 0}
              label={codLock > 0 ? `Nuevo en ${fmtCorto(codLock)}` : 'Disponible'}
            />
          </View>
          {codNum ? (
            /*
              Bloque centrado y en el orden en que se lee: para qué es, el
              número, y qué hace. Antes iba el número primero, alineado a la
              izquierda y con la categoría debajo en pequeño — el dato grande
              aparecía sin que nada dijera de qué era.
            */
            <View style={styles.codigoBloque}>
              <Text style={styles.codCat}>{codCat}</Text>
              <Text style={styles.codNum}>{codNum}</Text>
              <Text style={[styles.cardBody, styles.codProposito]}>{codDesc}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.cardTitulo}>Aún no has activado un código</Text>
              <Text style={styles.cardBody}>
                Un número sagrado para repetir toda la semana.
              </Text>
            </>
          )}
          <PieTarjeta cta={codNum && codLock > 0 ? 'Ver mi código' : 'Activar un código'} />
        </Tarjeta>

        {/* Oráculo del día */}
        <Tarjeta acento={color.lavender} onPress={() => router.push('/oraculo')}>
          <View style={styles.cardTop}>
            <Emblem name="bastos" size={24} glow="rgba(205,189,242,.5)" />
            <View style={{ flex: 1 }}>
              <Kicker style={{ letterSpacing: 1.8 } as never}>Oráculo del día · 24 h</Kicker>
            </View>
            <Pildora
              bloqueado={oraLock > 0}
              label={oraLock > 0 ? `Nuevo en ${fmtCorto(oraLock)}` : 'Disponible'}
            />
          </View>
          <Text style={styles.cardTitulo}>{oraTitulo}</Text>
          {oraBody ? <Text style={styles.cardBody}>{oraBody}</Text> : null}
          <PieTarjeta cta={oraCta} />
        </Tarjeta>

        {/* La Baraja — consulta, no lectura: por eso va la última y sin píldora */}
        <Tarjeta
          acento={suitColor.espadas}
          onPress={() => router.push('/baraja')}
          style={styles.fila}
        >
          <Emblem name="espadas" size={40} glow="rgba(141,176,236,.5)" />
          <View style={{ flex: 1 }}>
            {/* Sin el `marginTop` de `cardTitulo`: aquí no hay cabecera encima
                de la que separarse, va en fila junto al emblema. */}
            <Text style={[styles.cardTitulo, { marginTop: 0 }]}>La Baraja</Text>
            <Text style={styles.filaSub}>Los significados de las 40 cartas</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Tarjeta>
      </View>

      <Text style={styles.pie}>Nuevas lecturas llegarán con las próximas lunas ✦</Text>
      <EnlaceTenue
        onPress={() => {
          // Todo a cero: temporizadores vencidos, secciones disponibles y nada
          // guardado. El aviso es el que llegaría al abrirse las lecturas.
          restablecerLecturas();
          void avisarAhora('✨ Tus lecturas están disponibles. Ven a recibirlas.');
          mostrarToast('✨ Todo restablecido');
        }}
      >
        Restablecer lecturas (demo)
      </EnlaceTenue>

      <Toast mensaje={toast} />
    </Screen>
  );
}

/**
 * Acceso al perfil: silueta de persona dibujada con dos círculos, para no
 * meter una familia de iconos entera por una sola figura.
 */
function BotonPerfil({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Mi perfil"
      hitSlop={10}
      style={({ pressed }) => [styles.botonPerfil, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.perfilCabeza} />
      <View style={styles.perfilCuerpo} />
    </Pressable>
  );
}

/** Tarjeta del día de mayor vibración. Sin temporizador, por diseño. */
function TarjetaVibra({ vibra }: { vibra: VibraDia }) {
  return (
    <View style={styles.vibraCard}>
      {/*
        El halo va detrás del círculo y centrado en él.

        Antes medía 190 px y colgaba de la esquina (`left: -40, top: -50`), así
        que el resplandor iluminaba media tarjeta y no el símbolo: se leía como
        una mancha de fondo, no como el brillo del emblema. Ahora es un círculo
        de 104 centrado sobre el de 46, así que sobresale ~29 px por cada lado y
        se ve como lo que es.

        Las cuentas: el círculo empieza en `padding` (16) y mide 46, o sea que su
        centro cae en 16 + 23 = 39. El halo se coloca restando su radio a ese
        centro — 39 − 52 = −13 — para que los dos centros coincidan. Como el
        bloque va centrado, el `left` se calcula sobre el círculo real en tiempo
        de render, no aquí; por eso el halo vive dentro del propio grupo.
      */}
      <View style={styles.vibraCentro}>
        <View style={styles.vibraEmblema}>
          <Halo
            size={104}
            color={vibra.color}
            opacity={0.22}
            style={styles.vibraHalo}
          />
          <View
            style={[
              styles.vibraCirculo,
              { borderColor: `${vibra.color}88`, shadowColor: vibra.color },
            ]}
          >
            <Text style={[styles.vibraSimbolo, { color: vibra.color }]}>{vibra.simbolo}</Text>
          </View>
        </View>

        <Kicker style={styles.vibraKicker as never}>Tu día más alto de la semana</Kicker>

        {/*
          El día y lo que significa, en la misma línea. Antes iban en dos
          renglones y el significado quedaba como un subtítulo suelto; juntos se
          leen como una sola frase y liberan el alto que necesita el mensaje.

          `flexWrap` porque hay significados largos: si no caben, el segundo baja
          entero en vez de partirse por la mitad.
        */}
        <View style={styles.vibraLinea}>
          <Text style={styles.vibraDia}>{vibra.dia}</Text>
          <Text style={[styles.vibraTitulo, { color: vibra.color }]}>
            · {vibra.titulo}
          </Text>
        </View>

        <Text style={styles.vibraMsg}>“{vibra.msg}”</Text>
      </View>

      <Text style={styles.vibraPlaneta}>{vibra.planeta}</Text>
    </View>
  );
}

function PieTarjeta({ cta }: { cta: string }) {
  return (
    <View style={styles.cardPie}>
      <Text style={styles.cardCta}>{cta}</Text>
      <Text style={styles.chevronPeq}>›</Text>
    </View>
  );
}

/**
 * Sorteo del día. Vive fuera del componente para no ejecutarse en el render.
 *
 * Lee el contenido con `getContenido()` y no con el hook porque esto no es un
 * componente: aquí no hay dónde suscribirse.
 */
function sortearVibra(): number {
  return Math.floor(Math.random() * getContenido().VIBRA_DIAS.length);
}

/**
 * Elige el día de mayor vibración: uno al azar, fijo durante toda la semana.
 * La llave es la fecha del lunes, así que se renueva solo al cambiar de semana.
 */
function useVibraDelDia(s: State): VibraDia {
  const { VIBRA_DIAS } = useContenido();
  const week = semanaKey();
  const vigente = s.vibra?.week === week ? s.vibra.idx : null;
  // Se sortea una vez por montaje; solo se usa si aún no hay un día de esta semana.
  const [sorteado, setSorteado] = useState(sortearVibra);

  /*
   * "Restablecer lecturas (demo)" no cambiaba el día, y parecía que no borraba
   * nada.
   *
   * Sí lo borraba: `restablecerLecturas()` pone `vibra: null`. El problema
   * estaba aquí. `sorteado` se calcula UNA vez, al montar la pantalla, y al
   * quedarse el estado sin día se reutilizaba ese mismo número — así que se
   * volvía a persistir exactamente el día que ya estaba. Desde fuera:
   * restablecer no hacía nada.
   *
   * Con esto, pasar de "tengo día" a "no tengo día" fuerza un sorteo nuevo. El
   * `ref` guarda si lo había en el render anterior; sin él no se distingue un
   * restablecimiento de un primer arranque, y en el primer arranque hay que
   * respetar el sorteo del montaje para no cambiar el día dos veces seguidas.
   */
  const habiaDia = useRef(vigente !== null);

  useEffect(() => {
    if (vigente !== null) {
      habiaDia.current = true;
      return;
    }
    const nuevo = habiaDia.current ? sortearVibra() : sorteado;
    habiaDia.current = false;
    if (nuevo !== sorteado) setSorteado(nuevo);
    // El sorteo se persiste para que el día no cambie al reabrir la app.
    setState({ vibra: { week, idx: nuevo } });
  }, [vigente, week, sorteado]);

  return VIBRA_DIAS[vigente ?? sorteado] ?? VIBRA_DIAS[0];
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 4 },
  marca: {
    fontFamily: font.sansSemi,
    ...text.micro,
    letterSpacing: 2.8,
    textTransform: 'uppercase',
    color: lavenderDim(0.7),
  },
  titulo: {
    fontFamily: font.serif,
    ...text.display,
    color: color.gold,
    marginTop: 2,
  },
  fecha: {
    fontFamily: font.sans,
    ...text.menor,
    color: lavenderDim(0.62),
    marginTop: 3,
  },

  // Silueta de persona: círculo arriba, medio círculo abajo.
  botonPerfil: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: goldDim(0.45),
    backgroundColor: 'rgba(21,13,52,.5)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  perfilCabeza: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: goldDim(0.85),
    marginTop: 9,
  },
  perfilCuerpo: {
    width: 22,
    height: 22,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    backgroundColor: goldDim(0.85),
    marginTop: 3,
  },

  /*
   * La pila de tarjetas. Una sola columna, todas al mismo ancho.
   *
   * La separación va aquí, en el `gap`, y no en el `marginTop` de cada tarjeta:
   * así reordenarlas o meter una nueva no descuadra nada, y no hay forma de que
   * dos tarjetas acaben con distinta distancia entre sí.
   */
  pila: { marginTop: 18, gap: 12 },

  /**
   * Cabecera común de todas las tarjetas: emblema, kicker y píldora.
   *
   * El kicker va en medio con `flex: 1`, así que la píldora queda siempre
   * pegada a la derecha sin importar lo largo que sea el rótulo. Antes esto era
   * `space-between` con el kicker en su propia línea debajo, que con las
   * tarjetas anchas dejaba un hueco raro entre el emblema y la píldora.
   */
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitulo: {
    fontFamily: font.serif,
    ...text.titulo,
    color: color.cream,
    marginTop: 11,
  },
  /** Para los textos que van centrados dentro de su tarjeta. */
  centrado: { textAlign: 'center' },
  cardBody: {
    fontFamily: font.sans,
    // Dos escalones desde donde estaba. En la rejilla estrecha iba en `menor`
    // porque no cabía otra cosa; a todo el ancho pasó a `cuerpo`, y ahora a
    // `guia` (19 px), que es lo que hace legible el texto de las tarjetas sin
    // tener que acercarse el teléfono. Lo comparten Cruz, Código y Oráculo.
    ...text.guia,
    color: lavenderDim(0.82),
    marginTop: 6,
  },
  cardPie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: lavenderDim(0.16),
  },
  cardCta: { fontFamily: font.sansSemi, ...text.menor, color: goldDim(0.92) },
  chevronPeq: { fontFamily: font.serif, fontSize: fs(20), color: goldDim(0.7) },
  chevron: { fontFamily: font.serif, fontSize: fs(24), color: goldDim(0.7) },

  // Día de vibración
  vibraCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: goldDim(0.45),
    backgroundColor: '#1d1442',
    // Igual que `tarjeta` en `ui.tsx`: sube a 16 para acompañar a la letra.
    padding: 16,
    overflow: 'hidden',
  },
  vibraCirculo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    backgroundColor: 'rgba(10,7,32,.5)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.35,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 0 },
  },
  vibraSimbolo: { fontFamily: font.serif, fontSize: fs(26), lineHeight: fs(30) },

  // Todo el bloque centrado: es la tarjeta del día, no tiene estado ni acción,
  // y centrada se lee como una portada en vez de como una ficha más.
  vibraCentro: { alignItems: 'center' },
  // Caja del emblema: sirve de ancla para centrar el halo detrás del círculo.
  vibraEmblema: { alignItems: 'center', justifyContent: 'center' },
  vibraHalo: { position: 'absolute' },
  vibraKicker: { letterSpacing: 1.8, marginTop: 12, textAlign: 'center' },
  // El día y su significado, en una línea. `wrap` para los significados largos.
  vibraLinea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
  },
  vibraDia: {
    fontFamily: font.serifBold,
    ...text.titulo,
    color: color.gold,
  },
  vibraTitulo: {
    fontFamily: font.sansBold,
    // Sube de `micro` a `menor`: ya no es un subtítulo debajo del día, va a su
    // lado y tiene que sostenerse junto a él.
    ...text.menor,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  vibraMsg: {
    fontFamily: font.serifItalic,
    // La frase es lo que se viene a leer aquí, así que va al mismo escalón que
    // los títulos de las demás tarjetas: `cuerpo` → `guia` → `titulo`.
    ...text.titulo,
    color: creamDim(0.9),
    marginTop: 10,
    textAlign: 'center',
  },
  vibraPlaneta: {
    fontFamily: font.sansSemi,
    ...text.micro,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: lavenderDim(0.6),
    marginTop: 10,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: lavenderDim(0.16),
  },

  // Afirmación
  // La afirmación es lo que se viene a leer: sube a `titulo` (24 px), el mismo
  // escalón que los títulos de las demás tarjetas. Sigue en cursiva porque es
  // una cita, no un rótulo.
  afirmTexto: {
    fontFamily: font.serifItalicBold,
    ...text.titulo,
    color: color.cream,
    marginTop: 6,
  },
  // Encabezado del tipo de afirmación, ahora POR ENCIMA de la cita.
  afirmNombre: {
    fontFamily: font.sansSemi,
    ...text.menor,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(231,154,180,.9)',
    marginTop: 11,
  },

  // Código
  // Categoría, número y propósito como un solo bloque centrado.
  codigoBloque: { alignItems: 'center', marginTop: 11 },
  codNum: {
    fontFamily: font.serifBold,
    fontSize: fs(36),
    letterSpacing: 2.8,
    lineHeight: fs(44),
    color: suitColor.oros,
    marginTop: 4,
    textAlign: 'center',
  },
  codCat: {
    fontFamily: font.sansSemi,
    ...text.menor,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(236,200,116,.85)',
    textAlign: 'center',
  },
  // El propósito, centrado bajo el número y sin el margen de `cardBody`.
  codProposito: { marginTop: 4, textAlign: 'center' },

  // Cruz de Vida
  // Va justo bajo la cabecera, así que abre el bloque con más aire que la rejilla.
  // El borde dorado es lo único que la distingue: es la lectura mayor. El resto
  // de medidas ya las da `tarjeta` y la separación la da `pila`.
  cruz: { paddingTop: 18, borderColor: goldDim(0.35) },

  // Filas inferiores (Baraja, guardados)
  // La Baraja va en fila —emblema, texto, "›"— y no en bloque como las demás:
  // no tiene estado que mostrar, solo lleva a un sitio.
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  filaSub: {
    fontFamily: font.sans,
    ...text.menor,
    color: lavenderDim(0.7),
    marginTop: 3,
  },

  pie: {
    textAlign: 'center',
    fontFamily: font.sans,
    ...text.menor,
    color: lavenderDim(0.5),
    marginTop: 24,
  },
});
