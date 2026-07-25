/**
 * Cruz de Vida — una lectura gratis al mes.
 *
 * Flujo: intro → quién consulta → elegir pregunta → concentración → tirada
 * animada → resultado. Las cartas se van repartiendo en cruz por rondas hasta
 * que aparece la carta que representa la pregunta; solo esa posición se interpreta.
 *
 * Diferencia respecto al prototipo: sin paywall de lecturas adicionales.
 */
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Barajado } from '@/components/Barajado';
import { DorsoNaipe, Naipe, nombreCarta, numName, paloName } from '@/components/Naipe';
import { Header, Screen } from '@/components/Screen';
import { Volteo } from '@/components/Volteo';
import {
  BotonGuardar,
  BotonPrimario,
  BotonSecundario,
  EnlaceTenue,
  PildoraInfo,
  Toast,
} from '@/components/ui';
import {
  CRUZ_DATA,
  type CartaRef,
  type PosKey,
  type Pregunta,
} from '@/data/cruz';
import { anchoCelda, useAnchoContenido } from '@/lib/layout';
import {
  guardadoDesde,
  guardadosDe,
  guardar,
  MES_MS,
  mesKey,
  setState,
  useStore,
} from '@/lib/store';
import { fechaCorta, useTick } from '@/lib/time';
import {
  cardBorder,
  color,
  creamDim,
  font,
  goldDim,
  lavenderDim,
  radius,
  type Suit,
} from '@/theme/tokens';

type Paso = 'intro' | 'genero' | 'pregunta' | 'concentra' | 'tirada' | 'resultado';
type Genero = 'mujer' | 'hombre';
/** Fases de una carta al caer: entra, boca abajo, se voltea, es la representante */
type Fase = 'enter' | 'down' | 'up' | 'rep';
type Puesta = { carta: CartaRef; fase: Fase };
type Slots = Record<PosKey, Puesta[]>;

const POSICIONES: PosKey[] = ['arriba', 'izquierda', 'abajo', 'derecha'];
const SLOTS_VACIOS: Slots = { arriba: [], izquierda: [], abajo: [], derecha: [] };

const PALOS: Suit[] = ['oros', 'copas', 'espadas', 'bastos'];
const NUMEROS = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

export default function CruzDeVida() {
  const router = useRouter();
  const s = useStore();

  const [paso, setPaso] = useState<Paso>('intro');
  const [genero, setGenero] = useState<Genero | null>(null);
  const [preguntaId, setPreguntaId] = useState<number | null>(null);
  const [barajando, setBarajando] = useState(false);
  const [slots, setSlots] = useState<Slots>(SLOTS_VACIOS);
  const [encontrada, setEncontrada] = useState(false);
  const [estado, setEstado] = useState('');
  const [resPos, setResPos] = useState<PosKey | null>(null);
  const [resCarta, setResCarta] = useState<CartaRef | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // La cruz son 3 columnas con 10 px de separación dentro del ancho disponible.
  const ancho = useAnchoContenido();
  const celda = anchoCelda(ancho, 3, 10);

  // El tick solo corre en la intro, que es donde se muestra la cuenta atrás.
  const now = useTick(paso === 'intro', 60_000);
  const usadas = s.cruzMes?.ym === mesKey() ? s.cruzMes.usadas : 0;
  const hayLectura = usadas < 1;
  /** Lo guardado es lo único que se conserva de las lecturas pasadas. */
  const guardadas = guardadosDe(s, 'cruz');
  /** Cada lectura se guarda una sola vez; con la del mes siguiente se reactiva. */
  const yaGuardada = guardadoDesde(s, 'cruz', s.cruzLast?.fecha ?? Infinity);

  useEffect(() => {
    const pendientes = timers.current;
    return () => pendientes.forEach(clearTimeout);
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const pregunta = CRUZ_DATA.preguntas.find((q) => q.id === preguntaId) ?? null;
  const centro: CartaRef =
    genero === 'hombre' ? { palo: 'copas', num: 12 } : { palo: 'copas', num: 10 };

  /** Cartas que representan la pregunta elegida, según su tipo. */
  function cartasRepresentantes(q: Pregunta | null): CartaRef[] {
    if (!q) return [];
    if (q.rep.tipo === 'fija') return [{ palo: q.rep.palo, num: q.rep.num }];
    if (q.rep.tipo === 'genero') return [q.rep[genero ?? 'mujer']];
    return q.rep[genero ?? 'mujer'];
  }

  function fijarFase(pos: PosKey, fase: Fase) {
    setSlots((prev) => {
      const arr = prev[pos];
      if (!arr.length) return prev;
      const copia = [...arr];
      copia[copia.length - 1] = { ...copia[copia.length - 1], fase };
      return { ...prev, [pos]: copia };
    });
  }

  function tirar() {
    const reps = cartasRepresentantes(pregunta);
    if (!reps.length || !pregunta) return;

    const esCentro = (c: CartaRef) => c.palo === centro.palo && c.num === centro.num;
    const esRepresentante = (c: CartaRef) =>
      reps.some((r) => r.palo === c.palo && r.num === c.num);

    /*
     * Baraja completa de 40 menos la carta del consultante, que ya está al
     * centro. Las representantes SÍ entran en el mazo: se baraja de verdad y se
     * reparte hasta que aparece una. Así su posición es uniforme — puede salir
     * en la primera carta o en la última, sin pesos que la empujen al principio.
     */
    const mazo: CartaRef[] = [];
    PALOS.forEach((p) =>
      NUMEROS.forEach((n) => {
        const c = { palo: p, num: n };
        if (!esCentro(c)) mazo.push(c);
      }),
    );
    for (let i = mazo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
    }

    const corte = mazo.findIndex(esRepresentante);
    const secuencia = corte >= 0 ? mazo.slice(0, corte + 1) : [...mazo, reps[0]];

    setPaso('tirada');
    setBarajando(true);
    setSlots(SLOTS_VACIOS);
    setEncontrada(false);
    setResPos(null);
    setResCarta(null);
    setEstado('Barajando las cartas…');

    const msBaraja = 1900;
    /*
     * El reparto acelera como el de una tarotista, pero sin atropellarse: la
     * pausa nunca baja de 460 ms. Como las cartas rotan entre las 4 posiciones,
     * cada casilla recibe una cada 4 pausas (mín. 1840 ms), de sobra para que se
     * vea la entrada (430 ms) y el volteo (600 ms) completos.
     */
    const pausaInicial = 1250;
    const pausaMinima = 460;
    const pausaDe = (j: number) =>
      Math.max(pausaMinima, pausaInicial * Math.pow(0.9, j));

    after(msBaraja, () => {
      setBarajando(false);
      setEstado('');
    });

    let reloj = msBaraja + 200;

    secuencia.forEach((carta, j) => {
      const pos = POSICIONES[j % 4];
      const def = CRUZ_DATA.posiciones.find((p) => p.key === pos);
      const esUltima = j === secuencia.length - 1;
      const pausa = pausaDe(j);
      // La carta representante se hace esperar: es la que trae la respuesta.
      const anticipacion = esUltima && j > 0 ? 650 : 0;
      const cuando = reloj + anticipacion;
      reloj = cuando + pausa;

      // El volteo arranca justo cuando la carta termina de asentarse, no antes,
      // para que se vea caer primero y girar después. Es fijo: no depende del ritmo.
      const msVolteo = esUltima ? 620 : 460;

      after(cuando, () => {
        setSlots((prev) => ({ ...prev, [pos]: [...prev[pos], { carta, fase: 'enter' }] }));
        setEstado(`${def?.nombre ?? ''}…`);
        after(60, () => fijarFase(pos, 'down'));
        after(msVolteo, () => fijarFase(pos, 'up'));

        if (esUltima) {
          after(1100, () => {
            fijarFase(pos, 'rep');
            setEncontrada(true);
            setEstado(`✨ Tu carta apareció · ${def?.nombre ?? ''}`);
          });
          after(2400, () => {
            const texto = textoRespuesta(pregunta, pos, carta);
            setState({
              cruzLast: {
                pregunta: pregunta.texto,
                pos: def?.nombre ?? '',
                posKey: pos,
                carta: nombreCarta(carta.palo, carta.num),
                texto,
                fecha: Date.now(),
              },
              cruzNext: Date.now() + MES_MS,
              cruzMes: { ym: mesKey(), usadas: usadas + 1 },
            });
            setResPos(pos);
            setResCarta(carta);
            setPaso('resultado');
          });
        }
      });
    });
  }

  function volver() {
    if (paso === 'intro') {
      router.back();
      return;
    }
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPaso('intro');
    setPreguntaId(null);
    setEncontrada(false);
    setBarajando(false);
    setSlots(SLOTS_VACIOS);
  }

  function mostrarToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(null), 2400);
  }

  const diasRestantes =
    s.cruzNext > now ? Math.max(1, Math.ceil((s.cruzNext - now) / 86_400_000)) : 30;

  return (
    <Screen scroll={paso !== 'tirada' || !barajando}>
      <Header
        kicker="Lectura mensual"
        titulo="Cruz de Vida"
        onBack={volver}
        right={<PildoraInfo label={`${usadas} de 1 lectura`} />}
      />

      {paso === 'intro' && (
        <View style={{ flex: 1 }}>
          <CruzHero />
          <Text style={styles.intro}>
            Cinco cartas forman la cruz. Solo una posición guarda tu respuesta: donde
            aparezca la carta que representa tu pregunta.
          </Text>

          <View style={styles.pasos}>
            <PasoIntro n="I" texto="Dinos quién consulta: tu carta representante se coloca al centro." />
            <PasoIntro n="II" texto="Elige tu pregunta entre las que la Cruz puede responder." />
            <PasoIntro n="III" texto="Concéntrate y tira: la cruz se irá formando hasta revelar tu carta." />
          </View>

          <View style={{ flex: 1, minHeight: 20 }} />

          {/* Solo aparecen las lecturas que el usuario decidió guardar. */}
          {guardadas.length > 0 ? (
            <View style={{ marginTop: 26 }}>
              <Text style={styles.ultimaKicker}>Resultados anteriores</Text>
              <View style={{ gap: 12, marginTop: 12 }}>
                {guardadas.map((g) => (
                  <View key={g.fecha} style={styles.ultimaLectura}>
                    <Text style={styles.ultimaKicker}>{fechaCorta(g.fecha)}</Text>
                    <Text style={styles.ultimaPregunta}>“{g.pregunta}”</Text>
                    <Text style={styles.ultimaMeta}>
                      Apareció en {g.pos} · {g.carta}
                    </Text>
                    <Text style={styles.ultimaTexto}>{g.texto}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {hayLectura ? (
            <BotonPrimario style={{ marginTop: 28 }} onPress={() => setPaso('genero')}>
              Comenzar el ritual
            </BotonPrimario>
          ) : (
            <View style={styles.sinLecturas}>
              <Text style={styles.sinLecturasTitulo}>
                La energía de tu lectura se renueva con la luna nueva
              </Text>
              <Text style={styles.sinLecturasSub}>
                Tu próxima lectura gratis estará lista en {diasRestantes} días
              </Text>
            </View>
          )}

          <EnlaceTenue
            onPress={() => {
              setState({ cruzLast: null, cruzMes: null, cruzNext: 0 });
              mostrarToast('✨ Lecturas restablecidas');
            }}
          >
            Restablecer (demo)
          </EnlaceTenue>
        </View>
      )}

      {paso === 'genero' && (
        <View style={{ flex: 1 }}>
          <Text style={styles.pasoNum}>Paso 1 de 3</Text>
          <Text style={styles.pregTitulo}>¿Quién consulta?</Text>
          <Text style={styles.pregSub}>
            {'Tu carta representante se colocará\nal centro de la cruz.'}
          </Text>

          <View style={styles.generoFila}>
            {(
              [
                { key: 'mujer' as Genero, label: 'Mujer', carta: { palo: 'copas' as Suit, num: 10 } },
                { key: 'hombre' as Genero, label: 'Hombre', carta: { palo: 'copas' as Suit, num: 12 } },
              ]
            ).map((g) => (
              <Pressable
                key={g.key}
                accessibilityRole="button"
                accessibilityLabel={g.label}
                onPress={() => {
                  setGenero(g.key);
                  after(320, () => setPaso('pregunta'));
                }}
                style={[
                  styles.generoOpcion,
                  genero === g.key && styles.generoOpcionActiva,
                ]}
              >
                <Naipe palo={g.carta.palo} num={g.carta.num} width={96} />
                <Text style={styles.generoLabel}>{g.label}</Text>
                <Text style={styles.generoCarta}>
                  {nombreCarta(g.carta.palo, g.carta.num)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {paso === 'pregunta' && (
        <View style={{ flex: 1 }}>
          <Text style={styles.pasoNum}>Paso 2 de 3</Text>
          <Text style={styles.pregTitulo}>Elige tu pregunta</Text>

          <View style={{ marginTop: 18 }}>
            {CRUZ_DATA.categorias.map((cat) => (
              <View key={cat.key}>
                <View style={styles.catCabecera}>
                  <Text style={styles.catNombre}>{cat.nombre}</Text>
                  <View style={styles.catLinea} />
                </View>
                {cat.ids.map((id) => {
                  const q = CRUZ_DATA.preguntas.find((p) => p.id === id);
                  if (!q) return null;
                  const sel = preguntaId === id;
                  return (
                    <Pressable
                      key={id}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: sel }}
                      onPress={() => setPreguntaId(id)}
                      style={[styles.opcionPregunta, sel && styles.opcionPreguntaSel]}
                    >
                      <View style={[styles.radio, sel && styles.radioSel]}>
                        {sel ? <View style={styles.radioPunto} /> : null}
                      </View>
                      <Text style={styles.opcionTexto}>{q.texto}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>

          <BotonPrimario
            style={{ marginTop: 22 }}
            disabled={!preguntaId}
            onPress={() => setPaso('concentra')}
          >
            Continuar
          </BotonPrimario>
        </View>
      )}

      {paso === 'concentra' && pregunta && (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.pasoNum}>Paso 3 de 3</Text>
          <Text style={styles.pregTitulo}>Concéntrate</Text>

          <View style={{ marginTop: 26 }}>
            <Naipe palo={centro.palo} num={centro.num} width={128} />
          </View>
          <Text style={styles.centroLabel}>
            Tu carta al centro · {nombreCarta(centro.palo, centro.num)}
          </Text>

          <View style={{ marginTop: 24, maxWidth: 300 }}>
            <Text style={styles.preguntaCita}>“{pregunta.texto}”</Text>
            <Text style={styles.concentraTexto}>
              Cierra los ojos y respira profundo. Sostén tu pregunta en el corazón. El
              universo ya está moviendo las piezas.
            </Text>
          </View>

          <View style={{ flex: 1, minHeight: 20 }} />
          <BotonPrimario style={{ marginTop: 26 }} onPress={tirar}>
            Tirar las cartas
          </BotonPrimario>
        </View>
      )}

      {paso === 'tirada' && pregunta && (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.tiradaPregunta}>“{pregunta.texto}”</Text>
          <Text style={styles.tiradaBuscando}>
            Buscando tu carta · {etiquetaRepresentantes(cartasRepresentantes(pregunta))}
          </Text>

          {barajando ? (
            <View style={{ marginTop: 28 }}>
              <Barajado palo="oros" />
            </View>
          ) : (
            <CruzTablero
              slots={slots}
              centro={centro}
              encontrada={encontrada}
              celda={celda}
            />
          )}

          <Text
            style={[
              styles.estado,
              { color: encontrada ? color.goldMid : lavenderDim(0.75) },
            ]}
          >
            {estado}
          </Text>
        </View>
      )}

      {paso === 'resultado' && pregunta && resCarta && resPos && (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.resKicker}>Tu carta apareció en</Text>
          <Text style={styles.resPosNombre}>
            {CRUZ_DATA.posiciones.find((p) => p.key === resPos)?.nombre}
          </Text>

          <MiniCruz resaltada={resPos} />

          <View style={styles.resCartaFila}>
            <Naipe palo={resCarta.palo} num={resCarta.num} width={72} />
            <View style={{ flex: 1 }}>
              <Text style={styles.resCartaNombre}>
                {nombreCarta(resCarta.palo, resCarta.num)}
              </Text>
              <Text style={styles.resSubtitulo}>
                {subtituloResultado(pregunta, resPos, resCarta)}
              </Text>
            </View>
          </View>

          <Text style={styles.resTexto}>
            {textoRespuesta(pregunta, resPos, resCarta)}
          </Text>
          <Text style={styles.resNota}>
            Las demás cartas descansan: solo esta posición guarda tu respuesta.
          </Text>

          {/* Guardar es lo único que conserva la lectura: si no, se pierde. */}
          <Text style={styles.avisoGuardar}>
            Guárdala para poder volver a leerla. Si no la guardas, no quedará
            registro de esta lectura.
          </Text>

          <View style={{ flex: 1, minHeight: 20 }} />
          <BotonGuardar
            style={{ marginTop: 18 }}
            guardado={yaGuardada}
            etiquetaGuardado="Guardada en Mi Camino ✦"
            onPress={() => {
              const def = CRUZ_DATA.posiciones.find((p) => p.key === resPos);
              guardar({
                tipo: 'cruz',
                fecha: Date.now(),
                pregunta: pregunta.texto,
                pos: def?.nombre ?? '',
                posKey: resPos,
                carta: nombreCarta(resCarta.palo, resCarta.num),
                texto: textoRespuesta(pregunta, resPos, resCarta),
              });
              mostrarToast('✨ Lectura guardada en Mi Camino');
            }}
          >
            Guardar mi lectura
          </BotonGuardar>
          <BotonSecundario style={{ marginTop: 12 }} onPress={() => router.back()}>
            Volver al inicio
          </BotonSecundario>
        </View>
      )}

      <Toast mensaje={toast} />
    </Screen>
  );
}

/** Texto de respuesta según la posición donde cayó la carta representante. */
function textoRespuesta(q: Pregunta, pos: PosKey, carta: CartaRef): string {
  if (q.rep.tipo === 'multi') return q.grupos?.[carta.palo]?.resp[pos] ?? '';
  return q.resp?.[pos] ?? '';
}

function subtituloResultado(q: Pregunta, pos: PosKey, carta: CartaRef): string {
  const def = CRUZ_DATA.posiciones.find((p) => p.key === pos);
  if (q.rep.tipo === 'multi') {
    const g = q.grupos?.[carta.palo];
    return `${g?.titulo ?? ''} · ${def?.desc ?? ''}`;
  }
  const apodo = q.rep.tipo === 'fija' && q.rep.apodo ? `${q.rep.apodo} · ` : '';
  return `${apodo}${def?.desc ?? ''}`;
}

function etiquetaRepresentantes(reps: CartaRef[]): string {
  if (reps.length === 1) return nombreCarta(reps[0].palo, reps[0].num);
  return reps.map((r) => `${numName(r.num)} de ${paloName(r.palo)}`).join(' · ');
}

/** Cruz decorativa de la pantalla de intro: 5 dorsos con la central resaltada. */
function CruzHero() {
  const celda = 54;
  const alto = 74;
  const posiciones: { left: number; top: number; centro?: boolean }[] = [
    { left: celda + 8, top: 0 },
    { left: 0, top: alto + 8 },
    { left: celda + 8, top: alto + 8, centro: true },
    { left: (celda + 8) * 2, top: alto + 8 },
    { left: celda + 8, top: (alto + 8) * 2 },
  ];

  return (
    <View style={styles.heroWrap}>
      <View style={{ width: celda * 3 + 16, height: alto * 3 + 16 }}>
        {posiciones.map((p, i) => (
          <View key={i} style={{ position: 'absolute', left: p.left, top: p.top }}>
            <DorsoNaipe width={celda} borderOpacity={p.centro ? 0.7 : 0.35} />
          </View>
        ))}
      </View>
    </View>
  );
}

function PasoIntro({ n, texto }: { n: string; texto: string }) {
  return (
    <View style={styles.pasoFila}>
      <Text style={styles.pasoRomano}>{n}</Text>
      <Text style={styles.pasoTexto}>{texto}</Text>
    </View>
  );
}

/**
 * Una carta al caer en su casilla.
 *
 * Reproduce la entrada del prototipo, que hasta ahora no estaba implementada: la
 * carta llega desde abajo (`translateY(46px) scale(.82)`) y se asienta en 430 ms
 * con la curva del diseño, de modo que se ve *lanzarse* al hueco. Solo después
 * se voltea.
 */
function CartaRepartida({
  puesta,
  arriba,
  encontrada,
  ancho,
  alto,
}: {
  puesta: Puesta;
  arriba: boolean;
  encontrada: boolean;
  ancho: number;
  alto: number;
}) {
  const entrada = useSharedValue(0);
  const atenuado = useSharedValue(1);

  // Las cartas de debajo se atenúan, y todas menos la representante se apagan
  // cuando la tirada encuentra su carta.
  const opacidadDestino = !arriba ? 0.5 : encontrada && puesta.fase !== 'rep' ? 0.45 : 1;

  useEffect(() => {
    if (puesta.fase !== 'enter') {
      entrada.value = withTiming(1, {
        duration: 430,
        easing: Easing.bezier(0.2, 0.8, 0.3, 1),
      });
    }
  }, [puesta.fase, entrada]);

  useEffect(() => {
    atenuado.value = withTiming(opacidadDestino, { duration: 400 });
  }, [opacidadDestino, atenuado]);

  const estilo = useAnimatedStyle(() => ({
    opacity: entrada.value * atenuado.value,
    transform: [
      { translateY: (1 - entrada.value) * 46 },
      { scale: 0.82 + entrada.value * 0.18 },
      { rotate: arriba ? '0deg' : '-4deg' },
    ],
  }));

  const boca = puesta.fase === 'up' || puesta.fase === 'rep';

  return (
    <Animated.View
      style={[styles.cartaEnHueco, { zIndex: arriba ? 2 : 1 }, estilo]}
    >
      <Volteo
        volteada={boca}
        duracion={600}
        style={{ width: ancho, height: alto }}
        frente={<Naipe palo={puesta.carta.palo} num={puesta.carta.num} width={ancho} />}
        dorso={<DorsoNaipe width={ancho} />}
      />
    </Animated.View>
  );
}

/** Tablero de la tirada: la cruz de 5 posiciones con las cartas cayendo. */
function CruzTablero({
  slots,
  centro,
  encontrada,
  celda: CELDA,
}: {
  slots: Slots;
  centro: CartaRef;
  encontrada: boolean;
  celda: number;
}) {
  const alto = CELDA / (5 / 7);

  const casilla = (pos: PosKey) => {
    const arr = slots[pos];
    const visibles = arr.slice(-2);
    const def = CRUZ_DATA.posiciones.find((p) => p.key === pos);
    const esRep = arr.length > 0 && arr[arr.length - 1].fase === 'rep';

    return (
      // Ancho fijo: si la celda creciera con su etiqueta ("Lo que se deja atrás"
      // es mucho más ancha que la carta), la cruz se descuadraría.
      <View style={{ width: CELDA, alignItems: 'center', gap: 5 }}>
        <View style={{ width: CELDA, height: alto }}>
          <View style={styles.huecoVacio} />
          {visibles.map((puesta, i) => (
            <CartaRepartida
              key={`${pos}-${arr.length - visibles.length + i}`}
              puesta={puesta}
              arriba={i === visibles.length - 1}
              encontrada={encontrada}
              ancho={CELDA}
              alto={alto}
            />
          ))}
        </View>
        <Text
          style={[
            styles.celdaEtiqueta,
            { color: esRep ? color.goldMid : lavenderDim(0.5) },
          ]}
        >
          {def?.nombre}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ marginTop: 18, alignItems: 'center' }}>
      {casilla('arriba')}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        {casilla('izquierda')}
        <View style={{ width: CELDA, alignItems: 'center', gap: 5 }}>
          <Naipe palo={centro.palo} num={centro.num} width={CELDA} />
          <Text style={[styles.celdaEtiqueta, { color: lavenderDim(0.5) }]}>
            Consultante
          </Text>
        </View>
        {casilla('derecha')}
      </View>
      <View style={{ marginTop: 10 }}>{casilla('abajo')}</View>
    </View>
  );
}

/** Diagrama pequeño que marca en dorado la posición donde cayó la carta. */
function MiniCruz({ resaltada }: { resaltada: PosKey }) {
  const cuadro = (pos: PosKey | 'centro') => {
    const hit = pos === resaltada;
    return (
      <View
        style={[
          styles.mini,
          {
            backgroundColor:
              pos === 'centro'
                ? lavenderDim(0.25)
                : hit
                  ? color.goldBright
                  : lavenderDim(0.12),
            borderColor: hit ? color.goldBright : lavenderDim(0.25),
          },
        ]}
      />
    );
  };

  return (
    <View style={{ marginTop: 14, alignItems: 'center', gap: 5 }}>
      {cuadro('arriba')}
      <View style={{ flexDirection: 'row', gap: 5 }}>
        {cuadro('izquierda')}
        {cuadro('centro')}
        {cuadro('derecha')}
      </View>
      {cuadro('abajo')}
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: { alignItems: 'center', marginTop: 30, marginBottom: 24 },
  intro: {
    textAlign: 'center',
    fontFamily: font.sans,
    fontSize: 14.5,
    lineHeight: 24,
    color: lavenderDim(0.78),
    maxWidth: 320,
    alignSelf: 'center',
  },
  pasos: { gap: 12, marginTop: 26, marginHorizontal: 4 },
  pasoFila: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  pasoRomano: {
    fontFamily: font.serif,
    fontSize: 20,
    color: color.goldMid,
    width: 18,
    textAlign: 'center',
  },
  pasoTexto: {
    flex: 1,
    fontFamily: font.sans,
    fontSize: 13.5,
    lineHeight: 20,
    color: creamDim(0.85),
  },

  ultimaLectura: {
    marginTop: 26,
    borderWidth: 1,
    borderColor: goldDim(0.3),
    borderRadius: radius.cardSmall,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(21,13,52,.5)',
  },
  ultimaKicker: {
    fontFamily: font.sansSemi,
    fontSize: 10.5,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: goldDim(0.75),
  },
  ultimaPregunta: {
    fontFamily: font.serifItalic,
    fontSize: 18,
    lineHeight: 24,
    color: color.cream,
    marginTop: 8,
  },
  ultimaMeta: {
    fontFamily: font.sansSemi,
    fontSize: 12,
    color: goldDim(0.85),
    marginTop: 7,
  },
  ultimaTexto: {
    fontFamily: font.sans,
    fontSize: 13,
    lineHeight: 21,
    color: creamDim(0.88),
    marginTop: 8,
  },

  sinLecturas: {
    marginTop: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: goldDim(0.25),
    borderRadius: radius.cardSmall,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  sinLecturasTitulo: {
    fontFamily: font.serif,
    fontSize: 19,
    color: color.gold,
    textAlign: 'center',
  },
  sinLecturasSub: {
    fontFamily: font.sans,
    fontSize: 12.5,
    color: lavenderDim(0.65),
    marginTop: 6,
    textAlign: 'center',
  },

  pasoNum: {
    marginTop: 24,
    fontFamily: font.sansSemi,
    fontSize: 11,
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    color: lavenderDim(0.55),
    textAlign: 'center',
  },
  pregTitulo: {
    fontFamily: font.serif,
    fontSize: 32,
    color: color.cream,
    textAlign: 'center',
    marginTop: 4,
  },
  pregSub: {
    fontFamily: font.sans,
    fontSize: 13.5,
    lineHeight: 22,
    color: lavenderDim(0.7),
    textAlign: 'center',
    marginTop: 8,
  },

  generoFila: { flexDirection: 'row', gap: 16, justifyContent: 'center', marginTop: 32 },
  generoOpcion: {
    width: 150,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 18,
    paddingHorizontal: 12,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: cardBorder,
    backgroundColor: 'rgba(21,13,52,.5)',
  },
  generoOpcionActiva: {
    borderColor: 'rgba(236,200,116,.9)',
    backgroundColor: 'rgba(236,200,116,.08)',
  },
  generoLabel: {
    fontFamily: font.serif,
    fontSize: 22,
    color: color.gold,
    marginTop: 12,
  },
  generoCarta: {
    fontFamily: font.sans,
    fontSize: 11.5,
    color: lavenderDim(0.6),
    marginTop: 2,
  },

  catCabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    marginBottom: 8,
    marginHorizontal: 2,
  },
  catNombre: {
    fontFamily: font.sansSemi,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: goldDim(0.75),
  },
  catLinea: { flex: 1, height: 1, backgroundColor: goldDim(0.2) },
  opcionPregunta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    minHeight: 50,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: lavenderDim(0.16),
    backgroundColor: 'rgba(21,13,52,.4)',
    marginBottom: 6,
  },
  opcionPreguntaSel: {
    borderColor: 'rgba(236,200,116,.85)',
    backgroundColor: 'rgba(236,200,116,.08)',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: lavenderDim(0.45),
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSel: { borderColor: color.goldMid },
  radioPunto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.goldMid,
  },
  opcionTexto: {
    flex: 1,
    fontFamily: font.sans,
    fontSize: 14,
    lineHeight: 20,
    color: color.cream,
  },

  centroLabel: {
    fontFamily: font.sans,
    fontSize: 11.5,
    color: lavenderDim(0.6),
    marginTop: 12,
  },
  preguntaCita: {
    fontFamily: font.serifItalic,
    fontSize: 20,
    lineHeight: 28,
    color: color.gold,
    textAlign: 'center',
  },
  concentraTexto: {
    fontFamily: font.sans,
    fontSize: 13.5,
    lineHeight: 22,
    color: lavenderDim(0.75),
    marginTop: 14,
    textAlign: 'center',
  },

  tiradaPregunta: {
    marginTop: 16,
    fontFamily: font.serifItalic,
    fontSize: 17,
    lineHeight: 23,
    color: goldDim(0.9),
    textAlign: 'center',
    maxWidth: 320,
  },
  tiradaBuscando: {
    fontFamily: font.sans,
    fontSize: 11.5,
    color: lavenderDim(0.6),
    marginTop: 4,
    textAlign: 'center',
  },
  cartaEnHueco: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  huecoVacio: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: lavenderDim(0.3),
    borderRadius: 9,
  },
  celdaEtiqueta: {
    fontFamily: font.sansSemi,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  estado: {
    marginTop: 14,
    minHeight: 24,
    fontFamily: font.serifItalic,
    fontSize: 17,
    textAlign: 'center',
  },

  resKicker: {
    marginTop: 22,
    fontFamily: font.sansSemi,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: lavenderDim(0.55),
  },
  resPosNombre: {
    fontFamily: font.serif,
    fontSize: 38,
    lineHeight: 42,
    color: color.gold,
    textAlign: 'center',
  },
  mini: { width: 26, height: 36, borderRadius: 4, borderWidth: 1 },
  resCartaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 22,
    width: '100%',
    borderWidth: 1,
    borderColor: cardBorder,
    borderRadius: radius.cardSmall,
    padding: 16,
  },
  resCartaNombre: {
    fontFamily: font.serif,
    fontSize: 21,
    lineHeight: 24,
    color: color.cream,
  },
  resSubtitulo: {
    fontFamily: font.sans,
    fontSize: 11.5,
    lineHeight: 17,
    color: lavenderDim(0.65),
    marginTop: 4,
  },
  resTexto: {
    fontFamily: font.sans,
    fontSize: 14.5,
    lineHeight: 25,
    color: creamDim(0.92),
    marginTop: 20,
  },
  resNota: {
    fontFamily: font.serifItalic,
    fontSize: 16,
    color: lavenderDim(0.7),
    marginTop: 18,
    textAlign: 'center',
  },
  avisoGuardar: {
    fontFamily: font.sans,
    fontSize: 12.5,
    lineHeight: 19,
    color: goldDim(0.75),
    marginTop: 16,
    textAlign: 'center',
  },
});
