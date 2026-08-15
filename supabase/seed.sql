-- ============================================================================
--  Prisma Azul — contenido
-- ============================================================================
--
--  GENERADO POR scripts/exportar-contenido.mjs — NO EDITAR A MANO.
--  Para regenerarlo:  node scripts/exportar-contenido.mjs
--
--  Textos de los PDFs de Gilda, volcados literalmente. Aplícalo DESPUÉS de
--  schema.sql, en el SQL Editor de Supabase. Es idempotente: reejecutarlo
--  actualiza lo que cambió y respeta el resto.
-- ============================================================================

begin;

-- Palos ---------------------------------------------------------------------
insert into public.palos (key, nombre, elemento, color, idx_color, orden) values ('oros', 'Oros', 'Tierra · Prosperidad', '#ecc874', '#f0d488', 0)
  on conflict (key) do update set nombre = excluded.nombre, elemento = excluded.elemento, color = excluded.color, idx_color = excluded.idx_color, orden = excluded.orden;
insert into public.palos (key, nombre, elemento, color, idx_color, orden) values ('copas', 'Copas', 'Agua · Emoción', '#e79ab4', '#f0b9cd', 1)
  on conflict (key) do update set nombre = excluded.nombre, elemento = excluded.elemento, color = excluded.color, idx_color = excluded.idx_color, orden = excluded.orden;
insert into public.palos (key, nombre, elemento, color, idx_color, orden) values ('espadas', 'Espadas', 'Aire · Intelecto', '#8db0ec', '#aecaf5', 2)
  on conflict (key) do update set nombre = excluded.nombre, elemento = excluded.elemento, color = excluded.color, idx_color = excluded.idx_color, orden = excluded.orden;
insert into public.palos (key, nombre, elemento, color, idx_color, orden) values ('bastos', 'Bastos', 'Fuego · Acción', '#86cf9e', '#a8e3bc', 3)
  on conflict (key) do update set nombre = excluded.nombre, elemento = excluded.elemento, color = excluded.color, idx_color = excluded.idx_color, orden = excluded.orden;

-- Significado de las 40 cartas ----------------------------------------------
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('oros', 1, 'Representa un sí. Es una carta de éxito, resultados positivos, oportunidades y caminos que comienzan a abrirse. Indica que una situación puede avanzar, que las cosas pueden mejorar y que existe una energía favorable para lograr lo que se está buscando.', 'Representa un sí ante las preguntas sentimentales. Hay una energía favorable para la relación y posibilidad de que la situación avance. Puede hablar de reconciliaciones, retomar una relación, superar dificultades o volver a construir un vínculo desde un lugar más estable. También representa éxito sentimental y la posibilidad de que aquello que deseas en el amor comience a tomar forma.', 'Representa éxito, reconocimiento y nuevas oportunidades laborales. Puede indicar propuestas, crecimiento profesional, proyectos que prosperan o una etapa donde las cosas comienzan a fluir de manera favorable.', 'Es una de las cartas más positivas para la economía. Habla de éxito, abundancia, prosperidad, dinero extra, oportunidades financieras, mejoras económicas o buena suerte en asuntos relacionados con el dinero.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('oros', 2, 'Representa una promesa sincera, buenas intenciones y una actitud positiva hacia ti. Habla de vínculos que comienzan a tomar forma, acuerdos y conexiones con interés verdadero. También se relaciona con la familia, la unión y la creación de algo nuevo; puede representar embarazo, hijos o la llegada de una nueva etapa importante.', 'Es la carta del amor sincero, las buenas intenciones y los sentimientos reales. Representa una persona que tuvo una conexión verdadera contigo y un cariño genuino. Es la carta del noviazgo y de los vínculos que buscan avanzar hacia algo más estable: en un "casi algo" indica interés verdadero y posibilidad de formalizarse. También habla de reconciliación y de volver a construir el vínculo desde la sinceridad.', 'Representa acuerdos favorables, buenas relaciones laborales y la posibilidad de que algo avance de manera positiva. Puede indicar alianzas, propuestas o personas con buena actitud hacia ti en lo profesional.', 'Habla de estabilidad, apoyo y crecimiento económico. Puede señalar oportunidades, acuerdos o proyectos que empiezan a tomar forma y pueden traer beneficios.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('oros', 3, 'Representa el crecimiento, el avance y las situaciones que comienzan a tomar forma. Indica que algo va de menos a más, que se construye poco a poco y que con el tiempo puede alcanzar mejores resultados.', 'Representa sentimientos que crecen y se fortalecen con el tiempo. Si preguntas por tu persona de interés, sus emociones pueden ir aumentando poco a poco: comienza a extrañarte más, crece el deseo de acercamiento o la intención de reconciliarse se vuelve más fuerte. Dentro de una relación, señala un amor en crecimiento y un vínculo cada vez más estable.', 'Indica progreso, aprendizaje y crecimiento profesional. Habla de proyectos que avanzan poco a poco, de resultados que llegan con constancia y de una situación laboral que puede mejorar con el tiempo.', 'Representa crecimiento económico gradual. Un proyecto, negocio o inversión comienza a dar frutos poco a poco. No habla de resultados inmediatos, sino de una mejora que se construye con paciencia y esfuerzo.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('oros', 4, 'Representa dudas, inseguridades, miedos y aquello que nos detiene por temor a avanzar. Muestra bloqueos internos, pero también indica que esos miedos pueden superarse y que hay posibilidad de encontrar estabilidad.', 'Representa dudas e inseguridades sentimentales. Una persona puede tener miedo de avanzar contigo, temor a involucrarse o no estar segura de dar el siguiente paso. Al ser una carta positiva, esas dudas pueden aclararse y la situación mejorar: hay sentimientos, pero la persona necesita vencer sus inseguridades.', 'Indica miedo al cambio, inseguridad ante una nueva oportunidad o dudas sobre una decisión laboral. La persona tiene las capacidades para avanzar, pero algo interno la detiene; los obstáculos se resuelven con confianza y paciencia.', 'Habla de preocupaciones, temor a perder estabilidad o inseguridad al tomar decisiones económicas. Aun así, hay posibilidad de ordenar la situación, recuperar confianza y encontrar una solución.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('oros', 5, 'Representa la necesidad de pedir ayuda, orientación o apoyo. Habla de alguien que no sabe cómo actuar o siente que no puede resolver las cosas por sí solo. Invita a aceptar apoyo, escuchar consejos y permitir que otros aporten una solución.', 'Representa una persona que necesita mucho de ti: de tu apoyo, tu atención o tu presencia. Puede indicar que alguien se ha acostumbrado a recibir tu ayuda y estabilidad, dependiendo de lo que tú aportas. Hay oportunidad de mejorar la situación cambiando ciertas dinámicas: dar demasiado puede impedir que la otra persona aprenda a actuar, crecer o aportar por sí misma.', 'Indica la necesidad de pedir apoyo, consejo o ayuda para resolver una situación laboral. Habla de aprender de alguien con más experiencia, buscar orientación o aceptar que no todo se resuelve en soledad.', 'Representa la necesidad de apoyo económico o de buscar una solución con ayuda de otras personas: préstamos, consejos financieros o alguien que te orienta. También habla de aprender a administrar mejor los recursos.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('oros', 6, 'No estás recibiendo exactamente lo que deseas en este momento, pero existe la posibilidad de recuperar el equilibrio o encontrar la forma de obtener lo que necesitas.', 'Hay algo que esperas recibir en esta relación y no lo obtienes por completo: atención, cariño, compromiso, interés o esfuerzo. Puede existir un desequilibrio — tú das más de lo que recibes, o la otra persona siente que no recibe lo que necesita. También puede indicar disminución de sentimientos o interés; pero al ser una carta positiva, el equilibrio puede recuperarse y la situación mejorar.', 'Representa buscar reconocimiento, apoyo o una recompensa que todavía no llega como esperabas. Puede indicar que algo mejora, que llega una oportunidad o que recibes ayuda de otra fuente.', 'Habla de una meta económica que aún no se concreta, pero que tienes potencial de alcanzar. La oportunidad, ayuda o recurso que necesitas puede llegar por otro medio.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('oros', 7, 'Confirma que aquello que tanto deseas tiene grandes posibilidades de llegar a tu vida. Es una carta de logro, cumplimiento y resultados favorables. Habla de situaciones que avanzan hacia donde esperas y de metas que comienzan a hacerse realidad.', 'Aquello que deseas en el amor puede concretarse. Sin pareja, hay gran posibilidad de conocer a alguien con quien construir una relación. Si buscas reconciliarte, lo que anhelas tiene posibilidades de suceder. En un "casi algo", el vínculo puede evolucionar hacia una relación más estable. Habla de sentimientos que se fortalecen y de una relación que avanza hacia donde ambos desean.', 'Aquello por lo que has trabajado puede dar resultados. Habla de crecimiento, oportunidades, ascensos, reconocimiento o de alcanzar una meta profesional que esperabas.', 'Indica un incremento económico, estabilidad y la posibilidad de obtener lo que buscas. Un trámite, pago, asunto legal o proyecto económico pendiente se resolverá de manera favorable.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('oros', 10, 'Hay otras personas involucradas en la situación por la que preguntas: una persona joven, varias personas influyendo a la vez o alguien interviniendo de manera directa. En consultas espirituales puede indicar que alguien realiza un trabajo energético, con intención positiva o negativa, o que recurrió a otra persona para intervenir.', 'Puede existir una tercera persona o un interés sentimental informal. Tu persona de interés puede sentir atracción por alguien más o mantener un vínculo sin compromiso: una conexión que influye en la situación sentimental.', 'Otras personas influyen en tu situación laboral: compañeros, clientes, colaboradores o un grupo con participación en el resultado que esperas.', 'Tu situación económica puede depender de la participación o apoyo de otras personas. También señala proyectos, negocios o decisiones donde intervienen varias personas.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('oros', 11, 'La clave de esta situación está en los pensamientos, intenciones o ideas de las personas involucradas. Habla de lo que alguien analiza, considera o planea antes de actuar; si tu pregunta involucra a varias personas, muestra lo que piensan y la influencia de sus ideas sobre el resultado.', 'Si existe una tercera persona, muestra lo que esa persona piensa o la influencia que sus pensamientos tienen en la relación.', 'Las decisiones dependerán de lo que otras personas están pensando: la opinión de compañeros, clientes, jefes o de quienes participan en el ámbito laboral.', 'Una decisión económica aún se está analizando. Otras personas evalúan una propuesta, un proyecto, un trámite o una inversión antes de dar una respuesta.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('oros', 12, 'Hay un hombre involucrado en la situación: un hombre joven, un conocido, un amigo o alguien que influye directamente en los acontecimientos. En consultas espirituales puede señalar al hombre que realiza un trabajo energético o a quien recurrió a otra persona para intervenir.', 'Existe la influencia de un hombre en la situación sentimental. Puede representar a un tercero, un interés amoroso o alguien que llama la atención de tu persona de interés, sin que exista necesariamente una relación formal.', 'Un hombre influye en tu situación laboral: un compañero, un cliente, un jefe o alguien cuya participación será importante para el resultado que esperas.', 'Un hombre puede tener un papel importante en tus asuntos económicos: brindándote apoyo, participando en un proyecto o influyendo en una decisión financiera.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('copas', 1, 'La situación tiene que ver directamente contigo: tu persona, tu cuerpo, tu mente, tu alma y tu espíritu. También representa tu hogar o tu refugio. Te invita a mirar hacia tu interior, porque la respuesta que buscas nace de ti y de lo que estás viviendo.', 'El amor debe vivirse de manera completa, en cuerpo, alma y espíritu. Habla de una conexión profunda donde los sentimientos y el bienestar de ambos importan por igual. Antes de buscar respuestas en la otra persona, escucha lo que tú sientes y lo que realmente deseas para tu vida sentimental.', 'Tu crecimiento laboral dependerá de ti, de tus decisiones y de la confianza en tus capacidades. El ambiente donde trabajas influye directamente en tu bienestar.', 'La estabilidad económica comienza por ti: por cómo administras tus recursos y las decisiones que tomas. Es una invitación a construir seguridad desde tus propias acciones.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('copas', 2, 'La verdad saldrá a la luz. Habla de descubrir la realidad de una situación, de enterarte de algo importante o de recibir una respuesta sincera. Las personas involucradas actúan y se expresan con honestidad.', 'Las palabras y sentimientos que tu persona de interés expresa hacia ti son sinceros. Si te dice que te ama, habla con la verdad; si dice que necesita tiempo o no desea continuar, también es honesta. Cree en los hechos y palabras que nacen de la sinceridad. Puede anunciar que una verdad sentimental saldrá a la luz y te permitirá comprender mejor la situación.', 'Pronto conocerás la verdad sobre una situación laboral: conversaciones sinceras, aclaraciones o información que te ayudará a decidir mejor.', 'Conocerás la realidad de un asunto económico: una respuesta, un acuerdo, un trámite o información importante que te dará claridad para actuar.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('copas', 3, 'La situación aún no está completamente definida. Existe ambivalencia, dudas o cambios constantes: hoy puede parecer una cosa y mañana otra. Todavía hay posibilidad de que la situación cambie.', 'Tu persona de interés puede sentirse ambivalente respecto a ti: a veces desea acercarse y estar contigo, otras necesita tomar distancia. Sus sentimientos o decisiones no son completamente firmes todavía. Al no ser definitivo, las cosas pueden cambiar según las decisiones de ambos y cómo evolucione la relación.', 'Tu situación laboral aún no está decidida: cambios de opinión, propuestas en valoración o decisiones pendientes. Todavía hay margen para influir en el resultado a tu favor.', 'Un asunto económico todavía no está resuelto. Hay dudas, cambios o decisiones pendientes, pero la respuesta no es definitiva: aún puede evolucionar favorablemente.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('copas', 4, 'Aquello por lo que preguntas está próximo a suceder. Habla de acontecimientos, noticias, oportunidades o cambios que llegarán en poco tiempo. Anuncia movimiento y resultados cercanos.', 'Lo que esperas en el amor puede suceder pronto. Si preguntas si esa persona te va a buscar, llamar o escribir, la respuesta es sí, y en poco tiempo. Una reconciliación, un regreso o un acercamiento está más cerca de lo que imaginas; la relación puede comenzar a evolucionar muy pronto.', 'Una oportunidad laboral, un ascenso, una propuesta o un cambio favorable puede llegar en corto plazo. Habla de avances por concretarse.', 'Una mejora económica, un pago, un ingreso o una oportunidad está próxima a llegar. También puede señalar la resolución cercana de un trámite o asunto económico.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('copas', 5, 'Algo inesperado está por suceder: acontecimientos que llegan por sorpresa y cambios que aparecen cuando menos los esperas. Puede representar un regalo del universo o una compensación energética.', 'Vivirás una situación que no esperabas: una persona que regresa a buscarte, un mensaje, una declaración o un acercamiento inesperado. También puede indicar un rompimiento o cambio repentino. La carta no dice si será bueno o malo: lo que ocurra te sorprenderá porque no lo estabas esperando.', 'Puede presentarse un cambio inesperado en lo laboral: un ascenso, una nueva oportunidad, un cambio de puesto o una situación que modifique tu estabilidad. Será algo que no tenías contemplado.', 'Puede llegar un movimiento económico inesperado: un ingreso, un pago, una oportunidad o un gasto que cambie tu panorama financiero sin esperarlo.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('copas', 6, 'Se acerca un encuentro, una reunión o un acontecimiento importante. Habla de compartir, convivir, celebrar o reunirte con otras personas. Puede indicar una invitación, una salida o un motivo de alegría próximo.', 'Sí existe la posibilidad de volver a reunirte con tu persona de interés. Si preguntas si la volverás a ver o si habrá un acercamiento, la respuesta es positiva: un encuentro cara a cara, una conversación importante o la oportunidad de compartir nuevamente un momento juntos.', 'Vienen momentos positivos para celebrar: un reconocimiento, una reunión importante, un logro, un ascenso o una buena noticia en lo laboral.', 'Una mejora que será motivo de celebración: un ingreso, un pago, un logro económico o una noticia favorable que te dará tranquilidad.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('copas', 7, 'La situación por la que preguntas ha tenido un impacto muy fuerte en tu vida: algo que te marcó profundamente, por sufrimiento o por una gran alegría. La respuesta depende de lo que hoy resuene contigo y de las cartas que acompañen la lectura.', 'Esta relación ha despertado emociones muy intensas en ti: una persona que te hizo inmensamente feliz o que te lastimó profundamente. La carta confirma que existe una huella emocional muy importante entre ustedes.', 'Tu situación laboral ha sido emocionalmente significativa. Reconoce el esfuerzo, la decepción o el desgaste de los momentos difíciles, o la gran satisfacción de un logro importante.', 'El aspecto económico ha tenido un impacto importante en tu vida: una pérdida que te preocupó mucho o una mejora que te llenó de tranquilidad. Depende de la situación que atraviesas.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('copas', 10, 'Esta carta te representa a ti si eres mujer. Si eres hombre y preguntas por tu persona de interés, la representa a ella. Todo lo que aparezca alrededor hablará de esa mujer: sus pensamientos, emociones, decisiones o lo que está viviendo.', 'Si eres mujer, habla de ti y de cómo vives la relación. Si eres hombre, habla de tu persona de interés y de lo que sucede en su vida sentimental.', 'Si eres mujer, muestra cómo te encuentras en el trabajo y lo que viene para ti. Si eres hombre y preguntas por tu persona de interés, habla de cómo se encuentra ella en lo laboral.', 'Si eres mujer, habla de tu economía, tus ingresos y estabilidad. Si eres hombre y preguntas por tu persona de interés, muestra cómo está ella en el dinero y lo que puede venir.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('copas', 11, 'Si eres mujer, habla de lo que estás pensando, tus dudas e ideas y cómo procesas la situación. Si eres hombre y preguntas por tu persona de interés, representa lo que ella piensa, cómo analiza las cosas o las decisiones que considera tomar.', 'Si eres mujer, muestra lo que tú piensas y sientes de tu situación sentimental. Si eres hombre, revela lo que tu persona de interés está pensando sobre ti o sobre la relación.', 'Si eres mujer, muestra cómo ves tu trabajo, tus proyectos y decisiones. Si eres hombre, habla de lo que tu persona de interés piensa de su situación laboral.', 'Si eres mujer, muestra cómo analizas tus finanzas y decisiones económicas. Si eres hombre, representa lo que tu persona de interés piensa sobre su situación económica.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('copas', 12, 'Esta carta te representa a ti si eres hombre. Si eres mujer y preguntas por tu persona de interés, lo representa a él. Todo lo que aparezca alrededor hablará de ese hombre: sus emociones, decisiones, experiencias o lo que está viviendo.', 'Si eres hombre, habla de ti y de cómo vives la relación. Si eres mujer, habla de tu persona de interés y de lo que sucede en su vida sentimental.', 'Si eres hombre, muestra cómo te encuentras en el trabajo y lo que viene para ti. Si eres mujer y preguntas por tu persona de interés, habla de cómo se encuentra él en lo laboral.', 'Si eres hombre, habla de tu economía, ingresos y estabilidad. Si eres mujer y preguntas por tu persona de interés, muestra cómo está él en el dinero y lo que puede suceder.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('espadas', 1, 'Representa un no. La situación no se dará como esperas o la respuesta a tu pregunta es negativa. Habla de finales, cierres, rupturas y de lo que llega a su término: el fin de una etapa para dar paso a un nuevo comienzo.', 'Señala una negativa, una separación o el cierre de un ciclo sentimental: una ruptura, una decepción amorosa o una relación que llegó a su final. Una situación difícil necesita terminar para que puedas avanzar.', 'El término de una etapa laboral: fin de un empleo, rechazo de una propuesta, un proyecto que no prospera o una oportunidad que no se concreta. Invita a aceptar los cambios y prepararte para nuevos caminos.', 'Respuesta negativa en asuntos económicos, retrasos o dificultades para concretar un negocio, préstamo o inversión. Actúa con prudencia y evita decisiones impulsivas mientras la situación se estabiliza.', '[{"t":"Salud","x":"Una situación de salud que necesita atención y seguimiento: revisión médica, estudios o chequeo para atender un problema antes de que avance. Puede hablar de hábitos perjudiciales o dependencias — consumo excesivo de alcohol u otras sustancias — señalando la importancia de buscar apoyo y recuperar el equilibrio."},{"t":"Energía negativa","x":"Puede representar que una persona dirige hacia ti una intención negativa con fuerza, como una ritualización. Habla de energías densas, conflictos o malas intenciones que buscan afectar tu bienestar. Invita a proteger y limpiar tu energía, mantenerte alerta y fortalecer tu equilibrio emocional y espiritual."}]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('espadas', 2, 'Una situación que se complica y resulta difícil de resolver: obstáculos, conflictos o problemas que requieren tiempo, paciencia y esfuerzo. Puede indicar que la respuesta no llegará pronto o que por ahora no hay una solución clara.', 'Conflictos en la relación, distanciamientos o problemas difíciles de superar. Invita a reconocer la realidad y comprender que algunas dificultades necesitarán tiempo para resolverse o no se pueden resolver en este momento.', 'Un ambiente laboral complicado: desacuerdos, bloqueos, proyectos estancados, problemas con compañeros o superiores, o la sensación de que las soluciones tardarán.', 'Dificultades económicas, deudas o problemas financieros que no se resolverán de inmediato. Paciencia, administrar con cuidado y buscar soluciones a largo plazo: la recuperación puede ser lenta.', '[{"t":"Energía negativa","x":"Presencia de energías negativas o personas actuando en tu contra a través de sus pensamientos, intenciones, deseos o acciones. Aunque no es tan intensa, sigue siendo fuerte. Mantente alerta, realiza una limpieza energética y no permitas que las malas intenciones afecten tu equilibrio."}]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('espadas', 3, 'Representa las soluciones. Los problemas comienzan a resolverse, aparecen alternativas y una situación complicada puede encontrar salida favorable. Habla de avances, acuerdos y de dejar atrás los conflictos.', 'Reconciliación y segundas oportunidades. Una relación puede sanar, los conflictos de pareja tienen solución y existe intención de dialogar, perdonar o retomar el vínculo. Puede representar el deseo de tu persona de interés de acercarse a resolver las diferencias.', 'Los problemas laborales empiezan a solucionarse: acuerdos, mejoras en el ambiente de trabajo o la respuesta que buscabas para avanzar profesionalmente.', 'Las dificultades económicas comienzan a resolverse: nuevas oportunidades, soluciones para organizar tus finanzas, recuperar estabilidad o salir de una situación complicada.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('espadas', 4, 'Representa la infidelidad, las mentiras, los engaños, las traiciones y las malas intenciones. Invita a abrir los ojos: puede haber personas que no son sinceras o verdades que aún no salen a la luz.', 'Puede haber mentiras, engaños, secretos o infidelidades en la relación. Alguien podría estar ocultando información o actuando sin sinceridad. Observa los hechos antes de tomar una decisión.', 'Un ambiente laboral con posibles chismes, envidias, malas intenciones o personas deshonestas. Sé prudente, no confíes ciegamente y cuida cómo manejas la información.', 'Advierte sobre engaños, promesas incumplidas o personas que podrían aprovecharse de ti. Revisa con atención cualquier acuerdo, inversión o préstamo antes de decidir.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('espadas', 5, 'Representa los procesos, los trámites y las situaciones que requieren esfuerzo, tiempo y constancia. Puede indicar documentos, asuntos legales, juicios, contratos, estudios o procedimientos que deben seguir su curso antes de resolverse.', 'Una relación en la que se ha invertido mucho tiempo, esfuerzo y dedicación sin los resultados esperados. Una de las dos personas siente que ha dado más de lo que recibe; la relación requiere trabajo y compromiso para avanzar.', 'Esfuerzo constante y dedicación. Trámites laborales, contratos, documentos o asuntos legales; o la sensación de trabajar mucho sin el reconocimiento o los resultados esperados.', 'Trámites financieros, contratos, pagos o asuntos legales del dinero. Has invertido tiempo o recursos en un proyecto que aún no da resultados: mantén la constancia antes de ver los frutos.', '[{"t":"Salud","x":"Presta atención a tu bienestar y no dejes pasar malestares o síntomas. Acude a revisión médica, hazte los estudios necesarios o da seguimiento a un tratamiento antes de que se complique. Puede representar trámites de salud: consultas, análisis clínicos o procedimientos. Atiende el problema a tiempo."}]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('espadas', 6, 'Representa la tristeza, la soledad, la nostalgia y las preocupaciones. Habla de cargas emocionales, sentimientos de vacío o la sensación de que algo falta para recuperar la tranquilidad. Puede indicar desánimo o depresión.', 'Tu persona de interés te extraña: nostalgia por la relación o deseo de volver a estar contigo. Una de las dos personas piensa constantemente en la otra, la echa de menos o atraviesa tristeza por la situación sentimental.', 'Insatisfacción laboral: sentir que ya no estás a gusto o desear un cambio. Preocupaciones por el ambiente laboral o el rumbo de tu vida profesional.', 'Preocupaciones económicas, incertidumbre por la estabilidad o estrés por gastos, deudas o compromisos. Mantén la calma y busca soluciones antes de que la preocupación te rebase.', '[{"t":"Salud","x":"Preocupación por la salud, propia o de alguien cercano. Presta más atención al bienestar físico y emocional, sin dejar que el miedo o la ansiedad se apoderen de la situación."}]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('espadas', 7, 'Representa conflictos, problemas y situaciones que pueden volverse más intensas o difíciles de controlar: discusiones, enfrentamientos, tensión y emociones a flor de piel.', 'Una relación con muchos conflictos, discusiones y desgaste emocional. Una etapa donde las diferencias se hacen más fuertes, con reclamos o palabras hirientes. La relación necesita atención y diálogo para evitar que el problema crezca.', 'Conflictos laborales, roces con compañeros, desacuerdos o un ambiente tenso: competencia, problemas de comunicación o falta de armonía.', 'Problemas económicos que generan estrés o tensión: desacuerdos por dinero, conflictos por pagos, negocios o decisiones financieras que deben manejarse con cuidado.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('espadas', 10, 'Representa una figura femenina cercana a ti o presente en tu entorno: amigas, conocidas, compañeras de trabajo o alguien del círculo social. Muestra la influencia o presencia de una mujer en la situación consultada.', 'Puede representar a una mujer con importancia en la vida sentimental de tu persona de interés, como una amante. Puede señalar una tercera persona o a una mujer del entorno con influencia sobre la relación.', 'Una mujer dentro del entorno laboral: compañera, clienta, conocida o alguien con participación o influencia en la situación profesional.', 'Apoyo, influencia o participación de una mujer cercana en asuntos económicos: acuerdos, consejos u oportunidades que llegan a través de una figura femenina.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('espadas', 11, 'Representa el pensamiento de un hombre o una mujer: un amigo, una amiga, un compañero de trabajo, un jefe, un cliente o cualquier persona relacionada con la situación que consultas.', 'Si tu persona de interés tiene a alguien que le llama la atención o existe una tercera persona, esta carta representa lo que esa persona piensa o la influencia de sus pensamientos en la situación sentimental.', 'La situación dependerá de la opinión o las decisiones que otra persona está considerando: un jefe, un compañero, un cliente o alguien con influencia en tu entorno laboral.', 'Una decisión económica puede depender de lo que otra persona piensa o evalúa: un consejo, una opinión o una decisión que influirá en tus finanzas.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('espadas', 12, 'Representa una figura masculina cercana o relacionada con la situación: un amigo, conocido, compañero de trabajo, alguien del entorno social o una persona con influencia en la situación.', 'Un hombre con importancia en el área sentimental, como un amante. Puede señalar la presencia de un hombre en la vida de tu persona de interés o una tercera persona con algún interés o vínculo emocional.', 'Un hombre dentro del entorno laboral: compañero, jefe, cliente o alguien con participación o influencia en la situación profesional.', 'Influencia, apoyo o participación de un hombre cercano en asuntos económicos: consejos, ayuda, oportunidades o alguien que interviene en tu situación financiera.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('bastos', 1, 'Es un cambio de suerte positivo. Anuncia nuevas oportunidades, buenos comienzos y una etapa en la que las cosas empiezan a fluir a tu favor.', 'Un cambio positivo con tu persona de interés: mejora en la relación, convivencia más armoniosa o una nueva etapa donde las cosas fluyen mejor. Trae esperanza, acercamiento y oportunidad de fortalecer el vínculo. También es la carta de la sexualidad y la atracción física: el deseo y la química siguen presentes o la pasión vuelve a despertar. En preguntas íntimas puede señalar un encuentro sexual o confirmar una conexión íntima con otra persona.', 'Cambios positivos: los conflictos laborales comienzan a resolverse y se abre una etapa de crecimiento. Puede anunciar un cambio de empleo, un ascenso o un mejor puesto.', 'Un cambio positivo en la economía: mejor flujo de dinero, ingresos extras o nuevas oportunidades de ganancia. La economía empieza a moverse a tu favor.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('bastos', 2, 'Un nuevo camino, un nuevo comienzo y la llegada de una nueva oportunidad. Habla de avanzar, dejar atrás una etapa y abrirse a nuevas experiencias. También representa viajes, movimiento y cambios que te llevan hacia algo diferente.', 'Un nuevo camino con tu persona de interés: una oportunidad de empezar de nuevo, como si la relación pudiera construirse desde cero. Esa persona piensa seriamente en regresar, retomar el vínculo o volver a darte un lugar importante. También puede anunciar la llegada de alguien nuevo: el amor vuelve a ponerse en movimiento.', 'Nuevas oportunidades y crecimiento: un nuevo empleo, un ascenso, un cambio positivo o la oportunidad de iniciar un proyecto, invertir o emprender.', 'Un cambio positivo en la economía: dinero extra, ingresos inesperados o nuevas oportunidades financieras. Se abre un camino hacia mayor estabilidad.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('bastos', 3, 'Representa la energía del amor. Sentimientos que crecen, ilusión, acercamiento y una conexión que se fortalece. Anuncia una etapa donde el amor fluye con naturalidad y las emociones cobran fuerza.', 'Sentimientos verdaderos. Tu persona de interés todavía te ama, sigue sintiendo algo por ti o ese amor fue real. Habla de un vínculo que permanece — ese hilo rojo que sigue uniéndolos incluso separados. Si continúan juntos, el lazo se fortalece y el amor sigue creciendo.', 'Buenas relaciones laborales: armonía, colaboración y buena comunicación con compañeros y jefes. Vínculos positivos que favorecen el crecimiento y las oportunidades.', 'Oportunidades económicas a través de personas cercanas: negocios, inversiones o proyectos con familiares o amigos. Vínculos económicos sólidos que abren camino a la estabilidad.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('bastos', 4, 'Estabilidad en cualquier área de la vida. Habla de equilibrio, seguridad y de una etapa en la que las cosas se consolidan y dan tranquilidad.', 'Una relación que se vuelve estable y formal: dar un paso importante como iniciar un noviazgo, vivir juntos, comprometerse o llegar al matrimonio. Un amor que deja de ser ilusión para convertirse en algo real y sólido: compromiso, confianza y deseo de construir una vida en común.', 'Estabilidad laboral: seguridad en tu empleo, un trabajo firme y la tranquilidad de un puesto estable, sin riesgo de despidos.', 'Estabilidad y tranquilidad: las finanzas se consolidan y todo se siente más seguro. Lo que has construido empieza a dar resultados.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('bastos', 5, 'Representa la comunicación: una llamada, un mensaje, una conversación importante o una noticia que trae movimiento. También habla de redes sociales — observar o tener contacto a través de plataformas digitales — y de situaciones que se aclaran con el diálogo.', 'Comunicación con tu persona de interés: te busca, te llama, te escribe o se hace presente. Si es una expareja, habla de acercamiento o intención de retomar el contacto; tras una discusión, la otra persona se abre al diálogo. También representa las redes: esa persona está pendiente de ti, de tus estados y publicaciones, manteniendo una conexión aunque sea indirecta.', 'Comunicación y apertura de oportunidades a través de la palabra: buenas conversaciones, entrevistas, negociaciones. Tu forma de expresarte puede abrirte puertas.', 'Facilidad para generar ingresos: buenas ideas, creatividad y energía para buscar nuevas formas de hacer dinero. Movimiento económico y oportunidades.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('bastos', 6, 'Representa los celos, las inseguridades y las dudas internas. Aparece cuando hay miedo a avanzar o resistencia a dar el siguiente paso. También habla de personas que observan lo que haces desde la inseguridad o la envidia. Invita a recuperar la confianza en ti mismo.', 'Celos, inseguridades y miedo a perder a alguien. Puede indicar que tú tienes dudas hacia tu persona de interés, o que esa persona siente celos o inquietud por la relación. Habla de necesidad de controlar, posesividad o preocupación por el otro. Invita a revisar la confianza dentro del vínculo.', 'Inseguridades, dudas o miedo a perder la estabilidad laboral. También celos, envidia o energías negativas alrededor de tu crecimiento. Confía más en tus capacidades y en tu valor.', 'Inseguridades económicas: miedo a invertir, a arriesgarte o a iniciar un proyecto. Trabaja la seguridad en ti mismo y no dejes que el miedo te frene.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('bastos', 7, 'Problemas, conflictos o situaciones que requieren atención en cualquier área. No necesariamente algo grave: momentos donde hay que poner esfuerzo, defender tu posición y buscar soluciones. Retos que se pueden trabajar y superar.', 'Problemas o conflictos con tu persona de interés: discusiones, diferencias o tensión entre ambos. No habla de algo definitivo, sino de una etapa donde hay cosas que hablar y trabajar para recuperar la armonía.', 'Conflictos o roces en el ambiente laboral: tensiones con compañeros o jefes, ambiente pesado o desacuerdos. Se resuelven con comunicación, paciencia y equilibrio.', 'Dificultades económicas que necesitan atención: decisiones o gastos que no dan los resultados esperados. Tiene solución si se revisa con calma cómo administras tu dinero.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('bastos', 10, 'Representa a la familia y a las personas más cercanas. Cuando preguntas por alguien, señala a un familiar: tu mamá, una hermana, una tía, una prima o alguien con vínculo familiar muy cercano. Habla de los lazos de sangre y su importancia en la situación.', 'El apoyo de tu familia, especialmente de las figuras femeninas cercanas. Si atraviesas una decepción o ruptura, no tienes que cargar con todo: acércate a quienes te quieren, escucha sus consejos y permite que su apoyo te devuelva la tranquilidad.', 'Un ambiente laboral armonioso, donde las personas se sienten como familia. Una mujer de tu familia puede brindarte una oportunidad, un consejo o el apoyo que necesitas.', 'Apoyo económico de tu familia, especialmente de una figura femenina: un préstamo, ayuda para un gasto, apoyo para una inversión o un consejo financiero. En momentos de necesidad, tu familia es un respaldo importante.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('bastos', 11, 'Los pensamientos de una persona cercana, hombre o mujer de tu familia: lo que está pensando, analizando o reflexionando. Presta atención a sus ideas, opiniones o preocupaciones — ahí puede estar la respuesta que buscas.', 'El apoyo de tu familia, especialmente de las figuras femeninas cercanas. Ante una decepción amorosa, sus consejos y cariño pueden darte la fortaleza y la respuesta que necesitas.', 'Los pensamientos de la persona con mayor influencia en tu entorno laboral: lo que piensa un jefe, supervisor o cliente. Una decisión importante puede depender de la opinión de alguien con autoridad.', 'Pensamientos, consejos y orientación de una persona que puede influir positivamente en tu economía: una idea, recomendación o solución que mejore tus finanzas.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;
insert into public.cartas (palo, num, general, amor, trabajo, dinero, extras) values ('bastos', 12, 'Un hombre de tu familia o una figura masculina muy cercana: tu papá, un hermano, un tío, un primo o un hombre con vínculo familiar importante. Habla de su presencia, su influencia o de situaciones relacionadas con él.', 'El apoyo, la orientación o los consejos de una figura masculina de tu familia. En una situación sentimental complicada, un hombre cercano puede brindarte fortaleza, respaldo o una perspectiva para decidir mejor.', 'Un ambiente laboral de confianza, o apoyo, oportunidad o recomendación por parte de un familiar hombre. Una figura masculina cercana puede impulsar tu crecimiento profesional.', 'Apoyo económico de un hombre de tu familia: un préstamo, ayuda financiera, respaldo para emprender o superar un momento difícil.', '[]'::jsonb)
  on conflict (palo, num) do update set general = excluded.general, amor = excluded.amor, trabajo = excluded.trabajo, dinero = excluded.dinero, extras = excluded.extras;

-- Códigos sagrados ----------------------------------------------------------
insert into public.codigo_categorias (key, nombre, sub, palo, color, orden) values ('amor', 'Amor', 'Atraer, sanar y fortalecer el amor', 'copas', '#e79ab4', 0)
  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, palo = excluded.palo, color = excluded.color, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '82412', 'Atraer a la persona correcta y adecuada para ti, favoreciendo una relación alineada con tu bienestar', 0)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '715400', 'Favorecer el regreso del ser amado o una posible reconciliación', 1)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '802', 'Activar las feromonas', 2)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '11834', 'Aumentar la libido', 3)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '904', 'Potenciar el atractivo sexual', 4)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '111', 'El código de la sexualidad', 5)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '739', 'Solucionar problemas sexuales en la pareja', 6)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '1021', 'Tranquilizar a una persona cuando existe una discusión o conflicto sentimental', 7)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '889', 'Pedir perdón o ser perdonado', 8)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '75139', 'Despejar caminos en el amor', 9)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '11550', 'Atraer el amor de tu vida', 10)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '70', 'Invocar el ángel del amor', 11)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '571', 'Facilitar la conexión entre almas gemelas', 12)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '580', 'Para que empiece en ti y te busque; hablar desde el amor con tu pareja', 13)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '191919', 'Atraer velozmente al compañero de vida', 14)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '25700', 'Cumplir deseos en el amor', 15)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '390', 'Superar obstáculos en el amor', 16)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '725', 'Reconciliarse, regresar con tu ex, restaurar parejas rotas', 17)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '159', 'Soltar emociones intensas en la relación', 18)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '781', 'Romper bloqueos para que llegue el alma gemela', 19)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '672', 'Romper cadenas, llenar carencias y sanar el corazón', 20)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '216', 'Sanar resentimientos en una relación', 21)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '877', 'Amor propio', 22)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '31', 'Activar la fidelidad en tu relación', 23)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '1751', 'Milagro inesperado y rápido en el amor', 24)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '541', 'Aumentar el amor en pareja', 25)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '718', 'Reconciliación con tu pareja o en una relación', 26)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '62987', 'Romper el orgullo de esa persona para poder hablar con ella', 27)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '35133', 'Enviar un "te amo" a una persona', 28)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '2190', 'Éxito en el amor', 29)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '0447', 'Un nuevo comienzo en el amor', 30)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '212', 'Evitar la infidelidad', 31)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '2026', 'Apresurar la llegada de un alma gemela o afín a ti', 32)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '2526', 'Atraer el amor', 33)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '2918', 'Felicidad inmediata', 34)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '620', 'Alegría, felicidad y amor; sanar una herida de amor', 35)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '51826', 'Activar los rayos de la estrella secreta del amor para hacer tus sueños realidad', 36)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '294', 'Fortalecer el amor de pareja', 37)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '61126', 'Recibir el amor a todos los niveles, sobre todo cuando no te sientes amado', 38)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '427', 'Amor', 39)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '863', 'Ángel femenino del amor', 40)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '219', 'Aprender las leyes de la atracción y del amor', 41)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('amor', '125', 'Solucionar problemas en el amor', 42)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigo_categorias (key, nombre, sub, palo, color, orden) values ('dinero', 'Dinero y trabajo', 'Abundancia, empleo y prosperidad', 'oros', '#ecc874', 1)
  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, palo = excluded.palo, color = excluded.color, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '71588', 'Atraer clientes a un negocio', 0)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '42170', 'Dinero y abundancia sin tropiezos', 1)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '741', 'Solución inmediata en problemas económicos o laborales', 2)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '199', 'Ganar la lotería y juegos de azar', 3)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '344', 'Lograr lo imposible restaurando la energía del dinero o el trabajo', 4)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '7131', 'Encontrar el empleo ideal, que llegue con facilidad y rapidez', 5)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '25700', 'Cumplir un deseo económico o laboral', 6)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '390', 'Superar obstáculos en el dinero o en lo laboral', 7)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '520', 'Recibir dinero inesperado', 8)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '300', 'Sanar el miedo al dinero', 9)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '773', 'Liberarse de espíritus de ruina y miseria', 10)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '294', 'Sanar el miedo al éxito', 11)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '897', 'Para que el dinero fluya hacia ti, sin tropiezos', 12)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '47620', 'Conectar con el dinero', 13)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '61316', 'Disolver de raíz los implantes que impiden la conexión con la energía del dinero', 14)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '858', 'Para que te paguen deudas; recuperar dinero', 15)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '4000000', 'Sanar la relación con el dinero a nivel subconsciente', 16)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '2190', 'Éxito en el dinero y en el trabajo', 17)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '0447', 'Un nuevo comienzo laboral o económico', 18)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '744', 'Restaurar situaciones extremas o casos donde ya no sentías solución económica o laboral', 19)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '212', 'Conseguir mentores en finanzas que te enseñen el manejo correcto del dinero', 20)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '1016', 'Traer dinero de la energía del sol', 21)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '1122', 'Para que el dinero fluya hacia ti', 22)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '425', 'Dinero', 23)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '888', 'Protección para el dinero y lo laboral', 24)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '33300', 'Atraer oportunidades laborales urgentes', 25)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '11111', 'Abrir caminos laborales', 26)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '55500', 'Acelerar cambios positivos en el trabajo', 27)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '88888', 'Atraer abundancia económica', 28)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '71717', 'Conectar con el empleo ideal', 29)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '99900', 'Mejorar ingresos y estabilidad', 30)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '44444', 'Seguridad laboral y éxito', 31)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '12345', 'Desbloquear oportunidades económicas', 32)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('dinero', '22222', 'Acuerdos laborales armoniosos', 33)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigo_categorias (key, nombre, sub, palo, color, orden) values ('salud', 'Salud', 'Sanación y bienestar del cuerpo', 'bastos', '#86cf9e', 2)
  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, palo = excluded.palo, color = excluded.color, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '25300', 'Liberar de cualquier enfermedad contagiosa', 0)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '1751', 'Milagro inesperado y rápido en la salud', 1)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '81621', 'Restaurar el ADN para la salud', 2)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '50', 'Reconectar el ADN con las doce hebras que ayudan a sanar y restaurar el cuerpo', 3)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '464', 'Autosanación del cuerpo', 4)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '128', 'Sanación a todos los niveles en cuestión de salud', 5)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '25700', 'Cumplir deseos en la salud o en su mejora', 6)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '110834', 'Hacer una sanación a distancia', 7)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '1297', 'Fortalecer la mente', 8)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '34', 'Sanar dolor emocional', 9)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '45600', 'Borrar memorias negativas', 10)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '2516', 'Sanar karmas sexuales', 11)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '71566', 'Liberar del alcoholismo', 12)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '554', 'Sanar la codependencia', 13)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '1015', 'Sanar los celos', 14)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '2539', 'Sanar el asma', 15)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '525700', 'Sanar ataques de pánico', 16)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '122714', 'Sanar la drogadicción', 17)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '154', 'Dejar de fumar marihuana', 18)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '811', 'Dejar de fumar', 19)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '1188', 'Prevenir el cáncer', 20)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '1577', 'Cáncer; cáncer de vejiga', 21)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '29700', 'Cáncer de colon', 22)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '2194', 'Cáncer testicular', 23)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '52569', 'Resolver problemas en el embarazo', 24)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('salud', '1449', 'Disfrutar el embarazo', 25)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigo_categorias (key, nombre, sub, palo, color, orden) values ('limpieza', 'Limpieza y protección energética', 'Escudo, limpieza y liberación', 'espadas', '#8db0ec', 3)
  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, palo = excluded.palo, color = excluded.color, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '450', 'Protección', 0)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '828', 'Favorecer un descanso reparador y restaurar tu energía', 1)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '051', 'Eliminar enemigos ocultos', 2)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '0927', 'Eliminar vibraciones negativas y la influencia de objetos, personas o entidades negativas; limpiar espacios', 3)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '44', 'Sanar y liberar de raíz la influencia de magia negra, amarres y trabajos', 4)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '2579', 'Ser inmune a maldiciones', 5)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '8585', 'Protección contra magia negra', 6)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '1021', 'Tranquilizar a una persona cuando existe un problema o conflicto en una relación', 7)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '79', 'Favorecer el desbloqueo de la prosperidad en las relaciones', 8)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '615', 'Protección contra envidias', 9)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '525', 'Activar la protección de tu ángel de la guarda', 10)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '921', 'Invocar el escudo del Arcángel Miguel: protección y limpieza energética', 11)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '128', 'Sanación a todos los niveles', 12)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '110834', 'Hacer una sanación a distancia', 13)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '715', 'Casa sana', 14)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '1617', 'Quitar brujería', 15)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '41933', 'Energía de Jesús para limpiar', 16)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '791', 'Cancelar el karma; sanar vidas pasadas y abrir caminos en felicidad y prosperidad', 17)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '2516', 'Cancelar karma sexual', 18)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '554', 'Soltar y dejar fluir; anular resistencias y frenos que no te permiten avanzar', 19)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '457', 'Eliminar bloqueos', 20)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '215', 'Romper cadenas', 21)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '3314', 'Liberar cadenas de cualquier tipo que impiden tu crecimiento energético', 22)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '159', 'Soltar emociones intensas; alegría de vivir', 23)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '505', 'Espíritus milagrosos', 24)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '18', 'Fuerza, seguridad y paz', 25)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '72988', 'Salir de un lugar o relación donde ya no se desea estar', 26)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '530', 'Evitar daños por parte de vecinos', 27)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '314', 'Terminar o evitar amistades nocivas', 28)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '455', 'Protección contra fuerzas siniestras', 29)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '52919', 'Eliminar de tu existencia las entidades negativas almacenadas en tu ser', 30)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '339', 'Liberar la culpa de haber hecho amarres', 31)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '553', 'Sanar el árbol genealógico', 32)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '69900', 'Mal de ojo y envidias', 33)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '443355', 'Invocar al Espíritu Santo para liberar lazos kármicos que perjudican esta y otras vidas', 34)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '1221', 'Quitar entidades negativas del cuerpo, tuyas o de otra persona, que causen dolor', 35)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '425', 'Limpiar la energía del dinero', 36)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '825', 'Activar tu seguridad energética', 37)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '11129', 'Que una persona que te molesta o envidia se aleje', 38)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '593', 'Evitar daños de terceras personas hacia ti', 39)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '694', 'Neutralizar la envidia', 40)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '237', 'Eliminar frecuencias negativas del bajo astral', 41)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '860907', 'Transformar cualquier bloqueo en tu vida', 42)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '1188', 'Liberar lazos kármicos de vidas pasadas y actuales', 43)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '26700', 'Limpiar el camino energético; limpiar el aura', 44)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '12900', 'Librar de cualquier espíritu maligno que rodee a la persona o su casa', 45)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '111111', 'Liberar trabajos de magia negra del pasado y del presente', 46)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '212', 'Liberar la energía de venganza de vidas pasadas', 47)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '1579', 'Romper lazos y cadenas kármicas de vidas pasadas y actuales', 48)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '1118', 'Liberar implantes negativos', 49)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '1', 'Paz interior', 50)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '594', 'Limpieza del aura', 51)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '19913', 'Cerrar el aura ante cualquier energía negativa', 52)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '811', 'Reparar el aura de cualquier daño', 53)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '72599', 'Sanar el aura', 54)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '729', 'Retirar dardos, balas y flechas de entidades negativas; paz mental y equilibrio interior', 55)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '11111111', 'Proteger y liberar de trabajos y magia negra superpoderosa', 56)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '93', 'Santa Filomena: protección de accidentes y de la oscuridad', 57)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '570', 'Liberación de adicciones y dependencias', 58)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '333', 'Protección y asistencia espiritual', 59)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '719', 'Sanación emocional profunda', 60)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '1122', 'Romper patrones repetitivos', 61)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '4418', 'Transmutación de energía negativa', 62)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '71588', 'Fortaleza espiritual y voluntad', 63)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '897', 'Limpieza energética emocional', 64)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '1810', 'Recuperar control personal y claridad', 65)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '519834', 'Corte de lazos energéticos', 66)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '888', 'Transmutación y liberación profunda; restaurar el equilibrio energético', 67)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '1111', 'Apertura de caminos y nuevos comienzos', 68)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '2121', 'Soltar relaciones que ya no corresponden', 69)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '29', 'Liberación emocional', 70)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '33300', 'Limpieza profunda de trabajos de magia negra', 71)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '44400', 'Protección divina contra ataques energéticos negativos', 72)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '71500', 'Romper hechizos, amarres y manipulaciones', 73)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '99900', 'Transmutar energía negativa en luz', 74)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '777', 'Protección espiritual', 75)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '1212', 'Cerrar portales energéticos negativos', 76)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '43200', 'Cortar lazos energéticos dañinos', 77)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '000', 'Reset energético total', 78)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '2020', 'Limpiar karmas energéticos negativos', 79)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '77777', 'Protección divina máxima', 80)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('limpieza', '55500', 'Liberación de cargas energéticas densas', 81)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigo_categorias (key, nombre, sub, palo, color, orden) values ('varios', 'Varios', 'Familia, hogar, sanación interior…', 'copas', '#cdbdf2', 4)
  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, palo = excluded.palo, color = excluded.color, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '288', 'Eliminar y sanar traumas de la infancia y adolescencia', 0)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '999', 'Arcángeles: justicia divina', 1)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '1297', 'Fortalecer la mente', 2)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '34', 'Sanar dolor emocional', 3)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '41933', 'Atraer la energía de Jesús', 4)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '159', 'Soltar emociones intensas', 5)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '554', 'Soltar y dejar fluir; recibir lo que el universo tiene para ti', 6)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '928', 'Vencer el miedo a la muerte', 7)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '681', 'Vencer miedos irracionales', 8)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '294', 'No sabotearte', 9)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '812', 'Sanar experiencias dolorosas', 10)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '224', 'Sanar cuando se tienen hijos no deseados o si fuiste un hijo no deseado', 11)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '378', 'Sanar el abuso sexual sufrido en la infancia; tener buen futuro', 12)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '108', 'Sanación de carencias afectivas en la infancia', 13)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '843', 'Sanación de la sexualidad', 14)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '613', 'Sanar y quitar el sufrimiento de abuso sexual en la infancia', 15)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '525', 'Ángel de la Guarda', 16)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '5772', 'Cortar lazos con exparejas', 17)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '577', 'Cortar lazos telepáticos con exparejas', 18)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '344', 'Lograr lo imposible; activar en casos imposibles', 19)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '25700', 'Cumplir un deseo', 20)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '877', 'Amor propio', 21)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '45600', 'Borrar memorias negativas', 22)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '545', 'Recibir del universo energía para tus líneas de vida', 23)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '91', 'Para que se arrepienta del daño que te hicieron', 24)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '100', 'Aprender a decir no cuando así se necesite', 25)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '7278', 'Sanar almas adictas al sufrimiento', 26)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '102', 'Angustia', 27)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '363', 'Ansiedad', 28)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '154', 'Sanar la herida de abandono', 29)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '314', 'Sanar la herida de humillación', 30)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '907', 'Sanar la herida de injusticia', 31)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '260', 'Sanar la herida de rechazo', 32)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '218', 'Sanar heridas de traición', 33)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '527', 'Encorazonar con la energía celestial', 34)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '825', 'Obtener seguridad', 35)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '169', 'Aliviar el sentimiento de soledad', 36)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '451', 'Tener seguridad en uno mismo', 37)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '28500', 'Abrir posibilidades', 38)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '4', 'Arcángel Uriel: éxito, seguridad y confianza en uno mismo', 39)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '17', 'Ángel de la gratitud', 40)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '144', 'Protección y guía para los hijos', 41)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '721', 'Unión de madre, padre e hijos', 42)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '1010', 'Armonía y equilibrio familiar', 43)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '420', 'Paz en el hogar', 44)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;
insert into public.codigos (categoria, codigo, proposito, orden) values ('varios', '318', 'Resolver conflictos', 45)
  on conflict (categoria, codigo) do update set proposito = excluded.proposito, orden = excluded.orden;

-- Afirmaciones --------------------------------------------------------------
insert into public.afirmacion_categorias (key, nombre, sub, palo, color, motif, proximamente, orden) values ('amor', 'Amor', 'Sanar, soltar y atraer amor verdadero', 'copas', '#e79ab4', 'corazon', FALSE, 0)
  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, palo = excluded.palo, color = excluded.color, motif = excluded.motif, proximamente = excluded.proximamente, orden = excluded.orden;
insert into public.afirmacion_categorias (key, nombre, sub, palo, color, motif, proximamente, orden) values ('dinero', 'Dinero', 'Abrir, proteger y expandir tu abundancia', 'oros', '#ecc874', 'moneda', FALSE, 1)
  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, palo = excluded.palo, color = excluded.color, motif = excluded.motif, proximamente = excluded.proximamente, orden = excluded.orden;
insert into public.afirmacion_categorias (key, nombre, sub, palo, color, motif, proximamente, orden) values ('trabajo', 'Trabajo', 'Caminos laborales y propósito', 'espadas', '#8db0ec', 'estrella', TRUE, 2)
  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, palo = excluded.palo, color = excluded.color, motif = excluded.motif, proximamente = excluded.proximamente, orden = excluded.orden;
insert into public.afirmacion_categorias (key, nombre, sub, palo, color, motif, proximamente, orden) values ('salud', 'Salud', 'Bienestar, cuerpo y energía vital', 'bastos', '#86cf9e', 'estrella', TRUE, 3)
  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, palo = excluded.palo, color = excluded.color, motif = excluded.motif, proximamente = excluded.proximamente, orden = excluded.orden;
delete from public.afirmaciones;
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Ya no lo quieres de vuelta… y eso cambia todo.', 0);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'La mejor decisión fue dejar de esperar.', 1);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'No es el final… era la liberación.', 2);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Algo mejor viene después del desapego.', 3);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Tu paz vale más que cualquier regreso.', 4);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'La energía correcta nunca te rompe.', 5);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Ya no estás para migajas emocionales.', 6);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'La versión de ti que despertó ya no acepta lo que antes toleraba.', 7);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'El verdadero cambio empieza cuando dejas de abrir puertas que casi te destruyen.', 8);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'No vuelve porque ya no vibras en el mismo lugar.', 9);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'No es orgullo, es paz.', 10);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Hay conexiones que solo llegan a enseñarte lo que ya no debes permitir.', 11);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Tu energía está dejando de perseguir y empezando a atraer.', 12);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Lo que se aleja con caos no pertenece a tu nueva energía.', 13);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'La vida no te está quitando nada… te está alineando.', 14);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Cuando sanas, ya no vuelves a elegir desde la herida.', 15);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'A veces el universo aleja lo que duele para abrir espacio a lo que realmente mereces.', 16);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'No estás perdiendo a esa persona, estás recuperándote a ti.', 17);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Lo que te rompió no puede acompañarte hacia lo que sana.', 18);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Cerrar una puerta también es un acto de amor propio.', 19);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Cuando eliges no volver atrás, la energía empieza a cambiar.', 20);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'No me aferro a lo que no es para mí.', 21);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Confío en soltar lo que no me elige.', 22);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'El amor real no provoca ansiedad ni duda.', 23);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Elijo paz emocional sobre intensidad.', 24);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'El amor llega a mí de forma natural y armoniosa.', 25);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Estoy lista para recibir un amor sincero, sano y recíproco.', 26);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Atraigo un amor que me suma, no que me resta.', 27);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'El amor que llega a mí es claro, honesto y estable.', 28);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Estoy abierta a una conexión profunda y verdadera.', 29);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Soy energía de amor y eso se refleja en quién se acerca a mí.', 30);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Mi luz interior atrae a quien sabe valorarla.', 31);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Irradio amor y recibo amor en la misma medida.', 32);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Mi corazón es un imán para conexiones auténticas.', 33);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Rompo patrones que me alejaban del amor.', 34);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Hoy elijo relaciones diferentes a las del pasado.', 35);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Merezco un amor que no duela.', 36);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Dejo atrás el miedo a amar y ser amada.', 37);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Estoy lista para amar y ser amada.', 38);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Soy suficiente tal como soy.', 39);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Me amo, me respeto y me elijo cada día.', 40);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Merezco un amor bonito, sin dolor ni dudas.', 41);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Suelto lo que ya no me corresponde, con amor.', 42);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Libero relaciones que ya cumplieron su propósito.', 43);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Dejo espacio para que llegue algo mejor.', 44);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Estoy lista para una relación sana, presente y comprometida.', 45);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Atraigo una pareja que me elige con claridad y constancia.', 46);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Mi vida se abre a una relación amorosa, equilibrada y feliz.', 47);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Llega a mí una relación donde ambos nos merecemos y nos elegimos.', 48);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'El amor de pareja llega a mí en el momento perfecto.', 49);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Mi pareja ideal se acerca a mi vida con facilidad.', 50);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Estoy en sintonía con una relación real y recíproca.', 51);
insert into public.afirmaciones (categoria, texto, orden) values ('amor', 'Hoy activo la energía de pareja en mi vida.', 52);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'La abundancia encuentra caminos inesperados hacia mí.', 0);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Estoy lista para recibir más de lo que imaginé.', 1);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'El dinero fluye hacia mí con facilidad.', 2);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Cada día abro espacio para nuevas oportunidades.', 3);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Mi vida empieza a expandirse en abundancia.', 4);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Merezco vivir en tranquilidad y abundancia.', 5);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Recibir también es un acto de amor propio.', 6);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'No vine a esta vida solo a sobrevivir.', 7);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Estoy aprendiendo a recibir sin culpa.', 8);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Mi energía está preparada para sostener abundancia.', 9);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Rompo toda creencia de escasez, heredada o aprendida.', 10);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Declaro abiertos mis caminos económicos bajo luz y abundancia.', 11);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Toda puerta cerrada por miedo o escasez se libera ahora.', 12);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Implanto prosperidad, estabilidad y expansión para mi vida.', 13);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'La energía de la abundancia despierta dentro de mí.', 14);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Todo bloqueo hacia el dinero se disuelve y se desvanece.', 15);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Lo que construyo crece lejos de toda negatividad.', 16);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'La abundancia llega limpia, estable y constante.', 17);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Todo lo que toco empieza a prosperar.', 18);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Declaro protegidos mis caminos económicos y todo lo que nace de mis manos.', 19);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Toda energía de envidia u oscuridad se disuelve antes de tocar mi abundancia.', 20);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Estoy en protección mientras construyo la vida que soñé.', 21);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Libero el miedo que me alejaba de la abundancia.', 22);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Corto todo bloqueo mental y energético relacionado con el dinero.', 23);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'La carencia deja de dirigir mi vida.', 24);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Mi energía ya no rechaza la prosperidad.', 25);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Limpio mi relación con el dinero y la transformo en paz.', 26);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Toda energía de duda, miedo o limitación pierde fuerza en mí.', 27);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'El dinero deja de sentirse pesado y comienza a fluir seguro.', 28);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Mi economía se limpia, se ordena y se armoniza.', 29);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Suelto la energía de lucha y abro espacio para recibir.', 30);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Estoy dejando de vivir desde la escasez.', 31);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Visualizo una vida estable, abundante y en paz.', 32);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Me veo viviendo con tranquilidad económica.', 33);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Ninguna energía de envidia tiene poder sobre mi abundancia.', 34);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Mi negocio está protegido, bendecido y en expansión.', 35);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Toda energía negativa o envidia hacia mis caminos se disuelve.', 36);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'La luz protege todo lo que estoy construyendo.', 37);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Nada externo bloquea lo que está destinado para mí.', 38);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Rompo toda energía de pobreza, bloqueo o mala intención alrededor de mis ingresos.', 39);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Toda sombra de envidia hacia mi prosperidad pierde fuerza ahora.', 40);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Mi abundancia está protegida y en movimiento.', 41);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Corto energías de envidia, comparación y sabotaje.', 42);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'La energía de mi negocio se limpia y se fortalece.', 43);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'El universo responde a la energía que sostengo.', 44);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Cada pensamiento de abundancia transforma mi realidad.', 45);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Creo en una vida más grande para mí.', 46);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'El dinero ya no se siente imposible.', 47);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Mi realidad financiera está cambiando.', 48);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'La abundancia empieza dentro de mí.', 49);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Lo que antes bloqueaba mi prosperidad hoy pierde poder.', 50);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'La abundancia llega cuando dejo de perseguir y comienzo a permitir.', 51);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Mi energía crea magnetismo para recibir.', 52);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'No necesito agotarme para merecer abundancia.', 53);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'La prosperidad también puede ser suave y tranquila.', 54);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Libero bloqueos mentales, emocionales y energéticos relacionados con el dinero.', 55);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'La prosperidad fluye libremente hacia mí.', 56);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Suelto el miedo de no tener.', 57);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Toda energía que frenaba mi abundancia pierde fuerza ahora.', 58);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Limpio mi energía de carencia, deuda y preocupación.', 59);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Estoy floreciendo en todas las áreas de mi vida.', 60);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'La energía de la abundancia comienza a ordenarse a mi favor.', 61);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Libero pensamientos que cierran mis caminos económicos.', 62);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Estoy dejando de sobrevivir y empezando a prosperar.', 63);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Mi mente ya no rechaza la abundancia.', 64);
insert into public.afirmaciones (categoria, texto, orden) values ('dinero', 'Estoy creando una nueva relación con el dinero.', 65);

-- Oráculos ------------------------------------------------------------------
insert into public.oraculos (key, nombre, sub, color, palo, tipo, orden) values ('alma', 'Lo que su alma desea decirte', 'Mensajes que esa persona guarda en silencio', '#cdbdf2', 'copas', 'frase', 0)
  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, color = excluded.color, palo = excluded.palo, tipo = excluded.tipo, orden = excluded.orden;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 1, 'No he podido olvidarte.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 2, 'Pienso en ti más de lo que imaginas.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 3, 'Comprendí tu valor cuando ya no estabas.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 4, 'Me arrepiento de muchas cosas.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 5, 'Quisiera volver a hablar contigo.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 6, 'Sigo sintiendo una conexión contigo.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 7, 'Aún ocupas un lugar en mi corazón.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 8, 'El orgullo me mantiene en silencio.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 9, 'Extraño tu presencia.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 10, 'Sueño contigo con frecuencia.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 11, 'No fue fácil dejarte ir.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 12, 'Quisiera saber cómo estás.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 13, 'Todavía guardo esperanza.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 14, 'Estoy sanando mis heridas.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 15, 'Necesito tiempo para cambiar.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 16, 'Quiero pedirte perdón.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 17, 'Me cuesta expresar lo que siento.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 18, 'Hay palabras que nunca te dije.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 19, 'Me haces mucha falta.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 20, 'Tu recuerdo sigue vivo en mí.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 21, 'Nadie ha logrado reemplazarte.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 22, 'Me di cuenta de mis errores.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 23, 'Ojalá hubiera actuado diferente.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 24, 'A veces deseo empezar de nuevo.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 25, 'Estoy luchando contra mis miedos.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 26, 'La distancia me hizo reflexionar.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 27, 'Nunca dejé de preocuparme por ti.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 28, 'Me duele haberte lastimado.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 29, 'Sigo aprendiendo gracias a nuestra historia.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 30, 'Quisiera que el destino nos reúna otra vez.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 31, 'Hay algo pendiente entre nosotros.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 32, 'Mi corazón aún te recuerda.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 33, 'No todo está perdido.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 34, 'Estoy reuniendo valor para acercarme.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 35, 'Aún siento amor por ti.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 36, 'Te extraño en silencio.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 37, 'El tiempo cambió mi forma de verte.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 38, 'Cada recuerdo me acerca a ti.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 39, 'Espero que aún haya una oportunidad.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 40, 'No he encontrado lo que tenía contigo.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 41, 'Mi silencio no significa indiferencia.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 42, 'Te llevo en mis pensamientos.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 43, 'Siento que aún estamos conectados.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 44, 'Gracias por todo lo que vivimos.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 45, 'Siempre ocuparás un lugar especial en mí.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 46, 'Me gustaría sanar esta historia contigo.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 47, 'Estoy listo para dejar atrás el pasado.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 48, 'El universo sigue cruzando nuestros caminos.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 49, 'Confío en que el destino hará lo correcto.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('alma', 50, 'Aún no he dicho la última palabra.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculos (key, nombre, sub, color, palo, tipo, orden) values ('sentimental', 'Situación sentimental', 'La energía que rodea tu corazón hoy', '#e79ab4', 'copas', 'titulo', 1)
  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, color = excluded.color, palo = excluded.palo, tipo = excluded.tipo, orden = excluded.orden;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 1, 'Hay una nueva oportunidad para aquello que parecía terminado.', 'Reencuentro', 'Regreso, destino, oportunidad, conexión')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 2, 'El tiempo es necesario para que las emociones encuentren claridad.', 'Distancia', 'Espacio, reflexión, pausa, espera')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 3, 'Lo que permanece en silencio pronto buscará ser expresado.', 'Comunicación', 'Conversación, mensaje, sinceridad, verdad')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 4, 'Antes de amar plenamente, el corazón necesita sanar.', 'Sanación', 'Perdón, calma, liberación, crecimiento')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 5, 'Nada ocurre por casualidad; esta conexión tiene un propósito.', 'Destino', 'Sincronía, aprendizaje, camino, propósito')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 6, 'Las respuestas llegarán cuando las emociones se tranquilicen.', 'Confusión', 'Dudas, indecisión, incertidumbre, bloqueo')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 7, 'Existe una energía que sigue acercándolos.', 'Atracción', 'Deseo, química, magnetismo, pasión')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 8, 'Lo que hoy conoces pronto tomará un rumbo diferente.', 'Cambio', 'Transformación, evolución, movimiento, renovación')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 9, 'No fuerces los acontecimientos; todo tiene su momento.', 'Paciencia', 'Espera, confianza, proceso, tiempo')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 10, 'La relación puede fortalecerse si ambos están dispuestos.', 'Compromiso', 'Estabilidad, unión, responsabilidad, futuro')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 11, 'Soltar abrirá espacio para algo mejor.', 'Liberación', 'Cierre, desapego, paz, independencia')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 12, 'Lo que entregas también puede regresar a ti.', 'Reciprocidad', 'Equilibrio, correspondencia, cariño, armonía')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 13, 'No todo está perdido; aún hay posibilidades.', 'Esperanza', 'Fe, ilusión, confianza, luz')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 14, 'Alguien sigue pensando en lo vivido.', 'Nostalgia', 'Recuerdos, pasado, añoranza, emociones')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 15, 'Una verdad importante saldrá a la luz.', 'Verdad', 'Sinceridad, revelación, claridad, honestidad')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 16, 'Ha llegado el momento de elegir un camino.', 'Decisión', 'Elección, determinación, cambio, acción')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 17, 'Después de la tormenta nace una nueva etapa.', 'Renacer', 'Nuevos comienzos, oportunidad, evolución, esperanza')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 18, 'El destino prepara un momento importante.', 'Encuentro', 'Cita, acercamiento, coincidencia, conexión')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 19, 'No estás solo; hay fuerzas que cuidan este proceso.', 'Protección', 'Guía, apoyo, seguridad, confianza')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 20, 'El temor puede estar impidiendo avanzar.', 'Miedo', 'Inseguridad, heridas, defensa, resistencia')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 21, 'Perdonar cambia el rumbo del corazón.', 'Perdón', 'Reconciliación, comprensión, paz, liberación')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 22, 'Lo que buscas necesita más tiempo.', 'Espera', 'Paciencia, calma, maduración, confianza')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 23, 'Permítete creer nuevamente en el amor.', 'Ilusión', 'Sueños, optimismo, posibilidades, alegría')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 24, 'Cada relación deja una enseñanza valiosa.', 'Aprendizaje', 'Experiencia, crecimiento, evolución, sabiduría')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 25, 'Los caminos pueden volver a unirse.', 'Reconexión', 'Regreso, vínculo, acercamiento, oportunidad')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 26, 'No confundas el silencio con la falta de interés.', 'Silencio', 'Introspección, pausa, observación, reflexión')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 27, 'La sinceridad será la base de esta conexión.', 'Lealtad', 'Fidelidad, confianza, estabilidad, respeto')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 28, 'No todo lo que atrae conduce al bienestar.', 'Tentación', 'Deseo, impulso, atracción, elección')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 29, 'El amor florece cuando también floreces tú.', 'Abundancia', 'Plenitud, bienestar, felicidad, prosperidad')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 30, 'Tu corazón ya conoce la respuesta.', 'Intuición', 'Señales, percepción, sabiduría, guía interior')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 31, 'Existe la posibilidad de reparar lo que se rompió.', 'Reconciliación', 'Perdón, regreso, oportunidad, unión')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 32, 'Amar también significa poner límites sanos.', 'Límites', 'Respeto, autoestima, equilibrio, protección')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 33, 'Reconoce lo mucho que vales.', 'Valor', 'Autoestima, confianza, fortaleza, dignidad')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 34, 'Algo que no esperabas puede transformar la situación.', 'Sorpresa', 'Noticias, cambio, inesperado, alegría')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 35, 'Las dudas comenzarán a disiparse.', 'Claridad', 'Certeza, comprensión, verdad, enfoque')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 36, 'La atracción sigue viva.', 'Pasión', 'Intensidad, deseo, química, emoción')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 37, 'Escucha lo que realmente siente tu corazón.', 'Elección del corazón', 'Sentimientos, decisión, autenticidad, amor')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 38, 'Para recibir algo nuevo, primero debes cerrar una etapa.', 'Ciclo cerrado', 'Final, aceptación, renovación, paz')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 39, 'Existe un lazo que trasciende lo evidente.', 'Conexión espiritual', 'Alma, destino, aprendizaje, vínculo')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 40, 'El universo abre un nuevo camino para ti.', 'Esperanza renovada', 'Optimismo, oportunidad, fe, renacer')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 41, 'Permítete recibir el amor que mereces.', 'Corazón abierto', 'Confianza, entrega, amor, vulnerabilidad')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 42, 'Cuando ambas energías se equilibran, el amor fluye.', 'Equilibrio', 'Armonía, reciprocidad, estabilidad, paz')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 43, 'Lo mejor puede llegar desde donde menos lo imaginas.', 'Nuevos horizontes', 'Cambio, oportunidades, expansión, futuro')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 44, 'Tus pensamientos y acciones están dando forma a tu realidad.', 'Manifestación', 'Intención, creación, energía, propósito')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('sentimental', 45, 'El amor que permanece es el que nace desde la verdad.', 'Amor verdadero', 'Autenticidad, compromiso, respeto, plenitud')
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculos (key, nombre, sub, color, palo, tipo, orden) values ('contacto', 'Energías del contacto cero', 'Lo que se mueve mientras no hay contacto', '#8db0ec', 'espadas', 'frase', 2)
  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, color = excluded.color, palo = excluded.palo, tipo = excluded.tipo, orden = excluded.orden;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 1, 'El contacto cero está por romperse.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 2, 'Se acerca una comunicación.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 3, 'Hay sentimientos que siguen vivos.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 4, 'La distancia es solo temporal.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 5, 'La energía comienza a cambiar.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 6, 'La otra persona piensa en ti.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 7, 'El universo está moviendo las piezas.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 8, 'Se aproxima un reencuentro.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 9, 'Hay asuntos pendientes.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 10, 'La conexión sigue activa.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 11, 'El silencio terminará pronto.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 12, 'Una conversación traerá claridad.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 13, 'Se abre una nueva oportunidad.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 14, 'La reconciliación es posible.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 15, 'Los bloqueos comienzan a desaparecer.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 16, 'La verdad saldrá a la luz.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 17, 'Ambos están aprendiendo una lección.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 18, 'El tiempo juega a tu favor.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 19, 'La paciencia dará frutos.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 20, 'No todo está perdido.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 21, 'Una señal confirmará tus dudas.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 22, 'La energía del amor sigue presente.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 23, 'Es momento de confiar.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 24, 'Algo inesperado cambiará la situación.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 25, 'La conexión necesita sanar.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 26, 'Se están cerrando viejas heridas.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 27, 'El destino aún no escribe el final.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 28, 'Habrá un cambio importante.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 29, 'La otra persona está reflexionando.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 30, 'El orgullo está perdiendo fuerza.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 31, 'El miedo retrasa el acercamiento.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 32, 'La energía favorece el diálogo.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 33, 'La respuesta llegará cuando menos lo esperes.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 34, 'Es momento de soltar el control.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 35, 'Todo ocurre en el momento perfecto.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 36, 'El universo te está protegiendo.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 37, 'Esta historia aún tiene algo que enseñar.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 38, 'Tu paz es la prioridad.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 39, 'La separación tenía un propósito.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 40, 'Lo que es para ti encontrará el camino.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 41, 'Se aproxima un nuevo comienzo.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 42, 'Hay una decisión importante por tomar.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 43, 'Una nueva etapa está por iniciar.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 44, 'La energía favorece el perdón.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 45, 'El amor propio transformará esta conexión.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 46, 'Si esta persona no regresa, llegará alguien mejor para ti.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 47, 'El cierre de este ciclo abrirá una puerta más grande.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 48, 'Tu corazón volverá a sonreír.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 49, 'Confía en el camino que el universo está trazando.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('contacto', 50, 'Lo mejor para tu alma está cada vez más cerca.', NULL, NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculos (key, nombre, sub, color, palo, tipo, orden) values ('tiempo', 'El Tiempo Sagrado', 'Cuándo llegará lo que esperas', '#ecc874', 'oros', 'titulo', 3)
  on conflict (key) do update set nombre = excluded.nombre, sub = excluded.sub, color = excluded.color, palo = excluded.palo, tipo = excluded.tipo, orden = excluded.orden;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 1, 'La energía ya comenzó a moverse, aunque todavía no puedas verlo. Lo que esperas está acercándose paso a paso. Mantén la confianza y no permitas que la impaciencia te haga abandonar el camino justo antes de recibir lo que tanto has esperado.', 'Está más cerca de lo que imaginas', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 2, 'Los próximos días traerán noticias, movimientos o señales importantes. Mantente atento, porque una pequeña acción o una conversación pueden marcar el inicio del cambio que estabas esperando.', 'En pocos días', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 3, 'No existe el retraso cuando el universo está preparando el mejor resultado para ti. Todo llegará exactamente cuando pueda sostenerse en tu vida. Confía en el proceso; cada día te acerca más a tu propósito.', 'El tiempo divino', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 4, 'Mientras intentes controlar cada detalle, la energía encontrará resistencia. Permite que el universo haga su parte. Soltar no significa renunciar; significa confiar en que lo correcto encontrará el camino hacia ti.', 'Cuando sueltes el control', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 5, 'Has recorrido una etapa de paciencia, aprendizaje y crecimiento. Esa espera está terminando y muy pronto comenzarás a ver resultados concretos. Mantén tu corazón abierto para recibirlos.', 'La espera está llegando a su fin', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 6, 'Aunque hoy no puedas verlo, situaciones, personas y oportunidades ya se están acomodando a tu favor. Lo que parecía detenido está cobrando fuerza detrás del escenario.', 'El universo ya está moviendo las piezas', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 7, 'Esta carta te invita a recuperar tu poder. No detengas tu vida esperando que alguien cambie o regrese. Cuando eliges avanzar, el universo abre caminos mucho más grandes de los que imaginabas.', 'No vale la pena seguir esperando', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 8, 'Lo que está destinado para ti no puede perderse. Si algo aún no ocurre, es porque todavía se está preparando el momento perfecto. Confía: lo que es para tu mayor bien siempre encuentra la forma de llegar.', 'El destino nunca llega tarde', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 9, 'La energía se está acelerando y los acontecimientos comenzarán a tomar forma muy pronto. Antes de que finalice este ciclo, recibirás una señal, una respuesta o un movimiento que te ayudará a comprender que todo está avanzando.', 'Antes de que termine este mes', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 10, 'Lo que hoy parece inmóvil empezará a transformarse. El próximo mes abrirá puertas, traerá noticias o pondrá frente a ti nuevas oportunidades. Mantente dispuesto a recibir los cambios.', 'El próximo mes traerá movimiento', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 11, 'El universo necesita un poco más de tiempo para acomodar las circunstancias. No interpretes esta espera como un rechazo; es parte de la preparación para que lo que llegue sea estable y duradero.', 'Dentro de tres meses', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 12, 'Se está desarrollando un proceso profundo. Durante este tiempo habrá aprendizajes, cambios internos y situaciones que te prepararán para recibir aquello que hoy estás preguntando.', 'Dentro de seis meses', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 13, 'Quizá todavía no veas resultados, pero la energía ya comenzó a moverse. Cada día te acerca más a aquello que tanto has esperado. La paciencia pronto dará paso a la manifestación.', 'El momento perfecto ya se está acercando', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 14, 'Has avanzado más de lo que imaginas. Antes de que todo se manifieste, será necesario dar un pequeño paso, tomar una decisión o cerrar un asunto pendiente. Después de eso, el camino se abrirá.', 'Solo falta un último paso', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 15, 'El universo no puede llenar una mano que aún se aferra al pasado. Libera lo que ya cumplió su propósito y deja espacio para recibir lo nuevo. El cierre de hoy será el comienzo de mañana.', 'Primero debes cerrar un ciclo', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 16, 'Cuando dejes de mirar el reloj y de buscar señales a cada instante, la vida te sorprenderá. Muchas de las mejores manifestaciones llegan cuando recuperamos la calma y permitimos que todo fluya.', 'La respuesta llegará cuando menos lo esperes', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 17, 'No tendrás que adivinar cuándo actuar. El universo pondrá frente a ti una sincronía, una conversación, un sueño o una coincidencia que disipará tus dudas. Confía en tu intuición cuando esa señal aparezca.', 'Una señal confirmará el momento', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 18, 'Aunque algunas piezas todavía parezcan fuera de lugar, todo está encontrando su sitio. Lo que hoy parece una demora es, en realidad, una preparación para que recibas exactamente lo que necesitas.', 'Todo se está alineando a tu favor', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 19, 'Has sembrado más de lo que imaginas. Cada esfuerzo, cada aprendizaje y cada paso que has dado están creando el momento perfecto para recoger los frutos. La cosecha llega cuando está madura, no cuando la impaciencia la reclama. Muy pronto verás cómo aquello que sembraste empieza a manifestarse.', 'El tiempo de la cosecha', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 20, 'No todo depende de tu esfuerzo. Existen sincronías, encuentros y circunstancias que deben coincidir para que aquello que deseas pueda manifestarse. El universo está moviendo piezas que aún no alcanzas a ver. Confía en que cada acontecimiento llegará exactamente cuando deba llegar.', 'El reloj del universo', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 21, 'Esperar no significa detener tu vida. Mientras aquello que anhelas llega, el universo te invita a seguir creciendo, disfrutando y construyendo nuevos caminos. Cuando el momento llegue, descubrirás que la espera también fue parte del regalo.', 'La espera consciente', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 22, 'Estás mucho más cerca de lo que imaginas. A veces el mayor cambio sucede justo antes de que todo se manifieste. No abandones el camino ahora; un pequeño paso más puede marcar la diferencia entre rendirte y alcanzar aquello que tanto has esperado.', 'Un paso más', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 23, 'Hay momentos en los que el universo responde cuando dejas de controlar el resultado. Soltar no es renunciar; es confiar en que lo que es para ti encontrará la forma de llegar. Al liberar la ansiedad, permites que la energía fluya con mayor facilidad.', 'El tiempo de soltar', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 24, 'Así como la naturaleza tiene primavera, verano, otoño e invierno, tu vida también atraviesa ciclos. No intentes adelantar una etapa que todavía necesita madurar. Honra el momento en el que estás, porque cada estación tiene una enseñanza y un propósito.', 'Todo tiene su estación', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 25, 'No será antes ni después. Lo que está destinado para ti llegará cuando las condiciones sean las adecuadas para que puedas recibirlo plenamente. Lo que hoy parece tardanza, mañana tendrá todo el sentido. El tiempo correcto siempre trae las mejores versiones de los sueños.', 'El momento indicado', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 26, 'Nada ocurre por casualidad. Las personas, las oportunidades y los cambios llegan cuando su presencia puede transformar tu camino. Aunque hoy no lo percibas, el universo está sincronizando cada detalle para que todo suceda de la mejor manera.', 'La sincronía perfecta', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 27, 'Antes de recibir aquello que deseas, tú también estás cambiando. El universo está fortaleciendo tu corazón, ampliando tu visión y preparándote para sostener lo que viene. La transformación es parte del regalo.', 'El tiempo de la transformación', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 28, 'Puede parecer que todo permanece inmóvil, pero la puerta correcta está a punto de abrirse. No fuerces lo que no fluye. Lo que realmente es para ti llegará con naturalidad y marcará un nuevo comienzo.', 'La puerta se abrirá', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 29, 'La paciencia no retrasa tus sueños; los fortalece. Todo aquello que vale la pena necesita tiempo para crecer. Confía en el proceso, porque el universo nunca olvida aquello que has pedido con el corazón.', 'El regalo de la paciencia', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 30, 'Un ciclo importante está llegando a su fin. Lo que parecía eterno pronto dará paso a una nueva etapa llena de posibilidades. Despide el pasado con gratitud y recibe con confianza lo que comienza.', 'Los ciclos se cumplen', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 31, 'Aquello que has estado esperando está más cerca de lo que imaginas. Muy pronto recibirás una señal, una conversación, una oportunidad o una respuesta que despejará tus dudas. Mantente atento y con el corazón abierto.', 'La respuesta se acerca', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 32, 'Aunque no puedas ver cómo se están acomodando las cosas, el universo continúa trabajando a tu favor. Hay procesos que ocurren en silencio antes de manifestarse. La fe también forma parte del camino.', 'Confía en el camino invisible', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 33, 'Durante mucho tiempo has dado, aprendido y esperado. Ahora comienza una etapa en la que el universo también quiere entregarte bendiciones. Abre tu corazón para recibir con gratitud lo que está por llegar.', 'El tiempo de recibir', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 34, 'Un "todavía no" no significa un "nunca". Hay aspectos que necesitan acomodarse antes de que todo suceda. Confía en que este tiempo de espera tiene un propósito y evitará que recibas algo antes de estar preparado.', 'El universo dice: aún no', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 35, 'Hay momentos en los que la vida cambia de manera inesperada. Lo que parecía imposible encuentra un camino, y aquello que habías perdido comienza a renacer. Mantén viva la esperanza, porque el universo también obra a través de los milagros.', 'El tiempo de los milagros', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 36, 'Si todo parece tranquilo o incluso detenido, no significa que nada esté ocurriendo. A veces, el universo guarda silencio justo antes de un gran movimiento. Confía, porque el cambio ya viene en camino.', 'La calma antes del cambio', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 37, 'No tienes que perseguir aquello que verdaderamente está destinado para ti. Mientras avanzas y creces, eso que tanto anhelas también se acerca a tu vida. Muy pronto ambos caminos se encontrarán.', 'El destino te está encontrando', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 38, 'Los frutos más valiosos nunca aparecen de un día para otro. Permite que cada experiencia, aprendizaje y oportunidad maduren antes de exigir resultados. Lo que llega en el momento correcto suele permanecer por mucho más tiempo.', 'Todo madura a su tiempo', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 39, 'Una etapa de mayor claridad está por comenzar. Las dudas se disiparán y comprenderás por qué muchas cosas tuvieron que esperar. El amanecer siempre llega después de la noche más larga.', 'Un nuevo amanecer', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 40, 'El universo puede sorprenderte de formas que jamás imaginaste. No te limites pensando que solo existe un camino para que tus deseos se cumplan. Mantente abierto, porque la vida suele superar tus expectativas.', 'La bendición inesperada', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 41, 'Aunque todavía no puedas verla, aquello que sembraste ya comenzó a crecer. Sigue alimentando tus sueños con confianza y constancia. Lo invisible también forma parte del proceso de manifestación.', 'La semilla ya germinó', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 42, 'La fe es la fuerza que sostiene los sueños mientras todavía no se manifiestan. No permitas que la duda robe la confianza que has construido. Sigue creyendo, porque el universo responde a los corazones perseverantes.', 'El tiempo de creer', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 43, 'Llegará el día en que mirarás hacia atrás y comprenderás que cada espera, cada pausa y cada cambio tenían un propósito. Lo que hoy parece confuso, mañana será una de tus mayores enseñanzas.', 'Todo tendrá sentido', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 44, 'Después de tanta preparación, el universo anuncia que un ciclo de espera está por terminar. Es momento de actuar, aceptar oportunidades y confiar en lo que se presenta. Lo que esperabas comienza a manifestarse.', 'La hora ha llegado', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 45, 'No permitas que la ansiedad por el futuro te robe la belleza del hoy. El presente también contiene regalos, aprendizajes y momentos que un día recordarás con gratitud. Vive plenamente este instante.', 'El regalo del presente', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 46, 'El universo te muestra que ya no es momento de esperar, sino de dar el siguiente paso. Confía en tus capacidades y en todo lo que has aprendido. El movimiento abrirá nuevas puertas.', 'El tiempo de avanzar', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 47, 'Tu esfuerzo, tu paciencia y tu constancia están a punto de dar frutos. No abandones ahora. Lo que tanto has construido comienza a acercarse con fuerza y estabilidad.', 'La recompensa está cerca', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 48, 'Aunque desde tu perspectiva parezca que todo tarda demasiado, para el universo cada acontecimiento ocurre en el instante preciso. Confía en que nada importante ha pasado de largo; simplemente está llegando en el tiempo ideal.', 'El universo nunca se retrasa', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 49, 'Has llegado al final de una etapa importante. Todo lo aprendido, vivido y superado te prepara para comenzar un nuevo capítulo con mayor sabiduría. Celebra tu crecimiento y recibe lo nuevo con el corazón abierto.', 'El ciclo se completa', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;
insert into public.oraculo_cartas (oraculo, carta_id, mensaje, titulo, claves) values ('tiempo', 50, 'No existe un mejor momento que aquel que el universo ha preparado para ti. Lo que está destinado a tu vida llegará cuando tu corazón, tu camino y las circunstancias estén alineados. Confía siempre: nada de lo que es para ti puede perderse. Cada espera tiene un propósito y cada bendición encuentra su momento.', 'El tiempo perfecto', NULL)
  on conflict (oraculo, carta_id) do update set mensaje = excluded.mensaje, titulo = excluded.titulo, claves = excluded.claves;

-- Cruz de Vida --------------------------------------------------------------
insert into public.cruz_posiciones (key, nombre, descripcion, orden) values ('arriba', 'Pensamiento', 'El pensamiento predominante relacionado con la pregunta.', 0)
  on conflict (key) do update set nombre = excluded.nombre, descripcion = excluded.descripcion, orden = excluded.orden;
insert into public.cruz_posiciones (key, nombre, descripcion, orden) values ('izquierda', 'Camino', 'Hacia dónde se dirige la situación; el camino que se abre.', 1)
  on conflict (key) do update set nombre = excluded.nombre, descripcion = excluded.descripcion, orden = excluded.orden;
insert into public.cruz_posiciones (key, nombre, descripcion, orden) values ('abajo', 'Realización', 'Lo que ya se está manifestando en el presente.', 2)
  on conflict (key) do update set nombre = excluded.nombre, descripcion = excluded.descripcion, orden = excluded.orden;
insert into public.cruz_posiciones (key, nombre, descripcion, orden) values ('derecha', 'Lo que se deja atrás', 'Aquello que termina, se supera o queda en el pasado.', 3)
  on conflict (key) do update set nombre = excluded.nombre, descripcion = excluded.descripcion, orden = excluded.orden;
insert into public.cruz_categorias (key, nombre, orden) values ('amor', 'Amor', 0)
  on conflict (key) do update set nombre = excluded.nombre, orden = excluded.orden;
insert into public.cruz_categorias (key, nombre, orden) values ('dinero', 'Dinero y trabajo', 1)
  on conflict (key) do update set nombre = excluded.nombre, orden = excluded.orden;
insert into public.cruz_categorias (key, nombre, orden) values ('salud', 'Salud y energía', 2)
  on conflict (key) do update set nombre = excluded.nombre, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (1, 'amor', '¿Mi expareja todavía piensa en mí?', '{"tipo":"fija","palo":"copas","num":11,"nombre":"Caballo de Copas"}'::jsonb, '{"arriba":"Sí. Esa persona todavía piensa en ti. El pensamiento está presente y activo. La energía mental sigue enfocada en ti y existe la posibilidad de que esos pensamientos aumenten o cobren más fuerza con el paso del tiempo.","izquierda":"Sí. Sigues formando parte de su camino. La energía indica que aún te tiene presente y existe la posibilidad de que esa conexión evolucione, incluso pudiendo manifestarse en una comunicación o un acercamiento.","abajo":"Sí. Esa persona piensa en ti en este momento. Es una energía que ya está presente y ocurriendo, aunque probablemente no la exprese o tú todavía no tengas conocimiento de ello.","derecha":"La energía indica que esa persona está dejando esos pensamientos atrás. Poco a poco comienza a cerrar ese ciclo y a soltar lo vivido entre ustedes."}'::jsonb, NULL, 0)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (2, 'amor', '¿Qué energía tiene mi expareja hacia mí?', '{"tipo":"fija","palo":"bastos","num":3,"nombre":"Tres de Bastos","apodo":"Carta del Amor"}'::jsonb, '{"arriba":"Todavía existen sentimientos hacia ti. Esos sentimientos permanecen latentes y activos en su pensamiento. La energía indica que aún hay una conexión emocional que puede crecer con el tiempo o mantenerse presente.","izquierda":"Todavía existen sentimientos y la energía se dirige hacia un posible acercamiento. Existe la posibilidad de que esa persona quiera expresar lo que siente, hablar de esos sentimientos o incluso que haya energía favorable para una reconciliación.","abajo":"Los sentimientos siguen existiendo en este momento. Son reales y permanecen presentes en la energía de esa persona. Sin embargo, es posible que no los exprese o que no llegues a saber lo que realmente siente.","derecha":"La energía indica que esa persona ya está cerrando ese ciclo sentimental. Los sentimientos han evolucionado y se están transformando. Representa un proceso de aceptación, sanación y trascendencia emocional, dejando el pasado."}'::jsonb, NULL, 1)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (3, 'amor', '¿Qué energía tiene mi pareja actual hacia mí?', '{"tipo":"genero","mujer":{"palo":"copas","num":12,"nombre":"Rey de Copas"},"hombre":{"palo":"copas","num":10,"nombre":"Diez de Copas"}}'::jsonb, '{"arriba":"Tu pareja sigue teniendo una energía positiva hacia ti. En este momento sigues presente en sus pensamientos y todavía existe interés por la relación. Aunque esta posición no indica cuánto tiempo permanecerá así, sí muestra que el vínculo continúa siendo importante para esa persona.","izquierda":"La relación todavía tiene camino por recorrer. Aún hay posibilidades de resolver las diferencias y fortalecer el vínculo. Tu pareja sigue teniendo interés en continuar contigo y existe disposición para trabajar en la relación.","abajo":"Tu pareja sigue formando parte de tu vida y la energía indica que la relación continúa. Sin embargo, también muestra que hay situaciones que ambos deben trabajar para que el vínculo se mantenga estable y pueda crecer de manera sana.","derecha":"Esta posición muestra que tu pareja podría estar comenzando a tomar distancia emocional. Puede existir un proceso de alejamiento, un posible rompimiento o la necesidad de cerrar un ciclo si los problemas entre ustedes no se atienden a tiempo."}'::jsonb, NULL, 2)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (4, 'amor', '¿Cómo está mi energía en el aspecto sentimental?', '{"tipo":"multi","mujer":[{"palo":"espadas","num":12},{"palo":"oros","num":12},{"palo":"copas","num":12}],"hombre":[{"palo":"espadas","num":10},{"palo":"oros","num":10},{"palo":"copas","num":10}]}'::jsonb, NULL, '{"espadas":{"titulo":"Energía de una expareja","resp":{"arriba":"Hay una expareja que sigue pensando mucho en ti. Aunque probablemente no te lo haga saber, sigues presente en sus recuerdos y en su mente.","izquierda":"Una expareja está considerando acercarse a ti. Existe la posibilidad de que busque hablar contigo, comunicarse o incluso intentar una reconciliación.","abajo":"En este momento hay una expareja que te recuerda constantemente. Esa energía sigue activa, aunque es posible que nunca llegue a expresarte lo que siente.","derecha":"Esta carta muestra que esa expareja está cerrando el ciclo contigo. Poco a poco está soltando el vínculo y dejando esa historia en el pasado."}},"oros":{"titulo":"Energía de una relación informal","resp":{"arriba":"Hay una persona que siente atracción por ti, pero busca una relación informal. Por ahora esa energía permanece en la intención y aún no se manifiesta completamente.","izquierda":"Se acerca una persona interesada en proponerte una relación informal o sin compromiso. Existe la posibilidad de que esa propuesta llegue a manifestarse.","abajo":"En este momento estás atrayendo personas que no buscan un compromiso estable. Es importante trabajar en tu energía y en algunos patrones personales para comenzar a atraer relaciones más sanas y duraderas.","derecha":"Estás dejando atrás la energía de las relaciones informales. Poco a poco comienzas a vibrar con mayor fuerza hacia relaciones más estables y comprometidas."}},"copas":{"titulo":"Energía de una relación estable","resp":{"arriba":"Se está acercando a tu vida la energía de una relación estable. Comienzas a vibrar con una conexión seria que poco a poco puede tomar forma.","izquierda":"Vas caminando hacia una relación estable. Existe una alta probabilidad de conocer a una persona que llegue con intenciones serias e incluso con una propuesta de compromiso.","abajo":"En este momento ya vibras con la energía de una relación estable. Sin embargo, necesitas seguir trabajando en ti, abrirte más al amor, fortalecer tu seguridad y permitirte conocer nuevas personas para que esa energía se manifieste plenamente.","derecha":"En este momento hay bloqueos que están dificultando la llegada de una relación estable. Es posible que el miedo, el aislamiento o la falta de apertura estén frenando esa energía. La carta te invita a salir más, abrirte a nuevas experiencias y trabajar en ti para permitir que llegue una relación sana y estable."}}}'::jsonb, 3)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (5, 'dinero', '¿Cómo está mi energía en el aspecto económico o del dinero?', '{"tipo":"fija","palo":"oros","num":7,"nombre":"Siete de Oros"}'::jsonb, '{"arriba":"Tu energía económica comienza desde tus pensamientos. Tienes buenas ideas, proyectos o deseos de mejorar tus ingresos. Sabes que puedes crecer económicamente y tienes el potencial para hacerlo; sin embargo, todavía te hace falta convertir esas ideas en acciones. La carta te invita a confiar más en ti y a dar el siguiente paso para materializar tus proyectos.","izquierda":"Vas caminando hacia una mejora económica. Se están abriendo oportunidades que pueden ayudarte a incrementar tus ingresos, ya sea mediante un nuevo trabajo, un cambio laboral, un negocio o una nueva fuente de dinero. La energía es favorable y te invita a aprovechar las oportunidades que lleguen a tu vida.","abajo":"En este momento cuentas con cierta estabilidad económica o laboral. Has logrado construir una base sólida; sin embargo, la carta también te muestra que tienes el potencial para crecer mucho más. Es un buen momento para buscar nuevas formas de generar ingresos o fortalecer tu economía.","derecha":"En este momento existen bloqueos que están frenando tu crecimiento económico. Puede tratarse de miedo a invertir, temor a cambiar de trabajo, resistencia a salir de tu zona de confort o incluso un estado emocional que no te permite avanzar. La carta te invita a trabajar en esos bloqueos para abrir el camino a una mejora económica."}'::jsonb, NULL, 4)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (6, 'dinero', '¿Va a mejorar mi situación económica?', '{"tipo":"fija","palo":"espadas","num":3,"nombre":"Tres de Espadas","apodo":"Carta de la Solución"}'::jsonb, '{"arriba":"Sí, tu situación económica puede mejorar. En este momento están llegando a tu mente ideas, proyectos o soluciones que pueden ayudarte a salir adelante. Aunque todavía puedas sentir miedo o incertidumbre, la energía indica que vas por el camino correcto. Confía en esas ideas, porque una de ellas puede convertirse en la solución que estás buscando.","izquierda":"La solución ya está en camino. Muy pronto comenzarán a aparecer oportunidades, propuestas o situaciones que te ayudarán a resolver tus asuntos económicos. La energía muestra que el cambio ya se está acercando y que poco a poco comenzarás a ver una mejoría.","abajo":"La solución ya está presente en tu vida, aunque tal vez todavía no la hayas reconocido por completo. Vas por buen camino y estás construyendo una base que te permitirá mejorar tu situación económica de manera estable. La energía es favorable y muestra que la solución ya comenzó a manifestarse.","derecha":"En este momento la solución se encuentra bloqueada o estancada. La carta te invita a actuar, organizarte y tomar decisiones. Necesitas moverte, planear y confiar más en tus capacidades, porque si permaneces en la misma situación será más difícil que llegue el cambio que estás esperando. Cuando tomes acción, la energía comenzará a desbloquearse."}'::jsonb, NULL, 5)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (7, 'dinero', '¿Vienen oportunidades o propuestas económicas para mí?', '{"tipo":"fija","palo":"bastos","num":2,"nombre":"Dos de Bastos","apodo":"Carta de los Caminos y las Oportunidades"}'::jsonb, '{"arriba":"Sí vienen oportunidades para ti, pero primero debes confiar en lo que ya estás pensando. Si desde hace tiempo has considerado cambiar de trabajo, iniciar un negocio o buscar una nueva forma de generar ingresos, esta carta confirma que vas por el camino correcto. Solo falta dar el paso y vencer el miedo para convertir esas ideas en acciones.","izquierda":"Las oportunidades ya vienen en camino. Comenzarán a presentarse propuestas laborales, económicas o nuevos proyectos que pueden ayudarte a crecer. Analiza cada oportunidad con calma antes de tomar una decisión, para elegir la que realmente te brinde estabilidad y crecimiento.","abajo":"Las oportunidades ya están presentes en tu vida. La energía muestra que estás sembrando algo que puede convertirse en un proyecto sólido y duradero. Aunque puedas sentir que las oportunidades son pocas, en realidad ya existen; solo necesitas reconocerlas y aprovecharlas.","derecha":"En este momento hay bloqueos que están impidiendo que las oportunidades fluyan. Es posible que estés en una zona de confort, que el miedo al cambio te frene o que no estés viendo todas las opciones frente a ti. La carta te invita a mover tu energía, abrirte a nuevas posibilidades y tomar decisiones que desbloqueen el camino."}'::jsonb, NULL, 6)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (8, 'dinero', '¿Se acercan nuevos ingresos?', '{"tipo":"fija","palo":"oros","num":7,"nombre":"Siete de Oros","apodo":"Carta del Dinero"}'::jsonb, '{"arriba":"Sí, se acercan nuevos ingresos. La energía muestra que las ideas que has venido pensando para mejorar tu economía son acertadas. Ya tienes dentro de ti la inspiración o el proyecto que puede ayudarte a generar más dinero. Confía en esas ideas y llévalas a la acción sin miedo, porque ahí se encuentra la oportunidad que buscas.","izquierda":"Sí, nuevos ingresos vienen en camino. Se acercan oportunidades económicas que pueden mejorar tu situación financiera. Incluso podrías recibir dinero extra de forma inesperada o encontrar una nueva fuente de ingresos. Tu economía comienza a avanzar hacia una etapa más favorable.","abajo":"Sí, vienen nuevos ingresos. Lo que estás haciendo actualmente tiene el potencial de darte estabilidad y generar más dinero. La carta también te invita a implementar nuevas ideas, ampliar tus proyectos o buscar otras alternativas. Tienes una base sólida sobre la cual seguir creciendo.","derecha":"En este momento existen bloqueos que limitan la llegada de nuevos ingresos. Es importante activar tu energía, explorar nuevas oportunidades y abrirte a diferentes posibilidades. También es buen momento para limpiar tu energía y trabajar los bloqueos emocionales, de confianza o de actitud. Al salir de la rutina, abrirás el camino a nuevos ingresos."}'::jsonb, NULL, 7)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (9, 'dinero', '¿Es un buen momento para invertir o iniciar un proyecto?', '{"tipo":"fija","palo":"oros","num":1,"nombre":"As de Oros","apodo":"Carta del Éxito y las Nuevas Oportunidades"}'::jsonb, '{"arriba":"Sí, este puede ser un muy buen momento para invertir o iniciar un proyecto. Tienes una idea clara y con potencial de éxito, no solo económico sino también de crecimiento personal y profesional. Confía en tu intuición, pero analiza cada paso con lógica. Si el proyecto resuena contigo y has evaluado sus posibilidades, avanza con confianza.","izquierda":"Sí, vas caminando hacia el inicio de un proyecto o una inversión favorable. La vida comenzará a mostrarte oportunidades y personas que te ayudarán a encontrar el camino adecuado. Mantente abierto a las señales, pero toma siempre decisiones bien pensadas y evita actuar por impulso.","abajo":"Sí, este es un momento favorable para iniciar un proyecto o realizar una inversión. Ya tienes una base sólida y existen posibilidades reales de éxito. Continúa actuando con responsabilidad, analizando cada decisión; la carta confirma que estás en una etapa de realización y crecimiento.","derecha":"Por ahora no es el mejor momento para invertir o iniciar un proyecto. Todavía necesitas aclarar algunas ideas, reunir más información o fortalecer tu plan antes de dar ese paso. Es mejor esperar un poco y analizar todas las opciones antes de comprometer tu dinero. La paciencia y la planificación serán tus mejores aliadas."}'::jsonb, NULL, 8)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (10, 'dinero', '¿Qué debo saber sobre mi economía en este momento?', '{"tipo":"fija","palo":"oros","num":3,"nombre":"Tres de Oros","apodo":"Carta del Crecimiento Económico"}'::jsonb, '{"arriba":"Tu economía tiene un gran potencial de crecimiento. Tienes ideas creativas y la capacidad de generar mayores ingresos, pero es importante que no las dejes solo en tu mente. Confía en tu intuición, desarrolla esos proyectos y conviértelos en acciones. Ahí puede estar la oportunidad que buscas.","izquierda":"Vas por un camino de estabilidad económica y crecimiento. Se acercan oportunidades, proyectos y posibilidades que pueden mejorar tus ingresos. Mantente atento a lo que llegue y no temas asumir riesgos, siempre que los analices con responsabilidad. Hay oportunidades importantes que no debes dejar pasar.","abajo":"Actualmente cuentas con una base de estabilidad económica. Sin embargo, la carta te invita a no conformarte con lo que ya has logrado. Tienes la capacidad de generar más ingresos y seguir creciendo. Es momento de salir de tu zona de confort y confiar en tu potencial.","derecha":"Esta posición indica que debes cuidar tu economía. Puede presentarse un periodo de estancamiento, un gasto inesperado o alguna situación que afecte tus finanzas si no actúas con prudencia. Evita gastos innecesarios, ahorra para imprevistos y no adquieras deudas que comprometan tu estabilidad."}'::jsonb, NULL, 9)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (11, 'dinero', '¿Hay bloqueos que estén afectando mi prosperidad?', '{"tipo":"fija","palo":"espadas","num":2,"nombre":"Dos de Espadas","apodo":"Carta de los Bloqueos"}'::jsonb, '{"arriba":"Sí, los principales bloqueos se encuentran en tus pensamientos. Es posible que el miedo, la preocupación o las ideas negativas estén limitando tu prosperidad. La carta te invita a cambiar tu forma de pensar, confiar más en tus capacidades y enfocarte en las posibilidades: al transformar tu mentalidad también transformarás tu economía.","izquierda":"En realidad, no hay bloqueos importantes en tu camino. Al contrario, se están abriendo puertas y oportunidades para ti. Si sientes que no avanzas, es posible que aún no estés viendo todas las opciones frente a ti. Mantente atento, porque el camino comienza a despejarse.","abajo":"Tu energía muestra estabilidad. Aunque en algunos momentos surjan obstáculos, tienes la capacidad, las herramientas y los recursos para superarlos. No permitas que pequeños contratiempos te hagan pensar que todo está bloqueado. Puedes resolver cualquier situación que se presente.","derecha":"Esta posición indica que sí existen bloqueos que necesitan ser atendidos. Actúa con prudencia, cuida tu economía y evita decisiones impulsivas. Ahorrar, organizar tus finanzas y analizar cada paso te ayudará a desbloquear poco a poco tu prosperidad. Estos bloqueos no son permanentes: se superan con conciencia, planificación y acción."}'::jsonb, NULL, 10)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (12, 'dinero', '¿Vienen nuevas oportunidades de trabajo para mí?', '{"tipo":"fija","palo":"bastos","num":4,"nombre":"Cuatro de Bastos","apodo":"Carta de las Oportunidades Laborales"}'::jsonb, '{"arriba":"Sí existe la posibilidad de un cambio laboral. Desde hace tiempo has pensado en buscar algo mejor o en hacer un cambio que te permita crecer. Confía en tu intuición: si sientes que puedes encontrar una mejor oportunidad, tienes la capacidad para lograrlo. Cree en ti y no temas buscar nuevas opciones.","izquierda":"Sí, vienen nuevas oportunidades laborales para ti. Se abrirán puertas que pueden representar un crecimiento profesional y económico. Antes de decidir, analiza si ese cambio realmente te brinda mayor estabilidad y mejores condiciones. Si la oportunidad es sólida, puede ser un paso muy positivo.","abajo":"Actualmente cuentas con una base de estabilidad laboral. Es posible que lleguen nuevas oportunidades, pero la carta aconseja no tomar decisiones apresuradas. Analiza cada propuesta con calma y asegúrate de que represente una mejora real. La estabilidad que tienes también es un logro que vale la pena cuidar.","derecha":"Por ahora las oportunidades laborales pueden sentirse detenidas o estancadas. Es posible que una zona de confort te impida ver nuevas posibilidades. La carta te invita a abrirte al cambio, valorar las propuestas que lleguen y no cerrar la puerta a nuevas experiencias laborales."}'::jsonb, NULL, 11)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (13, 'salud', '¿Cómo está mi energía en cuestión de la salud?', '{"tipo":"fija","palo":"espadas","num":5,"nombre":"Cinco de Espadas","apodo":"Carta de la Salud"}'::jsonb, '{"arriba":"Tu intuición merece ser escuchada. Si desde hace tiempo has sentido la necesidad de realizarte un estudio, unos análisis o acudir a una revisión médica, esta carta te invita a hacerlo. No significa que exista un problema, sino que es importante prestar atención a lo que tu cuerpo y tu intuición te indican.","izquierda":"La energía muestra un camino estable en el aspecto de la salud. En este momento cuentas con una buena base de bienestar. Aun así, es importante seguir cuidándote y mantenerte atento a cualquier cambio o señal que tu cuerpo pueda manifestar.","abajo":"Tu energía refleja estabilidad en la salud. Si estás llevando un tratamiento o controlando alguna condición, la carta indica que puedes mantenerte estable siempre que continúes cuidándote y sigas las indicaciones de los profesionales que te atienden. La constancia será clave.","derecha":"Has superado o estás dejando atrás situaciones importantes relacionadas con tu salud. La carta te invita a no bajar la guardia: continúa cuidándote, presta atención a las señales de tu cuerpo y actúa a tiempo si notas algún cambio. La prevención será tu mejor aliada."}'::jsonb, NULL, 12)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;
insert into public.cruz_preguntas (id, categoria, texto, rep, resp, grupos, orden) values (14, 'salud', '¿Cómo se encuentra mi energía física y emocional?', '{"tipo":"fija","palo":"copas","num":3,"nombre":"Tres de Copas","apodo":"Carta del Equilibrio Emocional"}'::jsonb, '{"arriba":"Tus pensamientos están influyendo directamente en tu bienestar. Es posible que estés pasando por altibajos, preocupándote demasiado o imaginando escenarios que aún no ocurren, y eso desgasta tu energía. La carta te invita a cambiar poco a poco esos pensamientos, confiar más en ti y alimentar una actitud más positiva.","izquierda":"Tu energía física y emocional va por buen camino. Cuentas con la fortaleza necesaria para enfrentar los retos y la capacidad de recuperarte de cualquier situación difícil. Esta carta indica que posees una buena base de equilibrio para seguir adelante.","abajo":"En este momento tienes una estabilidad importante, tanto emocional como física. Sabes recuperarte después de los momentos difíciles y cuentas con los recursos internos para superar los obstáculos. Confía en tu capacidad para salir adelante: tu energía muestra una base sólida.","derecha":"Has vivido situaciones emocionales que pudieron afectarte profundamente, incluso reflejarse en tu bienestar físico. Ese proceso está comenzando a quedar atrás. Aunque el dolor aún se sienta presente, poco a poco recuperarás tu equilibrio. Este periodo no será permanente."}'::jsonb, NULL, 13)
  on conflict (id) do update set categoria = excluded.categoria, texto = excluded.texto, rep = excluded.rep, resp = excluded.resp, grupos = excluded.grupos, orden = excluded.orden;

-- Día que vibras más alto ---------------------------------------------------
insert into public.vibra_dias (dia, planeta, simbolo, color, titulo, msg, orden) values ('Lunes', 'Día de la Luna', '☽', '#cdbdf2', 'Día de la intuición', 'Fluye con la marea emocional.', 0)
  on conflict (dia) do update set planeta = excluded.planeta, simbolo = excluded.simbolo, color = excluded.color, titulo = excluded.titulo, msg = excluded.msg, orden = excluded.orden;
insert into public.vibra_dias (dia, planeta, simbolo, color, titulo, msg, orden) values ('Martes', 'Día de Marte', '♂', '#e79ab4', 'Día de la acción', 'Canaliza tu fuerza con propósito.', 1)
  on conflict (dia) do update set planeta = excluded.planeta, simbolo = excluded.simbolo, color = excluded.color, titulo = excluded.titulo, msg = excluded.msg, orden = excluded.orden;
insert into public.vibra_dias (dia, planeta, simbolo, color, titulo, msg, orden) values ('Miércoles', 'Día de Mercurio', '☿', '#8db0ec', 'Día de la conexión', 'Comunica tu verdad.', 2)
  on conflict (dia) do update set planeta = excluded.planeta, simbolo = excluded.simbolo, color = excluded.color, titulo = excluded.titulo, msg = excluded.msg, orden = excluded.orden;
insert into public.vibra_dias (dia, planeta, simbolo, color, titulo, msg, orden) values ('Jueves', 'Día de Júpiter', '♃', '#86cf9e', 'Día de la expansión', 'Crece con sabiduría y justicia.', 3)
  on conflict (dia) do update set planeta = excluded.planeta, simbolo = excluded.simbolo, color = excluded.color, titulo = excluded.titulo, msg = excluded.msg, orden = excluded.orden;
insert into public.vibra_dias (dia, planeta, simbolo, color, titulo, msg, orden) values ('Viernes', 'Día de Venus', '♀', '#f0b9cd', 'Día de la armonía', 'Atrae lo que nutre tu alma.', 4)
  on conflict (dia) do update set planeta = excluded.planeta, simbolo = excluded.simbolo, color = excluded.color, titulo = excluded.titulo, msg = excluded.msg, orden = excluded.orden;
insert into public.vibra_dias (dia, planeta, simbolo, color, titulo, msg, orden) values ('Sábado', 'Día de Saturno', '♄', '#e7cf9b', 'Día de la estructura', 'Cosecha los frutos de tu disciplina.', 5)
  on conflict (dia) do update set planeta = excluded.planeta, simbolo = excluded.simbolo, color = excluded.color, titulo = excluded.titulo, msg = excluded.msg, orden = excluded.orden;
insert into public.vibra_dias (dia, planeta, simbolo, color, titulo, msg, orden) values ('Domingo', 'Día del Sol', '☉', '#ecc874', 'Día de la vitalidad', 'Brilla con tu propia luz.', 6)
  on conflict (dia) do update set planeta = excluded.planeta, simbolo = excluded.simbolo, color = excluded.color, titulo = excluded.titulo, msg = excluded.msg, orden = excluded.orden;

-- Versión de cada bloque ----------------------------------------------------
-- Sube estos números a mano tras editar textos: la app solo vuelve a
-- descargar un bloque si su versión es mayor que la que tiene en caché.
insert into public.contenido_version (seccion, version) values ('baraja', 1) on conflict (seccion) do nothing;
insert into public.contenido_version (seccion, version) values ('codigos', 1) on conflict (seccion) do nothing;
insert into public.contenido_version (seccion, version) values ('afirmaciones', 1) on conflict (seccion) do nothing;
insert into public.contenido_version (seccion, version) values ('oraculo', 1) on conflict (seccion) do nothing;
insert into public.contenido_version (seccion, version) values ('cruz', 1) on conflict (seccion) do nothing;
insert into public.contenido_version (seccion, version) values ('vibra', 1) on conflict (seccion) do nothing;

commit;
