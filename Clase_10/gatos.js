// gatos.js
const express = require("express");
const app = express();
const PORT = 3000;

// Ruta principal que muestra la foto del gato
app.get("/", async (req, res) => {
  try {
    // Consultar la API de TheCatAPI
    const respuesta = await fetch("https://api.thecatapi.com/v1/images/search");
    const datos = await respuesta.json();
    const urlImagen = datos[0].url; // La URL de la imagen del gato

    // HTML simple para mostrar la imagen
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>🐱 Gato Aleatorio</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background: #f0f0f0;
            padding: 20px;
          }
          img {
            max-width: 90%;
            max-height: 70vh;
            border-radius: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            margin: 20px auto;
          }
          button {
            background: #ff9900;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
          }
          button:hover {
            background: #e68900;
          }
        </style>
      </head>
      <body>
        <h1>🐱 ¡Un gato aleatorio para ti! 🐱</h1>
        <img src="${urlImagen}" alt="Gato aleatorio">
        <br>
        <button onclick="location.reload()">🔄 Otro gato</button>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error("Error al obtener el gato:", error);
    res
      .status(500)
      .send(
        "❌ Hubo un error al obtener la imagen del gato. Inténtalo de nuevo más tarde.",
      );
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log("😺 ¡Ve a ver tu gato!");
});
