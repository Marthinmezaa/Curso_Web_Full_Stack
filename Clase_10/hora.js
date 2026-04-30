// app.js
const express = require("express");
const app = express();
const PORT = 3000;

// Función para obtener saludo según la hora
function obtenerSaludo() {
  const hora = new Date().getHours();

  if (hora >= 5 && hora < 8) {
    return "🌅 ¡Muy buenos días! A empezar el día con toda la actitud ☕✨";
  } else if (hora >= 8 && hora < 12) {
    return "☀️ ¡Buenos días! Ya con energía, a darle con todo 💪😊";
  } else if (hora >= 12 && hora < 15) {
    return "🍜 ¡Buenas tardes! Espero que estés almorzando rico 🥗";
  } else if (hora >= 15 && hora < 19) {
    return "📚 ¡Buenas tardes! Sigue brillando que el día no termina 🌟";
  } else if (hora >= 19 && hora < 22) {
    return "🌆 ¡Buenas noches! Hora de relajarse después del día 🛋️📺";
  } else {
    return "🌙 ¡Muy buenas noches! Es hora de descansar, mañana será un gran día 💤✨";
  }
}

// Ruta principal
app.get("/", (req, res) => {
  res.send("🌟 Bienvenido! Visita /hola para un saludo especial 🌟");
});

// Ruta /hola con saludo según el horario
app.get("/hola", (req, res) => {
  const saludo = obtenerSaludo();
  res.send(saludo);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en http://localhost:" + PORT);
  console.log("🎯 Prueba: http://localhost:" + PORT + "/hola");
  console.log("⏰ El saludo cambia según la hora del día");
});
