// super.js
const express = require("express");
const app = express();
const PORT = 3000;

// Listas de partes para el nombre del superhéroe
const primeras = ["Súper", "Mega", "Hiper", "Ultra", "Increíble", "Fantástico"];
const segundas = ["Fuerza", "Velocidad", "Luz", "Oscuridad", "Rayos", "Poder"];
const terceras = [
  "Relámpago",
  "Trueno",
  "Estrella",
  "Galaxia",
  "Dragón",
  "Fénix",
];

// Función para generar nombre aleatorio
function generarNombreSuperheroe() {
  const primera = primeras[Math.floor(Math.random() * primeras.length)];
  const segunda = segundas[Math.floor(Math.random() * segundas.length)];
  const tercera = terceras[Math.floor(Math.random() * terceras.length)];
  return `${primera} ${segunda} ${tercera}`;
}

// Ruta principal
app.get("/", (req, res) => {
  res.send(
    "🦸‍♂️ Bienvenido al generador de superhéroes. Visita /superheroe para obtener tu nombre",
  );
});

// Ruta /superheroe que devuelve un nombre aleatorio
app.get("/superheroe", (req, res) => {
  const nombre = generarNombreSuperheroe();
  res.send(`🦸‍♀️ ¡Tu nombre de superhéroe es: ${nombre}! 🦸‍♂️`);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en http://localhost:" + PORT);
  console.log(
    "🦸‍♂️ Genera tu superhéroe en: http://localhost:" + PORT + "/superheroe",
  );
});
