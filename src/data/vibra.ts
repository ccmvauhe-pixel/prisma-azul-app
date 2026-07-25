/**
 * Día que vibras más alto en la semana.
 * Portado de `vibra-data.js` (fuente: PDF de Gilda). Contenido literal.
 */
export type VibraDia = {
  dia: string;
  planeta: string;
  simbolo: string;
  color: string;
  titulo: string;
  msg: string;
};

export const VIBRA_DIAS: VibraDia[] = [
  {
    "dia": "Lunes",
    "planeta": "Día de la Luna",
    "simbolo": "☽",
    "color": "#cdbdf2",
    "titulo": "Día de la intuición",
    "msg": "Fluye con la marea emocional."
  },
  {
    "dia": "Martes",
    "planeta": "Día de Marte",
    "simbolo": "♂",
    "color": "#e79ab4",
    "titulo": "Día de la acción",
    "msg": "Canaliza tu fuerza con propósito."
  },
  {
    "dia": "Miércoles",
    "planeta": "Día de Mercurio",
    "simbolo": "☿",
    "color": "#8db0ec",
    "titulo": "Día de la conexión",
    "msg": "Comunica tu verdad."
  },
  {
    "dia": "Jueves",
    "planeta": "Día de Júpiter",
    "simbolo": "♃",
    "color": "#86cf9e",
    "titulo": "Día de la expansión",
    "msg": "Crece con sabiduría y justicia."
  },
  {
    "dia": "Viernes",
    "planeta": "Día de Venus",
    "simbolo": "♀",
    "color": "#f0b9cd",
    "titulo": "Día de la armonía",
    "msg": "Atrae lo que nutre tu alma."
  },
  {
    "dia": "Sábado",
    "planeta": "Día de Saturno",
    "simbolo": "♄",
    "color": "#e7cf9b",
    "titulo": "Día de la estructura",
    "msg": "Cosecha los frutos de tu disciplina."
  },
  {
    "dia": "Domingo",
    "planeta": "Día del Sol",
    "simbolo": "☉",
    "color": "#ecc874",
    "titulo": "Día de la vitalidad",
    "msg": "Brilla con tu propia luz."
  }
];
