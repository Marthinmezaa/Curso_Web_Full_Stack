// Matriz de letras de la sopa de letras
const letters = [
  ["P", "E", "R", "R", "O", "X", "T", "Y", "Z", "L"],
  ["A", "B", "C", "D", "L", "G", "A", "T", "O", "N"],
  ["R", "E", "A", "F", "U", "N", "A", "E", "E", "M"],
  ["E", "I", "C", "A", "S", "A", "O", "W", "D", "I"],
  ["S", "V", "A", "S", "H", "K", "T", "S", "O", "T"],
  ["F", "Q", "C", "D", "C", "A", "R", "R", "O", "Z"],
  ["W", "A", "A", "E", "G", "T", "G", "B", "C", "S"],
  ["G", "H", "X", "V", "N", "A", "N", "U", "I", "S"],
  ["L", "U", "C", "K", "J", "T", "F", "H", "T", "E"],
  ["Q", "R", "Y", "L", "X", "T", "P", "A", "O", "M"],
];

// Lista de palabras que el jugador debe encontrar
const words = ["PERRO", "GATO", "CASA", "CARRO", "LUNA"];

let selectedCells = [];
let foundWords = new Set(); // Guardar palabras ya encontradas

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");

  // Crear la cuadrícula de la sopa de letras
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("div");
      cell.textContent = letters[i][j];
      cell.dataset.row = i;
      cell.dataset.col = j;
      grid.appendChild(cell);

      // Escuchar clics en las celdas
      cell.addEventListener("mousedown", handleMouseDown);
      cell.addEventListener("mouseover", handleMouseOver);
    }
  }

  // Evento para finalizar selección al soltar el ratón
  document.addEventListener("mouseup", handleMouseUp);
});

// Al hacer clic en una celda, empezar la selección
function handleMouseDown(e) {
  selectedCells = [e.target];
  e.target.classList.add("selected");
}

// Al arrastrar por la cuadrícula, continuar selección
function handleMouseOver(e) {
  if (selectedCells.length > 0) {
    selectedCells.push(e.target);
    e.target.classList.add("selected");
  }
}

// Al soltar el ratón, verificar si la palabra seleccionada es válida
function handleMouseUp() {
  const selectedWord = selectedCells.map((cell) => cell.textContent).join("");

  if (words.includes(selectedWord)) {
    foundWords.add(selectedWord);

    // Marcar las celdas como "encontradas"
    selectedCells.forEach((cell) => cell.classList.add("found"));
    document.getElementById(
      `word-${words.indexOf(selectedWord) + 1}`,
    ).style.textDecoration = "line-through";

    // Mostrar mensaje de éxito si todas las palabras fueron encontradas
    if (foundWords.size === words.length) {
      document.getElementById("message").textContent =
        "¡Felicidades, has encontrado todas las palabras!";
    }
  }

  // Reiniciar la selección
  selectedCells.forEach((cell) => cell.classList.remove("selected"));
  selectedCells = [];
}
