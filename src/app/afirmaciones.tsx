/**
 * Afirmaciones — una por semana.
 *
 * Flujo: elegir área → "Canalizando tu energía…" → revelación → bloqueo semanal.
 * Trabajo y Salud aparecen atenuadas y sin interacción ("Próximamente"), como en
 * el diseño: su contenido todavía no existe.
 *
 * Los copys de tiempo se ajustaron de diario a semanal ("de hoy" → "de la semana",
 * "cada 24 horas" → "cada semana"), según la especificación del ritmo de la app.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AvisoNotificacion } from '@/components/AvisoNotificacion';
import { Barajado } from '@/components/Barajado';
import { Emblem } from '@/components/Emblem';
import { Halo } from '@/components/Halo';
import { Latido, PulsoBrillo, PulsoOpacidad } from '@/components/PulsoBrillo';
import { Header, Screen } from '@/components/Screen';
import {
  BotonGuardar,
  BotonSecundario,
  EnlaceTenue,
  Pildora,
  Temporizador,
  Toast,
} from '@/components/ui';
import {
  type AfirmacionCategoria,
} from '@/data/afirmaciones';
import {
  borrarGuardadosDe,
  guardadoDesde,
  guardar,
  SEMANA_MS,
  setState,
  ultimoGuardado,
  useStore,
} from '@/lib/store';
import { fmtLargo, useTick } from '@/lib/time';
import {
  cardBorder,
  color,
  font,
  fs,
  goldDim,
  lavenderDim,
  radius,
} from '@/theme/tokens';
import { abrioSeccion, completoLectura, guardo, vioContenido } from '@/lib/analitica';
import { useContenido } from '@/lib/contenido';
import { avisarAhora } from '@/lib/notifications';

type Paso = 'elegir' | 'canalizar' | 'revelar' | 'bloqueado';

export default function Afirmaciones() {
  useEffect(() => abrioSeccion('afirmaciones'), []);
  const router = useRouter();
  const s = useStore();
  const { AFIRMACION_CATEGORIAS } = useContenido();
  const [paso, setPaso] = useState<Paso>(() =>
    s.afirmacionLock > Date.now() ? 'bloqueado' : 'elegir',
  );
  const [cat, setCat] = useState<string | null>(null);
  const [idx, setIdx] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const now = useTick(paso === 'bloqueado');
  const restante = Math.max(0, s.afirmacionLock - now);
  /** Lo guardado es lo único que se conserva; lo demás se pierde al renovarse. */
  const guardada = ultimoGuardado(s, 'afirmacion');
  /**
   * Cada entrega se guarda una sola vez: se compara contra la fecha de la
   * afirmación en curso, así que al renovarse la semana el botón se reactiva.
   */
  const yaGuardada = guardadoDesde(s, 'afirmacion', s.afirmacionLast?.fecha ?? Infinity);

  useEffect(() => {
    const pendientes = timers.current;
    return () => pendientes.forEach(clearTimeout);
  }, []);

  const categoria = AFIRMACION_CATEGORIAS.find((c) => c.key === cat) ?? null;
  const afirmacion = categoria && idx != null ? categoria.items[idx] : '';

  function elegir(c: AfirmacionCategoria) {
    if (c.proximamente || c.items.length === 0) return;
    setCat(c.key);
    setPaso('canalizar');

    timers.current.push(
      setTimeout(() => {
        // Evita repetir la última afirmación entregada de esa categoría.
        const ultima = s.afirmacionLast?.cat === c.key ? s.afirmacionLast.idx : -1;
        let elegida = Math.floor(Math.random() * c.items.length);
        if (c.items.length > 1 && elegida === ultima) {
          elegida = (elegida + 1) % c.items.length;
        }

        setIdx(elegida);
        setState({
          afirmacionLock: Date.now() + SEMANA_MS,
          afirmacionLast: {
            cat: c.key,
            idx: elegida,
            texto: c.items[elegida],
            nombre: c.nombre,
            fecha: Date.now(),
          },
        });
        setPaso('revelar');
        completoLectura('afirmaciones', { categoria: c.key });
        vioContenido('afirmaciones', { categoria: c.key, indice: elegida });
      }, 2300),
    );
  }

  function volver() {
    if (paso === 'elegir' || paso === 'bloqueado') {
      router.back();
      return;
    }
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (s.afirmacionLock > Date.now()) setPaso('bloqueado');
    else {
      setPaso('elegir');
      setCat(null);
      setIdx(null);
    }
  }

  function mostrarToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(null), 2200);
  }

  return (
    <Screen scroll={paso !== 'canalizar'}>
      <Header
        kicker="Una por semana"
        titulo="Afirmaciones"
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
            Elige el área de tu vida. El universo te entregará la afirmación que tu
            energía necesita esta semana.
          </Text>
          <View style={styles.lista}>
            {AFIRMACION_CATEGORIAS.map((c) => (
              <FilaCategoria key={c.key} categoria={c} onPress={() => elegir(c)} />
            ))}
          </View>
          {/* El kicker de la cabecera ya dice "Una por semana". */}
          <Text style={styles.pie}>Repítela y hazla tuya ✦</Text>
        </>
      )}

      {paso === 'canalizar' && (
        <View style={styles.centro}>
          <Text style={styles.catNombre}>{categoria?.nombre}</Text>
          <View style={{ marginTop: 30 }}>
            {/* Dorso propio de Afirmaciones: círculo, ✦ y el sello inferior */}
            <Barajado
              palo={categoria?.palo ?? 'copas'}
              variante="afirmacion"
              acento={categoria?.color}
            />
          </View>
          <PulsoOpacidad style={{ marginTop: 32 }}>
            <Text style={styles.canalizando}>Canalizando tu energía…</Text>
          </PulsoOpacidad>
          <Text style={styles.canalizandoSub}>
            Respira profundo. La palabra correcta viene en camino.
          </Text>
        </View>
      )}

      {paso === 'revelar' && categoria && (
        /*
          Todo el bloque va arriba y seguido: kicker, tarjeta, instrucción y las
          dos acciones, sin hueco elástico entre medias.
          Hubo dos intentos antes. El primero tenía un `flex: 1` delante de los
          botones que los clavaba al borde inferior. El segundo los centraba con
          `justifyContent`, y eso trae un efecto raro: al retirarse el botón de
          guardar, el grupo se recoloca y la tarjeta BAJA. Alineado arriba, al
          desaparecer el primero el segundo sube y nada de lo de encima se mueve.
        */
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            /*
              Sin guardar va arriba, que es donde tienen que estar los dos
              botones. Guardada, el botón de guardar se retira y quedaría un
              hueco muerto abajo, así que el bloque se centra y ocupa la
              pantalla en vez de dejarla a medias.
            */
            justifyContent: yaGuardada ? 'center' : 'flex-start',
          }}
        >
          <Text style={styles.kickerCat}>Afirmación de {categoria.nombre}</Text>

          <TarjetaAfirmacion categoria={categoria} texto={afirmacion} />

          <Text style={styles.instruccion}>
            {'Repítela esta semana, en voz alta o en tu mente,\ncada vez que tu energía lo pida.'}
          </Text>

          <BotonGuardar
            style={{ marginTop: 26 }}
            guardado={yaGuardada}
            etiquetaGuardado="Guardada en Mi Camino ✦"
            onPress={() => {
              guardar({
                tipo: 'afirmacion',
                fecha: Date.now(),
                texto: afirmacion,
                categoria: categoria.nombre,
              });
              guardo('afirmaciones', { categoria: categoria.key });
              mostrarToast('✨ Guardada en Mi Camino');
            }}
          >
            Guardar mi afirmación
          </BotonGuardar>
          <BotonSecundario style={{ marginTop: 12 }} onPress={() => router.back()}>
            Volver al inicio
          </BotonSecundario>
        </View>
      )}

      {paso === 'bloqueado' && (
        /*
          Centrado y sin hueco elástico, igual que Códigos y Oráculo. El
          `marginTop: 40` del emblema sobra cuando el bloque ya va centrado:
          desplazaba el conjunto hacia abajo en vez de dejarlo en el medio.
        */
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <PulsoBrillo style={{ borderRadius: 37 }}>
            <View style={styles.circuloBloqueo}>
              <Emblem name="copas" size={38} />
            </View>
          </PulsoBrillo>

          <Temporizador
            etiqueta="Tu próxima afirmación estará lista en:"
            valor={fmtLargo(restante)}
          />

          {/* Solo sobrevive lo guardado */}
          {guardada ? (
            <View style={styles.cajaUltima}>
              <Text style={styles.cajaUltimaKicker}>
                Tu afirmación guardada · {guardada.categoria}
              </Text>
              <Text style={styles.cajaUltimaTexto}>“{guardada.texto}”</Text>
            </View>
          ) : (
            <View style={styles.cajaUltima}>
              <Text style={styles.cajaUltimaTexto}>
                No guardaste tu afirmación, así que no quedó registro de ella.
              </Text>
            </View>
          )}

          <AvisoNotificacion
            style={{ marginTop: 22 }}
            emblema="copas"
            cuando="lunes 8:00"
            mensaje="✨ Tu afirmación de la semana te espera."
            etiquetaToggle="Avisarme cada semana"
            activo={s.notif.afirmacion}
            onToggle={() =>
              setState((st) => ({
                notif: { ...st.notif, afirmacion: !st.notif.afirmacion },
              }))
            }
          />

          <BotonSecundario style={{ marginTop: 22 }} onPress={() => router.back()}>
            Volver al inicio
          </BotonSecundario>

          <EnlaceTenue
            onPress={() => {
              // Sección como recién estrenada: temporizador a 0 y sin nada
              // guardado. El aviso es el que llegaría al abrirse la semana.
              setState({ afirmacionLock: 0, afirmacionLast: null });
              borrarGuardadosDe('afirmacion');
              setPaso('elegir');
              setCat(null);
              setIdx(null);
              void avisarAhora('✨ Nueva semana, nueva afirmación. Ven a recibirla.');
              mostrarToast('✨ Sección restablecida');
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

function FilaCategoria({
  categoria,
  onPress,
}: {
  categoria: AfirmacionCategoria;
  onPress: () => void;
}) {
  const pronto = !!categoria.proximamente;
  return (
    <Pressable
      onPress={pronto ? undefined : onPress}
      disabled={pronto}
      accessibilityRole="button"
      accessibilityLabel={`${categoria.nombre}. ${categoria.sub}`}
      style={({ pressed }) => [
        styles.filaCat,
        {
          borderLeftColor: pronto ? lavenderDim(0.3) : categoria.color,
          borderColor: pronto ? goldDim(0.14) : cardBorder,
          opacity: pronto ? 0.55 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <Emblem
        name={categoria.palo}
        size={42}
        opacity={pronto ? 0.4 : 1}
        glow={pronto ? undefined : `${categoria.color}88`}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.filaCatNombre}>{categoria.nombre}</Text>
        <Text style={styles.filaCatSub}>
          {pronto ? `Muy pronto · ${categoria.sub}` : categoria.sub}
        </Text>
      </View>
      {pronto ? (
        <View style={styles.etiquetaPronto}>
          <Text style={styles.etiquetaProntoTexto}>Próximamente</Text>
        </View>
      ) : (
        <Text style={styles.chevron}>›</Text>
      )}
    </Pressable>
  );
}

/**
 * Tarjeta de revelación: halo del color de la categoría, doble borde dorado y el
 * motivo central que late — corazón para Amor, moneda de oro para Dinero.
 */
function TarjetaAfirmacion({
  categoria,
  texto,
}: {
  categoria: AfirmacionCategoria;
  texto: string;
}) {
  return (
    <LinearGradient
      colors={['#2a1f57', '#150d34', '#0b0726']}
      locations={[0, 0.62, 1]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.tarjetaAfirm}
    >
      <Halo
        size={240}
        color={categoria.color}
        opacity={0.2}
        style={{ position: 'absolute', top: -96, alignSelf: 'center' }}
      />
      <View style={styles.marcoInterior} pointerEvents="none" />

      <Latido>
        <Motivo categoria={categoria} />
      </Latido>

      <Text style={styles.comilla}>“</Text>
      <Text style={styles.afirmTexto}>{texto}</Text>
      <View style={styles.separador} />
      <Text style={styles.sello}>Prisma Azul</Text>
    </LinearGradient>
  );
}

/**
 * El motivo que corona la tarjeta, según la categoría.
 *
 * Antes esto era `motif === 'corazon' ? <Corazon/> : <Moneda/>`, y ahí estaba el
 * fallo: `motif` tiene tres valores —`corazon`, `moneda` y `estrella`— así que
 * las dos categorías de `estrella` (Trabajo, de espadas, y Salud, de bastos)
 * caían al `else` y salían con la moneda de oros. Una afirmación de Salud se
 * coronaba con el emblema de otro palo y en dorado, fuera de su color.
 */
function Motivo({ categoria }: { categoria: AfirmacionCategoria }) {
  if (categoria.motif === 'corazon') return <Corazon />;
  if (categoria.motif === 'moneda') return <Moneda />;
  return <Estrella categoria={categoria} />;
}

/**
 * Medallón de la categoría: mismo cuerpo que la moneda —círculo de 72, anillo
 * interior y resplandor— pero teñido con su color y con su propio emblema, para
 * que Trabajo y Salud se lean como suyas y no como una moneda prestada.
 */
function Estrella({ categoria }: { categoria: AfirmacionCategoria }) {
  const c = categoria.color;
  return (
    <View style={[styles.medallon, { borderColor: c, shadowColor: c }]}>
      <LinearGradient
        // El color de la categoría en tres intensidades: el degradado de la
        // moneda, sin fijar el dorado.
        colors={[`${c}f2`, `${c}b8`, `${c}5c`]}
        locations={[0, 0.48, 1]}
        start={{ x: 0.35, y: 0.28 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.medallonAnillo, { borderColor: `${c}8c` }]} pointerEvents="none" />
      <Emblem name={categoria.palo} size={34} opacity={0.5} />
    </View>
  );
}

/** Corazón rosa: cuadrado girado 45° más dos lóbulos circulares. */
function Corazon() {
  return (
    <View style={styles.corazonCaja}>
      <View style={styles.corazonCuerpo}>
        <LinearGradient
          colors={['#f0b9cd', '#e79ab4', '#c9769a']}
          locations={[0, 0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['#f0b9cd', '#e79ab4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.corazonLobuloSuperior}
        />
        <LinearGradient
          colors={['#f0b9cd', '#c9769a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.corazonLobuloIzquierdo}
        />
      </View>
    </View>
  );
}

/** Moneda de oro con el emblema de oros oscurecido al centro. */
function Moneda() {
  return (
    <View style={styles.moneda}>
      <LinearGradient
        colors={['#f6e2a8', '#ecc874', '#b98a3e']}
        locations={[0, 0.48, 1]}
        start={{ x: 0.35, y: 0.28 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.monedaAnillo} pointerEvents="none" />
      <Emblem name="oros" size={36} opacity={0.45} />
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    textAlign: 'center',
    fontFamily: font.sans,
    fontSize: fs(14),
    lineHeight: fs(23),
    color: lavenderDim(0.78),
    maxWidth: 320,
    alignSelf: 'center',
    marginTop: 22,
  },
  lista: { gap: 12, marginTop: 22 },
  filaCat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 16,
    borderRadius: radius.cardSmall,
    borderWidth: 1,
    borderLeftWidth: 3,
    backgroundColor: 'rgba(21,13,52,.5)',
  },
  filaCatNombre: {
    fontFamily: font.serif,
    fontSize: fs(21),
    lineHeight: fs(24),
    color: color.cream,
  },
  filaCatSub: {
    fontFamily: font.sans,
    fontSize: fs(12),
    lineHeight: fs(17),
    color: lavenderDim(0.65),
    marginTop: 3,
  },
  chevron: { fontFamily: font.serif, fontSize: fs(24), color: goldDim(0.7) },
  etiquetaPronto: {
    borderWidth: 1,
    borderColor: lavenderDim(0.3),
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  etiquetaProntoTexto: {
    fontFamily: font.sansBold,
    fontSize: fs(11),
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: lavenderDim(0.6),
  },
  pie: {
    textAlign: 'center',
    fontFamily: font.sans,
    fontSize: fs(11.5),
    color: lavenderDim(0.45),
    marginTop: 18,
  },

  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  catNombre: {
    fontFamily: font.serif,
    fontSize: fs(26),
    color: color.cream,
    textAlign: 'center',
  },
  canalizando: { fontFamily: font.serifItalic, fontSize: fs(18), color: goldDim(0.9) },
  canalizandoSub: {
    fontFamily: font.sans,
    fontSize: fs(12.5),
    color: lavenderDim(0.6),
    marginTop: 8,
  },

  kickerCat: {
    fontFamily: font.sansSemi,
    fontSize: fs(11),
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    color: lavenderDim(0.55),
    marginTop: 18,
    textAlign: 'center',
  },
  tituloGrande: {
    fontFamily: font.serif,
    fontSize: fs(30),
    color: color.gold,
    textAlign: 'center',
    marginTop: 4,
  },

  tarjetaAfirm: {
    width: '100%',
    marginTop: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: goldDim(0.55),
    paddingTop: 32,
    paddingHorizontal: 26,
    paddingBottom: 30,
    alignItems: 'center',
    overflow: 'hidden',
  },
  marcoInterior: {
    position: 'absolute',
    top: 9,
    left: 9,
    right: 9,
    bottom: 9,
    borderWidth: 1,
    borderColor: goldDim(0.35),
    borderRadius: 15,
  },
  comilla: {
    fontFamily: font.serif,
    fontSize: fs(30),
    color: goldDim(0.55),
    marginTop: 14,
    lineHeight: fs(30),
  },
  // La afirmación es lo único que se viene a leer aquí: manda en la tarjeta.
  afirmTexto: {
    fontFamily: font.serifItalicBold,
    fontSize: fs(27),
    lineHeight: fs(39),
    color: color.cream,
    textAlign: 'center',
    marginTop: 4,
  },
  separador: {
    width: 44,
    height: 1,
    backgroundColor: goldDim(0.7),
    marginTop: 18,
  },
  sello: {
    fontFamily: font.sansSemi,
    fontSize: fs(11),
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: lavenderDim(0.55),
    marginTop: 12,
  },

  corazonCaja: { width: 64, height: 60, alignItems: 'center' },
  corazonCuerpo: {
    width: 44,
    height: 44,
    marginTop: 12,
    borderRadius: 6,
    transform: [{ rotate: '45deg' }],
    overflow: 'visible',
    shadowColor: '#e79ab4',
    shadowOpacity: 0.65,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  corazonLobuloSuperior: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    top: -22,
    left: 0,
  },
  corazonLobuloIzquierdo: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    top: 0,
    left: -22,
  },

  // Mismo cuerpo que la moneda, con color y emblema de la categoría.
  medallon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 2,
    marginBottom: 6,
    shadowOpacity: 0.55,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  medallonAnillo: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    bottom: 6,
    borderRadius: 30,
    borderWidth: 1,
  },

  moneda: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#f0d488',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 2,
    marginBottom: 6,
    shadowColor: '#ecc874',
    shadowOpacity: 0.55,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  monedaAnillo: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    bottom: 6,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(28,19,56,.45)',
  },

  instruccion: {
    fontFamily: font.sans,
    fontSize: fs(13),
    lineHeight: fs(21),
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
  cajaUltima: {
    width: '100%',
    marginTop: 26,
    borderWidth: 1,
    borderColor: goldDim(0.3),
    borderRadius: radius.inner,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(21,13,52,.5)',
    alignItems: 'center',
  },
  cajaUltimaKicker: {
    fontFamily: font.sansSemi,
    fontSize: fs(11),
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: goldDim(0.7),
    textAlign: 'center',
  },
  // Acompaña al aumento de `afirmTexto`: es la misma afirmación, ya guardada.
  cajaUltimaTexto: {
    fontFamily: font.serifItalic,
    fontSize: fs(21),
    lineHeight: fs(31),
    color: color.cream,
    marginTop: 8,
    textAlign: 'center',
  },
});
