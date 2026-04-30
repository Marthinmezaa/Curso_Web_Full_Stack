// productos.js
const express = require("express");
const app = express();
const PORT = 3000;

// Lista de productos
const productos = [
  { id: 1, nombre: "Laptop", precio: 999 },
  { id: 2, nombre: "Teléfono", precio: 599 },
  { id: 3, nombre: "Tablet", precio: 299 },
];

// Ruta principal
app.get("/", (req, res) => {
  res.send("📦 Bienvenido a la tienda. Visita /productos para ver el catálogo");
});

// Ruta para listar todos los productos
app.get("/productos", (req, res) => {
  let mensaje = "🛒 Lista de productos:\n\n";
  productos.forEach((p) => {
    mensaje += `🔹 ${p.nombre} - $${p.precio} (ID: ${p.id})\n`;
  });
  mensaje += "\n💡 Para buscar: /productos/buscar?nombre=ejemplo";
  res.send(mensaje);
});

// Ruta para buscar productos por nombre (parcial, sin distinguir mayúsculas)
app.get("/productos/buscar", (req, res) => {
  const nombreBuscado = req.query.nombre;

  if (!nombreBuscado) {
    return res.send(
      "❌ Por favor, proporciona un nombre para buscar. Ejemplo: /productos/buscar?nombre=lap",
    );
  }

  const resultados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(nombreBuscado.toLowerCase()),
  );

  if (resultados.length === 0) {
    return res.send(
      `😕 No se encontraron productos con nombre que incluya "${nombreBuscado}"`,
    );
  }

  let mensaje = `🔍 Resultados para "${nombreBuscado}":\n\n`;
  resultados.forEach((p) => {
    mensaje += `✅ ${p.nombre} - $${p.precio}\n`;
  });
  res.send(mensaje);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en http://localhost:" + PORT);
  console.log("📋 Ver productos: http://localhost:" + PORT + "/productos");
  console.log(
    "🔎 Buscar producto: http://localhost:" +
      PORT +
      "/productos/buscar?nombre=lap",
  );
});
