const express = require("express");
const Database = require("better-sqlite3");
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

const db = new Database("cine.db");

// 1. Crear tabla peliculas
app.get("/crear-tabla", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS peliculas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      fecha_estreno TEXT
    )
  `;
  db.exec(sql);
  res.json({ mensaje: '✅ Tabla "peliculas" creada (o ya existía).' });
});

// 2. Obtener todas las películas (GET)
app.get("/peliculas", (req, res) => {
  const todas = db.prepare("SELECT * FROM peliculas").all();
  res.json(todas);
});

// 3. Obtener una película por ID (GET)
app.get("/peliculas/:id", (req, res) => {
  const { id } = req.params;
  const peli = db.prepare("SELECT * FROM peliculas WHERE id = ?").get(id);
  if (!peli) {
    return res.status(404).json({ error: `No existe película con ID ${id}` });
  }
  res.json(peli);
});

// 4. Insertar una nueva película (POST)
app.post("/peliculas", (req, res) => {
  const { titulo, fecha_estreno } = req.body;

  if (!titulo || !fecha_estreno) {
    return res
      .status(400)
      .json({
        error: "Faltan campos: titulo y fecha_estreno son obligatorios",
      });
  }

  const insert = db.prepare(
    "INSERT INTO peliculas (titulo, fecha_estreno) VALUES (?, ?)",
  );
  const resultado = insert.run(titulo, fecha_estreno);
  res.status(201).json({
    mensaje: `Película "${titulo}" agregada`,
    id: resultado.lastInsertRowId,
  });
});

// 5. Actualizar una película (PUT)
app.put("/peliculas/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, fecha_estreno } = req.body;

  const existe = db.prepare("SELECT id FROM peliculas WHERE id = ?").get(id);
  if (!existe) {
    return res.status(404).json({ error: `ID ${id} no existe` });
  }

  let campos = [],
    valores = [];
  if (titulo !== undefined) {
    campos.push("titulo = ?");
    valores.push(titulo);
  }
  if (fecha_estreno !== undefined) {
    campos.push("fecha_estreno = ?");
    valores.push(fecha_estreno);
  }

  if (campos.length === 0) {
    return res
      .status(400)
      .json({ error: "Envía al menos un campo: titulo o fecha_estreno" });
  }

  valores.push(id);
  const sql = `UPDATE peliculas SET ${campos.join(", ")} WHERE id = ?`;
  db.prepare(sql).run(...valores);
  res.json({ mensaje: `Película ID ${id} actualizada` });
});

// 6. Borrar una película (DELETE)
app.delete("/peliculas/:id", (req, res) => {
  const { id } = req.params;

  const existe = db.prepare("SELECT id FROM peliculas WHERE id = ?").get(id);
  if (!existe) {
    return res.status(404).json({ error: `ID ${id} no existe` });
  }

  db.prepare("DELETE FROM peliculas WHERE id = ?").run(id);
  res.json({ mensaje: `Película ID ${id} eliminada` });
});

// Ruta de ayuda
app.get("/", (req, res) => {
  res.send(`
    <h1>🎬 API REST de Películas</h1>
    <ul>
      <li><strong>GET /peliculas</strong> - Obtener todas</li>
      <li><strong>GET /peliculas/:id</strong> - Obtener una</li>
      <li><strong>POST /peliculas</strong> - Insertar (Body JSON: { "titulo": "...", "fecha_estreno": "YYYY-MM-DD" })</li>
      <li><strong>PUT /peliculas/:id</strong> - Actualizar (Body JSON con campos a modificar)</li>
      <li><strong>DELETE /peliculas/:id</strong> - Borrar</li>
      <li><strong>GET /crear-tabla</strong> - Crear tabla (si no existe)</li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de películas en http://localhost:${PORT}`);
});
