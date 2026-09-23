# AGENTS.md

Proyecto activo del repo (práctica multi-proyecto): juego de plataformas en HTML, CSS y JS. Trabaja únicamente dentro de esta carpeta; no toques carpetas del nivel superior (`html-css-js/`, `python/`). Este proyecto solo contiene `idea.jpg` (referencia visual del juego).

## Especificación del juego
- `index.html` en la raíz del proyecto; CSS y JS **en carpetas propias** (p. ej. `css/` y `js/`), no archivos sueltos junto al HTML.
- Fondo, plataformas, personaje y monedas se crean con HTML/CSS/JS (sin imágenes externas).
- Mecánica: el personaje salta sobre plataformas fijas; las monedas aparecen aleatoriamente sobre las plataformas.
- Monedas (2 tipos):
  - **Amarilla**: otorga 1 punto.
  - **Morada**: muestra una pregunta con 3 opciones de respuesta; el puntaje depende de la dificultad: Fácil = 5, Media = 7, Difícil = 10. El banco de preguntas está en `js/preguntas.js` (tema: Salud Mental en los Adolescentes, 5 por dificultad). Las medias y difíciles requieren razonamiento/aplicación, no solo memorización.
- **Modo de 2 jugadores**: al iniciar se piden los nombres; cada jugador juega una ronda de 30 segundos y el personaje cambia de color por jugador. Gana quien sume más puntos en total (empate si igualan).

## Verificación
- Sin build system, sin tests ni linter configurados en el repo (no hay `package.json` ni configs).
- El juego debe iniciarse con rutas relativas (abrir `index.html` directo en el navegador, sin servidor).

## Convenciones del repo
- UI y textos en español (incluidos los nombres de variables si es aplicable).