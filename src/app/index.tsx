/**
 * Mi Camino — menú principal.
 *
 * Tablero de estado y navegación: día de mayor vibración, afirmación, código
 * sagrado, oráculo, Cruz de Vida y la baraja, con sus temporizadores visibles.
 * No hay barra de pestañas; todo se abre tocando las tarjetas.
 *
 * Diferencia respecto al prototipo: no incluye el paywall de lecturas
 * adicionales — la Cruz de Vida ofrece una lectura gratis al mes y nada más.
 */
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
import { VIBRA_DIAS } from '@/data/vibra';
import {
  guardadosDe,
  restablecerLecturas,
  semanaKey,
  setState,
  ultimoGuardado,
  useStore,
  type State,
} from '@/lib/store';
import { fechaCorta, fechaHoy, fmtCorto, recortar, useTick } from '@/lib/time';
import {
  color,
  creamDim,
  font,
  goldDim,
  lavenderDim,
  radius,
  suitColor,
} from '@/theme/tokens';

export default function MiCamino() {
  const router = useRouter();
  const s = useStore();
  const now = useTick(true);
  const [toast, setToast] = useState<string | null>(null);

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
    const larga = afirmGuardada.texto.length > 150;
    afirmTexto = `“${larga ? recortar(afirmGuardada.texto, 120) : afirmGuardada.texto}”`;
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
  const codDesc = codGuardado ? recortar(codGuardado.proposito, 95) : '';

  // — Oráculo (nunca muestra el contenido de la lectura desde aquí) —
  let oraTitulo = 'Aún no has pedido tu oráculo';
  let oraBody = 'Tres mensajes que tu alma necesita, cada 24 horas.';
  let oraCta = oraLock > 0 ? 'Ver el oráculo' : 'Recibir mi oráculo';
  if (oraGuardados.length > 0) {
    // Del Oráculo solo se conserva la última lectura guardada.
    oraTitulo = 'Tu oráculo guardado te espera';
    oraBody = `${oraGuardados[0].oraculo} · Toca para volver a leerlo.`;
    oraCta = 'Ver mi oráculo guardado';
  }

  // — Cruz de Vida: una lectura gratis al mes —
  const usadas = s.cruzMes?.usadas ?? 0;
  const cruzDisponible = usadas < 1;
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
          <Text style={styles.titulo}>Mi Camino</Text>
        </View>
        <Text style={styles.fecha}>{fechaHoy(now)}</Text>
      </View>

      {/* Rejilla 2×2 */}
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <TarjetaVibra vibra={vibra} />

          <Tarjeta
            acento={suitColor.copas}
            onPress={() => router.push('/afirmaciones')}
            style={styles.gridCell}
          >
            <View style={styles.cardTop}>
              <Emblem name="copas" size={22} glow="rgba(231,154,180,.5)" />
              <Pildora
                compacta
                bloqueado={afirmLock > 0}
                label={afirmLock > 0 ? `Nueva en ${fmtCorto(afirmLock)}` : 'Disponible'}
              />
            </View>
            <Kicker style={styles.kickerTop}>Afirmación</Kicker>
            <Text style={styles.afirmTexto}>{afirmTexto}</Text>
            {afirmNombre ? <Text style={styles.afirmNombre}>{afirmNombre}</Text> : null}
            <View style={{ flex: 1 }} />
            <PieTarjeta cta={afirmCta} />
          </Tarjeta>
        </View>

        <View style={styles.gridRow}>
          <Tarjeta
            acento={suitColor.oros}
            onPress={() => router.push('/codigos')}
            style={styles.gridCell}
          >
            <View style={styles.cardTop}>
              <Emblem name="oros" size={22} glow="rgba(236,200,116,.5)" />
              <Pildora
                compacta
                bloqueado={codLock > 0}
                label={codLock > 0 ? `Nuevo en ${fmtCorto(codLock)}` : 'Disponible'}
              />
            </View>
            <Kicker style={styles.kickerTop}>Código sagrado</Kicker>
            {codNum ? (
              <>
                <Text style={styles.codNum}>{codNum}</Text>
                <Text style={styles.codCat}>{codCat}</Text>
                <Text style={styles.cardBody}>{codDesc}</Text>
              </>
            ) : (
              <>
                <Text style={styles.cardTitulo}>Aún no has activado un código</Text>
                <Text style={styles.cardBody}>
                  Un número sagrado para repetir toda la semana.
                </Text>
              </>
            )}
            <View style={{ flex: 1 }} />
            <PieTarjeta cta={codNum && codLock > 0 ? 'Ver mi código' : 'Activar un código'} />
          </Tarjeta>

          <Tarjeta
            acento={color.lavender}
            onPress={() => router.push('/oraculo')}
            style={styles.gridCell}
          >
            <View style={styles.cardTop}>
              <Emblem name="bastos" size={22} glow="rgba(205,189,242,.5)" />
              <Pildora
                compacta
                bloqueado={oraLock > 0}
                label={oraLock > 0 ? `Nuevo en ${fmtCorto(oraLock)}` : 'Disponible'}
              />
            </View>
            <Kicker style={styles.kickerTop}>Oráculo del día</Kicker>
            <Text style={styles.cardTitulo}>{oraTitulo}</Text>
            <Text style={styles.cardBody}>{oraBody}</Text>
            <View style={{ flex: 1 }} />
            <PieTarjeta cta={oraCta} />
          </Tarjeta>
        </View>
      </View>

      {/* Cruz de Vida */}
      <Tarjeta acento={suitColor.copas} style={styles.cruz}>
        <View style={styles.cruzTop}>
          <Emblem name="copas" size={24} glow="rgba(231,154,180,.5)" />
          <View style={{ flex: 1 }}>
            <Kicker style={{ letterSpacing: 1.8 } as never}>Cruz de Vida · Mensual</Kicker>
          </View>
          <Pildora
            compacta
            bloqueado={!cruzDisponible}
            label={
              cruzDisponible
                ? 'Disponible'
                : cruzNextMs > 0
                  ? `Gratis en ${fmtCorto(cruzNextMs)}`
                  : 'Sin lecturas'
            }
          />
        </View>
        <Text style={styles.cruzTitulo}>
          {cruzGuardadas.length > 0
            ? 'Tienes lecturas guardadas'
            : 'Aún no tienes lecturas guardadas'}
        </Text>
        <Text style={styles.cruzBody}>
          {cruzGuardadas.length > 0
            ? `${cruzGuardadas.length} ${
                cruzGuardadas.length === 1 ? 'lectura' : 'lecturas'
              } · La última, del ${fechaCorta(cruzGuardadas[0].fecha)}`
            : 'Haz tu pregunta y deja que la cruz te responda.'}
        </Text>
        <BotonPrimario alto={44} onPress={() => router.push('/cruz')} style={{ marginTop: 14 }}>
          {cruzGuardadas.length > 0 ? 'Ver resultados anteriores' : 'Ir a la Cruz'}
        </BotonPrimario>
        <Text style={styles.cruzUso}>
          {usadas} de 1 lectura usada este mes · Una lectura gratis cada mes
        </Text>
      </Tarjeta>

      {/* La Baraja */}
      <Tarjeta
        acento={suitColor.espadas}
        onPress={() => router.push('/baraja')}
        style={styles.fila}
      >
        <Emblem name="espadas" size={40} glow="rgba(141,176,236,.5)" />
        <View style={{ flex: 1 }}>
          <Text style={styles.filaTitulo}>La Baraja</Text>
          <Text style={styles.filaSub}>
            Los significados de las 40 cartas · Siempre disponible
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Tarjeta>

      <Text style={styles.pie}>Nuevos rituales llegarán con las próximas lunas ✦</Text>
      <EnlaceTenue
        onPress={() => {
          restablecerLecturas();
          mostrarToast('✨ Lecturas restablecidas');
        }}
      >
        Restablecer lecturas (demo)
      </EnlaceTenue>

      <Toast mensaje={toast} />
    </Screen>
  );
}

/** Tarjeta del día de mayor vibración. Sin temporizador, por diseño. */
function TarjetaVibra({ vibra }: { vibra: (typeof VIBRA_DIAS)[number] }) {
  return (
    <View style={[styles.gridCell, styles.vibraCard]}>
      <Halo
        size={190}
        color={vibra.color}
        opacity={0.18}
        style={{ position: 'absolute', left: -40, top: -50 }}
      />
      <View style={styles.cardTop}>
        <View
          style={[
            styles.vibraCirculo,
            { borderColor: `${vibra.color}88`, shadowColor: vibra.color },
          ]}
        >
          <Text style={[styles.vibraSimbolo, { color: vibra.color }]}>{vibra.simbolo}</Text>
        </View>
        <Text style={styles.vibraEtiqueta}>{'Tu día más alto\nesta semana'}</Text>
      </View>
      <Text style={styles.vibraDia}>{vibra.dia}</Text>
      <Text style={[styles.vibraTitulo, { color: vibra.color }]}>{vibra.titulo}</Text>
      <Text style={styles.vibraMsg}>“{vibra.msg}”</Text>
      <View style={{ flex: 1 }} />
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

/** Sorteo del día. Vive fuera del componente para no ejecutarse en el render. */
function sortearVibra(): number {
  return Math.floor(Math.random() * VIBRA_DIAS.length);
}

/**
 * Elige el día de mayor vibración: uno al azar, fijo durante toda la semana.
 * La llave es la fecha del lunes, así que se renueva solo al cambiar de semana.
 */
function useVibraDelDia(s: State): (typeof VIBRA_DIAS)[number] {
  const week = semanaKey();
  const vigente = s.vibra?.week === week ? s.vibra.idx : null;
  // Se sortea una vez por montaje; solo se usa si aún no hay un día de esta semana.
  const [sorteado] = useState(sortearVibra);
  const idx = vigente ?? sorteado;

  useEffect(() => {
    // El sorteo se persiste para que el día no cambie al reabrir la app.
    if (vigente === null) setState({ vibra: { week, idx } });
  }, [vigente, week, idx]);

  return VIBRA_DIAS[idx] ?? VIBRA_DIAS[0];
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 4 },
  marca: {
    fontFamily: font.sansSemi,
    fontSize: 10.5,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    color: lavenderDim(0.6),
  },
  titulo: {
    fontFamily: font.serif,
    fontSize: 32,
    lineHeight: 36,
    color: color.gold,
    marginTop: 2,
  },
  fecha: {
    fontFamily: font.sans,
    fontSize: 11,
    color: lavenderDim(0.55),
    textAlign: 'right',
    maxWidth: 92,
  },

  grid: { marginTop: 22, gap: 12 },
  gridRow: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  gridCell: { flex: 1, minHeight: 196 },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  kickerTop: { marginTop: 9 },
  cardTitulo: {
    fontFamily: font.serif,
    fontSize: 17,
    lineHeight: 22,
    color: color.cream,
    marginTop: 7,
  },
  cardBody: {
    fontFamily: font.sans,
    fontSize: 11.5,
    lineHeight: 17,
    color: lavenderDim(0.75),
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
  cardCta: { fontFamily: font.sansSemi, fontSize: 11.5, color: goldDim(0.9) },
  chevronPeq: { fontFamily: font.serif, fontSize: 20, color: goldDim(0.7) },
  chevron: { fontFamily: font.serif, fontSize: 24, color: goldDim(0.7) },

  // Día de vibración
  vibraCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: goldDim(0.45),
    backgroundColor: '#1d1442',
    padding: 14,
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
  vibraSimbolo: { fontFamily: font.serif, fontSize: 26, lineHeight: 30 },
  vibraEtiqueta: {
    fontFamily: font.sansSemi,
    fontSize: 9.5,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: lavenderDim(0.55),
    textAlign: 'right',
    lineHeight: 13,
  },
  vibraDia: {
    fontFamily: font.serifBold,
    fontSize: 28,
    lineHeight: 30,
    color: color.gold,
    marginTop: 10,
  },
  vibraTitulo: {
    fontFamily: font.sansBold,
    fontSize: 9.5,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  vibraMsg: {
    fontFamily: font.serifItalic,
    fontSize: 14.5,
    lineHeight: 20,
    color: creamDim(0.9),
    marginTop: 8,
  },
  vibraPlaneta: {
    fontFamily: font.sansSemi,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: lavenderDim(0.5),
    marginTop: 10,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: lavenderDim(0.16),
  },

  // Afirmación
  afirmTexto: {
    fontFamily: font.serifItalicBold,
    fontSize: 16.5,
    lineHeight: 22,
    color: color.cream,
    marginTop: 7,
  },
  afirmNombre: {
    fontFamily: font.sansSemi,
    fontSize: 10.5,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(231,154,180,.85)',
    marginTop: 6,
  },

  // Código
  codNum: {
    fontFamily: font.serifBold,
    fontSize: 36,
    letterSpacing: 2.8,
    lineHeight: 40,
    color: suitColor.oros,
    marginTop: 6,
  },
  codCat: {
    fontFamily: font.sansSemi,
    fontSize: 10.5,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(236,200,116,.8)',
    marginTop: 2,
  },

  // Cruz de Vida
  cruz: { marginTop: 12, padding: 16, paddingTop: 18, borderColor: goldDim(0.35) },
  cruzTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cruzTitulo: {
    fontFamily: font.serif,
    fontSize: 22,
    lineHeight: 26,
    color: color.cream,
    marginTop: 11,
  },
  cruzBody: {
    fontFamily: font.sans,
    fontSize: 12.5,
    lineHeight: 19,
    color: lavenderDim(0.75),
    marginTop: 5,
  },
  cruzUso: {
    fontFamily: font.sans,
    fontSize: 11,
    color: lavenderDim(0.5),
    marginTop: 10,
    textAlign: 'center',
  },

  // Filas inferiores (Baraja, guardados)
  fila: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 16,
  },
  filaTitulo: {
    fontFamily: font.serif,
    fontSize: 21,
    lineHeight: 24,
    color: color.cream,
  },
  filaSub: {
    fontFamily: font.sans,
    fontSize: 12,
    color: lavenderDim(0.68),
    marginTop: 3,
  },

  pie: {
    textAlign: 'center',
    fontFamily: font.sans,
    fontSize: 11.5,
    color: lavenderDim(0.45),
    marginTop: 24,
  },
});
