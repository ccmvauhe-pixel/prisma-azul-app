/**
 * Cruz de Vida — una lectura gratis por semana, hasta 3 en total.
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
import { CARD_RATIO, DorsoNaipe, Naipe, nombreCarta, numName, paloName } from '@/components/Naipe';
import { Header, Screen } from '@/components/Screen';
import { Volteo } from '@/components/Volteo';
import {
  BotonGuardar,
  BotonPrimario,
  BotonSecundario,
  EnlaceTenue,
  PildoraInfo,
  Temporizador,
  Toast,
} from '@/components/ui';
import {
  type CartaRef,
  type PosKey,
  type Pregunta,
} from '@/data/cruz';
import { anchoCelda, useAnchoContenido } from '@/lib/layout';
import {
  borrarGuardadosDe,
  consumirCruz,
  CRUZ_MAX_SEMANA,
  estadoCruz,
  guardadoDesde,
  guardadosDe,
  guardar,
  setState,
  useStore,
} from '@/lib/store';
import { fechaCorta, fmtLargo, useTick } from '@/lib/time';
import {
  cardBorder,
  color,
  creamDim,
  font,
  fs,
  goldDim,
  lavenderDim,
  radius,
  type Suit,
} from '@/theme/tokens';
import { abrioSeccion, completoLectura, guardo, vioContenido } from '@/lib/analitica';
import { getContenido, useContenido } from '@/lib/contenido';
import { avisarAhora } from '@/lib/notifications';

type Paso =
  | 'intro'
  | 'genero'
  | 'categoria'
  | 'pregunta'
  | 'concentra'
  | 'tirada'
  | 'resultado';
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
  useEffect(() => abrioSeccion('cruz'), []);
  const router = useRouter();
  const s = useStore();
  const { CRUZ_DATA } = useContenido();

  const [paso, setPaso] = useState<Paso>('intro');
  const [genero, setGenero] = useState<Genero | null>(null);
  /** Área elegida (Amor, Dinero y trabajo, Salud y energía): filtra las preguntas. */
  const [catKey, setCatKey] = useState<string | null>(null);
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

  /*
   * El tick solo corre en la intro, que es donde se muestra la cuenta atrás.
   *
   * Cada segundo, no cada minuto: antes aquí solo se leían días ("vuelve a
   * abrirse en 3 días") y bastaba con 60 s. Ahora es el temporizador común, y
   * `fmtLargo` baja a segundos en el último día — con el tick de un minuto esos
   * segundos se quedarían clavados y saltarían de sesenta en sesenta.
   */
  const now = useTick(paso === 'intro');
  const cruz = estadoCruz(s, now);
  const usadas = cruz.usadas;
  const hayLectura = cruz.puedeLeer;
  /** Lo guardado es lo único que se conserva de las lecturas pasadas. */
  const guardadas = guardadosDe(s, 'cruz');
  /** Cada lectura se guarda una sola vez; con la de la semana siguiente se reactiva. */
  const yaGuardada = guardadoDesde(s, 'cruz', s.cruzLast?.fecha ?? Infinity);

  useEffect(() => {
    const pendientes = timers.current;
    return () => pendientes.forEach(clearTimeout);
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const categoria = CRUZ_DATA.categorias.find((c) => c.key === catKey) ?? null;
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

    const msBaraja = 2300;
    /*
     * El reparto acelera como el de una tarotista, pero sin atropellarse: la
     * pausa nunca baja de 680 ms. Como las cartas rotan entre las 4 posiciones,
     * cada casilla recibe una cada 4 pausas (mín. 2720 ms), de sobra para que se
     * vea la entrada (540 ms) y el volteo (760 ms) completos.
     *
     * Ritmo pausado a petición: se parte de 1600 ms y la caída es suave (0.93),
     * así que una tirada media ronda los 23 s en vez de los 17 de antes.
     */
    const pausaInicial = 1600;
    const pausaMinima = 680;
    const pausaDe = (j: number) =>
      Math.max(pausaMinima, pausaInicial * Math.pow(0.93, j));

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
      const anticipacion = esUltima && j > 0 ? 900 : 0;
      const cuando = reloj + anticipacion;
      reloj = cuando + pausa;

      // El volteo arranca justo cuando la carta termina de asentarse, no antes,
      // para que se vea caer primero y girar después. Es fijo: no depende del ritmo.
      const msVolteo = esUltima ? 780 : 580;

      after(cuando, () => {
        setSlots((prev) => ({ ...prev, [pos]: [...prev[pos], { carta, fase: 'enter' }] }));
        setEstado(`${def?.nombre ?? ''}…`);
        after(60, () => fijarFase(pos, 'down'));
        after(msVolteo, () => fijarFase(pos, 'up'));

        if (esUltima) {
          after(1450, () => {
            fijarFase(pos, 'rep');
            setEncontrada(true);
            setEstado(`✨ Tu carta apareció · ${def?.nombre ?? ''}`);
          });
          after(3100, () => {
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
              // El consumo (contador semanal, extra gastada y temporizador) lo
              // decide el store: es la única regla de cobro de la app y no debe
              // estar repartida entre pantallas.
              ...consumirCruz(s),
            });
            setResPos(pos);
            setResCarta(carta);
            setPaso('resultado');
            completoLectura('cruz', {
              cartas_repartidas: secuencia.length,

            });
            // Qué pregunta eligió y dónde cayó su carta. Sin el texto: eso ya
            // vive en el contenido y duplicarlo aquí no aporta nada.
            vioContenido('cruz', {
              pregunta_id: pregunta.id,
              categoria: pregunta.cat,
              posicion: pos,
              carta: `${carta.palo}-${carta.num}`,
            });
          });
        }
      });
    });
  }

  /** Retrocede un paso cada vez; desde la tirada o el resultado, al principio. */
  function volver() {
    if (paso === 'intro') {
      router.back();
      return;
    }
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (paso === 'genero') return setPaso('intro');
    if (paso === 'categoria') return setPaso('genero');
    if (paso === 'pregunta') {
      setPreguntaId(null);
      return setPaso('categoria');
    }
    if (paso === 'concentra') return setPaso('pregunta');

    setPaso('intro');
    setCatKey(null);
    setPreguntaId(null);
    setEncontrada(false);
    setBarajando(false);
    setSlots(SLOTS_VACIOS);
  }

  function mostrarToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(null), 2400);
  }

  return (
    <Screen scroll={paso !== 'tirada' || !barajando}>
      <Header
        kicker="Lectura semanal"
        titulo="Cruz de Vida"
        onBack={volver}
        right={<PildoraInfo label={`${usadas} de ${CRUZ_MAX_SEMANA} esta semana`} />}
      />

      {paso === 'intro' && (
        /*
          La columna va centrada y en este orden: cruz, invitación y acción.
          Antes había un `flex: 1` justo detrás de la cruz que empujaba el botón
          al fondo de la pantalla; ahora el hueco elástico va al final, así que
          lo que importa queda arriba y junto.
        */
        <View style={{ flex: 1, alignItems: 'center' }}>
          {/*
            La cruz preside la entrada solo mientras no haya nada guardado.
            Con una lectura guardada, la protagonista es ella: el emblema pasa a
            ser decoración que empuja hacia abajo lo que de verdad se viene a
            leer. Sin guardar, todo se queda como estaba.
          */}
          {guardadas.length === 0 ? <CruzHero ancho={ancho} /> : null}

          {hayLectura ? (
            <>
              {/*
                La invitación solo acompaña a la acción. Con la lectura ya hecha
                —guardada o no— no hay nada que invitar: ahí manda el
                temporizador, y el texto sonaría a burla.
              */}
              <Text style={styles.invitacion}>
                Haz tu lectura y ve qué tiene el universo para ti
              </Text>

              {/*
                `width: '100%'` a mano, y no es de adorno.

                `BotonPrimario` pone `btnBase` —que es quien lleva el `width:
                100%`— en el degradado de DENTRO, no en el `Pressable` de fuera.
                Así que ese 100% es del Pressable, y el Pressable, en un
                contenedor con `alignItems: 'center'` como este, encoge hasta el
                ancho de su texto. `BotonSecundario` sí lleva `btnBase` en el
                Pressable, por eso "Volver al inicio" salía a todo el ancho y
                este no: juntos en la misma columna, la diferencia canta.
              */}
              <BotonPrimario
                style={{ width: '100%' }}
                onPress={() => setPaso('genero')}
              >
                Comenzar la lectura
              </BotonPrimario>
              {/* Si va a gastar una comprada, tiene que saberlo ANTES de entrar. */}
              {cruz.consumeExtra ? (
                <Text style={styles.avisoExtra}>
                  Esta lectura usará una de tus {cruz.extras} lecturas compradas
                </Text>
              ) : null}
            </>
          ) : (
            /*
              Sin lectura disponible solo queda el temporizador, en el formato
              común de las cuatro secciones. Antes había aquí dos bloques de
              texto distintos según si se había agotado el cupo o la semanal;
              ninguno decía nada que la cuenta atrás no diga ya.
            */
            <Temporizador
              etiqueta="Tu próxima lectura en:"
              valor={fmtLargo(Math.max(0, s.cruzNext - now))}
            />
          )}

          {/*
            Solo sobrevive la última lectura guardada: al guardar una nueva, la
            anterior se descarta.
          */}
          {guardadas.length > 0 ? (
            <View style={{ marginTop: 26, width: '100%' }}>
              <Text style={styles.ultimaKicker}>Tu lectura guardada</Text>
              <View style={styles.ultimaLectura}>
                <Text style={styles.ultimaKicker}>{fechaCorta(guardadas[0].fecha)}</Text>
                <Text style={styles.ultimaPregunta}>“{guardadas[0].pregunta}”</Text>
                <Text style={styles.ultimaMeta}>
                  Apareció en {guardadas[0].pos} · {guardadas[0].carta}
                </Text>
                <Text style={styles.ultimaTexto}>{guardadas[0].texto}</Text>
              </View>
            </View>
          ) : null}

          {/*
            Misma salida que en Afirmaciones y Oráculo, sin depender de la
            flecha de la cabecera. `alto={60}` lo iguala al primario, que por
            defecto mide 60 y el secundario 56: juntos en la misma columna, esos
            4 px de diferencia se notan.
          */}
          <BotonSecundario
            alto={60}
            style={{ marginTop: 22 }}
            onPress={() => router.back()}
          >
            Volver al inicio
          </BotonSecundario>

          <View style={{ flex: 1, minHeight: 24 }} />

          <EnlaceTenue
            onPress={() => {
              // Sección como recién estrenada: lectura de la semana disponible
              // otra vez y sin nada guardado. Las extras compradas no se tocan.
              setState({ cruzLast: null, cruzSemana: null, cruzNext: 0 });
              borrarGuardadosDe('cruz');
              void avisarAhora(
                '🌙 La Cruz de Vida se abre de nuevo. Tu lectura de la semana te espera.',
              );
              mostrarToast('✨ Sección restablecida');
            }}
          >
            Restablecer (demo)
          </EnlaceTenue>
        </View>
      )}

      {paso === 'genero' && (
        <View style={{ flex: 1 }}>
          <Text style={styles.pasoNum}>Paso 1 de 4</Text>
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
                  after(320, () => setPaso('categoria'));
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

      {paso === 'categoria' && (
        <View style={{ flex: 1 }}>
          <Text style={styles.pasoNum}>Paso 2 de 4</Text>
          <Text style={styles.pregTitulo}>¿Sobre qué preguntas?</Text>
          <Text style={styles.pregSub}>
            {'Elige el área de tu vida y verás\nlas preguntas que la Cruz responde.'}
          </Text>

          <View style={styles.listaAreas}>
            {CRUZ_DATA.categorias.map((cat) => (
              <Pressable
                key={cat.key}
                accessibilityRole="button"
                accessibilityLabel={cat.nombre}
                onPress={() => {
                  setCatKey(cat.key);
                  setPreguntaId(null);
                  after(220, () => setPaso('pregunta'));
                }}
                style={({ pressed }) => [styles.filaArea, { opacity: pressed ? 0.85 : 1 }]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.filaAreaNombre}>{cat.nombre}</Text>
                  <Text style={styles.filaAreaSub}>
                    {cat.ids.length} {cat.ids.length === 1 ? 'pregunta' : 'preguntas'}
                  </Text>
                </View>
                <Text style={styles.chevronArea}>›</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {paso === 'pregunta' && categoria && (
        <View style={{ flex: 1 }}>
          <Text style={styles.pasoNum}>Paso 3 de 4</Text>
          <Text style={styles.pregTitulo}>Elige tu pregunta</Text>
          <Text style={styles.pregSub}>{categoria.nombre}</Text>

          {/* Elegir la pregunta lleva directo a la lectura: no hay "Continuar". */}
          <View style={{ marginTop: 20 }}>
            {categoria.ids.map((id) => {
              const q = CRUZ_DATA.preguntas.find((p) => p.id === id);
              if (!q) return null;
              const sel = preguntaId === id;
              return (
                <Pressable
                  key={id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: sel }}
                  onPress={() => {
                    setPreguntaId(id);
                    after(260, () => setPaso('concentra'));
                  }}
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
        </View>
      )}

      {paso === 'concentra' && pregunta && (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.pasoNum}>Paso 4 de 4</Text>
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

          {/*
            Sin hueco elástico delante de los botones.
            Antes había aquí un `flex: 1` que los clavaba al borde inferior: al
            retirarse el de guardar, el hueco crecía otro tanto y "Volver al
            inicio" se quedaba exactamente donde estaba. Con los botones
            siguiendo al texto, al desaparecer el primero el segundo sube solo.
          */}
          <BotonGuardar
            style={{ marginTop: 26 }}
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
              guardo('cruz', { pregunta_id: pregunta.id, posicion: resPos });
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
  // Ayudante a nivel de módulo: no es un componente, así que lee el contenido
  // directamente en vez de con el hook.
  const def = getContenido().CRUZ_DATA.posiciones.find((p) => p.key === pos);
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
/**
 * La cruz de cartas boca abajo que preside la entrada.
 *
 * Se dimensiona con el ancho disponible en vez de con las medidas fijas de
 * antes (54 × 74): así crece con la pantalla y el alto sale de `CARD_RATIO`, no
 * de un número a mano que no cuadraba del todo con la carta que se dibuja.
 */
function CruzHero({ ancho }: { ancho: number }) {
  const GAP = 8;
  /*
   * Tres columnas más sus dos huecos.
   *
   * El tope de 72 no es decorativo: sin él la cruz se come 344 px de alto en un
   * móvil normal y empuja el botón fuera de la primera pantalla, que es justo
   * lo contrario de lo que se busca. Con 72 la cruz mide 234 × 318 —frente a
   * los 178 × 238 de antes— y el botón sigue entrando sin desplazar.
   */
  const celda = Math.min(72, Math.floor((ancho - GAP * 2) / 3));
  const alto = celda / CARD_RATIO;
  const paso = celda + GAP;
  const pasoV = alto + GAP;

  const posiciones: { left: number; top: number; centro?: boolean }[] = [
    { left: paso, top: 0 },
    { left: 0, top: pasoV },
    { left: paso, top: pasoV, centro: true },
    { left: paso * 2, top: pasoV },
    { left: paso, top: pasoV * 2 },
  ];

  return (
    <View style={styles.heroWrap}>
      <View style={{ width: celda * 3 + GAP * 2, height: alto * 3 + GAP * 2 }}>
        {posiciones.map((p, i) => (
          <View key={i} style={{ position: 'absolute', left: p.left, top: p.top }}>
            <DorsoNaipe width={celda} borderOpacity={p.centro ? 0.7 : 0.35} />
          </View>
        ))}
      </View>
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
        duration: 540,
        easing: Easing.bezier(0.2, 0.8, 0.3, 1),
      });
    }
  }, [puesta.fase, entrada]);

  useEffect(() => {
    atenuado.value = withTiming(opacidadDestino, { duration: 500 });
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
        duracion={760}
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
  const { CRUZ_DATA } = useContenido();
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
  // Menos aire arriba que antes: la cruz creció y el botón tiene que seguir
  // entrando en pantalla sin desplazar.
  heroWrap: { alignItems: 'center', marginTop: 18, marginBottom: 18 },
  /** La invitación de la entrada, en el lavanda del tema. */
  invitacion: {
    fontFamily: font.serifItalic,
    fontSize: fs(17.5),
    lineHeight: fs(26),
    color: color.lavender,
    textAlign: 'center',
    maxWidth: 300,
    alignSelf: 'center',
    marginBottom: 24,
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
    fontSize: fs(11),
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: goldDim(0.75),
  },
  ultimaPregunta: {
    fontFamily: font.serifItalic,
    fontSize: fs(18),
    lineHeight: fs(24),
    color: color.cream,
    marginTop: 8,
  },
  ultimaMeta: {
    fontFamily: font.sansSemi,
    fontSize: fs(12),
    color: goldDim(0.85),
    marginTop: 7,
  },
  ultimaTexto: {
    fontFamily: font.sans,
    fontSize: fs(13),
    lineHeight: fs(21),
    color: creamDim(0.88),
    marginTop: 8,
  },

  avisoExtra: {
    fontFamily: font.sans,
    fontSize: fs(12.5),
    lineHeight: fs(18),
    color: goldDim(0.85),
    textAlign: 'center',
    marginTop: 10,
  },
  pasoNum: {
    marginTop: 24,
    fontFamily: font.sansSemi,
    fontSize: fs(11),
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    color: lavenderDim(0.55),
    textAlign: 'center',
  },
  pregTitulo: {
    fontFamily: font.serif,
    fontSize: fs(32),
    color: color.cream,
    textAlign: 'center',
    marginTop: 4,
  },
  pregSub: {
    fontFamily: font.sans,
    fontSize: fs(13.5),
    lineHeight: fs(22),
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
    fontSize: fs(22),
    color: color.gold,
    marginTop: 12,
  },
  generoCarta: {
    fontFamily: font.sans,
    fontSize: fs(11.5),
    color: lavenderDim(0.6),
    marginTop: 2,
  },

  // Áreas: Amor, Dinero y trabajo, Salud y energía
  listaAreas: { gap: 12, marginTop: 30 },
  filaArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: radius.cardSmall,
    borderWidth: 1,
    borderColor: cardBorder,
    borderLeftWidth: 3,
    borderLeftColor: color.goldMid,
    backgroundColor: 'rgba(21,13,52,.5)',
  },
  filaAreaNombre: {
    fontFamily: font.serif,
    fontSize: fs(23),
    lineHeight: fs(27),
    color: color.cream,
  },
  filaAreaSub: {
    fontFamily: font.sans,
    fontSize: fs(12),
    color: lavenderDim(0.6),
    marginTop: 3,
  },
  chevronArea: { fontFamily: font.serif, fontSize: fs(26), color: goldDim(0.7) },

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
    fontSize: fs(14),
    lineHeight: fs(20),
    color: color.cream,
  },

  centroLabel: {
    fontFamily: font.sans,
    fontSize: fs(11.5),
    color: lavenderDim(0.6),
    marginTop: 12,
  },
  preguntaCita: {
    fontFamily: font.serifItalic,
    fontSize: fs(20),
    lineHeight: fs(28),
    color: color.gold,
    textAlign: 'center',
  },
  concentraTexto: {
    fontFamily: font.sans,
    fontSize: fs(13.5),
    lineHeight: fs(22),
    color: lavenderDim(0.75),
    marginTop: 14,
    textAlign: 'center',
  },

  tiradaPregunta: {
    marginTop: 16,
    fontFamily: font.serifItalic,
    fontSize: fs(17),
    lineHeight: fs(23),
    color: goldDim(0.9),
    textAlign: 'center',
    maxWidth: 320,
  },
  tiradaBuscando: {
    fontFamily: font.sans,
    fontSize: fs(11.5),
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
    fontSize: fs(11),
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  estado: {
    marginTop: 14,
    minHeight: 24,
    fontFamily: font.serifItalic,
    fontSize: fs(17),
    textAlign: 'center',
  },

  resKicker: {
    marginTop: 22,
    fontFamily: font.sansSemi,
    fontSize: fs(11),
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: lavenderDim(0.55),
  },
  resPosNombre: {
    fontFamily: font.serif,
    fontSize: fs(38),
    lineHeight: fs(42),
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
    fontSize: fs(21),
    lineHeight: fs(24),
    color: color.cream,
  },
  resSubtitulo: {
    fontFamily: font.sans,
    fontSize: fs(11.5),
    lineHeight: fs(17),
    color: lavenderDim(0.65),
    marginTop: 4,
  },
  resTexto: {
    fontFamily: font.sans,
    fontSize: fs(14.5),
    lineHeight: fs(25),
    color: creamDim(0.92),
    marginTop: 20,
  },
});
