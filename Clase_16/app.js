// app.js - Servicio web de login con Node.js + Express + JWT
// Para ejecutarlo: 
// 1. npm init -y
// 2. npm install express jsonwebtoken
// 3. node app.js

const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// --- SECRETO para firmar JWT (en un entorno real usar variable de entorno) ---
const JWT_SECRET = "clave-super-segura-para-firmar-tokens";

// --- BASE DE DATOS SIMULADA (usuarios y contraseñas) ---
const usuarios = [
    { id: 1, username: "ana", password: "123", nombre: "Ana García" },
    { id: 2, username: "luis", password: "clave", nombre: "Luis Pérez" },
    { id: 3, username: "admin", password: "admin", nombre: "Administrador" }
];

// ========== 1. ENDPOINT DE LOGIN ==========
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validar que lleguen ambos campos
    if (!username || !password) {
        return res.status(400).json({ 
            error: "Faltan datos", 
            mensaje: "Debes enviar 'username' y 'password'" 
        });
    }

    // Buscar usuario en la lista simulada
    const usuario = usuarios.find(u => u.username === username && u.password === password);

    if (!usuario) {
        return res.status(401).json({ 
            error: "Credenciales inválidas",
            mensaje: "Usuario o contraseña incorrectos" 
        });
    }

    // Crear payload del token (información que viajará dentro del JWT)
    const payload = {
        id: usuario.id,
        username: usuario.username,
        nombre: usuario.nombre
        // No incluir la contraseña nunca
    };

    // Firmar el token (expira en 1 hora)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // Devolver el token y datos básicos del usuario
    res.json({
        mensaje: "Login exitoso",
        token: token,
        usuario: {
            id: usuario.id,
            username: usuario.username,
            nombre: usuario.nombre
        }
    });
});

// ========== 2. MIDDLEWARE PARA VERIFICAR TOKEN (rutas protegidas) ==========
function verificarToken(req, res, next) {
    // El token suele enviarse en el header 'Authorization': Bearer <token>
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(' ')[1]; // Separar "Bearer" del token
    if (!token) {
        return res.status(401).json({ error: "Formato de token inválido" });
    }

    try {
        // Verificar y decodificar el token
        const payload = jwt.verify(token, JWT_SECRET);
        req.usuario = payload;  // Adjuntar la info del usuario a la request
        next();  // Pasa al siguiente middleware o a la ruta final
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expirado" });
        }
        return res.status(403).json({ error: "Token inválido" });
    }
}

// ========== 3. RUTA PROTEGIDA DE EJEMPLO ==========
app.get('/perfil', verificarToken, (req, res) => {
    // req.usuario fue inyectado por el middleware verificarToken
    res.json({
        mensaje: "Acceso concedido a área protegida",
        usuario: req.usuario
    });
});

// ========== 4. RUTA PÚBLICA DE BIENVENIDA ==========
app.get('/', (req, res) => {
    res.send('🚀 Servicio de login funcionando. Usa POST /login para autenticarte.');
});

// ========== 5. RUTA PÚBLICA DE ACCESO ==========
app.get('/acceso', (req, res) => {
  console.log('Acceso al login /acceso');
  res.sendFile(path.join(__dirname, 'acceso.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📌 Endpoints:`);
    console.log(`   POST /login  - Enviar { "username": "ana", "password": "123" }`);
    console.log(`   GET  /perfil - Requiere token (header Authorization: Bearer <token>)`);
});