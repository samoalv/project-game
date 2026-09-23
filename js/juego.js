"use strict";

// ===== Referencias al DOM =====
const contPlataformas = document.getElementById("plataformas");
const contMonedas = document.getElementById("monedas");
const contEfectos = document.getElementById("efectos");
const elPuntos = document.getElementById("puntos");
const elTiempo = document.getElementById("tiempo");
const elTiempoValor = document.getElementById("tiempo-restante");
const indicadorTurno = document.getElementById("indicador-turno");
const modalPregunta = document.getElementById("modal-pregunta");
const textoPregunta = document.getElementById("texto-pregunta");
const contOpciones = document.getElementById("opciones");
const etiquetaDificultad = document.getElementById("dificultad");
const resultado = document.getElementById("resultado");
const btnContinuar = document.getElementById("btn-continuar");
const overlayInicio = document.getElementById("inicio");
const formNombres = document.getElementById("form-nombres");
const inputNombre1 = document.getElementById("nombre-j1");
const inputNombre2 = document.getElementById("nombre-j2");
const overlayTurno = document.getElementById("turno");
const turnoNombre = document.getElementById("turno-nombre");
const turnoPunto = document.getElementById("turno-punto");
const btnTurno = document.getElementById("btn-turno");
const overlayFin = document.getElementById("fin");
const lineaJ1 = document.getElementById("linea-j1");
const lineaJ2 = document.getElementById("linea-j2");
const ganadorTexto = document.getElementById("ganador");
const btnReiniciar = document.getElementById("btn-reiniciar");
const personaje = document.getElementById("personaje");

// ===== Constantes del juego =====
const ANCHO = 960;
const ALTO = 540;
const GRAVEDAD = 2100; // píxeles por segundo
const VEL_SALTO = -760;
const VEL_CAMINAR = 220;
const DURACION = 30;
const MAX_MONEDAS = 5;
const PROB_MORADA = 0.3;

// ===== Jugadores =====
const COLORES_JUGADORES = [
  { relleno: "linear-gradient(#ff8a5c, #ff5a42)", borde: "#c22f1a", hexa: "#ff5a42" },
  { relleno: "linear-gradient(#5cb8ff, #2f6ff7)", borde: "#1a3fc2", hexa: "#2f6ff7" }
];

const jugadores = [
  { nombre: "Jugador 1", color: COLORES_JUGADORES[0], puntaje: 0 },
  { nombre: "Jugador 2", color: COLORES_JUGADORES[1], puntaje: 0 }
];

// ===== Plataformas fijas (x, y, ancho, alto) =====
const PLATAFORMAS = [
  { x: 0, y: 500, w: 960, h: 40, suelo: true },
  { x: 20, y: 430, w: 140, h: 16 },
  { x: 210, y: 350, w: 140, h: 16 },
  { x: 400, y: 270, w: 140, h: 16 },
  { x: 600, y: 190, w: 150, h: 16 },
  { x: 760, y: 120, w: 130, h: 16 },
  { x: 800, y: 270, w: 140, h: 16 },
  { x: 600, y: 350, w: 140, h: 16 },
  { x: 400, y: 430, w: 140, h: 16 },
  { x: 140, y: 360, w: 150, h: 16 },
  { x: 240, y: 200, w: 130, h: 16 },
  { x: 480, y: 130, w: 150, h: 16 }
];

// ===== Estado de la partida =====
let estado = "inicio"; // inicio | turno | jugando | pausa | fin
let jugadorActual = 0;
let tiempoRestante = DURACION;
let puntaje = 0;
let monedasActivas = [];
let preguntaActual = null;
const teclas = {};

const chico = {
  x: 0,
  y: 0,
  w: 34,
  h: 44,
  vx: 0,
  vy: 0,
  yAnterior: 0,
  enSuelo: false,
  direccion: 1
};

// ===== Inicialización =====
function construirPlataformas() {
  for (const p of PLATAFORMAS) {
    const el = document.createElement("div");
    el.className = p.suelo ? "plataforma suelo" : "plataforma";
    el.style.left = p.x + "px";
    el.style.top = p.y + "px";
    el.style.width = p.w + "px";
    el.style.height = p.h + "px";
    contPlataformas.appendChild(el);
  }
}

function conducirPersonajeAt() {
  personaje.style.left = chico.x + "px";
  personaje.style.top = chico.y + "px";
  personaje.style.transform = "scaleX(" + chico.direccion + ")";
}

function reiniciarPosicion() {
  chico.x = 100;
  chico.y = PLATAFORMAS[0].y - chico.h;
  chico.vx = 0;
  chico.vy = 0;
  chico.direccion = 1;
}

function aplicarColorJugador() {
  const color = COLORES_JUGADORES[jugadorActual];
  personaje.style.background = color.relleno;
  personaje.style.borderColor = color.borde;
  indicadorTurno.textContent = "Turno: " + jugadores[jugadorActual].nombre;
  indicadorTurno.style.background = color.hexa;
}

// ===== Monedas =====
function crearMoneda() {
  if (monedasActivas.length >= MAX_MONEDAS) return;
  // 80 % de las veces aparece sobre una plataforma elevada, no en el suelo
  const elegibles = Math.random() < 0.8 ? PLATAFORMAS.slice(1) : PLATAFORMAS;
  const p = elegibles[Math.floor(Math.random() * elegibles.length)];
  const rango = Math.max(20, p.w - 40);
  const x = p.x + 20 + Math.random() * rango;
  const y = p.y - 26;
  const esMorada = Math.random() < PROB_MORADA;

  const el = document.createElement("div");
  el.className = esMorada ? "moneda morada" : "moneda amarilla";
  el.textContent = esMorada ? "?" : "$";
  el.style.left = x + "px";
  el.style.top = y + "px";
  contMonedas.appendChild(el);

  monedasActivas.push({ x: x, y: y, w: 20, h: 20, morada: esMorada, el: el });
}

function limpiarMonedas() {
  monedasActivas.forEach(function (m) {
    m.el.remove();
  });
  monedasActivas = [];
}

function recogerMoneda(moneda) {
  moneda.el.remove();
  monedasActivas = monedasActivas.filter(function (m) {
    return m !== moneda;
  });

  if (moneda.morada) {
    abrirPregunta();
  } else {
    sumarPuntos(1);
    mostrarFeedback("+1", moneda.x + 2, moneda.y - 14, "ok");
  }

  // La moneda se reinicia al cabo de un momento
  setTimeout(crearMoneda, 300 + Math.random() * 1200);
}

// ===== Puntaje y tiempo =====
function sumarPuntos(n) {
  puntaje += n;
  elPuntos.textContent = puntaje;
}

function actualizarTiempo() {
  const segundos = Math.max(0, Math.ceil(tiempoRestante));
  elTiempoValor.textContent = segundos;
  if (segundos <= 10) {
    elTiempo.classList.add("apuro");
  } else {
    elTiempo.classList.remove("apuro");
  }
}

// ===== Preguntas (moneda morada) =====
function abrirPregunta() {
  estado = "pausa";
  preguntaActual = PREGUNTAS[Math.floor(Math.random() * PREGUNTAS.length)];

  etiquetaDificultad.textContent = ETIQUETA_DIFICULTAD[preguntaActual.tipo];
  etiquetaDificultad.className = "dificultad " + preguntaActual.tipo;
  textoPregunta.textContent = preguntaActual.pregunta;

  contOpciones.innerHTML = "";
  preguntaActual.opciones.forEach(function (texto, indice) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "opcion";
    boton.textContent = texto;
    boton.addEventListener("click", function () {
      responder(indice);
    });
    contOpciones.appendChild(boton);
  });

  resultado.classList.add("oculto");
  resultado.classList.remove("ok", "mal");
  btnContinuar.classList.add("oculto");
  modalPregunta.classList.remove("oculto");
}

function responder(indice) {
  const botones = contOpciones.querySelectorAll(".opcion");
  botones.forEach(function (b) {
    b.disabled = true;
  });

  const acierto = indice === preguntaActual.correcta;
  botones[preguntaActual.correcta].classList.add("correcta");
  if (!acierto) botones[indice].classList.add("incorrecta");

  if (acierto) {
    const ganancia = PUNTOS_DIFICULTAD[preguntaActual.tipo];
    sumarPuntos(ganancia);
    resultado.textContent = "¡Correcto! +" + ganancia + " puntos";
    resultado.className = "ok";
  } else {
    resultado.textContent = "Respuesta incorrecta";
    resultado.className = "mal";
  }

  resultado.classList.remove("oculto");
  btnContinuar.classList.remove("oculto");
}

btnContinuar.addEventListener("click", function () {
  modalPregunta.classList.add("oculto");
  estado = "jugando";
});

// ===== Efectos visuales =====
function mostrarFeedback(texto, x, y, clase) {
  const el = document.createElement("div");
  el.className = "feedback " + clase;
  el.textContent = texto;
  el.style.left = x + "px";
  el.style.top = y + "px";
  contEfectos.appendChild(el);
  setTimeout(function () {
    el.remove();
  }, 950);
}

// ===== Física y colisiones =====
function solape(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

function actualizar(dt) {
  // ---- Temporizador ----
  tiempoRestante -= dt;
  actualizarTiempo();
  if (tiempoRestante <= 0) {
    terminarRonda();
    return;
  }

  // ---- Movimiento horizontal ----
  const izquierda = teclas["ArrowLeft"] || teclas["KeyA"];
  const derecha = teclas["ArrowRight"] || teclas["KeyD"];
  let objetivo = 0;
  if (izquierda) objetivo = -VEL_CAMINAR;
  if (derecha) objetivo = VEL_CAMINAR;
  chico.vx = objetivo;

  chico.x += chico.vx * dt;
  chico.x = Math.max(0, Math.min(ANCHO - chico.w, chico.x));
  if (chico.vx < 0) chico.direccion = -1;
  if (chico.vx > 0) chico.direccion = 1;

  // ---- Movimiento vertical (gravedad) ----
  chico.vy += GRAVEDAD * dt;
  chico.yAnterior = chico.y;
  chico.y += chico.vy * dt;

  const piesAnterior = chico.yAnterior + chico.h;
  const pies = chico.y + chico.h;
  const cabezaAnterior = chico.yAnterior;
  const cabeza = chico.y;
  chico.enSuelo = false;

  for (const p of PLATAFORMAS) {
    const horiz = chico.x + chico.w > p.x && chico.x < p.x + p.w;
    if (!horiz) continue;

    if (chico.vy >= 0 && piesAnterior <= p.y + 2 && pies >= p.y) {
      // Aterrizar sobre la plataforma
      chico.y = p.y - chico.h;
      chico.vy = 0;
      chico.enSuelo = true;
    } else if (chico.vy < 0 && cabezaAnterior >= p.y + p.h && cabeza <= p.y + p.h) {
      // Chocar contra la parte inferior de la plataforma
      chico.y = p.y + p.h;
      chico.vy = 0;
    }
  }

  // ---- Resolución horizontal (lados sólidos) ----
  for (const p of PLATAFORMAS) {
    const sobrePlataforma = chico.y + chico.h - p.y > 2;
    const bajoPlataforma = p.y + p.h - chico.y > 2;
    const horiz = chico.x + chico.w > p.x && chico.x < p.x + p.w;
    if (!horiz || !sobrePlataforma || !bajoPlataforma) continue;

    if (chico.vx > 0) {
      chico.x = p.x - chico.w;
    } else if (chico.vx < 0) {
      chico.x = p.x + p.w;
    } else {
      chico.x =
        Math.abs(chico.x + chico.w - p.x) < Math.abs(chico.x - (p.x + p.w))
          ? p.x - chico.w
          : p.x + p.w;
    }
  }

  // Si se cayó fuera de la escena, reaparece
  if (chico.y > ALTO) reiniciarPosicion();

  // ---- Colisión con monedas ----
  for (const moneda of monedasActivas.slice()) {
    if (solape(chico, moneda)) {
      recogerMoneda(moneda);
    }
  }
}

// ===== Turnos =====
function terminarRonda() {
  estado = "fin";
  actualizarTiempo();
  jugadores[jugadorActual].puntaje += puntaje;

  if (jugadorActual === 0) {
    jugadorActual = 1;
    mostrarTurno();
  } else {
    mostrarResultado();
  }
}

function mostrarTurno() {
  overlayInicio.classList.add("oculto");
  overlayFin.classList.add("oculto");
  modalPregunta.classList.add("oculto");

  const jugador = jugadores[jugadorActual];
  turnoNombre.textContent = jugador.nombre;
  turnoPunto.style.background = jugador.color.hexa;
  aplicarColorJugador();
  overlayTurno.classList.remove("oculto");
  estado = "turno";
}

function empezarRonda() {
  overlayTurno.classList.add("oculto");
  puntaje = 0;
  elPuntos.textContent = "0";
  tiempoRestante = DURACION;
  elTiempoValor.textContent = DURACION;
  elTiempo.classList.remove("apuro");

  limpiarMonedas();
  reiniciarPosicion();
  for (let i = 0; i < MAX_MONEDAS; i++) crearMoneda();
  estado = "jugando";
}

function mostrarResultado() {
  overlayTurno.classList.add("oculto");

  const p1 = jugadores[0];
  const p2 = jugadores[1];
  lineaJ1.textContent = p1.nombre + ": " + p1.puntaje + " puntos";
  lineaJ2.textContent = p2.nombre + ": " + p2.puntaje + " puntos";
  lineaJ1.style.color = p1.color.hexa;
  lineaJ2.style.color = p2.color.hexa;

  if (p1.puntaje === p2.puntaje) {
    ganadorTexto.textContent = "¡Empate! 🤝";
  } else {
    const ganador = p1.puntaje > p2.puntaje ? p1 : p2;
    ganadorTexto.textContent = "🏆 ¡Gana " + ganador.nombre + "!";
  }

  overlayFin.classList.remove("oculto");
  estado = "fin";
}

formNombres.addEventListener("submit", function (e) {
  e.preventDefault();
  jugadores[0].nombre = inputNombre1.value.trim() || "Jugador 1";
  jugadores[1].nombre = inputNombre2.value.trim() || "Jugador 2";
  jugadores[0].puntaje = 0;
  jugadores[1].puntaje = 0;
  jugadorActual = 0;
  mostrarTurno();
});

btnTurno.addEventListener("click", empezarRonda);

btnReiniciar.addEventListener("click", function () {
  overlayFin.classList.add("oculto");
  inputNombre1.value = jugadores[0].nombre;
  inputNombre2.value = jugadores[1].nombre;
  overlayInicio.classList.remove("oculto");
  estado = "inicio";
});

// ===== Teclado =====
document.addEventListener("keydown", function (e) {
  const objetivo = e.target;
  const enEntrada =
    objetivo && (objetivo.tagName === "INPUT" || objetivo.tagName === "TEXTAREA");
  if (enEntrada) return;

  if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.key) !== -1) {
    e.preventDefault();
  }
  teclas[e.code] = true;

  const esSalto = e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW";
  if (e.repeat) return;
  if (esSalto && estado === "jugando" && chico.enSuelo) {
    chico.vy = VEL_SALTO;
    chico.enSuelo = false;
  }
});

document.addEventListener("keyup", function (e) {
  teclas[e.code] = false;
});

// ===== Bucle del juego =====
let ultimoTiempo = 0;

function bucle(tiempo) {
  const dt = Math.min(0.033, (tiempo - ultimoTiempo) / 1000);
  ultimoTiempo = tiempo;

  if (estado === "jugando") {
    actualizar(dt);
  }
  conducirPersonajeAt();
  requestAnimationFrame(bucle);
}

// ===== Arranque =====
construirPlataformas();
reiniciarPosicion();
aplicarColorJugador();
conducirPersonajeAt();
requestAnimationFrame(function (t) {
  ultimoTiempo = t;
  requestAnimationFrame(bucle);
});