// Significados de la Baraja Española — según la lectura de Gilda (fuente: PDFs).
// 8 y 9 de cada palo: tiene_contenido=false ("Próximamente").
window.BARAJA_DATA = {
palos: [
  { key:'oros', nombre:'Oros', elemento:'Tierra · Prosperidad', color:'#ecc874', idxColor:'#f0d488' },
  { key:'copas', nombre:'Copas', elemento:'Agua · Emoción', color:'#e79ab4', idxColor:'#f0b9cd' },
  { key:'espadas', nombre:'Espadas', elemento:'Aire · Intelecto', color:'#8db0ec', idxColor:'#aecaf5' },
  { key:'bastos', nombre:'Bastos', elemento:'Fuego · Acción', color:'#86cf9e', idxColor:'#a8e3bc' },
],
sinContenido: [8,9],
cartas: {
'oros-1': {
  general:'Representa un sí. Es una carta de éxito, resultados positivos, oportunidades y caminos que comienzan a abrirse. Indica que una situación puede avanzar, que las cosas pueden mejorar y que existe una energía favorable para lograr lo que se está buscando.',
  amor:'Representa un sí ante las preguntas sentimentales. Hay una energía favorable para la relación y posibilidad de que la situación avance. Puede hablar de reconciliaciones, retomar una relación, superar dificultades o volver a construir un vínculo desde un lugar más estable. También representa éxito sentimental y la posibilidad de que aquello que deseas en el amor comience a tomar forma.',
  trabajo:'Representa éxito, reconocimiento y nuevas oportunidades laborales. Puede indicar propuestas, crecimiento profesional, proyectos que prosperan o una etapa donde las cosas comienzan a fluir de manera favorable.',
  dinero:'Es una de las cartas más positivas para la economía. Habla de éxito, abundancia, prosperidad, dinero extra, oportunidades financieras, mejoras económicas o buena suerte en asuntos relacionados con el dinero.' },
'oros-2': {
  general:'Representa una promesa sincera, buenas intenciones y una actitud positiva hacia ti. Habla de vínculos que comienzan a tomar forma, acuerdos y conexiones con interés verdadero. También se relaciona con la familia, la unión y la creación de algo nuevo; puede representar embarazo, hijos o la llegada de una nueva etapa importante.',
  amor:'Es la carta del amor sincero, las buenas intenciones y los sentimientos reales. Representa una persona que tuvo una conexión verdadera contigo y un cariño genuino. Es la carta del noviazgo y de los vínculos que buscan avanzar hacia algo más estable: en un "casi algo" indica interés verdadero y posibilidad de formalizarse. También habla de reconciliación y de volver a construir el vínculo desde la sinceridad.',
  trabajo:'Representa acuerdos favorables, buenas relaciones laborales y la posibilidad de que algo avance de manera positiva. Puede indicar alianzas, propuestas o personas con buena actitud hacia ti en lo profesional.',
  dinero:'Habla de estabilidad, apoyo y crecimiento económico. Puede señalar oportunidades, acuerdos o proyectos que empiezan a tomar forma y pueden traer beneficios.' },
'oros-3': {
  general:'Representa el crecimiento, el avance y las situaciones que comienzan a tomar forma. Indica que algo va de menos a más, que se construye poco a poco y que con el tiempo puede alcanzar mejores resultados.',
  amor:'Representa sentimientos que crecen y se fortalecen con el tiempo. Si preguntas por tu persona de interés, sus emociones pueden ir aumentando poco a poco: comienza a extrañarte más, crece el deseo de acercamiento o la intención de reconciliarse se vuelve más fuerte. Dentro de una relación, señala un amor en crecimiento y un vínculo cada vez más estable.',
  trabajo:'Indica progreso, aprendizaje y crecimiento profesional. Habla de proyectos que avanzan poco a poco, de resultados que llegan con constancia y de una situación laboral que puede mejorar con el tiempo.',
  dinero:'Representa crecimiento económico gradual. Un proyecto, negocio o inversión comienza a dar frutos poco a poco. No habla de resultados inmediatos, sino de una mejora que se construye con paciencia y esfuerzo.' },
'oros-4': {
  general:'Representa dudas, inseguridades, miedos y aquello que nos detiene por temor a avanzar. Muestra bloqueos internos, pero también indica que esos miedos pueden superarse y que hay posibilidad de encontrar estabilidad.',
  amor:'Representa dudas e inseguridades sentimentales. Una persona puede tener miedo de avanzar contigo, temor a involucrarse o no estar segura de dar el siguiente paso. Al ser una carta positiva, esas dudas pueden aclararse y la situación mejorar: hay sentimientos, pero la persona necesita vencer sus inseguridades.',
  trabajo:'Indica miedo al cambio, inseguridad ante una nueva oportunidad o dudas sobre una decisión laboral. La persona tiene las capacidades para avanzar, pero algo interno la detiene; los obstáculos se resuelven con confianza y paciencia.',
  dinero:'Habla de preocupaciones, temor a perder estabilidad o inseguridad al tomar decisiones económicas. Aun así, hay posibilidad de ordenar la situación, recuperar confianza y encontrar una solución.' },
'oros-5': {
  general:'Representa la necesidad de pedir ayuda, orientación o apoyo. Habla de alguien que no sabe cómo actuar o siente que no puede resolver las cosas por sí solo. Invita a aceptar apoyo, escuchar consejos y permitir que otros aporten una solución.',
  amor:'Representa una persona que necesita mucho de ti: de tu apoyo, tu atención o tu presencia. Puede indicar que alguien se ha acostumbrado a recibir tu ayuda y estabilidad, dependiendo de lo que tú aportas. Hay oportunidad de mejorar la situación cambiando ciertas dinámicas: dar demasiado puede impedir que la otra persona aprenda a actuar, crecer o aportar por sí misma.',
  trabajo:'Indica la necesidad de pedir apoyo, consejo o ayuda para resolver una situación laboral. Habla de aprender de alguien con más experiencia, buscar orientación o aceptar que no todo se resuelve en soledad.',
  dinero:'Representa la necesidad de apoyo económico o de buscar una solución con ayuda de otras personas: préstamos, consejos financieros o alguien que te orienta. También habla de aprender a administrar mejor los recursos.' },
'oros-6': {
  general:'No estás recibiendo exactamente lo que deseas en este momento, pero existe la posibilidad de recuperar el equilibrio o encontrar la forma de obtener lo que necesitas.',
  amor:'Hay algo que esperas recibir en esta relación y no lo obtienes por completo: atención, cariño, compromiso, interés o esfuerzo. Puede existir un desequilibrio — tú das más de lo que recibes, o la otra persona siente que no recibe lo que necesita. También puede indicar disminución de sentimientos o interés; pero al ser una carta positiva, el equilibrio puede recuperarse y la situación mejorar.',
  trabajo:'Representa buscar reconocimiento, apoyo o una recompensa que todavía no llega como esperabas. Puede indicar que algo mejora, que llega una oportunidad o que recibes ayuda de otra fuente.',
  dinero:'Habla de una meta económica que aún no se concreta, pero que tienes potencial de alcanzar. La oportunidad, ayuda o recurso que necesitas puede llegar por otro medio.' },
'oros-7': {
  general:'Confirma que aquello que tanto deseas tiene grandes posibilidades de llegar a tu vida. Es una carta de logro, cumplimiento y resultados favorables. Habla de situaciones que avanzan hacia donde esperas y de metas que comienzan a hacerse realidad.',
  amor:'Aquello que deseas en el amor puede concretarse. Sin pareja, hay gran posibilidad de conocer a alguien con quien construir una relación. Si buscas reconciliarte, lo que anhelas tiene posibilidades de suceder. En un "casi algo", el vínculo puede evolucionar hacia una relación más estable. Habla de sentimientos que se fortalecen y de una relación que avanza hacia donde ambos desean.',
  trabajo:'Aquello por lo que has trabajado puede dar resultados. Habla de crecimiento, oportunidades, ascensos, reconocimiento o de alcanzar una meta profesional que esperabas.',
  dinero:'Indica un incremento económico, estabilidad y la posibilidad de obtener lo que buscas. Un trámite, pago, asunto legal o proyecto económico pendiente se resolverá de manera favorable.' },
'oros-10': {
  general:'Hay otras personas involucradas en la situación por la que preguntas: una persona joven, varias personas influyendo a la vez o alguien interviniendo de manera directa. En consultas espirituales puede indicar que alguien realiza un trabajo energético, con intención positiva o negativa, o que recurrió a otra persona para intervenir.',
  amor:'Puede existir una tercera persona o un interés sentimental informal. Tu persona de interés puede sentir atracción por alguien más o mantener un vínculo sin compromiso: una conexión que influye en la situación sentimental.',
  trabajo:'Otras personas influyen en tu situación laboral: compañeros, clientes, colaboradores o un grupo con participación en el resultado que esperas.',
  dinero:'Tu situación económica puede depender de la participación o apoyo de otras personas. También señala proyectos, negocios o decisiones donde intervienen varias personas.' },
'oros-11': {
  general:'La clave de esta situación está en los pensamientos, intenciones o ideas de las personas involucradas. Habla de lo que alguien analiza, considera o planea antes de actuar; si tu pregunta involucra a varias personas, muestra lo que piensan y la influencia de sus ideas sobre el resultado.',
  amor:'Si existe una tercera persona, muestra lo que esa persona piensa o la influencia que sus pensamientos tienen en la relación.',
  trabajo:'Las decisiones dependerán de lo que otras personas están pensando: la opinión de compañeros, clientes, jefes o de quienes participan en el ámbito laboral.',
  dinero:'Una decisión económica aún se está analizando. Otras personas evalúan una propuesta, un proyecto, un trámite o una inversión antes de dar una respuesta.' },
'oros-12': {
  general:'Hay un hombre involucrado en la situación: un hombre joven, un conocido, un amigo o alguien que influye directamente en los acontecimientos. En consultas espirituales puede señalar al hombre que realiza un trabajo energético o a quien recurrió a otra persona para intervenir.',
  amor:'Existe la influencia de un hombre en la situación sentimental. Puede representar a un tercero, un interés amoroso o alguien que llama la atención de tu persona de interés, sin que exista necesariamente una relación formal.',
  trabajo:'Un hombre influye en tu situación laboral: un compañero, un cliente, un jefe o alguien cuya participación será importante para el resultado que esperas.',
  dinero:'Un hombre puede tener un papel importante en tus asuntos económicos: brindándote apoyo, participando en un proyecto o influyendo en una decisión financiera.' },

'copas-1': {
  general:'La situación tiene que ver directamente contigo: tu persona, tu cuerpo, tu mente, tu alma y tu espíritu. También representa tu hogar o tu refugio. Te invita a mirar hacia tu interior, porque la respuesta que buscas nace de ti y de lo que estás viviendo.',
  amor:'El amor debe vivirse de manera completa, en cuerpo, alma y espíritu. Habla de una conexión profunda donde los sentimientos y el bienestar de ambos importan por igual. Antes de buscar respuestas en la otra persona, escucha lo que tú sientes y lo que realmente deseas para tu vida sentimental.',
  trabajo:'Tu crecimiento laboral dependerá de ti, de tus decisiones y de la confianza en tus capacidades. El ambiente donde trabajas influye directamente en tu bienestar.',
  dinero:'La estabilidad económica comienza por ti: por cómo administras tus recursos y las decisiones que tomas. Es una invitación a construir seguridad desde tus propias acciones.' },
'copas-2': {
  general:'La verdad saldrá a la luz. Habla de descubrir la realidad de una situación, de enterarte de algo importante o de recibir una respuesta sincera. Las personas involucradas actúan y se expresan con honestidad.',
  amor:'Las palabras y sentimientos que tu persona de interés expresa hacia ti son sinceros. Si te dice que te ama, habla con la verdad; si dice que necesita tiempo o no desea continuar, también es honesta. Cree en los hechos y palabras que nacen de la sinceridad. Puede anunciar que una verdad sentimental saldrá a la luz y te permitirá comprender mejor la situación.',
  trabajo:'Pronto conocerás la verdad sobre una situación laboral: conversaciones sinceras, aclaraciones o información que te ayudará a decidir mejor.',
  dinero:'Conocerás la realidad de un asunto económico: una respuesta, un acuerdo, un trámite o información importante que te dará claridad para actuar.' },
'copas-3': {
  general:'La situación aún no está completamente definida. Existe ambivalencia, dudas o cambios constantes: hoy puede parecer una cosa y mañana otra. Todavía hay posibilidad de que la situación cambie.',
  amor:'Tu persona de interés puede sentirse ambivalente respecto a ti: a veces desea acercarse y estar contigo, otras necesita tomar distancia. Sus sentimientos o decisiones no son completamente firmes todavía. Al no ser definitivo, las cosas pueden cambiar según las decisiones de ambos y cómo evolucione la relación.',
  trabajo:'Tu situación laboral aún no está decidida: cambios de opinión, propuestas en valoración o decisiones pendientes. Todavía hay margen para influir en el resultado a tu favor.',
  dinero:'Un asunto económico todavía no está resuelto. Hay dudas, cambios o decisiones pendientes, pero la respuesta no es definitiva: aún puede evolucionar favorablemente.' },
'copas-4': {
  general:'Aquello por lo que preguntas está próximo a suceder. Habla de acontecimientos, noticias, oportunidades o cambios que llegarán en poco tiempo. Anuncia movimiento y resultados cercanos.',
  amor:'Lo que esperas en el amor puede suceder pronto. Si preguntas si esa persona te va a buscar, llamar o escribir, la respuesta es sí, y en poco tiempo. Una reconciliación, un regreso o un acercamiento está más cerca de lo que imaginas; la relación puede comenzar a evolucionar muy pronto.',
  trabajo:'Una oportunidad laboral, un ascenso, una propuesta o un cambio favorable puede llegar en corto plazo. Habla de avances por concretarse.',
  dinero:'Una mejora económica, un pago, un ingreso o una oportunidad está próxima a llegar. También puede señalar la resolución cercana de un trámite o asunto económico.' },
'copas-5': {
  general:'Algo inesperado está por suceder: acontecimientos que llegan por sorpresa y cambios que aparecen cuando menos los esperas. Puede representar un regalo del universo o una compensación energética.',
  amor:'Vivirás una situación que no esperabas: una persona que regresa a buscarte, un mensaje, una declaración o un acercamiento inesperado. También puede indicar un rompimiento o cambio repentino. La carta no dice si será bueno o malo: lo que ocurra te sorprenderá porque no lo estabas esperando.',
  trabajo:'Puede presentarse un cambio inesperado en lo laboral: un ascenso, una nueva oportunidad, un cambio de puesto o una situación que modifique tu estabilidad. Será algo que no tenías contemplado.',
  dinero:'Puede llegar un movimiento económico inesperado: un ingreso, un pago, una oportunidad o un gasto que cambie tu panorama financiero sin esperarlo.' },
'copas-6': {
  general:'Se acerca un encuentro, una reunión o un acontecimiento importante. Habla de compartir, convivir, celebrar o reunirte con otras personas. Puede indicar una invitación, una salida o un motivo de alegría próximo.',
  amor:'Sí existe la posibilidad de volver a reunirte con tu persona de interés. Si preguntas si la volverás a ver o si habrá un acercamiento, la respuesta es positiva: un encuentro cara a cara, una conversación importante o la oportunidad de compartir nuevamente un momento juntos.',
  trabajo:'Vienen momentos positivos para celebrar: un reconocimiento, una reunión importante, un logro, un ascenso o una buena noticia en lo laboral.',
  dinero:'Una mejora que será motivo de celebración: un ingreso, un pago, un logro económico o una noticia favorable que te dará tranquilidad.' },
'copas-7': {
  general:'La situación por la que preguntas ha tenido un impacto muy fuerte en tu vida: algo que te marcó profundamente, por sufrimiento o por una gran alegría. La respuesta depende de lo que hoy resuene contigo y de las cartas que acompañen la lectura.',
  amor:'Esta relación ha despertado emociones muy intensas en ti: una persona que te hizo inmensamente feliz o que te lastimó profundamente. La carta confirma que existe una huella emocional muy importante entre ustedes.',
  trabajo:'Tu situación laboral ha sido emocionalmente significativa. Reconoce el esfuerzo, la decepción o el desgaste de los momentos difíciles, o la gran satisfacción de un logro importante.',
  dinero:'El aspecto económico ha tenido un impacto importante en tu vida: una pérdida que te preocupó mucho o una mejora que te llenó de tranquilidad. Depende de la situación que atraviesas.' },
'copas-10': {
  general:'Esta carta te representa a ti si eres mujer. Si eres hombre y preguntas por tu persona de interés, la representa a ella. Todo lo que aparezca alrededor hablará de esa mujer: sus pensamientos, emociones, decisiones o lo que está viviendo.',
  amor:'Si eres mujer, habla de ti y de cómo vives la relación. Si eres hombre, habla de tu persona de interés y de lo que sucede en su vida sentimental.',
  trabajo:'Si eres mujer, muestra cómo te encuentras en el trabajo y lo que viene para ti. Si eres hombre y preguntas por tu persona de interés, habla de cómo se encuentra ella en lo laboral.',
  dinero:'Si eres mujer, habla de tu economía, tus ingresos y estabilidad. Si eres hombre y preguntas por tu persona de interés, muestra cómo está ella en el dinero y lo que puede venir.' },
'copas-11': {
  general:'Si eres mujer, habla de lo que estás pensando, tus dudas e ideas y cómo procesas la situación. Si eres hombre y preguntas por tu persona de interés, representa lo que ella piensa, cómo analiza las cosas o las decisiones que considera tomar.',
  amor:'Si eres mujer, muestra lo que tú piensas y sientes de tu situación sentimental. Si eres hombre, revela lo que tu persona de interés está pensando sobre ti o sobre la relación.',
  trabajo:'Si eres mujer, muestra cómo ves tu trabajo, tus proyectos y decisiones. Si eres hombre, habla de lo que tu persona de interés piensa de su situación laboral.',
  dinero:'Si eres mujer, muestra cómo analizas tus finanzas y decisiones económicas. Si eres hombre, representa lo que tu persona de interés piensa sobre su situación económica.' },
'copas-12': {
  general:'Esta carta te representa a ti si eres hombre. Si eres mujer y preguntas por tu persona de interés, lo representa a él. Todo lo que aparezca alrededor hablará de ese hombre: sus emociones, decisiones, experiencias o lo que está viviendo.',
  amor:'Si eres hombre, habla de ti y de cómo vives la relación. Si eres mujer, habla de tu persona de interés y de lo que sucede en su vida sentimental.',
  trabajo:'Si eres hombre, muestra cómo te encuentras en el trabajo y lo que viene para ti. Si eres mujer y preguntas por tu persona de interés, habla de cómo se encuentra él en lo laboral.',
  dinero:'Si eres hombre, habla de tu economía, ingresos y estabilidad. Si eres mujer y preguntas por tu persona de interés, muestra cómo está él en el dinero y lo que puede suceder.' },

'espadas-1': {
  general:'Representa un no. La situación no se dará como esperas o la respuesta a tu pregunta es negativa. Habla de finales, cierres, rupturas y de lo que llega a su término: el fin de una etapa para dar paso a un nuevo comienzo.',
  amor:'Señala una negativa, una separación o el cierre de un ciclo sentimental: una ruptura, una decepción amorosa o una relación que llegó a su final. Una situación difícil necesita terminar para que puedas avanzar.',
  trabajo:'El término de una etapa laboral: fin de un empleo, rechazo de una propuesta, un proyecto que no prospera o una oportunidad que no se concreta. Invita a aceptar los cambios y prepararte para nuevos caminos.',
  dinero:'Respuesta negativa en asuntos económicos, retrasos o dificultades para concretar un negocio, préstamo o inversión. Actúa con prudencia y evita decisiones impulsivas mientras la situación se estabiliza.',
  extras:[
    {t:'Salud', x:'Una situación de salud que necesita atención y seguimiento: revisión médica, estudios o chequeo para atender un problema antes de que avance. Puede hablar de hábitos perjudiciales o dependencias — consumo excesivo de alcohol u otras sustancias — señalando la importancia de buscar apoyo y recuperar el equilibrio.'},
    {t:'Energía negativa', x:'Puede representar que una persona dirige hacia ti una intención negativa con fuerza, como una ritualización. Habla de energías densas, conflictos o malas intenciones que buscan afectar tu bienestar. Invita a proteger y limpiar tu energía, mantenerte alerta y fortalecer tu equilibrio emocional y espiritual.'}] },
'espadas-2': {
  general:'Una situación que se complica y resulta difícil de resolver: obstáculos, conflictos o problemas que requieren tiempo, paciencia y esfuerzo. Puede indicar que la respuesta no llegará pronto o que por ahora no hay una solución clara.',
  amor:'Conflictos en la relación, distanciamientos o problemas difíciles de superar. Invita a reconocer la realidad y comprender que algunas dificultades necesitarán tiempo para resolverse o no se pueden resolver en este momento.',
  trabajo:'Un ambiente laboral complicado: desacuerdos, bloqueos, proyectos estancados, problemas con compañeros o superiores, o la sensación de que las soluciones tardarán.',
  dinero:'Dificultades económicas, deudas o problemas financieros que no se resolverán de inmediato. Paciencia, administrar con cuidado y buscar soluciones a largo plazo: la recuperación puede ser lenta.',
  extras:[
    {t:'Energía negativa', x:'Presencia de energías negativas o personas actuando en tu contra a través de sus pensamientos, intenciones, deseos o acciones. Aunque no es tan intensa, sigue siendo fuerte. Mantente alerta, realiza una limpieza energética y no permitas que las malas intenciones afecten tu equilibrio.'}] },
'espadas-3': {
  general:'Representa las soluciones. Los problemas comienzan a resolverse, aparecen alternativas y una situación complicada puede encontrar salida favorable. Habla de avances, acuerdos y de dejar atrás los conflictos.',
  amor:'Reconciliación y segundas oportunidades. Una relación puede sanar, los conflictos de pareja tienen solución y existe intención de dialogar, perdonar o retomar el vínculo. Puede representar el deseo de tu persona de interés de acercarse a resolver las diferencias.',
  trabajo:'Los problemas laborales empiezan a solucionarse: acuerdos, mejoras en el ambiente de trabajo o la respuesta que buscabas para avanzar profesionalmente.',
  dinero:'Las dificultades económicas comienzan a resolverse: nuevas oportunidades, soluciones para organizar tus finanzas, recuperar estabilidad o salir de una situación complicada.' },
'espadas-4': {
  general:'Representa la infidelidad, las mentiras, los engaños, las traiciones y las malas intenciones. Invita a abrir los ojos: puede haber personas que no son sinceras o verdades que aún no salen a la luz.',
  amor:'Puede haber mentiras, engaños, secretos o infidelidades en la relación. Alguien podría estar ocultando información o actuando sin sinceridad. Observa los hechos antes de tomar una decisión.',
  trabajo:'Un ambiente laboral con posibles chismes, envidias, malas intenciones o personas deshonestas. Sé prudente, no confíes ciegamente y cuida cómo manejas la información.',
  dinero:'Advierte sobre engaños, promesas incumplidas o personas que podrían aprovecharse de ti. Revisa con atención cualquier acuerdo, inversión o préstamo antes de decidir.' },
'espadas-5': {
  general:'Representa los procesos, los trámites y las situaciones que requieren esfuerzo, tiempo y constancia. Puede indicar documentos, asuntos legales, juicios, contratos, estudios o procedimientos que deben seguir su curso antes de resolverse.',
  amor:'Una relación en la que se ha invertido mucho tiempo, esfuerzo y dedicación sin los resultados esperados. Una de las dos personas siente que ha dado más de lo que recibe; la relación requiere trabajo y compromiso para avanzar.',
  trabajo:'Esfuerzo constante y dedicación. Trámites laborales, contratos, documentos o asuntos legales; o la sensación de trabajar mucho sin el reconocimiento o los resultados esperados.',
  dinero:'Trámites financieros, contratos, pagos o asuntos legales del dinero. Has invertido tiempo o recursos en un proyecto que aún no da resultados: mantén la constancia antes de ver los frutos.',
  extras:[
    {t:'Salud', x:'Presta atención a tu bienestar y no dejes pasar malestares o síntomas. Acude a revisión médica, hazte los estudios necesarios o da seguimiento a un tratamiento antes de que se complique. Puede representar trámites de salud: consultas, análisis clínicos o procedimientos. Atiende el problema a tiempo.'}] },
'espadas-6': {
  general:'Representa la tristeza, la soledad, la nostalgia y las preocupaciones. Habla de cargas emocionales, sentimientos de vacío o la sensación de que algo falta para recuperar la tranquilidad. Puede indicar desánimo o depresión.',
  amor:'Tu persona de interés te extraña: nostalgia por la relación o deseo de volver a estar contigo. Una de las dos personas piensa constantemente en la otra, la echa de menos o atraviesa tristeza por la situación sentimental.',
  trabajo:'Insatisfacción laboral: sentir que ya no estás a gusto o desear un cambio. Preocupaciones por el ambiente laboral o el rumbo de tu vida profesional.',
  dinero:'Preocupaciones económicas, incertidumbre por la estabilidad o estrés por gastos, deudas o compromisos. Mantén la calma y busca soluciones antes de que la preocupación te rebase.',
  extras:[
    {t:'Salud', x:'Preocupación por la salud, propia o de alguien cercano. Presta más atención al bienestar físico y emocional, sin dejar que el miedo o la ansiedad se apoderen de la situación.'}] },
'espadas-7': {
  general:'Representa conflictos, problemas y situaciones que pueden volverse más intensas o difíciles de controlar: discusiones, enfrentamientos, tensión y emociones a flor de piel.',
  amor:'Una relación con muchos conflictos, discusiones y desgaste emocional. Una etapa donde las diferencias se hacen más fuertes, con reclamos o palabras hirientes. La relación necesita atención y diálogo para evitar que el problema crezca.',
  trabajo:'Conflictos laborales, roces con compañeros, desacuerdos o un ambiente tenso: competencia, problemas de comunicación o falta de armonía.',
  dinero:'Problemas económicos que generan estrés o tensión: desacuerdos por dinero, conflictos por pagos, negocios o decisiones financieras que deben manejarse con cuidado.' },
'espadas-10': {
  general:'Representa una figura femenina cercana a ti o presente en tu entorno: amigas, conocidas, compañeras de trabajo o alguien del círculo social. Muestra la influencia o presencia de una mujer en la situación consultada.',
  amor:'Puede representar a una mujer con importancia en la vida sentimental de tu persona de interés, como una amante. Puede señalar una tercera persona o a una mujer del entorno con influencia sobre la relación.',
  trabajo:'Una mujer dentro del entorno laboral: compañera, clienta, conocida o alguien con participación o influencia en la situación profesional.',
  dinero:'Apoyo, influencia o participación de una mujer cercana en asuntos económicos: acuerdos, consejos u oportunidades que llegan a través de una figura femenina.' },
'espadas-11': {
  general:'Representa el pensamiento de un hombre o una mujer: un amigo, una amiga, un compañero de trabajo, un jefe, un cliente o cualquier persona relacionada con la situación que consultas.',
  amor:'Si tu persona de interés tiene a alguien que le llama la atención o existe una tercera persona, esta carta representa lo que esa persona piensa o la influencia de sus pensamientos en la situación sentimental.',
  trabajo:'La situación dependerá de la opinión o las decisiones que otra persona está considerando: un jefe, un compañero, un cliente o alguien con influencia en tu entorno laboral.',
  dinero:'Una decisión económica puede depender de lo que otra persona piensa o evalúa: un consejo, una opinión o una decisión que influirá en tus finanzas.' },
'espadas-12': {
  general:'Representa una figura masculina cercana o relacionada con la situación: un amigo, conocido, compañero de trabajo, alguien del entorno social o una persona con influencia en la situación.',
  amor:'Un hombre con importancia en el área sentimental, como un amante. Puede señalar la presencia de un hombre en la vida de tu persona de interés o una tercera persona con algún interés o vínculo emocional.',
  trabajo:'Un hombre dentro del entorno laboral: compañero, jefe, cliente o alguien con participación o influencia en la situación profesional.',
  dinero:'Influencia, apoyo o participación de un hombre cercano en asuntos económicos: consejos, ayuda, oportunidades o alguien que interviene en tu situación financiera.' },

'bastos-1': {
  general:'Es un cambio de suerte positivo. Anuncia nuevas oportunidades, buenos comienzos y una etapa en la que las cosas empiezan a fluir a tu favor.',
  amor:'Un cambio positivo con tu persona de interés: mejora en la relación, convivencia más armoniosa o una nueva etapa donde las cosas fluyen mejor. Trae esperanza, acercamiento y oportunidad de fortalecer el vínculo. También es la carta de la sexualidad y la atracción física: el deseo y la química siguen presentes o la pasión vuelve a despertar. En preguntas íntimas puede señalar un encuentro sexual o confirmar una conexión íntima con otra persona.',
  trabajo:'Cambios positivos: los conflictos laborales comienzan a resolverse y se abre una etapa de crecimiento. Puede anunciar un cambio de empleo, un ascenso o un mejor puesto.',
  dinero:'Un cambio positivo en la economía: mejor flujo de dinero, ingresos extras o nuevas oportunidades de ganancia. La economía empieza a moverse a tu favor.' },
'bastos-2': {
  general:'Un nuevo camino, un nuevo comienzo y la llegada de una nueva oportunidad. Habla de avanzar, dejar atrás una etapa y abrirse a nuevas experiencias. También representa viajes, movimiento y cambios que te llevan hacia algo diferente.',
  amor:'Un nuevo camino con tu persona de interés: una oportunidad de empezar de nuevo, como si la relación pudiera construirse desde cero. Esa persona piensa seriamente en regresar, retomar el vínculo o volver a darte un lugar importante. También puede anunciar la llegada de alguien nuevo: el amor vuelve a ponerse en movimiento.',
  trabajo:'Nuevas oportunidades y crecimiento: un nuevo empleo, un ascenso, un cambio positivo o la oportunidad de iniciar un proyecto, invertir o emprender.',
  dinero:'Un cambio positivo en la economía: dinero extra, ingresos inesperados o nuevas oportunidades financieras. Se abre un camino hacia mayor estabilidad.' },
'bastos-3': {
  general:'Representa la energía del amor. Sentimientos que crecen, ilusión, acercamiento y una conexión que se fortalece. Anuncia una etapa donde el amor fluye con naturalidad y las emociones cobran fuerza.',
  amor:'Sentimientos verdaderos. Tu persona de interés todavía te ama, sigue sintiendo algo por ti o ese amor fue real. Habla de un vínculo que permanece — ese hilo rojo que sigue uniéndolos incluso separados. Si continúan juntos, el lazo se fortalece y el amor sigue creciendo.',
  trabajo:'Buenas relaciones laborales: armonía, colaboración y buena comunicación con compañeros y jefes. Vínculos positivos que favorecen el crecimiento y las oportunidades.',
  dinero:'Oportunidades económicas a través de personas cercanas: negocios, inversiones o proyectos con familiares o amigos. Vínculos económicos sólidos que abren camino a la estabilidad.' },
'bastos-4': {
  general:'Estabilidad en cualquier área de la vida. Habla de equilibrio, seguridad y de una etapa en la que las cosas se consolidan y dan tranquilidad.',
  amor:'Una relación que se vuelve estable y formal: dar un paso importante como iniciar un noviazgo, vivir juntos, comprometerse o llegar al matrimonio. Un amor que deja de ser ilusión para convertirse en algo real y sólido: compromiso, confianza y deseo de construir una vida en común.',
  trabajo:'Estabilidad laboral: seguridad en tu empleo, un trabajo firme y la tranquilidad de un puesto estable, sin riesgo de despidos.',
  dinero:'Estabilidad y tranquilidad: las finanzas se consolidan y todo se siente más seguro. Lo que has construido empieza a dar resultados.' },
'bastos-5': {
  general:'Representa la comunicación: una llamada, un mensaje, una conversación importante o una noticia que trae movimiento. También habla de redes sociales — observar o tener contacto a través de plataformas digitales — y de situaciones que se aclaran con el diálogo.',
  amor:'Comunicación con tu persona de interés: te busca, te llama, te escribe o se hace presente. Si es una expareja, habla de acercamiento o intención de retomar el contacto; tras una discusión, la otra persona se abre al diálogo. También representa las redes: esa persona está pendiente de ti, de tus estados y publicaciones, manteniendo una conexión aunque sea indirecta.',
  trabajo:'Comunicación y apertura de oportunidades a través de la palabra: buenas conversaciones, entrevistas, negociaciones. Tu forma de expresarte puede abrirte puertas.',
  dinero:'Facilidad para generar ingresos: buenas ideas, creatividad y energía para buscar nuevas formas de hacer dinero. Movimiento económico y oportunidades.' },
'bastos-6': {
  general:'Representa los celos, las inseguridades y las dudas internas. Aparece cuando hay miedo a avanzar o resistencia a dar el siguiente paso. También habla de personas que observan lo que haces desde la inseguridad o la envidia. Invita a recuperar la confianza en ti mismo.',
  amor:'Celos, inseguridades y miedo a perder a alguien. Puede indicar que tú tienes dudas hacia tu persona de interés, o que esa persona siente celos o inquietud por la relación. Habla de necesidad de controlar, posesividad o preocupación por el otro. Invita a revisar la confianza dentro del vínculo.',
  trabajo:'Inseguridades, dudas o miedo a perder la estabilidad laboral. También celos, envidia o energías negativas alrededor de tu crecimiento. Confía más en tus capacidades y en tu valor.',
  dinero:'Inseguridades económicas: miedo a invertir, a arriesgarte o a iniciar un proyecto. Trabaja la seguridad en ti mismo y no dejes que el miedo te frene.' },
'bastos-7': {
  general:'Problemas, conflictos o situaciones que requieren atención en cualquier área. No necesariamente algo grave: momentos donde hay que poner esfuerzo, defender tu posición y buscar soluciones. Retos que se pueden trabajar y superar.',
  amor:'Problemas o conflictos con tu persona de interés: discusiones, diferencias o tensión entre ambos. No habla de algo definitivo, sino de una etapa donde hay cosas que hablar y trabajar para recuperar la armonía.',
  trabajo:'Conflictos o roces en el ambiente laboral: tensiones con compañeros o jefes, ambiente pesado o desacuerdos. Se resuelven con comunicación, paciencia y equilibrio.',
  dinero:'Dificultades económicas que necesitan atención: decisiones o gastos que no dan los resultados esperados. Tiene solución si se revisa con calma cómo administras tu dinero.' },
'bastos-10': {
  general:'Representa a la familia y a las personas más cercanas. Cuando preguntas por alguien, señala a un familiar: tu mamá, una hermana, una tía, una prima o alguien con vínculo familiar muy cercano. Habla de los lazos de sangre y su importancia en la situación.',
  amor:'El apoyo de tu familia, especialmente de las figuras femeninas cercanas. Si atraviesas una decepción o ruptura, no tienes que cargar con todo: acércate a quienes te quieren, escucha sus consejos y permite que su apoyo te devuelva la tranquilidad.',
  trabajo:'Un ambiente laboral armonioso, donde las personas se sienten como familia. Una mujer de tu familia puede brindarte una oportunidad, un consejo o el apoyo que necesitas.',
  dinero:'Apoyo económico de tu familia, especialmente de una figura femenina: un préstamo, ayuda para un gasto, apoyo para una inversión o un consejo financiero. En momentos de necesidad, tu familia es un respaldo importante.' },
'bastos-11': {
  general:'Los pensamientos de una persona cercana, hombre o mujer de tu familia: lo que está pensando, analizando o reflexionando. Presta atención a sus ideas, opiniones o preocupaciones — ahí puede estar la respuesta que buscas.',
  amor:'El apoyo de tu familia, especialmente de las figuras femeninas cercanas. Ante una decepción amorosa, sus consejos y cariño pueden darte la fortaleza y la respuesta que necesitas.',
  trabajo:'Los pensamientos de la persona con mayor influencia en tu entorno laboral: lo que piensa un jefe, supervisor o cliente. Una decisión importante puede depender de la opinión de alguien con autoridad.',
  dinero:'Pensamientos, consejos y orientación de una persona que puede influir positivamente en tu economía: una idea, recomendación o solución que mejore tus finanzas.' },
'bastos-12': {
  general:'Un hombre de tu familia o una figura masculina muy cercana: tu papá, un hermano, un tío, un primo o un hombre con vínculo familiar importante. Habla de su presencia, su influencia o de situaciones relacionadas con él.',
  amor:'El apoyo, la orientación o los consejos de una figura masculina de tu familia. En una situación sentimental complicada, un hombre cercano puede brindarte fortaleza, respaldo o una perspectiva para decidir mejor.',
  trabajo:'Un ambiente laboral de confianza, o apoyo, oportunidad o recomendación por parte de un familiar hombre. Una figura masculina cercana puede impulsar tu crecimiento profesional.',
  dinero:'Apoyo económico de un hombre de tu familia: un préstamo, ayuda financiera, respaldo para emprender o superar un momento difícil.' }
}};
