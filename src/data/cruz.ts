/**
 * Cruz de Vida — método y contenido.
 * Portado de `cruz-data.js` (fuente: PDF "Cruz de vida, Baraja española"). Contenido literal.
 */
import type { Suit } from '@/theme/tokens';

export type PosKey = 'arriba' | 'izquierda' | 'abajo' | 'derecha';

export type Posicion = { key: PosKey; nombre: string; desc: string };
export type CruzCategoria = { key: string; nombre: string; ids: number[] };
export type CartaRef = { palo: Suit; num: number; nombre?: string };

export type Representante =
  | { tipo: 'fija'; palo: Suit; num: number; nombre: string; apodo?: string }
  | { tipo: 'genero'; mujer: CartaRef; hombre: CartaRef }
  | { tipo: 'multi'; mujer: CartaRef[]; hombre: CartaRef[] };

export type Respuestas = Record<PosKey, string>;
export type Grupo = { titulo: string; resp: Respuestas };

export type Pregunta = {
  id: number;
  texto: string;
  cat: string;
  rep: Representante;
  resp?: Respuestas;
  grupos?: Record<string, Grupo>;
};

export type CruzData = {
  posiciones: Posicion[];
  categorias: CruzCategoria[];
  preguntas: Pregunta[];
};

export const CRUZ_DATA: CruzData = {
  "posiciones": [
    {
      "key": "arriba",
      "nombre": "Pensamiento",
      "desc": "El pensamiento predominante relacionado con la pregunta."
    },
    {
      "key": "izquierda",
      "nombre": "Camino",
      "desc": "Hacia dónde se dirige la situación; el camino que se abre."
    },
    {
      "key": "abajo",
      "nombre": "Realización",
      "desc": "Lo que ya se está manifestando en el presente."
    },
    {
      "key": "derecha",
      "nombre": "Lo que se deja atrás",
      "desc": "Aquello que termina, se supera o queda en el pasado."
    }
  ],
  "categorias": [
    {
      "key": "amor",
      "nombre": "Amor",
      "ids": [
        1,
        2,
        3,
        4
      ]
    },
    {
      "key": "dinero",
      "nombre": "Dinero y trabajo",
      "ids": [
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ]
    },
    {
      "key": "salud",
      "nombre": "Salud y energía",
      "ids": [
        13,
        14
      ]
    }
  ],
  "preguntas": [
    {
      "id": 1,
      "texto": "¿Mi expareja todavía piensa en mí?",
      "cat": "amor",
      "rep": {
        "tipo": "fija",
        "palo": "copas",
        "num": 11,
        "nombre": "Caballo de Copas"
      },
      "resp": {
        "arriba": "Sí. Esa persona todavía piensa en ti. El pensamiento está presente y activo. La energía mental sigue enfocada en ti y existe la posibilidad de que esos pensamientos aumenten o cobren más fuerza con el paso del tiempo.",
        "izquierda": "Sí. Sigues formando parte de su camino. La energía indica que aún te tiene presente y existe la posibilidad de que esa conexión evolucione, incluso pudiendo manifestarse en una comunicación o un acercamiento.",
        "abajo": "Sí. Esa persona piensa en ti en este momento. Es una energía que ya está presente y ocurriendo, aunque probablemente no la exprese o tú todavía no tengas conocimiento de ello.",
        "derecha": "La energía indica que esa persona está dejando esos pensamientos atrás. Poco a poco comienza a cerrar ese ciclo y a soltar lo vivido entre ustedes."
      }
    },
    {
      "id": 2,
      "texto": "¿Qué energía tiene mi expareja hacia mí?",
      "cat": "amor",
      "rep": {
        "tipo": "fija",
        "palo": "bastos",
        "num": 3,
        "nombre": "Tres de Bastos",
        "apodo": "Carta del Amor"
      },
      "resp": {
        "arriba": "Todavía existen sentimientos hacia ti. Esos sentimientos permanecen latentes y activos en su pensamiento. La energía indica que aún hay una conexión emocional que puede crecer con el tiempo o mantenerse presente.",
        "izquierda": "Todavía existen sentimientos y la energía se dirige hacia un posible acercamiento. Existe la posibilidad de que esa persona quiera expresar lo que siente, hablar de esos sentimientos o incluso que haya energía favorable para una reconciliación.",
        "abajo": "Los sentimientos siguen existiendo en este momento. Son reales y permanecen presentes en la energía de esa persona. Sin embargo, es posible que no los exprese o que no llegues a saber lo que realmente siente.",
        "derecha": "La energía indica que esa persona ya está cerrando ese ciclo sentimental. Los sentimientos han evolucionado y se están transformando. Representa un proceso de aceptación, sanación y trascendencia emocional, dejando el pasado."
      }
    },
    {
      "id": 3,
      "texto": "¿Qué energía tiene mi pareja actual hacia mí?",
      "cat": "amor",
      "rep": {
        "tipo": "genero",
        "mujer": {
          "palo": "copas",
          "num": 12,
          "nombre": "Rey de Copas"
        },
        "hombre": {
          "palo": "copas",
          "num": 10,
          "nombre": "Diez de Copas"
        }
      },
      "resp": {
        "arriba": "Tu pareja sigue teniendo una energía positiva hacia ti. En este momento sigues presente en sus pensamientos y todavía existe interés por la relación. Aunque esta posición no indica cuánto tiempo permanecerá así, sí muestra que el vínculo continúa siendo importante para esa persona.",
        "izquierda": "La relación todavía tiene camino por recorrer. Aún hay posibilidades de resolver las diferencias y fortalecer el vínculo. Tu pareja sigue teniendo interés en continuar contigo y existe disposición para trabajar en la relación.",
        "abajo": "Tu pareja sigue formando parte de tu vida y la energía indica que la relación continúa. Sin embargo, también muestra que hay situaciones que ambos deben trabajar para que el vínculo se mantenga estable y pueda crecer de manera sana.",
        "derecha": "Esta posición muestra que tu pareja podría estar comenzando a tomar distancia emocional. Puede existir un proceso de alejamiento, un posible rompimiento o la necesidad de cerrar un ciclo si los problemas entre ustedes no se atienden a tiempo."
      }
    },
    {
      "id": 4,
      "texto": "¿Cómo está mi energía en el aspecto sentimental?",
      "cat": "amor",
      "rep": {
        "tipo": "multi",
        "mujer": [
          {
            "palo": "espadas",
            "num": 12
          },
          {
            "palo": "oros",
            "num": 12
          },
          {
            "palo": "copas",
            "num": 12
          }
        ],
        "hombre": [
          {
            "palo": "espadas",
            "num": 10
          },
          {
            "palo": "oros",
            "num": 10
          },
          {
            "palo": "copas",
            "num": 10
          }
        ]
      },
      "grupos": {
        "espadas": {
          "titulo": "Energía de una expareja",
          "resp": {
            "arriba": "Hay una expareja que sigue pensando mucho en ti. Aunque probablemente no te lo haga saber, sigues presente en sus recuerdos y en su mente.",
            "izquierda": "Una expareja está considerando acercarse a ti. Existe la posibilidad de que busque hablar contigo, comunicarse o incluso intentar una reconciliación.",
            "abajo": "En este momento hay una expareja que te recuerda constantemente. Esa energía sigue activa, aunque es posible que nunca llegue a expresarte lo que siente.",
            "derecha": "Esta carta muestra que esa expareja está cerrando el ciclo contigo. Poco a poco está soltando el vínculo y dejando esa historia en el pasado."
          }
        },
        "oros": {
          "titulo": "Energía de una relación informal",
          "resp": {
            "arriba": "Hay una persona que siente atracción por ti, pero busca una relación informal. Por ahora esa energía permanece en la intención y aún no se manifiesta completamente.",
            "izquierda": "Se acerca una persona interesada en proponerte una relación informal o sin compromiso. Existe la posibilidad de que esa propuesta llegue a manifestarse.",
            "abajo": "En este momento estás atrayendo personas que no buscan un compromiso estable. Es importante trabajar en tu energía y en algunos patrones personales para comenzar a atraer relaciones más sanas y duraderas.",
            "derecha": "Estás dejando atrás la energía de las relaciones informales. Poco a poco comienzas a vibrar con mayor fuerza hacia relaciones más estables y comprometidas."
          }
        },
        "copas": {
          "titulo": "Energía de una relación estable",
          "resp": {
            "arriba": "Se está acercando a tu vida la energía de una relación estable. Comienzas a vibrar con una conexión seria que poco a poco puede tomar forma.",
            "izquierda": "Vas caminando hacia una relación estable. Existe una alta probabilidad de conocer a una persona que llegue con intenciones serias e incluso con una propuesta de compromiso.",
            "abajo": "En este momento ya vibras con la energía de una relación estable. Sin embargo, necesitas seguir trabajando en ti, abrirte más al amor, fortalecer tu seguridad y permitirte conocer nuevas personas para que esa energía se manifieste plenamente.",
            "derecha": "En este momento hay bloqueos que están dificultando la llegada de una relación estable. Es posible que el miedo, el aislamiento o la falta de apertura estén frenando esa energía. La carta te invita a salir más, abrirte a nuevas experiencias y trabajar en ti para permitir que llegue una relación sana y estable."
          }
        }
      }
    },
    {
      "id": 5,
      "texto": "¿Cómo está mi energía en el aspecto económico o del dinero?",
      "cat": "dinero",
      "rep": {
        "tipo": "fija",
        "palo": "oros",
        "num": 7,
        "nombre": "Siete de Oros"
      },
      "resp": {
        "arriba": "Tu energía económica comienza desde tus pensamientos. Tienes buenas ideas, proyectos o deseos de mejorar tus ingresos. Sabes que puedes crecer económicamente y tienes el potencial para hacerlo; sin embargo, todavía te hace falta convertir esas ideas en acciones. La carta te invita a confiar más en ti y a dar el siguiente paso para materializar tus proyectos.",
        "izquierda": "Vas caminando hacia una mejora económica. Se están abriendo oportunidades que pueden ayudarte a incrementar tus ingresos, ya sea mediante un nuevo trabajo, un cambio laboral, un negocio o una nueva fuente de dinero. La energía es favorable y te invita a aprovechar las oportunidades que lleguen a tu vida.",
        "abajo": "En este momento cuentas con cierta estabilidad económica o laboral. Has logrado construir una base sólida; sin embargo, la carta también te muestra que tienes el potencial para crecer mucho más. Es un buen momento para buscar nuevas formas de generar ingresos o fortalecer tu economía.",
        "derecha": "En este momento existen bloqueos que están frenando tu crecimiento económico. Puede tratarse de miedo a invertir, temor a cambiar de trabajo, resistencia a salir de tu zona de confort o incluso un estado emocional que no te permite avanzar. La carta te invita a trabajar en esos bloqueos para abrir el camino a una mejora económica."
      }
    },
    {
      "id": 6,
      "texto": "¿Va a mejorar mi situación económica?",
      "cat": "dinero",
      "rep": {
        "tipo": "fija",
        "palo": "espadas",
        "num": 3,
        "nombre": "Tres de Espadas",
        "apodo": "Carta de la Solución"
      },
      "resp": {
        "arriba": "Sí, tu situación económica puede mejorar. En este momento están llegando a tu mente ideas, proyectos o soluciones que pueden ayudarte a salir adelante. Aunque todavía puedas sentir miedo o incertidumbre, la energía indica que vas por el camino correcto. Confía en esas ideas, porque una de ellas puede convertirse en la solución que estás buscando.",
        "izquierda": "La solución ya está en camino. Muy pronto comenzarán a aparecer oportunidades, propuestas o situaciones que te ayudarán a resolver tus asuntos económicos. La energía muestra que el cambio ya se está acercando y que poco a poco comenzarás a ver una mejoría.",
        "abajo": "La solución ya está presente en tu vida, aunque tal vez todavía no la hayas reconocido por completo. Vas por buen camino y estás construyendo una base que te permitirá mejorar tu situación económica de manera estable. La energía es favorable y muestra que la solución ya comenzó a manifestarse.",
        "derecha": "En este momento la solución se encuentra bloqueada o estancada. La carta te invita a actuar, organizarte y tomar decisiones. Necesitas moverte, planear y confiar más en tus capacidades, porque si permaneces en la misma situación será más difícil que llegue el cambio que estás esperando. Cuando tomes acción, la energía comenzará a desbloquearse."
      }
    },
    {
      "id": 7,
      "texto": "¿Vienen oportunidades o propuestas económicas para mí?",
      "cat": "dinero",
      "rep": {
        "tipo": "fija",
        "palo": "bastos",
        "num": 2,
        "nombre": "Dos de Bastos",
        "apodo": "Carta de los Caminos y las Oportunidades"
      },
      "resp": {
        "arriba": "Sí vienen oportunidades para ti, pero primero debes confiar en lo que ya estás pensando. Si desde hace tiempo has considerado cambiar de trabajo, iniciar un negocio o buscar una nueva forma de generar ingresos, esta carta confirma que vas por el camino correcto. Solo falta dar el paso y vencer el miedo para convertir esas ideas en acciones.",
        "izquierda": "Las oportunidades ya vienen en camino. Comenzarán a presentarse propuestas laborales, económicas o nuevos proyectos que pueden ayudarte a crecer. Analiza cada oportunidad con calma antes de tomar una decisión, para elegir la que realmente te brinde estabilidad y crecimiento.",
        "abajo": "Las oportunidades ya están presentes en tu vida. La energía muestra que estás sembrando algo que puede convertirse en un proyecto sólido y duradero. Aunque puedas sentir que las oportunidades son pocas, en realidad ya existen; solo necesitas reconocerlas y aprovecharlas.",
        "derecha": "En este momento hay bloqueos que están impidiendo que las oportunidades fluyan. Es posible que estés en una zona de confort, que el miedo al cambio te frene o que no estés viendo todas las opciones frente a ti. La carta te invita a mover tu energía, abrirte a nuevas posibilidades y tomar decisiones que desbloqueen el camino."
      }
    },
    {
      "id": 8,
      "texto": "¿Se acercan nuevos ingresos?",
      "cat": "dinero",
      "rep": {
        "tipo": "fija",
        "palo": "oros",
        "num": 7,
        "nombre": "Siete de Oros",
        "apodo": "Carta del Dinero"
      },
      "resp": {
        "arriba": "Sí, se acercan nuevos ingresos. La energía muestra que las ideas que has venido pensando para mejorar tu economía son acertadas. Ya tienes dentro de ti la inspiración o el proyecto que puede ayudarte a generar más dinero. Confía en esas ideas y llévalas a la acción sin miedo, porque ahí se encuentra la oportunidad que buscas.",
        "izquierda": "Sí, nuevos ingresos vienen en camino. Se acercan oportunidades económicas que pueden mejorar tu situación financiera. Incluso podrías recibir dinero extra de forma inesperada o encontrar una nueva fuente de ingresos. Tu economía comienza a avanzar hacia una etapa más favorable.",
        "abajo": "Sí, vienen nuevos ingresos. Lo que estás haciendo actualmente tiene el potencial de darte estabilidad y generar más dinero. La carta también te invita a implementar nuevas ideas, ampliar tus proyectos o buscar otras alternativas. Tienes una base sólida sobre la cual seguir creciendo.",
        "derecha": "En este momento existen bloqueos que limitan la llegada de nuevos ingresos. Es importante activar tu energía, explorar nuevas oportunidades y abrirte a diferentes posibilidades. También es buen momento para limpiar tu energía y trabajar los bloqueos emocionales, de confianza o de actitud. Al salir de la rutina, abrirás el camino a nuevos ingresos."
      }
    },
    {
      "id": 9,
      "texto": "¿Es un buen momento para invertir o iniciar un proyecto?",
      "cat": "dinero",
      "rep": {
        "tipo": "fija",
        "palo": "oros",
        "num": 1,
        "nombre": "As de Oros",
        "apodo": "Carta del Éxito y las Nuevas Oportunidades"
      },
      "resp": {
        "arriba": "Sí, este puede ser un muy buen momento para invertir o iniciar un proyecto. Tienes una idea clara y con potencial de éxito, no solo económico sino también de crecimiento personal y profesional. Confía en tu intuición, pero analiza cada paso con lógica. Si el proyecto resuena contigo y has evaluado sus posibilidades, avanza con confianza.",
        "izquierda": "Sí, vas caminando hacia el inicio de un proyecto o una inversión favorable. La vida comenzará a mostrarte oportunidades y personas que te ayudarán a encontrar el camino adecuado. Mantente abierto a las señales, pero toma siempre decisiones bien pensadas y evita actuar por impulso.",
        "abajo": "Sí, este es un momento favorable para iniciar un proyecto o realizar una inversión. Ya tienes una base sólida y existen posibilidades reales de éxito. Continúa actuando con responsabilidad, analizando cada decisión; la carta confirma que estás en una etapa de realización y crecimiento.",
        "derecha": "Por ahora no es el mejor momento para invertir o iniciar un proyecto. Todavía necesitas aclarar algunas ideas, reunir más información o fortalecer tu plan antes de dar ese paso. Es mejor esperar un poco y analizar todas las opciones antes de comprometer tu dinero. La paciencia y la planificación serán tus mejores aliadas."
      }
    },
    {
      "id": 10,
      "texto": "¿Qué debo saber sobre mi economía en este momento?",
      "cat": "dinero",
      "rep": {
        "tipo": "fija",
        "palo": "oros",
        "num": 3,
        "nombre": "Tres de Oros",
        "apodo": "Carta del Crecimiento Económico"
      },
      "resp": {
        "arriba": "Tu economía tiene un gran potencial de crecimiento. Tienes ideas creativas y la capacidad de generar mayores ingresos, pero es importante que no las dejes solo en tu mente. Confía en tu intuición, desarrolla esos proyectos y conviértelos en acciones. Ahí puede estar la oportunidad que buscas.",
        "izquierda": "Vas por un camino de estabilidad económica y crecimiento. Se acercan oportunidades, proyectos y posibilidades que pueden mejorar tus ingresos. Mantente atento a lo que llegue y no temas asumir riesgos, siempre que los analices con responsabilidad. Hay oportunidades importantes que no debes dejar pasar.",
        "abajo": "Actualmente cuentas con una base de estabilidad económica. Sin embargo, la carta te invita a no conformarte con lo que ya has logrado. Tienes la capacidad de generar más ingresos y seguir creciendo. Es momento de salir de tu zona de confort y confiar en tu potencial.",
        "derecha": "Esta posición indica que debes cuidar tu economía. Puede presentarse un periodo de estancamiento, un gasto inesperado o alguna situación que afecte tus finanzas si no actúas con prudencia. Evita gastos innecesarios, ahorra para imprevistos y no adquieras deudas que comprometan tu estabilidad."
      }
    },
    {
      "id": 11,
      "texto": "¿Hay bloqueos que estén afectando mi prosperidad?",
      "cat": "dinero",
      "rep": {
        "tipo": "fija",
        "palo": "espadas",
        "num": 2,
        "nombre": "Dos de Espadas",
        "apodo": "Carta de los Bloqueos"
      },
      "resp": {
        "arriba": "Sí, los principales bloqueos se encuentran en tus pensamientos. Es posible que el miedo, la preocupación o las ideas negativas estén limitando tu prosperidad. La carta te invita a cambiar tu forma de pensar, confiar más en tus capacidades y enfocarte en las posibilidades: al transformar tu mentalidad también transformarás tu economía.",
        "izquierda": "En realidad, no hay bloqueos importantes en tu camino. Al contrario, se están abriendo puertas y oportunidades para ti. Si sientes que no avanzas, es posible que aún no estés viendo todas las opciones frente a ti. Mantente atento, porque el camino comienza a despejarse.",
        "abajo": "Tu energía muestra estabilidad. Aunque en algunos momentos surjan obstáculos, tienes la capacidad, las herramientas y los recursos para superarlos. No permitas que pequeños contratiempos te hagan pensar que todo está bloqueado. Puedes resolver cualquier situación que se presente.",
        "derecha": "Esta posición indica que sí existen bloqueos que necesitan ser atendidos. Actúa con prudencia, cuida tu economía y evita decisiones impulsivas. Ahorrar, organizar tus finanzas y analizar cada paso te ayudará a desbloquear poco a poco tu prosperidad. Estos bloqueos no son permanentes: se superan con conciencia, planificación y acción."
      }
    },
    {
      "id": 12,
      "texto": "¿Vienen nuevas oportunidades de trabajo para mí?",
      "cat": "dinero",
      "rep": {
        "tipo": "fija",
        "palo": "bastos",
        "num": 4,
        "nombre": "Cuatro de Bastos",
        "apodo": "Carta de las Oportunidades Laborales"
      },
      "resp": {
        "arriba": "Sí existe la posibilidad de un cambio laboral. Desde hace tiempo has pensado en buscar algo mejor o en hacer un cambio que te permita crecer. Confía en tu intuición: si sientes que puedes encontrar una mejor oportunidad, tienes la capacidad para lograrlo. Cree en ti y no temas buscar nuevas opciones.",
        "izquierda": "Sí, vienen nuevas oportunidades laborales para ti. Se abrirán puertas que pueden representar un crecimiento profesional y económico. Antes de decidir, analiza si ese cambio realmente te brinda mayor estabilidad y mejores condiciones. Si la oportunidad es sólida, puede ser un paso muy positivo.",
        "abajo": "Actualmente cuentas con una base de estabilidad laboral. Es posible que lleguen nuevas oportunidades, pero la carta aconseja no tomar decisiones apresuradas. Analiza cada propuesta con calma y asegúrate de que represente una mejora real. La estabilidad que tienes también es un logro que vale la pena cuidar.",
        "derecha": "Por ahora las oportunidades laborales pueden sentirse detenidas o estancadas. Es posible que una zona de confort te impida ver nuevas posibilidades. La carta te invita a abrirte al cambio, valorar las propuestas que lleguen y no cerrar la puerta a nuevas experiencias laborales."
      }
    },
    {
      "id": 13,
      "texto": "¿Cómo está mi energía en cuestión de la salud?",
      "cat": "salud",
      "rep": {
        "tipo": "fija",
        "palo": "espadas",
        "num": 5,
        "nombre": "Cinco de Espadas",
        "apodo": "Carta de la Salud"
      },
      "resp": {
        "arriba": "Tu intuición merece ser escuchada. Si desde hace tiempo has sentido la necesidad de realizarte un estudio, unos análisis o acudir a una revisión médica, esta carta te invita a hacerlo. No significa que exista un problema, sino que es importante prestar atención a lo que tu cuerpo y tu intuición te indican.",
        "izquierda": "La energía muestra un camino estable en el aspecto de la salud. En este momento cuentas con una buena base de bienestar. Aun así, es importante seguir cuidándote y mantenerte atento a cualquier cambio o señal que tu cuerpo pueda manifestar.",
        "abajo": "Tu energía refleja estabilidad en la salud. Si estás llevando un tratamiento o controlando alguna condición, la carta indica que puedes mantenerte estable siempre que continúes cuidándote y sigas las indicaciones de los profesionales que te atienden. La constancia será clave.",
        "derecha": "Has superado o estás dejando atrás situaciones importantes relacionadas con tu salud. La carta te invita a no bajar la guardia: continúa cuidándote, presta atención a las señales de tu cuerpo y actúa a tiempo si notas algún cambio. La prevención será tu mejor aliada."
      }
    },
    {
      "id": 14,
      "texto": "¿Cómo se encuentra mi energía física y emocional?",
      "cat": "salud",
      "rep": {
        "tipo": "fija",
        "palo": "copas",
        "num": 3,
        "nombre": "Tres de Copas",
        "apodo": "Carta del Equilibrio Emocional"
      },
      "resp": {
        "arriba": "Tus pensamientos están influyendo directamente en tu bienestar. Es posible que estés pasando por altibajos, preocupándote demasiado o imaginando escenarios que aún no ocurren, y eso desgasta tu energía. La carta te invita a cambiar poco a poco esos pensamientos, confiar más en ti y alimentar una actitud más positiva.",
        "izquierda": "Tu energía física y emocional va por buen camino. Cuentas con la fortaleza necesaria para enfrentar los retos y la capacidad de recuperarte de cualquier situación difícil. Esta carta indica que posees una buena base de equilibrio para seguir adelante.",
        "abajo": "En este momento tienes una estabilidad importante, tanto emocional como física. Sabes recuperarte después de los momentos difíciles y cuentas con los recursos internos para superar los obstáculos. Confía en tu capacidad para salir adelante: tu energía muestra una base sólida.",
        "derecha": "Has vivido situaciones emocionales que pudieron afectarte profundamente, incluso reflejarse en tu bienestar físico. Ese proceso está comenzando a quedar atrás. Aunque el dolor aún se sienta presente, poco a poco recuperarás tu equilibrio. Este periodo no será permanente."
      }
    }
  ]
};
