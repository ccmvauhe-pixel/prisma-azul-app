/**
 * Oráculo del día — 4 oráculos y sus cartas.
 * Portado de `oraculo-data.js` (fuente: PDFs de Gilda). Contenido literal.
 */
import type { Suit } from '@/theme/tokens';

export type OraculoCarta = {
  id: number;
  mensaje: string;
  titulo?: string;
  claves?: string;
};

export type Oraculo = {
  key: string;
  nombre: string;
  sub: string;
  color: string;
  palo: Suit;
  tipo: 'frase' | 'titulo';
  cartas: OraculoCarta[];
};

export const ORACULOS: Oraculo[] = [
  {
    "key": "alma",
    "nombre": "Lo que su alma desea decirte",
    "sub": "Mensajes que esa persona guarda en silencio",
    "color": "#cdbdf2",
    "palo": "copas",
    "tipo": "frase",
    "cartas": [
      {
        "id": 1,
        "mensaje": "No he podido olvidarte."
      },
      {
        "id": 2,
        "mensaje": "Pienso en ti más de lo que imaginas."
      },
      {
        "id": 3,
        "mensaje": "Comprendí tu valor cuando ya no estabas."
      },
      {
        "id": 4,
        "mensaje": "Me arrepiento de muchas cosas."
      },
      {
        "id": 5,
        "mensaje": "Quisiera volver a hablar contigo."
      },
      {
        "id": 6,
        "mensaje": "Sigo sintiendo una conexión contigo."
      },
      {
        "id": 7,
        "mensaje": "Aún ocupas un lugar en mi corazón."
      },
      {
        "id": 8,
        "mensaje": "El orgullo me mantiene en silencio."
      },
      {
        "id": 9,
        "mensaje": "Extraño tu presencia."
      },
      {
        "id": 10,
        "mensaje": "Sueño contigo con frecuencia."
      },
      {
        "id": 11,
        "mensaje": "No fue fácil dejarte ir."
      },
      {
        "id": 12,
        "mensaje": "Quisiera saber cómo estás."
      },
      {
        "id": 13,
        "mensaje": "Todavía guardo esperanza."
      },
      {
        "id": 14,
        "mensaje": "Estoy sanando mis heridas."
      },
      {
        "id": 15,
        "mensaje": "Necesito tiempo para cambiar."
      },
      {
        "id": 16,
        "mensaje": "Quiero pedirte perdón."
      },
      {
        "id": 17,
        "mensaje": "Me cuesta expresar lo que siento."
      },
      {
        "id": 18,
        "mensaje": "Hay palabras que nunca te dije."
      },
      {
        "id": 19,
        "mensaje": "Me haces mucha falta."
      },
      {
        "id": 20,
        "mensaje": "Tu recuerdo sigue vivo en mí."
      },
      {
        "id": 21,
        "mensaje": "Nadie ha logrado reemplazarte."
      },
      {
        "id": 22,
        "mensaje": "Me di cuenta de mis errores."
      },
      {
        "id": 23,
        "mensaje": "Ojalá hubiera actuado diferente."
      },
      {
        "id": 24,
        "mensaje": "A veces deseo empezar de nuevo."
      },
      {
        "id": 25,
        "mensaje": "Estoy luchando contra mis miedos."
      },
      {
        "id": 26,
        "mensaje": "La distancia me hizo reflexionar."
      },
      {
        "id": 27,
        "mensaje": "Nunca dejé de preocuparme por ti."
      },
      {
        "id": 28,
        "mensaje": "Me duele haberte lastimado."
      },
      {
        "id": 29,
        "mensaje": "Sigo aprendiendo gracias a nuestra historia."
      },
      {
        "id": 30,
        "mensaje": "Quisiera que el destino nos reúna otra vez."
      },
      {
        "id": 31,
        "mensaje": "Hay algo pendiente entre nosotros."
      },
      {
        "id": 32,
        "mensaje": "Mi corazón aún te recuerda."
      },
      {
        "id": 33,
        "mensaje": "No todo está perdido."
      },
      {
        "id": 34,
        "mensaje": "Estoy reuniendo valor para acercarme."
      },
      {
        "id": 35,
        "mensaje": "Aún siento amor por ti."
      },
      {
        "id": 36,
        "mensaje": "Te extraño en silencio."
      },
      {
        "id": 37,
        "mensaje": "El tiempo cambió mi forma de verte."
      },
      {
        "id": 38,
        "mensaje": "Cada recuerdo me acerca a ti."
      },
      {
        "id": 39,
        "mensaje": "Espero que aún haya una oportunidad."
      },
      {
        "id": 40,
        "mensaje": "No he encontrado lo que tenía contigo."
      },
      {
        "id": 41,
        "mensaje": "Mi silencio no significa indiferencia."
      },
      {
        "id": 42,
        "mensaje": "Te llevo en mis pensamientos."
      },
      {
        "id": 43,
        "mensaje": "Siento que aún estamos conectados."
      },
      {
        "id": 44,
        "mensaje": "Gracias por todo lo que vivimos."
      },
      {
        "id": 45,
        "mensaje": "Siempre ocuparás un lugar especial en mí."
      },
      {
        "id": 46,
        "mensaje": "Me gustaría sanar esta historia contigo."
      },
      {
        "id": 47,
        "mensaje": "Estoy listo para dejar atrás el pasado."
      },
      {
        "id": 48,
        "mensaje": "El universo sigue cruzando nuestros caminos."
      },
      {
        "id": 49,
        "mensaje": "Confío en que el destino hará lo correcto."
      },
      {
        "id": 50,
        "mensaje": "Aún no he dicho la última palabra."
      }
    ]
  },
  {
    "key": "sentimental",
    "nombre": "Situación sentimental",
    "sub": "La energía que rodea tu corazón hoy",
    "color": "#e79ab4",
    "palo": "copas",
    "tipo": "titulo",
    "cartas": [
      {
        "id": 1,
        "titulo": "Reencuentro",
        "claves": "Regreso, destino, oportunidad, conexión",
        "mensaje": "Hay una nueva oportunidad para aquello que parecía terminado."
      },
      {
        "id": 2,
        "titulo": "Distancia",
        "claves": "Espacio, reflexión, pausa, espera",
        "mensaje": "El tiempo es necesario para que las emociones encuentren claridad."
      },
      {
        "id": 3,
        "titulo": "Comunicación",
        "claves": "Conversación, mensaje, sinceridad, verdad",
        "mensaje": "Lo que permanece en silencio pronto buscará ser expresado."
      },
      {
        "id": 4,
        "titulo": "Sanación",
        "claves": "Perdón, calma, liberación, crecimiento",
        "mensaje": "Antes de amar plenamente, el corazón necesita sanar."
      },
      {
        "id": 5,
        "titulo": "Destino",
        "claves": "Sincronía, aprendizaje, camino, propósito",
        "mensaje": "Nada ocurre por casualidad; esta conexión tiene un propósito."
      },
      {
        "id": 6,
        "titulo": "Confusión",
        "claves": "Dudas, indecisión, incertidumbre, bloqueo",
        "mensaje": "Las respuestas llegarán cuando las emociones se tranquilicen."
      },
      {
        "id": 7,
        "titulo": "Atracción",
        "claves": "Deseo, química, magnetismo, pasión",
        "mensaje": "Existe una energía que sigue acercándolos."
      },
      {
        "id": 8,
        "titulo": "Cambio",
        "claves": "Transformación, evolución, movimiento, renovación",
        "mensaje": "Lo que hoy conoces pronto tomará un rumbo diferente."
      },
      {
        "id": 9,
        "titulo": "Paciencia",
        "claves": "Espera, confianza, proceso, tiempo",
        "mensaje": "No fuerces los acontecimientos; todo tiene su momento."
      },
      {
        "id": 10,
        "titulo": "Compromiso",
        "claves": "Estabilidad, unión, responsabilidad, futuro",
        "mensaje": "La relación puede fortalecerse si ambos están dispuestos."
      },
      {
        "id": 11,
        "titulo": "Liberación",
        "claves": "Cierre, desapego, paz, independencia",
        "mensaje": "Soltar abrirá espacio para algo mejor."
      },
      {
        "id": 12,
        "titulo": "Reciprocidad",
        "claves": "Equilibrio, correspondencia, cariño, armonía",
        "mensaje": "Lo que entregas también puede regresar a ti."
      },
      {
        "id": 13,
        "titulo": "Esperanza",
        "claves": "Fe, ilusión, confianza, luz",
        "mensaje": "No todo está perdido; aún hay posibilidades."
      },
      {
        "id": 14,
        "titulo": "Nostalgia",
        "claves": "Recuerdos, pasado, añoranza, emociones",
        "mensaje": "Alguien sigue pensando en lo vivido."
      },
      {
        "id": 15,
        "titulo": "Verdad",
        "claves": "Sinceridad, revelación, claridad, honestidad",
        "mensaje": "Una verdad importante saldrá a la luz."
      },
      {
        "id": 16,
        "titulo": "Decisión",
        "claves": "Elección, determinación, cambio, acción",
        "mensaje": "Ha llegado el momento de elegir un camino."
      },
      {
        "id": 17,
        "titulo": "Renacer",
        "claves": "Nuevos comienzos, oportunidad, evolución, esperanza",
        "mensaje": "Después de la tormenta nace una nueva etapa."
      },
      {
        "id": 18,
        "titulo": "Encuentro",
        "claves": "Cita, acercamiento, coincidencia, conexión",
        "mensaje": "El destino prepara un momento importante."
      },
      {
        "id": 19,
        "titulo": "Protección",
        "claves": "Guía, apoyo, seguridad, confianza",
        "mensaje": "No estás solo; hay fuerzas que cuidan este proceso."
      },
      {
        "id": 20,
        "titulo": "Miedo",
        "claves": "Inseguridad, heridas, defensa, resistencia",
        "mensaje": "El temor puede estar impidiendo avanzar."
      },
      {
        "id": 21,
        "titulo": "Perdón",
        "claves": "Reconciliación, comprensión, paz, liberación",
        "mensaje": "Perdonar cambia el rumbo del corazón."
      },
      {
        "id": 22,
        "titulo": "Espera",
        "claves": "Paciencia, calma, maduración, confianza",
        "mensaje": "Lo que buscas necesita más tiempo."
      },
      {
        "id": 23,
        "titulo": "Ilusión",
        "claves": "Sueños, optimismo, posibilidades, alegría",
        "mensaje": "Permítete creer nuevamente en el amor."
      },
      {
        "id": 24,
        "titulo": "Aprendizaje",
        "claves": "Experiencia, crecimiento, evolución, sabiduría",
        "mensaje": "Cada relación deja una enseñanza valiosa."
      },
      {
        "id": 25,
        "titulo": "Reconexión",
        "claves": "Regreso, vínculo, acercamiento, oportunidad",
        "mensaje": "Los caminos pueden volver a unirse."
      },
      {
        "id": 26,
        "titulo": "Silencio",
        "claves": "Introspección, pausa, observación, reflexión",
        "mensaje": "No confundas el silencio con la falta de interés."
      },
      {
        "id": 27,
        "titulo": "Lealtad",
        "claves": "Fidelidad, confianza, estabilidad, respeto",
        "mensaje": "La sinceridad será la base de esta conexión."
      },
      {
        "id": 28,
        "titulo": "Tentación",
        "claves": "Deseo, impulso, atracción, elección",
        "mensaje": "No todo lo que atrae conduce al bienestar."
      },
      {
        "id": 29,
        "titulo": "Abundancia",
        "claves": "Plenitud, bienestar, felicidad, prosperidad",
        "mensaje": "El amor florece cuando también floreces tú."
      },
      {
        "id": 30,
        "titulo": "Intuición",
        "claves": "Señales, percepción, sabiduría, guía interior",
        "mensaje": "Tu corazón ya conoce la respuesta."
      },
      {
        "id": 31,
        "titulo": "Reconciliación",
        "claves": "Perdón, regreso, oportunidad, unión",
        "mensaje": "Existe la posibilidad de reparar lo que se rompió."
      },
      {
        "id": 32,
        "titulo": "Límites",
        "claves": "Respeto, autoestima, equilibrio, protección",
        "mensaje": "Amar también significa poner límites sanos."
      },
      {
        "id": 33,
        "titulo": "Valor",
        "claves": "Autoestima, confianza, fortaleza, dignidad",
        "mensaje": "Reconoce lo mucho que vales."
      },
      {
        "id": 34,
        "titulo": "Sorpresa",
        "claves": "Noticias, cambio, inesperado, alegría",
        "mensaje": "Algo que no esperabas puede transformar la situación."
      },
      {
        "id": 35,
        "titulo": "Claridad",
        "claves": "Certeza, comprensión, verdad, enfoque",
        "mensaje": "Las dudas comenzarán a disiparse."
      },
      {
        "id": 36,
        "titulo": "Pasión",
        "claves": "Intensidad, deseo, química, emoción",
        "mensaje": "La atracción sigue viva."
      },
      {
        "id": 37,
        "titulo": "Elección del corazón",
        "claves": "Sentimientos, decisión, autenticidad, amor",
        "mensaje": "Escucha lo que realmente siente tu corazón."
      },
      {
        "id": 38,
        "titulo": "Ciclo cerrado",
        "claves": "Final, aceptación, renovación, paz",
        "mensaje": "Para recibir algo nuevo, primero debes cerrar una etapa."
      },
      {
        "id": 39,
        "titulo": "Conexión espiritual",
        "claves": "Alma, destino, aprendizaje, vínculo",
        "mensaje": "Existe un lazo que trasciende lo evidente."
      },
      {
        "id": 40,
        "titulo": "Esperanza renovada",
        "claves": "Optimismo, oportunidad, fe, renacer",
        "mensaje": "El universo abre un nuevo camino para ti."
      },
      {
        "id": 41,
        "titulo": "Corazón abierto",
        "claves": "Confianza, entrega, amor, vulnerabilidad",
        "mensaje": "Permítete recibir el amor que mereces."
      },
      {
        "id": 42,
        "titulo": "Equilibrio",
        "claves": "Armonía, reciprocidad, estabilidad, paz",
        "mensaje": "Cuando ambas energías se equilibran, el amor fluye."
      },
      {
        "id": 43,
        "titulo": "Nuevos horizontes",
        "claves": "Cambio, oportunidades, expansión, futuro",
        "mensaje": "Lo mejor puede llegar desde donde menos lo imaginas."
      },
      {
        "id": 44,
        "titulo": "Manifestación",
        "claves": "Intención, creación, energía, propósito",
        "mensaje": "Tus pensamientos y acciones están dando forma a tu realidad."
      },
      {
        "id": 45,
        "titulo": "Amor verdadero",
        "claves": "Autenticidad, compromiso, respeto, plenitud",
        "mensaje": "El amor que permanece es el que nace desde la verdad."
      }
    ]
  },
  {
    "key": "contacto",
    "nombre": "Energías del contacto cero",
    "sub": "Lo que se mueve mientras no hay contacto",
    "color": "#8db0ec",
    "palo": "espadas",
    "tipo": "frase",
    "cartas": [
      {
        "id": 1,
        "mensaje": "El contacto cero está por romperse."
      },
      {
        "id": 2,
        "mensaje": "Se acerca una comunicación."
      },
      {
        "id": 3,
        "mensaje": "Hay sentimientos que siguen vivos."
      },
      {
        "id": 4,
        "mensaje": "La distancia es solo temporal."
      },
      {
        "id": 5,
        "mensaje": "La energía comienza a cambiar."
      },
      {
        "id": 6,
        "mensaje": "La otra persona piensa en ti."
      },
      {
        "id": 7,
        "mensaje": "El universo está moviendo las piezas."
      },
      {
        "id": 8,
        "mensaje": "Se aproxima un reencuentro."
      },
      {
        "id": 9,
        "mensaje": "Hay asuntos pendientes."
      },
      {
        "id": 10,
        "mensaje": "La conexión sigue activa."
      },
      {
        "id": 11,
        "mensaje": "El silencio terminará pronto."
      },
      {
        "id": 12,
        "mensaje": "Una conversación traerá claridad."
      },
      {
        "id": 13,
        "mensaje": "Se abre una nueva oportunidad."
      },
      {
        "id": 14,
        "mensaje": "La reconciliación es posible."
      },
      {
        "id": 15,
        "mensaje": "Los bloqueos comienzan a desaparecer."
      },
      {
        "id": 16,
        "mensaje": "La verdad saldrá a la luz."
      },
      {
        "id": 17,
        "mensaje": "Ambos están aprendiendo una lección."
      },
      {
        "id": 18,
        "mensaje": "El tiempo juega a tu favor."
      },
      {
        "id": 19,
        "mensaje": "La paciencia dará frutos."
      },
      {
        "id": 20,
        "mensaje": "No todo está perdido."
      },
      {
        "id": 21,
        "mensaje": "Una señal confirmará tus dudas."
      },
      {
        "id": 22,
        "mensaje": "La energía del amor sigue presente."
      },
      {
        "id": 23,
        "mensaje": "Es momento de confiar."
      },
      {
        "id": 24,
        "mensaje": "Algo inesperado cambiará la situación."
      },
      {
        "id": 25,
        "mensaje": "La conexión necesita sanar."
      },
      {
        "id": 26,
        "mensaje": "Se están cerrando viejas heridas."
      },
      {
        "id": 27,
        "mensaje": "El destino aún no escribe el final."
      },
      {
        "id": 28,
        "mensaje": "Habrá un cambio importante."
      },
      {
        "id": 29,
        "mensaje": "La otra persona está reflexionando."
      },
      {
        "id": 30,
        "mensaje": "El orgullo está perdiendo fuerza."
      },
      {
        "id": 31,
        "mensaje": "El miedo retrasa el acercamiento."
      },
      {
        "id": 32,
        "mensaje": "La energía favorece el diálogo."
      },
      {
        "id": 33,
        "mensaje": "La respuesta llegará cuando menos lo esperes."
      },
      {
        "id": 34,
        "mensaje": "Es momento de soltar el control."
      },
      {
        "id": 35,
        "mensaje": "Todo ocurre en el momento perfecto."
      },
      {
        "id": 36,
        "mensaje": "El universo te está protegiendo."
      },
      {
        "id": 37,
        "mensaje": "Esta historia aún tiene algo que enseñar."
      },
      {
        "id": 38,
        "mensaje": "Tu paz es la prioridad."
      },
      {
        "id": 39,
        "mensaje": "La separación tenía un propósito."
      },
      {
        "id": 40,
        "mensaje": "Lo que es para ti encontrará el camino."
      },
      {
        "id": 41,
        "mensaje": "Se aproxima un nuevo comienzo."
      },
      {
        "id": 42,
        "mensaje": "Hay una decisión importante por tomar."
      },
      {
        "id": 43,
        "mensaje": "Una nueva etapa está por iniciar."
      },
      {
        "id": 44,
        "mensaje": "La energía favorece el perdón."
      },
      {
        "id": 45,
        "mensaje": "El amor propio transformará esta conexión."
      },
      {
        "id": 46,
        "mensaje": "Si esta persona no regresa, llegará alguien mejor para ti."
      },
      {
        "id": 47,
        "mensaje": "El cierre de este ciclo abrirá una puerta más grande."
      },
      {
        "id": 48,
        "mensaje": "Tu corazón volverá a sonreír."
      },
      {
        "id": 49,
        "mensaje": "Confía en el camino que el universo está trazando."
      },
      {
        "id": 50,
        "mensaje": "Lo mejor para tu alma está cada vez más cerca."
      }
    ]
  },
  {
    "key": "tiempo",
    "nombre": "El Tiempo Sagrado",
    "sub": "Cuándo llegará lo que esperas",
    "color": "#ecc874",
    "palo": "oros",
    "tipo": "titulo",
    "cartas": [
      {
        "id": 1,
        "titulo": "Está más cerca de lo que imaginas",
        "mensaje": "La energía ya comenzó a moverse, aunque todavía no puedas verlo. Lo que esperas está acercándose paso a paso. Mantén la confianza y no permitas que la impaciencia te haga abandonar el camino justo antes de recibir lo que tanto has esperado."
      },
      {
        "id": 2,
        "titulo": "En pocos días",
        "mensaje": "Los próximos días traerán noticias, movimientos o señales importantes. Mantente atento, porque una pequeña acción o una conversación pueden marcar el inicio del cambio que estabas esperando."
      },
      {
        "id": 3,
        "titulo": "El tiempo divino",
        "mensaje": "No existe el retraso cuando el universo está preparando el mejor resultado para ti. Todo llegará exactamente cuando pueda sostenerse en tu vida. Confía en el proceso; cada día te acerca más a tu propósito."
      },
      {
        "id": 4,
        "titulo": "Cuando sueltes el control",
        "mensaje": "Mientras intentes controlar cada detalle, la energía encontrará resistencia. Permite que el universo haga su parte. Soltar no significa renunciar; significa confiar en que lo correcto encontrará el camino hacia ti."
      },
      {
        "id": 5,
        "titulo": "La espera está llegando a su fin",
        "mensaje": "Has recorrido una etapa de paciencia, aprendizaje y crecimiento. Esa espera está terminando y muy pronto comenzarás a ver resultados concretos. Mantén tu corazón abierto para recibirlos."
      },
      {
        "id": 6,
        "titulo": "El universo ya está moviendo las piezas",
        "mensaje": "Aunque hoy no puedas verlo, situaciones, personas y oportunidades ya se están acomodando a tu favor. Lo que parecía detenido está cobrando fuerza detrás del escenario."
      },
      {
        "id": 7,
        "titulo": "No vale la pena seguir esperando",
        "mensaje": "Esta carta te invita a recuperar tu poder. No detengas tu vida esperando que alguien cambie o regrese. Cuando eliges avanzar, el universo abre caminos mucho más grandes de los que imaginabas."
      },
      {
        "id": 8,
        "titulo": "El destino nunca llega tarde",
        "mensaje": "Lo que está destinado para ti no puede perderse. Si algo aún no ocurre, es porque todavía se está preparando el momento perfecto. Confía: lo que es para tu mayor bien siempre encuentra la forma de llegar."
      },
      {
        "id": 9,
        "titulo": "Antes de que termine este mes",
        "mensaje": "La energía se está acelerando y los acontecimientos comenzarán a tomar forma muy pronto. Antes de que finalice este ciclo, recibirás una señal, una respuesta o un movimiento que te ayudará a comprender que todo está avanzando."
      },
      {
        "id": 10,
        "titulo": "El próximo mes traerá movimiento",
        "mensaje": "Lo que hoy parece inmóvil empezará a transformarse. El próximo mes abrirá puertas, traerá noticias o pondrá frente a ti nuevas oportunidades. Mantente dispuesto a recibir los cambios."
      },
      {
        "id": 11,
        "titulo": "Dentro de tres meses",
        "mensaje": "El universo necesita un poco más de tiempo para acomodar las circunstancias. No interpretes esta espera como un rechazo; es parte de la preparación para que lo que llegue sea estable y duradero."
      },
      {
        "id": 12,
        "titulo": "Dentro de seis meses",
        "mensaje": "Se está desarrollando un proceso profundo. Durante este tiempo habrá aprendizajes, cambios internos y situaciones que te prepararán para recibir aquello que hoy estás preguntando."
      },
      {
        "id": 13,
        "titulo": "El momento perfecto ya se está acercando",
        "mensaje": "Quizá todavía no veas resultados, pero la energía ya comenzó a moverse. Cada día te acerca más a aquello que tanto has esperado. La paciencia pronto dará paso a la manifestación."
      },
      {
        "id": 14,
        "titulo": "Solo falta un último paso",
        "mensaje": "Has avanzado más de lo que imaginas. Antes de que todo se manifieste, será necesario dar un pequeño paso, tomar una decisión o cerrar un asunto pendiente. Después de eso, el camino se abrirá."
      },
      {
        "id": 15,
        "titulo": "Primero debes cerrar un ciclo",
        "mensaje": "El universo no puede llenar una mano que aún se aferra al pasado. Libera lo que ya cumplió su propósito y deja espacio para recibir lo nuevo. El cierre de hoy será el comienzo de mañana."
      },
      {
        "id": 16,
        "titulo": "La respuesta llegará cuando menos lo esperes",
        "mensaje": "Cuando dejes de mirar el reloj y de buscar señales a cada instante, la vida te sorprenderá. Muchas de las mejores manifestaciones llegan cuando recuperamos la calma y permitimos que todo fluya."
      },
      {
        "id": 17,
        "titulo": "Una señal confirmará el momento",
        "mensaje": "No tendrás que adivinar cuándo actuar. El universo pondrá frente a ti una sincronía, una conversación, un sueño o una coincidencia que disipará tus dudas. Confía en tu intuición cuando esa señal aparezca."
      },
      {
        "id": 18,
        "titulo": "Todo se está alineando a tu favor",
        "mensaje": "Aunque algunas piezas todavía parezcan fuera de lugar, todo está encontrando su sitio. Lo que hoy parece una demora es, en realidad, una preparación para que recibas exactamente lo que necesitas."
      },
      {
        "id": 19,
        "titulo": "El tiempo de la cosecha",
        "mensaje": "Has sembrado más de lo que imaginas. Cada esfuerzo, cada aprendizaje y cada paso que has dado están creando el momento perfecto para recoger los frutos. La cosecha llega cuando está madura, no cuando la impaciencia la reclama. Muy pronto verás cómo aquello que sembraste empieza a manifestarse."
      },
      {
        "id": 20,
        "titulo": "El reloj del universo",
        "mensaje": "No todo depende de tu esfuerzo. Existen sincronías, encuentros y circunstancias que deben coincidir para que aquello que deseas pueda manifestarse. El universo está moviendo piezas que aún no alcanzas a ver. Confía en que cada acontecimiento llegará exactamente cuando deba llegar."
      },
      {
        "id": 21,
        "titulo": "La espera consciente",
        "mensaje": "Esperar no significa detener tu vida. Mientras aquello que anhelas llega, el universo te invita a seguir creciendo, disfrutando y construyendo nuevos caminos. Cuando el momento llegue, descubrirás que la espera también fue parte del regalo."
      },
      {
        "id": 22,
        "titulo": "Un paso más",
        "mensaje": "Estás mucho más cerca de lo que imaginas. A veces el mayor cambio sucede justo antes de que todo se manifieste. No abandones el camino ahora; un pequeño paso más puede marcar la diferencia entre rendirte y alcanzar aquello que tanto has esperado."
      },
      {
        "id": 23,
        "titulo": "El tiempo de soltar",
        "mensaje": "Hay momentos en los que el universo responde cuando dejas de controlar el resultado. Soltar no es renunciar; es confiar en que lo que es para ti encontrará la forma de llegar. Al liberar la ansiedad, permites que la energía fluya con mayor facilidad."
      },
      {
        "id": 24,
        "titulo": "Todo tiene su estación",
        "mensaje": "Así como la naturaleza tiene primavera, verano, otoño e invierno, tu vida también atraviesa ciclos. No intentes adelantar una etapa que todavía necesita madurar. Honra el momento en el que estás, porque cada estación tiene una enseñanza y un propósito."
      },
      {
        "id": 25,
        "titulo": "El momento indicado",
        "mensaje": "No será antes ni después. Lo que está destinado para ti llegará cuando las condiciones sean las adecuadas para que puedas recibirlo plenamente. Lo que hoy parece tardanza, mañana tendrá todo el sentido. El tiempo correcto siempre trae las mejores versiones de los sueños."
      },
      {
        "id": 26,
        "titulo": "La sincronía perfecta",
        "mensaje": "Nada ocurre por casualidad. Las personas, las oportunidades y los cambios llegan cuando su presencia puede transformar tu camino. Aunque hoy no lo percibas, el universo está sincronizando cada detalle para que todo suceda de la mejor manera."
      },
      {
        "id": 27,
        "titulo": "El tiempo de la transformación",
        "mensaje": "Antes de recibir aquello que deseas, tú también estás cambiando. El universo está fortaleciendo tu corazón, ampliando tu visión y preparándote para sostener lo que viene. La transformación es parte del regalo."
      },
      {
        "id": 28,
        "titulo": "La puerta se abrirá",
        "mensaje": "Puede parecer que todo permanece inmóvil, pero la puerta correcta está a punto de abrirse. No fuerces lo que no fluye. Lo que realmente es para ti llegará con naturalidad y marcará un nuevo comienzo."
      },
      {
        "id": 29,
        "titulo": "El regalo de la paciencia",
        "mensaje": "La paciencia no retrasa tus sueños; los fortalece. Todo aquello que vale la pena necesita tiempo para crecer. Confía en el proceso, porque el universo nunca olvida aquello que has pedido con el corazón."
      },
      {
        "id": 30,
        "titulo": "Los ciclos se cumplen",
        "mensaje": "Un ciclo importante está llegando a su fin. Lo que parecía eterno pronto dará paso a una nueva etapa llena de posibilidades. Despide el pasado con gratitud y recibe con confianza lo que comienza."
      },
      {
        "id": 31,
        "titulo": "La respuesta se acerca",
        "mensaje": "Aquello que has estado esperando está más cerca de lo que imaginas. Muy pronto recibirás una señal, una conversación, una oportunidad o una respuesta que despejará tus dudas. Mantente atento y con el corazón abierto."
      },
      {
        "id": 32,
        "titulo": "Confía en el camino invisible",
        "mensaje": "Aunque no puedas ver cómo se están acomodando las cosas, el universo continúa trabajando a tu favor. Hay procesos que ocurren en silencio antes de manifestarse. La fe también forma parte del camino."
      },
      {
        "id": 33,
        "titulo": "El tiempo de recibir",
        "mensaje": "Durante mucho tiempo has dado, aprendido y esperado. Ahora comienza una etapa en la que el universo también quiere entregarte bendiciones. Abre tu corazón para recibir con gratitud lo que está por llegar."
      },
      {
        "id": 34,
        "titulo": "El universo dice: aún no",
        "mensaje": "Un \"todavía no\" no significa un \"nunca\". Hay aspectos que necesitan acomodarse antes de que todo suceda. Confía en que este tiempo de espera tiene un propósito y evitará que recibas algo antes de estar preparado."
      },
      {
        "id": 35,
        "titulo": "El tiempo de los milagros",
        "mensaje": "Hay momentos en los que la vida cambia de manera inesperada. Lo que parecía imposible encuentra un camino, y aquello que habías perdido comienza a renacer. Mantén viva la esperanza, porque el universo también obra a través de los milagros."
      },
      {
        "id": 36,
        "titulo": "La calma antes del cambio",
        "mensaje": "Si todo parece tranquilo o incluso detenido, no significa que nada esté ocurriendo. A veces, el universo guarda silencio justo antes de un gran movimiento. Confía, porque el cambio ya viene en camino."
      },
      {
        "id": 37,
        "titulo": "El destino te está encontrando",
        "mensaje": "No tienes que perseguir aquello que verdaderamente está destinado para ti. Mientras avanzas y creces, eso que tanto anhelas también se acerca a tu vida. Muy pronto ambos caminos se encontrarán."
      },
      {
        "id": 38,
        "titulo": "Todo madura a su tiempo",
        "mensaje": "Los frutos más valiosos nunca aparecen de un día para otro. Permite que cada experiencia, aprendizaje y oportunidad maduren antes de exigir resultados. Lo que llega en el momento correcto suele permanecer por mucho más tiempo."
      },
      {
        "id": 39,
        "titulo": "Un nuevo amanecer",
        "mensaje": "Una etapa de mayor claridad está por comenzar. Las dudas se disiparán y comprenderás por qué muchas cosas tuvieron que esperar. El amanecer siempre llega después de la noche más larga."
      },
      {
        "id": 40,
        "titulo": "La bendición inesperada",
        "mensaje": "El universo puede sorprenderte de formas que jamás imaginaste. No te limites pensando que solo existe un camino para que tus deseos se cumplan. Mantente abierto, porque la vida suele superar tus expectativas."
      },
      {
        "id": 41,
        "titulo": "La semilla ya germinó",
        "mensaje": "Aunque todavía no puedas verla, aquello que sembraste ya comenzó a crecer. Sigue alimentando tus sueños con confianza y constancia. Lo invisible también forma parte del proceso de manifestación."
      },
      {
        "id": 42,
        "titulo": "El tiempo de creer",
        "mensaje": "La fe es la fuerza que sostiene los sueños mientras todavía no se manifiestan. No permitas que la duda robe la confianza que has construido. Sigue creyendo, porque el universo responde a los corazones perseverantes."
      },
      {
        "id": 43,
        "titulo": "Todo tendrá sentido",
        "mensaje": "Llegará el día en que mirarás hacia atrás y comprenderás que cada espera, cada pausa y cada cambio tenían un propósito. Lo que hoy parece confuso, mañana será una de tus mayores enseñanzas."
      },
      {
        "id": 44,
        "titulo": "La hora ha llegado",
        "mensaje": "Después de tanta preparación, el universo anuncia que un ciclo de espera está por terminar. Es momento de actuar, aceptar oportunidades y confiar en lo que se presenta. Lo que esperabas comienza a manifestarse."
      },
      {
        "id": 45,
        "titulo": "El regalo del presente",
        "mensaje": "No permitas que la ansiedad por el futuro te robe la belleza del hoy. El presente también contiene regalos, aprendizajes y momentos que un día recordarás con gratitud. Vive plenamente este instante."
      },
      {
        "id": 46,
        "titulo": "El tiempo de avanzar",
        "mensaje": "El universo te muestra que ya no es momento de esperar, sino de dar el siguiente paso. Confía en tus capacidades y en todo lo que has aprendido. El movimiento abrirá nuevas puertas."
      },
      {
        "id": 47,
        "titulo": "La recompensa está cerca",
        "mensaje": "Tu esfuerzo, tu paciencia y tu constancia están a punto de dar frutos. No abandones ahora. Lo que tanto has construido comienza a acercarse con fuerza y estabilidad."
      },
      {
        "id": 48,
        "titulo": "El universo nunca se retrasa",
        "mensaje": "Aunque desde tu perspectiva parezca que todo tarda demasiado, para el universo cada acontecimiento ocurre en el instante preciso. Confía en que nada importante ha pasado de largo; simplemente está llegando en el tiempo ideal."
      },
      {
        "id": 49,
        "titulo": "El ciclo se completa",
        "mensaje": "Has llegado al final de una etapa importante. Todo lo aprendido, vivido y superado te prepara para comenzar un nuevo capítulo con mayor sabiduría. Celebra tu crecimiento y recibe lo nuevo con el corazón abierto."
      },
      {
        "id": 50,
        "titulo": "El tiempo perfecto",
        "mensaje": "No existe un mejor momento que aquel que el universo ha preparado para ti. Lo que está destinado a tu vida llegará cuando tu corazón, tu camino y las circunstancias estén alineados. Confía siempre: nada de lo que es para ti puede perderse. Cada espera tiene un propósito y cada bendición encuentra su momento."
      }
    ]
  }
];
