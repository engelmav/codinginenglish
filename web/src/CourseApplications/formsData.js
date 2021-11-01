export const basicCourseForm = [
  { fieldName: "email", title: "Email", fieldType: "email" },
  {
    fieldName: "given-name",
    title: "Nombre",
    fieldType: "shortAnswer",
  },
  {
    fieldName: "family-name",
    title: "Apellido",
    fieldType: "shortAnswer",
  },
  {
    fieldName: "programmingLevel",
    title: "Nivel de programación",
    fieldType: "multipleChoice",
    choices: [
      "No sé nada de la programación",
      "Sólo sé cosas como variables y for loops",
      "Escribo programas en mis ratos libres",
      "Escribo programas profesionalmente",
    ],
  },
  {
    fieldName: "englishLevel",
    title: "Nivel de inglés",
    fieldType: "multipleChoice",
    choices: [
      "No hablo nada de inglés",
      "Hablo un poco",
      "Me considero un nivel intermedio",
      "Hablo inglés fluido o casi fluido",
    ],
  },
  {
    fieldName: "whenAttend",
    title: "¿Qué hora prefieres asistir a una clase de dos horas?",
    fieldType: "checkboxes",
    choices: [
      "En la mañana (6:00 - 11:00)",
      "Alrededor del mediodía (11:00 - 15:00)",
      "En la noche (15:00 - 22:00)",
      "Ninguno",
    ],
  },
];
