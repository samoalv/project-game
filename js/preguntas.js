"use strict";

const PREGUNTAS = [
  // ---- Fáciles (5 puntos) ----
  { tipo: "facil", pregunta: "¿Qué es la salud mental?", opciones: ["La forma en que nos sentimos, pensamos y actuamos", "Solo cuántas veces sonreímos al día", "La cantidad de ejercicio que hacemos"], correcta: 0 },
  { tipo: "facil", pregunta: "Sentir tristeza, enojo o preocupación algunas veces…", opciones: ["Es señal de ser débil", "Es normal", "Quiere decir que tenemos una enfermedad"], correcta: 1 },
  { tipo: "facil", pregunta: "¿Qué edad comprende aproximadamente la adolescencia?", opciones: ["De los 5 a los 10 años", "De los 30 a los 40 años", "De los 10 a los 19 años"], correcta: 2 },
  { tipo: "facil", pregunta: "¿Cuál es un ejemplo de cómo cuidar nuestra salud mental?", opciones: ["Dormir y descansar bien", "Pasar todo el día en redes sociales", "Guardar siempre lo que sentimos"], correcta: 0 },
  { tipo: "facil", pregunta: "Según el texto, pedir ayuda…", opciones: ["No significa ser débil", "Siempre empeora las cosas", "Es algo de qué avergonzarse"], correcta: 0 },

  // ---- Medias (7 puntos): requieren razonamiento/aplicación ----
  { tipo: "media", pregunta: "Un compañero se burla de otro todos los días en el colegio. ¿Qué es esto y qué puede provocar?", opciones: ["Bullying o acoso escolar, que puede afectar su salud mental", "Una broma inofensiva que se olvida rápido", "Un juego entre amigos que lo hace más fuerte"], correcta: 0 },
  { tipo: "media", pregunta: "Ana duerme poco, pasa toda la tarde en redes sociales y no comparte sus problemas. ¿Qué le recomendaría el texto?", opciones: ["Seguir igual, porque a todo el mundo le pasa", "Dormir y descansar, compartir con quienes la apoyan y hablar de lo que siente", "Conectarse más tiempo para distraerse"], correcta: 1 },
  { tipo: "media", pregunta: "¿Por qué una misma situación, como pelearse con un amigo, puede afectar de manera distinta a cada adolescente?", opciones: ["Porque todos reaccionan de la misma forma", "Porque cada persona reacciona de manera diferente", "Porque los problemas solo les pasan a algunos"], correcta: 1 },
  { tipo: "media", pregunta: "Un amigo está triste desde hace mucho tiempo y ya no disfruta lo que antes le gustaba. ¿Qué podría estar pasando y qué conviene hacer?", opciones: ["Es solo pereza; lo mejor es dejarlo solo", "Podría tener depresión; conviene acompañarlo y que hable con un adulto de confianza", "No es nada; hay que cambiarle de amigos"], correcta: 1 },
  { tipo: "media", pregunta: "Lucas siente mucha preocupación antes de cada examen, le tiemblan las manos y duerme mal. ¿Qué relación tiene esto con la salud mental?", opciones: ["Es ansiedad: el miedo y el nerviosismo le afectan su vida diaria", "Es señal de que estudia demasiado", "Es algo normal que no requiere atención"], correcta: 0 },

  // ---- Difíciles (10 puntos): requieren tomar decisiones con criterio ----
  { tipo: "dificil", pregunta: "Tu amigo se siente muy solo, pero te pide que no le digas nada a nadie. ¿Cuál es la mejor forma de ayudarlo?", opciones: ["Guardar el secreto para siempre sin hacer nada", "Escucharlo sin juzgarlo y animarlo a hablar con un adulto de confianza", "Contarle su problema a todo el colegio"], correcta: 1 },
  { tipo: "dificil", pregunta: "Según la OMS, 1 de cada 7 adolescentes presenta un problema de salud mental. En un colegio de 70 estudiantes, ¿cuántos podrían estar en esa situación aproximadamente?", opciones: ["Unos 7", "Unos 10", "Unos 70"], correcta: 1 },
  { tipo: "dificil", pregunta: "María piensa que pedir ayuda es solo para personas «débiles». ¿Por qué el texto dice lo contrario?", opciones: ["Porque pedir ayuda siempre resuelve todos los problemas", "Porque pedir ayuda no significa ser débil y ayuda a sentirse acompañado", "Porque es obligatorio contarle todo a todos"], correcta: 1 },
  { tipo: "dificil", pregunta: "Un compañero nuevo no es invitado a nada y nadie lo incluye. ¿Qué actitud contribuiría a una mejor salud mental en el colegio?", opciones: ["Ignorarlo para que se acostumbre", "Escucharlo, respetar las diferencias e incluirlo", "Criticarlo para que cambie su forma de ser"], correcta: 1 },
  { tipo: "dificil", pregunta: "Lucas organiza sus tareas, hace deporte y reduce el tiempo en redes, pero sigue agobiado por un problema familiar. ¿Qué debería hacer?", opciones: ["Seguir solo, porque los buenos hábitos lo arreglan todo", "Ocultar el problema, nadie lo entendería", "Hablar con un adulto de confianza o un profesional de la salud"], correcta: 2 }
];

const PUNTOS_DIFICULTAD = { facil: 5, media: 7, dificil: 10 };
const ETIQUETA_DIFICULTAD = { facil: "Fácil", media: "Media", dificil: "Difícil" };