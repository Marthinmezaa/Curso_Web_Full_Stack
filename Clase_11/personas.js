// personas.js
const express = require("express");
const Database = require("better-sqlite3");
const app = express();
const PORT = 3000;

// Conectar a la base de datos (se crea el archivo si no existe)
const db = new Database("personas.db");

// Ruta principal con instrucciones
app.get("/", (req, res) => {
  res.send(`
    📌 API de Base de Datos Simple

    ▸ Crear tabla: GET /crear-tabla
    ▸ Insertar persona: GET /insertar?nombre=Juan&edad=25
    ▸ Ver todas las personas: GET /seleccionar
  `);
});

// 1. Crear tabla (si no existe)
app.get("/crear-tabla", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS personas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      edad INTEGER
    )
  `;
  db.exec(sql);
  res.send('✅ Tabla "personas" creada exitosamente (o ya existía).');
});

// 2. Insertar una persona (usando query params)
app.get("/insertar", (req, res) => {
  const { nombre, edad } = req.query;

  if (!nombre || !edad) {
    return res.send("❌ Faltan parámetros. Usa: /insertar?nombre=Juan&edad=25");
  }

  const insert = db.prepare(
    "INSERT INTO personas (nombre, edad) VALUES (?, ?)",
  );
  const resultado = insert.run(nombre, edad);

  res.send(
    `✅ Persona "${nombre}" (edad ${edad}) insertada con ID ${resultado.lastInsertRowId}.`,
  );
});

// 3. Seleccionar todas las personas
app.get("/seleccionar", (req, res) => {
  const rows = db.prepare("SELECT * FROM personas").all();

  if (rows.length === 0) {
    return res.send(
      "📭 No hay personas registradas. Primero inserta algunos datos.",
    );
  }

  let mensaje = "👥 Lista de personas:\n\n";
  rows.forEach((p) => {
    mensaje += `🔹 ID ${p.id} → ${p.nombre}, ${p.edad} años\n`;
  });
  res.send(mensaje);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log("📦 Base de datos: mi_base.db");
});
