// correo.js
const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const PORT = 3000;

// Configuración del transporter de Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ramiroec2@gmail.com",
    pass: "aaru cwxn ofjy lbfc", // Contraseña de aplicación
  },
});

// Ruta principal
app.get("/", (req, res) => {
  res.send(
    "📧 Bienvenido al servicio de correo. Usa /enviar-correo?para=correo@ejemplo.com&asunto=Hola&mensaje=Contenido",
  );
});

// Ruta para enviar correo
app.get("/enviar-correo", (req, res) => {
  const { para, asunto, mensaje } = req.query;

  // Validar que los parámetros existan
  if (!para || !asunto || !mensaje) {
    return res.send(
      "❌ Faltan parámetros. Ejemplo: /enviar-correo?para=destino@gmail.com&asunto=Prueba&mensaje=Hola%20mundo",
    );
  }

  const opcionesCorreo = {
    from: "ramiroec2@gmail.com",
    to: para,
    subject: asunto,
    text: mensaje,
  };

  transporter.sendMail(opcionesCorreo, (error, info) => {
    if (error) {
      console.error(error);
      return res.send(`❌ Error al enviar: ${error.message}`);
    }
    res.send(
      `✅ ¡Correo enviado exitosamente a ${para}! 📨\nDetalles: ${info.response}`,
    );
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en http://localhost:" + PORT);
  console.log(
    "📬 Ejemplo de uso: http://localhost:" +
      PORT +
      "/enviar-correo?para=amigo@gmail.com&asunto=Hola&mensaje=Esto%20es%20una%20prueba",
  );
});
