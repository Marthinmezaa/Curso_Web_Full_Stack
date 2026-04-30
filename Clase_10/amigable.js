// app.js
const express = require("express");
const app = express();
const PORT = 3000;

// Ruta principal
app.get("/", (req, res) => {
  res.send("🌟 Bienvenido! Visita /hola para un saludo amigable 🌟");
});

// Ruta /hola con mensaje amigable
app.get("/hola", (req, res) => {
  const nombre = req.query.nombre || "amigo";

  const mensajes = [
    `🎉 ¡Hola ${nombre}! Que tengas un día maravilloso ✨`,
    `💖 Hola ${nombre}! Me alegra mucho verte por aquí 🌈`,
    `🌸 ¡Hola ${nombre}! La vida es mejor con tu sonrisa 😊`,
    `🚀 Hola ${nombre}! Listo para programar cosas increíbles? 💻`,
    `🌟 ¡Hola ${nombre}! Eres increíble, nunca lo olvides 🦋`,
  ];

  const mensajeAleatorio =
    mensajes[Math.floor(Math.random() * mensajes.length)];
  res.send(mensajeAleatorio);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n✨ Servidor amigable corriendo en http://localhost:${PORT}`);
  console.log(`🎯 Prueba la ruta: http://localhost:${PORT}/hola`);
  console.log(`💡 Tip: agrega ?nombre=TuNombre para personalizar\n`);
});
