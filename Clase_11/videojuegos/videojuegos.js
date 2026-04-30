const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database"); // Importamos la conexión SQLite (better-sqlite3)
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Ruta principal
app.get("/", (req, res) => {
  console.log("Acceso a la ruta principal /");
  res.sendFile(path.join(__dirname, "videojuegos.html"));
});

// Listar todos los videojuegos
app.get("/videogames", (req, res) => {
  console.log("Acceso a GET /videogames");
  try {
    const rows = db.prepare("SELECT * FROM videogames").all();
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener videojuegos:", err.message);
    res.status(500).json({ error: "Error al obtener videojuegos" });
  }
});

// Obtener un videojuego por id
app.get("/videogames/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Acceso a GET /videogames/${id}`);
  try {
    const row = db.prepare("SELECT * FROM videogames WHERE id = ?").get(id);
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: "Videogame not found" });
    }
  } catch (err) {
    console.error("Error al obtener videojuego:", err.message);
    res.status(500).json({ error: "Error al obtener videojuego" });
  }
});

// Insertar un nuevo videojuego
app.post("/videogames", (req, res) => {
  console.log("Acceso a POST /videogames");
  console.log("Datos recibidos del cliente:", req.body);

  const { name, description, photo, video } = req.body;

  if (!name || !description || !photo || !video) {
    console.error("Error: Datos incompletos");
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const stmt = db.prepare(
      "INSERT INTO videogames (name, description, photo, video) VALUES (?, ?, ?, ?)",
    );
    const info = stmt.run(name, description, photo, video);
    console.log(
      "Videojuego insertado correctamente con ID:",
      info.lastInsertRowid,
    );
    res.status(201).json({ id: info.lastInsertRowid, ...req.body });
  } catch (err) {
    console.error("Error al insertar videojuego:", err.message);
    res.status(500).json({ error: "Error al insertar videojuego" });
  }
});

// Actualizar un videojuego existente
app.put("/videogames/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Acceso a PUT /videogames/${id}`);
  const { name, description, photo, video } = req.body;

  try {
    const stmt = db.prepare(
      "UPDATE videogames SET name = ?, description = ?, photo = ?, video = ? WHERE id = ?",
    );
    const info = stmt.run(name, description, photo, video, id);

    if (info.changes === 0) {
      res.status(404).json({ message: "Videogame not found" });
    } else {
      res.json({ id, name, description, photo, video });
    }
  } catch (err) {
    console.error("Error al actualizar videojuego:", err.message);
    res.status(500).json({ error: "Error al actualizar videojuego" });
  }
});

// Eliminar un videojuego
app.delete("/videogames/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Acceso a DELETE /videogames/${id}`);

  try {
    const stmt = db.prepare("DELETE FROM videogames WHERE id = ?");
    const info = stmt.run(id);

    if (info.changes === 0) {
      res.status(404).json({ message: "Videogame not found" });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    console.error("Error al eliminar videojuego:", err.message);
    res.status(500).json({ error: "Error al eliminar videojuego" });
  }
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
