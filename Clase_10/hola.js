// app.js
const express = require("express");
const app = express();
const PORT = 3000;

// Ruta principal
app.get("/", (req, res) => {
  res.send("🌟 Bienvenido! Visita /hola para un saludo 🌟");
});

// Ruta /hola con mensaje simple y amigable
app.get("/hola", (req, res) => {
  res.send("🎉 ¡Hola! Que tengas un lindo día ✨");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en http://localhost:" + PORT);
  console.log("🎯 Prueba: http://localhost:" + PORT + "/hola");
});
