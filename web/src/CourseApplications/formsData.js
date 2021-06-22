export const basicCourseForm = [
  {
    fieldName: "fullName",
    title: "Nombre",
    fieldType: "shortAnswer",
  },
  {
    fieldName: "email",
    title: "Email",
    fieldType: "email",
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
    fieldName: "whyProgramming",
    title: "¿Por qué quieres aprender a programar?",
    fieldType: "paragraph",
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
    fieldName: "whyProgram",
    title: "¿Por qué quieres aprender el inglés?",
    fieldType: "paragraph",
  },
  {
    fieldName: "whenAttend",
    title:
      "¿Qué hora prefieres asistir a las clases? Haz clic en todas las que sean de tu interés.",
    fieldType: "checkboxes",
    choices: [
      "6am - 8am",
      "8am - 10am",
      "10am - 12pm",
      "12pm - 2pm",
      "2pm - 4pm",
      "4pm 6pm",
      "6pm - 8pm",
      "8pm - 10pm",
      "Ninguno",
    ],
  },
  {
    fieldName: "location",
    title:
      "Ciudad y país. (Lo necesitamos para saber tu zona horaria)",
    fieldType: "shortAnswer",
  },
];
