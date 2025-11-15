// backend/server.js
// === SERVERLESS PARA VERCEL + PRODUCCIÓN ===

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const Usuario = require('./models/Usuario');
const EnlaceTemporal = require('./models/EnlaceTemporal');

const app = express();

// === CONFIGURACIÓN DE ENTORNO ===
const MONGO_URI = process.env.MONGO_URI;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_1234567890';

// Validar variables críticas
if (!MONGO_URI || !EMAIL_USER || !EMAIL_PASS) {
  console.error('Faltan variables de entorno: MONGO_URI, EMAIL_USER, EMAIL_PASS');
  process.exit(1);
}

// === MIDDLEWARE ===
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// === CONEXIÓN A MONGODB ===
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => {
    console.error('Error MongoDB:', err.message);
    process.exit(1);
  });

// === TRANSPORTER DE EMAIL ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// === GENERAR ENLACE MÁGICO ===
app.post('/api/auth/generar-enlace', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Correo requerido' });

    const usuario = await Usuario.findOne({ correo: email.trim().toLowerCase() });
    if (!usuario) {
      return res.json({ message: 'Si el correo está registrado, recibirás un enlace.' });
    }

    await EnlaceTemporal.deleteMany({ usuarioId: usuario._id });

    const token = crypto.randomBytes(32).toString('hex');
    const expiraEn = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await EnlaceTemporal.create({
      usuarioId: usuario._id,
      token,
      tipo: 'login',
      expiraEn
    });

    const enlace = `${FRONTEND_URL}/validar-acceso?token=${token}`;

    await transporter.sendMail({
      from: `"Acceso Seguro" <${EMAIL_USER}>`,
      to: usuario.correo,
      subject: 'Tu enlace de acceso temporal',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>¡Hola, ${usuario.nombre}!</h2>
          <p>Accede sin contraseña con este enlace mágico:</p>
          <a href="${enlace}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Iniciar Sesión
          </a>
          <p><small>Expira en 15 minutos. Si no solicitaste esto, ignóralo.</small></p>
        </div>
      `
    });

    res.json({ message: '¡Enlace enviado! Revisa tu correo.' });
  } catch (err) {
    console.error('Error generar enlace:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// === VALIDAR ENLACE MÁGICO ===
app.post('/api/auth/validar-enlace', async (req, res) => {
  try {
    const { token } = req.body;
    const enlace = await EnlaceTemporal.findOne({
      token,
      tipo: 'login',
      expiraEn: { $gt: new Date() }
    }).populate('usuarioId');

    if (!enlace) {
      return res.status(400).json({ message: 'Enlace inválido o expirado' });
    }

    const usuario = enlace.usuarioId;
    const sessionToken = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: '7d' });

    await enlace.deleteOne();

    res.json({
      sessionToken,
      usuario: { nombre: usuario.nombre, correo: usuario.correo },
      message: '¡Acceso concedido!'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

// === REGISTRO ===
app.post('/api/auth/registro', async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) return res.status(400).json({ message: 'Faltan datos' });

    const existe = await Usuario.findOne({ correo: correo.toLowerCase() });
    if (existe) return res.status(400).json({ message: 'Correo ya registrado' });

    const passwordHash = await bcryptjs.hash(password, 10);
    const usuario = await Usuario.create({ nombre, correo: correo.toLowerCase(), password: passwordHash });

    res.json({ message: '¡Cuenta creada! Ya puedes usar enlace mágico.' });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

// === LOGIN CON CONTRASEÑA ===
app.post('/api/auth/login', async (req, res) => {
  try {
    const { correo, password } = req.body;
    const usuario = await Usuario.findOne({ correo: correo.toLowerCase() });
    if (!usuario) return res.status(400).json({ message: 'Correo o contraseña incorrectos' });

    const esValida = await bcryptjs.compare(password, usuario.password);
    if (!esValida) return res.status(400).json({ message: 'Correo o contraseña incorrectos' });

    const sessionToken = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      sessionToken,
      message: '¡Acceso concedido!',
      usuario: { nombre: usuario.nombre, correo: usuario.correo }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

// === RECUPERAR CONTRASEÑA ===
app.post('/api/auth/recuperar-password', async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ correo: email?.trim().toLowerCase() });
    if (!usuario) {
      return res.json({ message: 'Si el correo existe, recibirás un enlace.' });
    }

    await EnlaceTemporal.deleteMany({ usuarioId: usuario._id, tipo: 'recuperacion' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiraEn = new Date(Date.now() + 15 * 60 * 1000);

    await EnlaceTemporal.create({
      usuarioId: usuario._id,
      token,
      tipo: 'recuperacion',
      expiraEn
    });

    const enlace = `${FRONTEND_URL}/cambiar-password?token=${token}`;

    await transporter.sendMail({
      from: `"Recuperación" <${EMAIL_USER}>`,
      to: usuario.correo,
      subject: 'Cambia tu contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h2>Recupera tu acceso</h2>
          <p>Haz clic para cambiar tu contraseña:</p>
          <a href="${enlace}" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
            Cambiar Contraseña
          </a>
          <p><small>Válido por 15 minutos.</small></p>
        </div>
      `
    });

    res.json({ message: 'Enlace enviado al correo.' });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

// === VERIFICAR TOKEN DE RECUPERACIÓN ===
app.post('/api/auth/verificar-token-recuperacion', async (req, res) => {
  try {
    const { token } = req.body;
    const enlace = await EnlaceTemporal.findOne({
      token,
      tipo: 'recuperacion',
      expiraEn: { $gt: new Date() }
    });

    if (!enlace) return res.status(400).json({ message: 'Enlace inválido o expirado' });

    res.json({ valido: true });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

// === CAMBIAR CONTRASEÑA ===
app.post('/api/auth/cambiar-password', async (req, res) => {
  try {
    const { token, nuevaPassword } = req.body;
    if (!nuevaPassword || nuevaPassword.length < 6) {
      return res.status(400).json({ message: 'Mínimo 6 caracteres' });
    }

    const enlace = await EnlaceTemporal.findOne({
      token,
      tipo: 'recuperacion',
      expiraEn: { $gt: new Date() }
    }).populate('usuarioId');

    if (!enlace) return res.status(400).json({ message: 'Enlace inválido o expirado' });

    const passwordHash = await bcryptjs.hash(nuevaPassword, 10);
    await Usuario.updateOne({ _id: enlace.usuarioId._id }, { password: passwordHash });
    await enlace.deleteOne();

    res.json({ message: '¡Contraseña cambiada con éxito!' });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

// === EXPORT PARA VERCEL ===
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend en http://localhost:${PORT}`);
  });
}