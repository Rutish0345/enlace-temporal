// backend/server.js
require('dotenv').config(); // ← AÑADE ESTO AL INICIO
const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const cors = require('cors');

const Usuario = require('./models/Usuario');
const EnlaceTemporal = require('./models/EnlaceTemporal');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL || 'https://vercel.com/ruths-projects-d5ab6f69/enlace-temporal'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
}));

app.use(express.json());

connectDB();

// Ruta de prueba
app.post('/api/test/insert-user', async (req, res) => {
  try {
    const { nombre, correo } = req.body;
    const usuario = new Usuario({
      id_usuario: crypto.randomBytes(8).toString('hex'),
      nombre,
      correo,
      pin_seguridad: '12345',
      fecha_creacion: new Date(),
      estado_cuenta: 'activo'
    });
    await usuario.save();
    res.json({ message: 'Usuario insertado', correo });
  } catch (error) {
    res.status(500).json({ message: 'Error al insertar usuario' });
  }
});

// Generar enlace
app.post('/api/auth/generar-enlace', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`[1] Email recibido: ${email}`);

    const usuario = await Usuario.findOne({ correo: email });
    console.log(`[2] Usuario encontrado: ${usuario ? 'SÍ' : 'NO'}`);

    if (usuario) {
      const token = crypto.randomBytes(32).toString('hex');
      await new EnlaceTemporal({ usuarioId: usuario._id, token }).save();
      console.log(`[4] Token guardado: ${token}`);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const enlace = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/validar-acceso?token=${token}`;
      await transporter.sendMail({
        from: '"Soporte Seguridad" <20230047@uthh.edu.mx>',
        to: usuario.correo,
        subject: 'Tu enlace de acceso temporal',
        html: `
          <p>Hola ${usuario.nombre},</p>
          <p>Haz clic para iniciar sesión. Expira en 15 minutos.</p>
          <a href="${enlace}" style="padding: 10px 15px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Acceder a mi cuenta
          </a>
        `
      });
      console.log(`[5] Correo enviado a: ${usuario.correo}`);
    }

    res.json({ message: 'Si tu correo está registrado, recibirás un enlace.' });
  } catch (error) {
    console.error('[ERROR]', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Validar enlace
app.post('/api/auth/validar-enlace', async (req, res) => {
  try {
    const { token } = req.body;
    const enlace = await EnlaceTemporal.findOne({ token });

    if (!enlace) return res.status(400).json({ message: 'Enlace inválido o expirado.' });

    await EnlaceTemporal.deleteOne({ _id: enlace._id });

    const sessionToken = jwt.sign(
      { usuarioId: enlace.usuarioId },
      'CLAVE_SECRETA_PARA_JWT',
      { expiresIn: '1h' }
    );

    res.json({ sessionToken });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});