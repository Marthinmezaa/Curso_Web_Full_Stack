const canvas = document.getElementById("tetris-board");
const context = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

const ROWS = 20; // Número de filas
const COLS = 10; // Número de columnas
const BLOCK_SIZE = 20; // Tamaño de cada bloque
const DROP_INTERVAL = 1000; // Intervalo de caída en milisegundos

// Definición de las piezas
const TETROMINOS = [
  [
    [1, 1, 1],
    [0, 1, 0],
  ], // T
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // S
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // Z
  [[1, 1, 1, 1]], // I
  [
    [1, 1, 1],
    [1, 0, 0],
  ], // L
  [
    [1, 1, 1],
    [0, 0, 1],
  ], // J
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentPiece;
let currentPosition;
let score = 0;
let lastDropTime = 0; // Para controlar la caída de la pieza

// Inicializa el juego
function startGame() {
  score = 0;
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  scoreDisplay.textContent = `Puntuación: ${score}`;
  generateNewPiece();
  requestAnimationFrame(update); // Comienza la animación
}

// Genera una nueva pieza
function generateNewPiece() {
  const randomIndex = Math.floor(Math.random() * TETROMINOS.length);
  currentPiece = TETROMINOS[randomIndex];
  currentPosition = {
    x: Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2),
    y: 0,
  };

  if (!isValidMove(currentPiece, currentPosition)) {
    alert("Juego terminado. Tu puntuación es: " + score);
    resetGame(); // Reinicia el juego
  }
}

// Reinicia el juego
function resetGame() {
  clearInterval(gameInterval); // Detener el intervalo
  startGame(); // Iniciar un nuevo juego
}

// Dibuja el tablero
function drawBoard() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  // Dibuja las piezas fijas
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] !== 0) {
        context.fillStyle = "blue"; // Cambia el color según sea necesario
        context.fillRect(
          col * BLOCK_SIZE,
          row * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE,
        );
        context.strokeStyle = "white";
        context.strokeRect(
          col * BLOCK_SIZE,
          row * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE,
        );
      }
    }
  }

  // Dibuja la pieza actual
  drawPiece(currentPiece, currentPosition);
}

// Dibuja la cuadrícula
function drawGrid() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      context.strokeStyle = "lightgray";
      context.strokeRect(
        col * BLOCK_SIZE,
        row * BLOCK_SIZE,
        BLOCK_SIZE,
        BLOCK_SIZE,
      );
    }
  }
}

// Dibuja la pieza actual
function drawPiece(piece, position) {
  context.fillStyle = "red"; // Cambia el color según sea necesario
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col] !== 0) {
        context.fillRect(
          (position.x + col) * BLOCK_SIZE,
          (position.y + row) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE,
        );
        context.strokeStyle = "white";
        context.strokeRect(
          (position.x + col) * BLOCK_SIZE,
          (position.y + row) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE,
        );
      }
    }
  }
}

// Actualiza el juego
function update(currentTime) {
  // Calcula el tiempo transcurrido desde la última actualización
  const deltaTime = currentTime - lastDropTime;

  // Caída de la pieza
  if (deltaTime > DROP_INTERVAL) {
    if (
      isValidMove(currentPiece, {
        x: currentPosition.x,
        y: currentPosition.y + 1,
      })
    ) {
      currentPosition.y++;
    } else {
      placePiece();
      checkCompleteLines();
      generateNewPiece();
    }
    lastDropTime = currentTime; // Actualiza el tiempo de la última caída
  }

  drawBoard();
  requestAnimationFrame(update); // Llama a la siguiente actualización
}

// Coloca la pieza en el tablero
function placePiece() {
  for (let row = 0; row < currentPiece.length; row++) {
    for (let col = 0; col < currentPiece[row].length; col++) {
      if (currentPiece[row][col] !== 0) {
        board[currentPosition.y + row][currentPosition.x + col] = 1;
      }
    }
  }
}

// Comprueba si una posición es válida
function isValidMove(piece, position) {
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col] !== 0) {
        const newX = position.x + col;
        const newY = position.y + row;
        if (
          newX < 0 ||
          newX >= COLS ||
          newY < 0 ||
          newY >= ROWS ||
          board[newY][newX] !== 0
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

// Rota la pieza actual
function rotatePiece() {
  const rotatedPiece = currentPiece[0].map((val, index) =>
    currentPiece.map((row) => row[index]).reverse(),
  );
  if (isValidMove(rotatedPiece, currentPosition)) {
    currentPiece = rotatedPiece;
  }
}

// Detección de líneas completas
function checkCompleteLines() {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row].every((cell) => cell !== 0)) {
      board.splice(row, 1);
      board.unshift(Array(COLS).fill(0)); // Agrega una nueva fila en la parte superior
      score += 10; // Incrementa la puntuación
      scoreDisplay.textContent = `Puntuación: ${score}`;
      row++; // Revisa nuevamente la fila que ha bajado
    }
  }
}

// Control del teclado
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      if (
        isValidMove(currentPiece, {
          x: currentPosition.x - 1,
          y: currentPosition.y,
        })
      ) {
        currentPosition.x--;
      }
      break;
    case "ArrowRight":
      if (
        isValidMove(currentPiece, {
          x: currentPosition.x + 1,
          y: currentPosition.y,
        })
      ) {
        currentPosition.x++;
      }
      break;
    case "ArrowDown":
    case " ":
      // Acelera la caída al mantener presionado
      if (
        isValidMove(currentPiece, {
          x: currentPosition.x,
          y: currentPosition.y + 1,
        })
      ) {
        currentPosition.y++;
      }
      break;
    case "ArrowUp":
      rotatePiece(); // Rota la pieza
      break;
  }
});

// Llama a la función de inicio
startGame();
