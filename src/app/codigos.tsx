/**
 * Códigos Sagrados — un código por semana.
 *
 * Flujo: elegir categoría → barajado → revelación con volteo 3D → código activo
 * con cuenta atrás de 7 días. El código se guarda en Mi Camino si el usuario quiere.
 */
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AvisoNotificacion } from '@/components/AvisoNotificacion';
import { Barajado } from '@/components/Barajado';
import { Emblem } from '@/components/Emblem';
import { PulsoBrillo, PulsoOpacidad } from '@/components/PulsoBrillo';
import { Header, Screen } from '@/components/Screen';
import { Volteo } from '@/components/Volteo';
import {
  BotonGuardar,
  BotonPrimario,
  EnlaceTenue,
  Pildora,
  Toast,
} from '@/components/ui';
import { CODIGO_CATEGORIAS, type CodigoCategoria } from '@/data/codigos';
import { useAnchoContenido } from '@/lib/layout';
import {
  borrarGuardadosDe,
  guardar,
  SEMANA_MS,
  setState,
  ultimoGuardado,
  useStore,
} from '@/lib/store';
import { fmtSemanal, useTick } from '@/lib/time';
import {
  cardBorder,
  color,
  creamDim,
  font,
  goldDim,
  lavenderDim,
  radius,
} from '@/theme/tokens';

type Paso = 'elegir' | 'barajar' | 'revelar' | 'activo';

/** El universo elige el código. Vive fuera del componente para no correr en el render. */
function sortearCodigo(c: CodigoCategoria): number {
  return Math.floor(Math.random() * c.codigos.length);
}

export default function CodigosSagrados() {
  const router = useRouter();
  const s = useStore();
  const [paso, setPaso] = useState<Paso>(() =>
    s.codigoActivo && s.codigoActivo.unlockAt > Date.now() ? 'activo' : 'elegir',
  );
  const [cat, setCat] = useState<string | null>(s.codigoActivo?.cat ?? null);
  const [idx, setIdx] = useState<number | null>(s.codigoActivo?.idx ?? null);
  const [volteada, setVolteada] = useState(false);
  /**
   * Solo es cierto en la sesión en que se activa el código. Al volver más tarde
   * arranca en falso, que es lo que hace que un código sin guardar no reaparezca.
   */
  const [recienActivado, setRecienActivado] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const anchoTarjeta = useAnchoContenido();
  const now = useTick(paso === 'activo');
  const bloqueado = paso === 'activo';
  const restante = Math.max(0, (s.codigoActivo?.unlockAt ?? 0) - now);

  useEffect(() => {
    const pendientes = timers.current;
    return () => pendientes.forEach(clearTimeout);
  }, []);

  function after(ms: number, fn: () => void) {
    timers.current.push(setTimeout(fn, ms));
  }

  const categoria = CODIGO_CATEGORIAS.find((c) => c.key === cat) ?? null;
  const codigo = categoria && idx != null ? categoria.codigos[idx] : null;

  const guardado = ultimoGuardado(s, 'codigo');
  /** ¿El código activo es justo el que está guardado? */
  const yaGuardado = !!codigo && !!categoria && guardado?.numero === codigo.c;

  /**
   * El código solo se ve si se guardó. La única excepción es la sesión en que se
   * acaba de activar: ahí sigue a la vista para poder guardarlo. Si se sale sin
   * guardarlo, no vuelve a aparecer — ni siquiera el intento de esa semana.
   */
  const visible = !!codigo && !!categoria && (yaGuardado || recienActivado);
  const puedeGuardar = visible && !yaGuardado;

  const mostrado =
    visible && codigo && categoria
      ? {
          numero: codigo.c,
          proposito: codigo.p,
          categoria: categoria.nombre,
          palo: categoria.palo,
        }
      : null;

  function elegir(c: CodigoCategoria) {
    const elegido = sortearCodigo(c);
    setCat(c.key);
    setIdx(elegido);
    setVolteada(false);
    setPaso('barajar');
    after(2400, () => {
      setPaso('revelar');
      after(350, () => setVolteada(true));
    });
  }

  function activar() {
    if (!cat || idx == null) return;
    setState({ codigoActivo: { cat, idx, unlockAt: Date.now() + SEMANA_MS } });
    setRecienActivado(true);
    setPaso('activo');
  }

  function volver() {
    if (paso === 'elegir' || paso === 'activo') {
      router.back();
      return;
    }
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (s.codigoActivo && s.codigoActivo.unlockAt > Date.now()) {
      setPaso('activo');
      return;
    }
    setPaso('elegir');
    setCat(null);
    setIdx(null);
  }

  function mostrarToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(null), 2400);
  }

  return (
    <Screen scroll={paso !== 'barajar'}>
      <Header
        kicker="Uno por semana"
        titulo="Código sagrado"
        onBack={volver}
        right={
          <Pildora bloqueado={bloqueado} label={bloqueado ? 'Activo' : 'Disponible'} />
        }
      />

      {paso === 'elegir' && (
        <>
          <Text style={styles.intro}>
            ¿Qué buscas esta semana? El universo elegirá un solo código para ti:
            repítelo 45 veces al día durante toda la semana.
          </Text>
          <View style={styles.lista}>
            {CODIGO_CATEGORIAS.map((c) => (
              <FilaCategoria key={c.key} categoria={c} onPress={() => elegir(c)} />
            ))}
          </View>
          <Text style={styles.pie}>
            Un solo código a la vez: la constancia es el ritual ✦
          </Text>
        </>
      )}

      {paso === 'barajar' && (
        <View style={styles.centro}>
          <Text style={styles.catNombre}>{categoria?.nombre}</Text>
          <View style={{ marginTop: 30 }}>
            <Barajado palo={categoria?.palo ?? 'oros'} />
          </View>
          <PulsoOpacidad style={{ marginTop: 32 }}>
            <Text style={styles.barajando}>El universo elige tu código…</Text>
          </PulsoOpacidad>
          <Text style={styles.barajandoSub}>Concéntrate en lo que deseas atraer.</Text>
        </View>
      )}

      {paso === 'revelar' && codigo && categoria && (
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={styles.kickerCat}>{categoria.nombre}</Text>
          <Text style={styles.tituloGrande}>Tu código de la semana</Text>

          <Volteo
            volteada={volteada}
            duracion={800}
            style={{ width: anchoTarjeta, minHeight: 240, marginTop: 24 }}
            frente={
              <TarjetaCodigo
                numero={codigo.c}
                proposito={codigo.p}
                palo={categoria.palo}
                ancho={anchoTarjeta}
              />
            }
            dorso={
              <View style={[styles.dorsoTarjeta, { width: anchoTarjeta }]}>
                <Emblem name={categoria.palo} size={52} />
              </View>
            }
          />

          <ComoUsarlo />
          <View style={{ flex: 1, minHeight: 22 }} />
          <BotonPrimario onPress={activar} style={{ marginTop: 22 }}>
            Recibir mi código
          </BotonPrimario>
        </View>
      )}

      {paso === 'activo' && (
        <View style={{ alignItems: 'center', flex: 1 }}>
          {/*
            Durante la sesión en que se activa, el código sigue a mano para poder
            guardarlo. Al volver más tarde solo sobrevive lo que se guardó.
          */}
          {mostrado ? (
            <>
              <Text style={styles.kickerCat}>
                {mostrado.categoria} · {puedeGuardar ? 'Código activo' : 'Código guardado'}
              </Text>
              <PulsoBrillo duracion={4000} style={{ width: '100%', marginTop: 10 }}>
                <TarjetaCodigo
                  numero={mostrado.numero}
                  proposito={mostrado.proposito}
                  palo={mostrado.palo}
                  ancho="100%"
                />
              </PulsoBrillo>
            </>
          ) : (
            <View style={styles.sinGuardar}>
              <Text style={styles.sinGuardarTexto}>
                No guardaste tu código, así que no quedó registro de él. El próximo
                podrás guardarlo al recibirlo.
              </Text>
            </View>
          )}

          <View style={styles.filaCuenta}>
            <Text style={styles.cuentaEtiqueta}>Nueva semana, nuevo código en</Text>
            <Text style={styles.cuentaValor}>{fmtSemanal(restante)}</Text>
          </View>

          {mostrado ? <ComoUsarlo /> : null}

          <View style={{ width: '100%', marginTop: 16 }}>
            <AvisoNotificacion
              emblema="oros"
              cuando="lunes 9:00"
              mensaje="🌙 Nueva semana, nuevo código. Ven a recibirlo."
              etiquetaToggle="Avisarme cada semana"
              activo={s.notif.codigo}
              onToggle={() =>
                setState((st) => ({ notif: { ...st.notif, codigo: !st.notif.codigo } }))
              }
            />
          </View>

          {mostrado && (puedeGuardar || yaGuardado) ? (
            <>
              {puedeGuardar ? (
                <Text style={styles.avisoGuardar}>
                  Guárdalo para poder volver a leerlo. Si no lo guardas, se irá con la
                  semana.
                </Text>
              ) : null}
              <BotonGuardar
                style={{ marginTop: 14 }}
                guardado={yaGuardado}
                etiquetaGuardado="Guardado en Mi Camino ✦"
                onPress={() => {
                  guardar({
                    tipo: 'codigo',
                    fecha: Date.now(),
                    numero: mostrado.numero,
                    proposito: mostrado.proposito,
                    categoria: mostrado.categoria,
                  });
                  mostrarToast('✨ Guardado en Mi Camino');
                }}
              >
                Guardar mi código
              </BotonGuardar>
            </>
          ) : null}

          <View style={{ flex: 1, minHeight: 24 }} />
          <EnlaceTenue
            onPress={() => {
              // Deja la sección como recién estrenada: sin código activo y sin
              // nada guardado.
              setState({ codigoActivo: null });
              borrarGuardadosDe('codigo');
              setPaso('elegir');
              setCat(null);
              setIdx(null);
              setRecienActivado(false);
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
  categoria: CodigoCategoria;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${categoria.nombre}. ${categoria.sub}`}
      style={({ pressed }) => [
        styles.filaCat,
        { borderLeftColor: categoria.color, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <Emblem name={categoria.palo} size={42} glow={`${categoria.color}88`} />
      <View style={{ flex: 1 }}>
        <Text style={styles.filaCatNombre}>{categoria.nombre}</Text>
        <Text style={styles.filaCatSub}>{categoria.sub}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

/** Tarjeta dorada con el número del código y su propósito. */
function TarjetaCodigo({
  numero,
  proposito,
  palo,
  ancho = '100%',
}: {
  numero: string;
  proposito: string;
  palo: CodigoCategoria['palo'];
  ancho?: number | `${number}%`;
}) {
  return (
    <LinearGradient
      colors={['#2a1f57', '#150d34', '#0b0726']}
      locations={[0, 0.62, 1]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={[styles.tarjetaCodigo, { width: ancho }]}
    >
      <View style={styles.marcoInterior} pointerEvents="none" />
      <Emblem name={palo} size={36} />
      <Text style={styles.numero}>{numero}</Text>
      <Text style={styles.proposito}>{proposito}</Text>
    </LinearGradient>
  );
}

function ComoUsarlo() {
  return (
    <View style={styles.comoUsarlo}>
      <Text style={styles.comoTitulo}>Cómo usarlo</Text>
      <Text style={styles.comoTexto}>
        Repítelo <Text style={styles.comoFuerte}>45 veces al día</Text>, en voz alta,
        escrito o en tu mente. Hazlo con fe, gratitud y en tiempo presente, toda la
        semana.
      </Text>
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
    maxWidth: 330,
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
    borderColor: cardBorder,
    borderLeftWidth: 3,
    backgroundColor: 'rgba(21,13,52,.5)',
  },
  filaCatNombre: {
    fontFamily: font.serif,
    fontSize: 21,
    lineHeight: 24,
    color: color.cream,
  },
  filaCatSub: {
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
  catNombre: {
    fontFamily: font.serif,
    fontSize: 26,
    color: color.cream,
    textAlign: 'center',
  },
  barajando: {
    fontFamily: font.serifItalic,
    fontSize: 18,
    color: goldDim(0.9),
  },
  barajandoSub: {
    fontFamily: font.sans,
    fontSize: 12.5,
    color: lavenderDim(0.6),
    marginTop: 8,
  },

  kickerCat: {
    fontFamily: font.sansSemi,
    fontSize: 11,
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    color: lavenderDim(0.55),
    marginTop: 18,
    textAlign: 'center',
  },
  tituloGrande: {
    fontFamily: font.serif,
    fontSize: 30,
    color: color.gold,
    textAlign: 'center',
    marginTop: 4,
  },

  tarjetaCodigo: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: goldDim(0.6),
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 26,
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
  numero: {
    fontFamily: font.serifBold,
    fontSize: 56,
    letterSpacing: 3.4,
    lineHeight: 60,
    color: '#f0d488',
    marginTop: 14,
    textAlign: 'center',
  },
  proposito: {
    fontFamily: font.sans,
    fontSize: 14,
    lineHeight: 22,
    color: creamDim(0.92),
    marginTop: 12,
    textAlign: 'center',
  },
  dorsoTarjeta: {
    minHeight: 240,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: goldDim(0.45),
    backgroundColor: '#150d34',
    alignItems: 'center',
    justifyContent: 'center',
  },

  filaCuenta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  cuentaEtiqueta: { fontFamily: font.sans, fontSize: 12, color: lavenderDim(0.65) },
  cuentaValor: { fontFamily: font.serifBold, fontSize: 20, color: color.gold },

  comoUsarlo: {
    width: '100%',
    marginTop: 18,
    borderWidth: 1,
    borderColor: lavenderDim(0.22),
    borderRadius: radius.inner,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(21,13,52,.45)',
  },
  comoTitulo: {
    fontFamily: font.sansSemi,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: goldDim(0.75),
  },
  comoTexto: {
    fontFamily: font.sans,
    fontSize: 13,
    lineHeight: 21,
    color: creamDim(0.88),
    marginTop: 6,
  },
  comoFuerte: { fontFamily: font.sansBold, color: color.gold },
  avisoGuardar: {
    fontFamily: font.sans,
    fontSize: 12.5,
    lineHeight: 19,
    color: goldDim(0.75),
    marginTop: 16,
    textAlign: 'center',
  },
  sinGuardar: {
    width: '100%',
    marginTop: 20,
    borderWidth: 1,
    borderColor: lavenderDim(0.22),
    borderRadius: radius.inner,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(21,13,52,.45)',
  },
  sinGuardarTexto: {
    fontFamily: font.sans,
    fontSize: 13.5,
    lineHeight: 22,
    color: lavenderDim(0.75),
    textAlign: 'center',
  },
});
