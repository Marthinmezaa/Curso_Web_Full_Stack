const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000;

// OpenWA
const SESSION_ID = "fbf7cec0-d6e5-40da-82c0-2812366e6b0e";
const API_KEY = "dev-admin-key";
const BASE_URL = "http://localhost:2785";
const ENDPOINT = `${BASE_URL}/api/sessions/${SESSION_ID}/messages/send-text`;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Base de datos
const db = new sqlite3.Database("./consultas.db", (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Base de datos conectada.");
    }
});

// Crear tabla
db.run(`
CREATE TABLE IF NOT EXISTS Consultas(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombrePaciente TEXT,
    telefono TEXT,
    email TEXT,
    fechaConsulta TEXT
)
`);

// ------------------
// GET /agendar
// ------------------
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/agendar.html");
});

// ------------------
// POST /agendar
// ------------------
app.post("/agendar", async (req, res) => {

    const {
        nombrePaciente,
        telefono,
        email,
        fechaConsulta
    } = req.body;

    const sql = `
    INSERT INTO Consultas(
        nombrePaciente,
        telefono,
        email,
        fechaConsulta
    )
    VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [nombrePaciente, telefono, email, fechaConsulta],
        async function (err) {

            if (err) {
                return res.send("Error al guardar.");
            }

            // Mensaje para WhatsApp
            const mensaje = `
📅 NUEVA CONSULTA MÉDICA

Paciente: ${nombrePaciente}
Teléfono: ${telefono}
Email: ${email}
Fecha: ${fechaConsulta}
`;

            try {

                await axios.post(
                    ENDPOINT,
                    {
                        chatId: telefono + "@c.us",
                        text: mensaje
                    },
                    {
                        headers: {
                            "x-api-key": API_KEY,
                            "Content-Type": "application/json"
                        }
                    }
                );

            } catch (error) {
                console.log("Error enviando WhatsApp");
            }

            res.send(`
                <h2>Consulta agendada correctamente</h2>
                <a href="/">Nueva consulta</a>
                <br><br>
                <a href="/consultas">Ver consultas</a>
            `);

        }
    );

});

// Mostrar página consultas.html
app.get("/consultas", (req, res) => {
    res.sendFile(__dirname + "/consultas.html");
});


// API que devuelve todas las consultas
app.get("/api/consultas", (req, res) => {

    db.all(
        "SELECT * FROM Consultas ORDER BY fechaConsulta",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: "Error al obtener consultas"
                });
            }

            res.json(rows);

        }
    );

});


app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});