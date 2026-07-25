/**
 * Oráculo del día — cada 24 horas.
 *
 * Flujo: elegir oráculo → barajado → abanico de 12 cartas del que se eligen 3 →
 * revelación con volteo 3D escalonado (750 ms entre cartas) → bloqueo de 24 h.
 */
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AbanicoOraculo } from '@/components/AbanicoOraculo';
import { AvisoNotificacion } from '@/components/AvisoNotificacion';
import { Barajado } from '@/components/Barajado';
import { Emblem } from '@/components/Emblem';
import { PulsoBrillo, PulsoOpacidad } from '@/components/PulsoBrillo';
import { Header, Screen } from '@/components/Screen';
import { Volteo } from '@/components/Volteo';
import {
  BotonGuardar,
  BotonPrimario,
  BotonSecundario,
  EnlaceTenue,
  Pildora,
  Toast,
} from '@/components/ui';
import { ORACULOS, type Oraculo } from '@/data/oraculo';
import {
  borrarGuardadosDe,
  DIA_MS,
  guardadoDesde,
  guardadosDe,
  guardar,
  setState,
  useStore,
  type GuardadoOraculo,
} from '@/lib/store';
import { fechaCorta, fmtLargo, useTick } from '@/lib/time';
import {
  cardBorder,
  color,
  creamDim,
  font,
  goldDim,
  lavenderDim,
  radius,
} from '@/theme/tokens';

type Paso = 'elegir' | 'barajar' | 'abanico' | 'revelar' | 'bloqueado';

export default function OraculoDelDia() {
  const router = useRouter();
  const s = useStore();
  const [paso, setPaso] = useState<Paso>(() =>
    s.oraculoLock > Date.now() ? 'bloqueado' : 'elegir',
  );
  const [oraculoKey, setOraculoKey] = useState<string | null>(null);
  const [elegidas, setElegidas] = useState<number[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const [volteadas, setVolteadas] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // El reloj corre también en la lista, para que el guardado desaparezca en vivo
  // en cuanto su temporizador llegue a 0.
  const now = useTick(paso === 'bloqueado' || paso === 'elegir');
  const restante = Math.max(0, s.oraculoLock - now);

  useEffect(() => {
    const pendientes = timers.current;
    return () => pendientes.forEach(clearTimeout);
  }, []);

  const oraculo = ORACULOS.find((o) => o.key === oraculoKey) ?? null;

  function elegirOraculo(o: Oraculo) {
    setOraculoKey(o.key);
    setElegidas([]);
    setVolteadas(0);
    setPaso('barajar');
    timers.current.push(setTimeout(() => setPaso('abanico'), 2400));
  }

  function alternarCarta(i: number) {
    setElegidas((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i);
      return prev.length < 3 ? [...prev, i] : prev;
    });
  }

  function revelar() {
    if (elegidas.length !== 3 || !oraculo) return;

    // Las cartas del abanico son un gesto: los tres mensajes se sortean del mazo.
    const pool = oraculo.cartas.map((c) => c.id);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const elegidos = pool.slice(0, 3);

    setIds(elegidos);
    setVolteadas(0);
    setState({
      oraculoLock: Date.now() + DIA_MS,
      oraculoLast: { key: oraculo.key, ids: elegidos, fecha: Date.now() },
    });
    setPaso('revelar');

    [0, 1, 2].forEach((i) => {
      timers.current.push(setTimeout(() => setVolteadas(i + 1), 500 + i * 750));
    });
  }

  function volver() {
    if (paso === 'elegir' || paso === 'bloqueado') {
      router.back();
      return;
    }
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (s.oraculoLock > Date.now()) setPaso('bloqueado');
    else {
      setPaso('elegir');
      setOraculoKey(null);
      setElegidas([]);
    }
  }

  function mostrarToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(null), 2200);
  }

  // Solo se conserva lo que el usuario decidió guardar.
  const guardados = guardadosDe(s, 'oraculo', now);
  /**
   * Una entrega se guarda una sola vez: se compara contra la fecha de la lectura
   * en curso, así que al renovarse el temporizador el botón vuelve a activarse.
   */
  const yaGuardado = guardadoDesde(s, 'oraculo', s.oraculoLast?.fecha ?? Infinity);

  return (
    <Screen scroll={paso !== 'barajar'}>
      <Header
        kicker="Cada 24 horas"
        titulo="Oráculo del día"
        onBack={volver}
        right={
          <Pildora
            bloqueado={paso === 'bloqueado'}
            label={paso === 'bloqueado' ? 'Bloqueado' : 'Disponible'}
          />
        }
      />

      {paso === 'elegir' && (
        <>
          <Text style={styles.intro}>
            ¿Qué necesita tu alma hoy? Elige tu oráculo: barajaremos sus cartas y tres
            mensajes llegarán a ti.
          </Text>
          <View style={styles.lista}>
            {ORACULOS.map((o) => (
              <Pressable
                key={o.key}
                onPress={() => elegirOraculo(o)}
                accessibilityRole="button"
                accessibilityLabel={`${o.nombre}. ${o.sub}`}
                style={({ pressed }) => [
                  styles.filaOraculo,
                  { borderLeftColor: o.color, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Emblem name={o.palo} size={42} glow={`${o.color}88`} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.filaNombre}>{o.nombre}</Text>
                  <Text style={styles.filaSub}>{o.sub}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.pie}>Más oráculos llegarán con las próximas lunas ✦</Text>
          <ResultadosAnteriores guardados={guardados} />
        </>
      )}

      {paso === 'barajar' && (
        <View style={styles.centro}>
          <Text style={styles.oraculoNombre}>{oraculo?.nombre}</Text>
          <View style={{ marginTop: 30 }}>
            <Barajado palo={oraculo?.palo ?? 'oros'} />
          </View>
          <PulsoOpacidad style={{ marginTop: 34 }}>
            <Text style={styles.barajando}>Barajando las cartas…</Text>
          </PulsoOpacidad>
          <Text style={styles.barajandoSub}>
            Respira. El universo ya está moviendo las piezas.
          </Text>
        </View>
      )}

      {paso === 'abanico' && oraculo && (
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={styles.kickerOraculo}>{oraculo.nombre}</Text>
          <Text style={styles.tituloGrande}>Elige 3 cartas</Text>
          <Text style={styles.subAbanico}>
            {'Déjate guiar por tu intuición.\n'}
            {elegidas.length === 0
              ? 'Toca las cartas que te llamen.'
              : `${elegidas.length} de 3 elegidas`}
          </Text>

          <View style={{ marginTop: 30 }}>
            <AbanicoOraculo
              palo={oraculo.palo}
              elegidas={elegidas}
              onToggle={alternarCarta}
            />
          </View>

          <View style={{ flex: 1, minHeight: 16 }} />
          <BotonPrimario
            disabled={elegidas.length !== 3}
            onPress={revelar}
            style={{ marginTop: 20 }}
          >
            Revelar mis mensajes
          </BotonPrimario>
        </View>
      )}

      {paso === 'revelar' && oraculo && (
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={styles.kickerOraculo}>{oraculo.nombre}</Text>
          <Text style={[styles.tituloGrande, { color: color.gold }]}>
            Tus tres mensajes
          </Text>

          <View style={{ width: '100%', gap: 14, marginTop: 20 }}>
            {ids.map((id, i) => {
              const carta = oraculo.cartas.find((c) => c.id === id);
              if (!carta) return null;
              return (
                <Volteo
                  key={id}
                  volteada={volteadas > i}
                  style={{ width: '100%', minHeight: 128 }}
                  frente={
                    <MensajeOraculo
                      oraculo={oraculo}
                      indice={i}
                      titulo={carta.titulo}
                      claves={carta.claves}
                      mensaje={carta.mensaje}
                    />
                  }
                  dorso={
                    <View style={styles.dorsoMensaje}>
                      <Emblem name={oraculo.palo} size={52} />
                    </View>
                  }
                />
              );
            })}
          </View>

          <Text style={styles.proxima}>
            Tu próximo oráculo se abrirá cuando la energía se renueve, en 24 horas.
          </Text>

          {/* Guardar es lo único que conserva la lectura: si no, se pierde. */}
          <Text style={styles.avisoGuardar}>
            Guárdalo para poder volver a leerlo. Si no lo guardas, no quedará
            registro.
          </Text>

          <BotonGuardar
            style={{ marginTop: 14 }}
            guardado={yaGuardado}
            etiquetaGuardado="Guardado en Mi Camino ✦"
            onPress={() => {
              guardar({
                tipo: 'oraculo',
                fecha: Date.now(),
                oraculo: oraculo.nombre,
                ids,
                // Vive lo que dure el temporizador de esta lectura.
                expira: s.oraculoLock,
              });
              mostrarToast('✨ Guardado en Mi Camino');
            }}
          >
            Guardar mi oráculo
          </BotonGuardar>
          <BotonSecundario style={{ marginTop: 12 }} onPress={() => router.back()}>
            Volver al inicio
          </BotonSecundario>
        </View>
      )}

      {paso === 'bloqueado' && (
        <View style={{ alignItems: 'center', flex: 1 }}>
          <PulsoBrillo style={{ marginTop: 40, borderRadius: 37 }}>
            <View style={styles.circuloBloqueo}>
              <Emblem name="oros" size={38} />
            </View>
          </PulsoBrillo>

          <Text style={styles.bloqueoTitulo}>La energía se está renovando</Text>
          <Text style={styles.cuentaAtras}>{fmtLargo(restante)}</Text>
          <Text style={styles.bloqueoSub}>
            {'Tu próximo mensaje estará listo entonces.\nVuelve cuando el cielo lo marque.'}
          </Text>

          <View style={{ width: '100%', marginTop: 30 }}>
            <AvisoNotificacion
              emblema="oros"
              cuando="mañana 9:00"
              mensaje="✨ Tu oráculo está listo. Un nuevo mensaje te espera."
              etiquetaToggle="Avisarme cada 24 horas"
              activo={s.notif.oraculo}
              onToggle={() =>
                setState((st) => ({
                  notif: { ...st.notif, oraculo: !st.notif.oraculo },
                }))
              }
            />
          </View>

          <ResultadosAnteriores guardados={guardados} />

          <View style={{ flex: 1, minHeight: 24 }} />
          <EnlaceTenue
            onPress={() => {
              // Deja la sección como recién estrenada: sin temporizador, sin
              // última lectura y sin nada guardado.
              setState({ oraculoLock: 0, oraculoLast: null });
              borrarGuardadosDe('oraculo');
              setPaso('elegir');
              setOraculoKey(null);
              setElegidas([]);
            }}
          >
            Restablecer (demo)
          </EnlaceTenue>
        </View>
      )}

      <Toast mensaje={toast} />
    </Screen>
  );
}

/**
 * El oráculo guardado. Solo se conserva el más reciente: cada lectura que se
 * guarda reemplaza a la anterior.
 */
function ResultadosAnteriores({
  guardados,
}: {
  guardados: GuardadoOraculo[];
}) {
  if (guardados.length === 0) return null;

  return (
    <View style={{ width: '100%', marginTop: 26 }}>
      <Text style={styles.ultimoKicker}>Tu oráculo guardado</Text>
      <View style={{ gap: 12, marginTop: 12 }}>
        {guardados.map((g) => {
          const oraculo = ORACULOS.find((o) => o.nombre === g.oraculo);
          return (
            <View key={g.fecha} style={styles.grupoGuardado}>
              <View style={styles.grupoCabecera}>
                <Text style={styles.grupoNombre}>{g.oraculo}</Text>
                <Text style={styles.grupoFecha}>{fechaCorta(g.fecha)}</Text>
              </View>
              <View style={{ gap: 8, marginTop: 8 }}>
                {g.ids.map((id) => {
                  const c = oraculo?.cartas.find((x) => x.id === id);
                  if (!c) return null;
                  return (
                    <View key={id} style={styles.ultimoItem}>
                      {c.titulo ? (
                        <Text style={styles.ultimoTitulo}>{c.titulo}</Text>
                      ) : null}
                      <Text style={styles.ultimoMensaje}>{c.mensaje}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/**
 * Tarjeta de mensaje. Crece con el contenido (`minHeight` en vez de alto fijo)
 * para que el texto nunca desborde, como exige el handoff.
 */
function MensajeOraculo({
  oraculo,
  indice,
  titulo,
  claves,
  mensaje,
}: {
  oraculo: Oraculo;
  indice: number;
  titulo?: string;
  claves?: string;
  mensaje: string;
}) {
  return (
    <View style={styles.mensaje}>
      <View style={styles.marcoMensaje} pointerEvents="none" />
      <View style={styles.mensajeFila}>
        <View style={{ marginTop: 4 }}>
          <Emblem name={oraculo.palo} size={34} glow={`${oraculo.color}88`} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.mensajeNum, { color: oraculo.color }]}>
            Mensaje {['I', 'II', 'III'][indice]}
          </Text>
          {titulo ? <Text style={styles.mensajeTitulo}>{titulo}</Text> : null}
          {claves ? <Text style={styles.mensajeClaves}>{claves}</Text> : null}
          <Text
            style={[
              styles.mensajeTexto,
              titulo
                ? { fontFamily: font.sans, fontSize: 13.5, lineHeight: 22 }
                : { fontFamily: font.serifItalic, fontSize: 19, lineHeight: 30 },
            ]}
          >
            {mensaje}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    textAlign: 'center',
    fontFamily: font.sans,
    fontSize: 14,
    lineHeight: 23,
    color: lavenderDim(0.78),
    maxWidth: 320,
    alignSelf: 'center',
    marginTop: 22,
  },
  lista: { gap: 12, marginTop: 22 },
  filaOraculo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 16,
    borderRadius: radius.cardSmall,
    borderWidth: 1,
    borderColor: cardBorder,
    borderLeftWidth: 3,
    backgroundColor: 'rgba(21,13,52,.5)',
  },
  filaNombre: {
    fontFamily: font.serif,
    fontSize: 21,
    lineHeight: 24,
    color: color.cream,
  },
  filaSub: {
    fontFamily: font.sans,
    fontSize: 12,
    lineHeight: 17,
    color: lavenderDim(0.65),
    marginTop: 3,
  },
  chevron: { fontFamily: font.serif, fontSize: 24, color: goldDim(0.7) },
  pie: {
    textAlign: 'center',
    fontFamily: font.sans,
    fontSize: 11.5,
    color: lavenderDim(0.45),
    marginTop: 18,
  },

  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  oraculoNombre: {
    fontFamily: font.serif,
    fontSize: 26,
    color: color.cream,
    textAlign: 'center',
  },
  barajando: { fontFamily: font.serifItalic, fontSize: 18, color: goldDim(0.9) },
  barajandoSub: {
    fontFamily: font.sans,
    fontSize: 12.5,
    color: lavenderDim(0.6),
    marginTop: 8,
  },

  kickerOraculo: {
    fontFamily: font.sansSemi,
    fontSize: 11,
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    color: lavenderDim(0.55),
    marginTop: 20,
    textAlign: 'center',
  },
  tituloGrande: {
    fontFamily: font.serif,
    fontSize: 30,
    color: color.cream,
    textAlign: 'center',
    marginTop: 4,
  },
  subAbanico: {
    fontFamily: font.sans,
    fontSize: 13,
    lineHeight: 20,
    color: lavenderDim(0.7),
    marginTop: 6,
    textAlign: 'center',
  },

  abanico: {
    width: '100%',
    maxWidth: 360,
    height: 250,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cartaAbanico: { position: 'absolute', bottom: 0 },

  mensaje: {
    width: '100%',
    minHeight: 128,
    borderRadius: radius.cardSmall,
    borderWidth: 1,
    borderColor: goldDim(0.55),
    backgroundColor: '#150d34',
    overflow: 'hidden',
  },
  marcoMensaje: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderWidth: 1,
    borderColor: goldDim(0.35),
    borderRadius: 12,
  },
  mensajeFila: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  mensajeNum: {
    fontFamily: font.sansBold,
    fontSize: 10,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  mensajeTitulo: {
    fontFamily: font.serif,
    fontSize: 21,
    lineHeight: 24,
    color: color.gold,
    marginTop: 2,
  },
  mensajeClaves: {
    fontFamily: font.sansSemi,
    fontSize: 10.5,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: lavenderDim(0.55),
    marginTop: 4,
  },
  mensajeTexto: { color: creamDim(0.92), marginTop: 7 },
  dorsoMensaje: {
    width: '100%',
    minHeight: 128,
    height: '100%',
    borderRadius: radius.cardSmall,
    borderWidth: 1,
    borderColor: goldDim(0.45),
    backgroundColor: '#150d34',
    alignItems: 'center',
    justifyContent: 'center',
  },

  proxima: {
    fontFamily: font.serifItalic,
    fontSize: 15.5,
    color: lavenderDim(0.7),
    marginTop: 16,
    textAlign: 'center',
  },

  circuloBloqueo: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 1,
    borderColor: goldDim(0.45),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloqueoTitulo: {
    fontFamily: font.serif,
    fontSize: 26,
    color: color.cream,
    marginTop: 22,
    textAlign: 'center',
  },
  cuentaAtras: {
    fontFamily: font.serifBold,
    fontSize: 44,
    color: color.gold,
    marginTop: 10,
    letterSpacing: 0.9,
  },
  bloqueoSub: {
    fontFamily: font.sans,
    fontSize: 12.5,
    color: lavenderDim(0.65),
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
  ultimoKicker: {
    fontFamily: font.sansSemi,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: goldDim(0.7),
  },
  ultimoItem: {
    borderWidth: 1,
    borderColor: lavenderDim(0.18),
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(21,13,52,.4)',
  },
  grupoGuardado: {
    borderWidth: 1,
    borderColor: goldDim(0.25),
    borderRadius: radius.cardSmall,
    padding: 14,
    backgroundColor: 'rgba(21,13,52,.35)',
  },
  grupoCabecera: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  grupoNombre: { fontFamily: font.serif, fontSize: 19, color: color.gold, flex: 1 },
  grupoFecha: { fontFamily: font.sans, fontSize: 11, color: lavenderDim(0.5) },
  avisoGuardar: {
    fontFamily: font.sans,
    fontSize: 12.5,
    lineHeight: 19,
    color: goldDim(0.75),
    marginTop: 14,
    textAlign: 'center',
  },
  ultimoTitulo: { fontFamily: font.serif, fontSize: 17, color: color.gold },
  ultimoMensaje: {
    fontFamily: font.sans,
    fontSize: 12.5,
    lineHeight: 19,
    color: creamDim(0.85),
  },
});
