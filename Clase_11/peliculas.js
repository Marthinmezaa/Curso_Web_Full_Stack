// peliculas.js
const express = require("express");
const Database = require("better-sqlite3");
const app = express();
const PORT = 3000;

const db = new Database("cine.db");

// 1. Crear tabla peliculas
app.get("/crear-tabla", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS peliculas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      director TEXT NOT NULL,
      anio INTEGER
    )
  `;
  db.exec(sql);
  res.send('✅ Tabla "peliculas" creada (o ya existía).');
});

// 2. Insertar una película
app.get("/insertar", (req, res) => {
  const { titulo, director, anio } = req.query;

  if (!titulo || !director || !anio) {
    return res.send(
      "❌ Ejemplo: /insertar?titulo=Inception&director=Nolan&anio=2010",
    );
  }

  const insert = db.prepare(
    "INSERT INTO peliculas (titulo, director, anio) VALUES (?, ?, ?)",
  );
  const resultado = insert.run(titulo, director, anio);
  res.send(
    `✅ Película "${titulo}" agregada con ID ${resultado.lastInsertRowId}.`,
  );
});

// 3. Seleccionar películas (todas o una)
app.get("/seleccionar", (req, res) => {
  const { id } = req.query;

  if (id) {
    const peli = db.prepare("SELECT * FROM peliculas WHERE id = ?").get(id);
    if (!peli) return res.send(`❌ No hay película con ID ${id}.`);
    return res.send(
      `🎬 Encontrada:\nID: ${peli.id}\nTítulo: ${peli.titulo}\nDirector: ${peli.director}\nAño: ${peli.anio}`,
    );
  } else {
    const todas = db.prepare("SELECT * FROM peliculas").all();
    if (todas.length === 0)
      return res.send("📭 No hay películas. Insertá alguna con /insertar");
    let mensaje = "📽️ Lista de películas:\n\n";
    todas.forEach((p) => {
      mensaje += `🎞️ ID ${p.id}: "${p.titulo}" - ${p.director} (${p.anio})\n`;
    });
    res.send(mensaje);
  }
});

// 4. Actualizar una película
app.get("/actualizar", (req, res) => {
  const { id, titulo, director, anio } = req.query;

  if (!id)
    return res.send("❌ Falta id. Ejemplo: /actualizar?id=1&titulo=Nuevo");

  const existe = db.prepare("SELECT id FROM peliculas WHERE id = ?").get(id);
  if (!existe) return res.send(`❌ ID ${id} no existe.`);

  let campos = [],
    valores = [];
  if (titulo) {
    campos.push("titulo = ?");
    valores.push(titulo);
  }
  if (director) {
    campos.push("director = ?");
    valores.push(director);
  }
  if (anio) {
    campos.push("anio = ?");
    valores.push(anio);
  }

  if (campos.length === 0)
    return res.send("❌ Envía al menos un campo: titulo, director o anio");

  valores.push(id);
  const sql = `UPDATE peliculas SET ${campos.join(", ")} WHERE id = ?`;
  db.prepare(sql).run(...valores);
  res.send(`✅ Película ID ${id} actualizada.`);
});

// 5. Borrar una película
app.get("/borrar", (req, res) => {
  const { id } = req.query;
  if (!id) return res.send("❌ Especifica id a borrar. Ejemplo: /borrar?id=3");

  const existe = db.prepare("SELECT id FROM peliculas WHERE id = ?").get(id);
  if (!existe) return res.send(`❌ No existe ID ${id}.`);

  db.prepare("DELETE FROM peliculas WHERE id = ?").run(id);
  res.send(`🗑️ Película ID ${id} eliminada.`);
});

// Ruta de ayuda
app.get("/", (req, res) => {
  res.send(`
    🎬 CRUD de Películas

    ▸ Crear tabla:      GET /crear-tabla
    ▸ Insertar:         GET /insertar?titulo=Matrix&director=Wachowski&anio=1999
    ▸ Ver todas:        GET /seleccionar
    ▸ Ver una:          GET /seleccionar?id=2
    ▸ Actualizar:       GET /actualizar?id=2&anio=2000
    ▸ Borrar:           GET /borrar?id=2
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de películas en http://localhost:${PORT}`);
});
