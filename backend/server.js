// backend/server.js  ← versión INFALIBLE (sin depender del .env)
const bcryptjs = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const Usuario = require('./models/Usuario');
const EnlaceTemporal = require('./models/EnlaceTemporal');

const app = express();
app.use(cors());
app.use(express.json());

// ======= TODAS LAS VARIABLES FIJAS AQUÍ (funciona SÍ o SÍ) =======
const MONGO_URI = "mongodb+srv://uniactividades75_db_user:ZfI4XJjRHngtIhcB@practica.dz6w7ti.mongodb.net/seguridad?retryWrites=true&w=majority";
const EMAIL_USER = "20230047@uthh.edu.mx";
const EMAIL_PASS = "aiktrzizknlzdehz";
const FRONTEND_URL = "http://localhost:5173";

// Conexión directa a MongoDB (sin process.env)
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado correctamente'))
  .catch(err => {
    console.error('Error conectando a MongoDB:', err.message);
    process.exit(1);
  });

// === GENERAR ENLACE MÁGICO (MISMO DISEÑO QUE RECUPERACIÓN) ===
app.post('/api/auth/generar-enlace', async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ correo: email?.trim().toLowerCase() });

    if (!usuario) {
      return res.json({ message: 'Si el correo está registrado, recibirás un enlace.' });
    }

    // Borrar enlaces anteriores
    await EnlaceTemporal.deleteMany({ usuarioId: usuario._id });

    const token = crypto.randomBytes(32).toString('hex');
    await EnlaceTemporal.create({
      usuarioId: usuario._id,
      token,
      tipo: 'login'
    });

    const enlace = `${FRONTEND_URL}/validar-acceso?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });

    await transporter.sendMail({
      from: EMAIL_USER,
      to: usuario.correo,
      subject: 'Tu enlace mágico - UTHH',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background: #fff3cd; border-radius: 15px; max-width: 500px; margin: auto;">
          <h2 style="color: #d97706;">Acceso sin contraseña</h2>
          <p>Hola <strong>${usuario.nombre}</strong>,</p>
          <p>Has solicitado un enlace mágico para entrar.</p>
          <p>Este enlace expira en <strong>15 minutos</strong>.</p>
          <br>
          <a href="${enlace}" style="background:#f59e0b; color:white; padding:15px 40px; text-decoration:none; border-radius:50px; font-weight:bold; display:inline-block;">
            Entrar ahora
          </a>
          <br><br>
          <small style="color:#666;">Si no solicitaste esto, ignora este mensaje.</small>
        </div>
      `
    });

    res.json({ message: 'Si el correo está registrado, recibirás un enlace.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// === VALIDAR ENLACE MÁGICO (DEVUELVE USUARIO) ===
app.post('/api/auth/validar-enlace', async (req, res) => {
  try {
    const { token } = req.body;
    const enlace = await EnlaceTemporal.findOne({ token }).populate('usuarioId');

    if (!enlace || (enlace.expiraEn && enlace.expiraEn < new Date())) {
      return res.status(400).json({ message: 'Enlace inválido o expirado' });
    }

    await EnlaceTemporal.deleteOne({ _id: enlace._id });
    
    const sessionToken = jwt.sign({ id: enlace.usuarioId._id }, 'clave123', { expiresIn: '7d' });

    // DEVOLVEMOS EL USUARIO
    res.json({ 
      sessionToken, 
      message: '¡Acceso concedido!',
      usuario: { 
        nombre: enlace.usuarioId.nombre, 
        correo: enlace.usuarioId.correo 
      }
    });

  } catch (err) {
    console.error(err(err));
    res.status(500).json({ message: 'Error' });
  }
});

app.listen(3001, () => {
  console.log('Backend corriendo en http://localhost:3001');
});

// === REGISTRO SIMPLE: NOMBRE, CORREO, CONTRASEÑA ===
app.post('/api/auth/registro', async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Contraseña muy corta' });
    }

    const existe = await Usuario.findOne({ correo: correo.toLowerCase() });
    if (existe) {
      return res.status(400).json({ message: 'Correo ya registrado' });
    }

    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    const nuevo = await Usuario.create({
      nombre: nombre.trim(),
      correo: correo.toLowerCase().trim(),
      password: passwordHash
    });

    res.json({ 
      message: '¡Cuenta creada! Usa tu correo para el enlace mágico.',
      usuario: { nombre: nuevo.nombre, correo: nuevo.correo }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// === RECUPERAR CONTRASEÑA ===
app.post('/api/auth/recuperar-password', async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ correo: email?.trim().toLowerCase() });

    if (!usuario) {
      return res.json({ message: 'Si el correo está registrado, recibirás un enlace.' });
    }

    // Borrar tokens anteriores
    await EnlaceTemporal.deleteMany({ usuarioId: usuario._id });

    const token = crypto.randomBytes(32).toString('hex');
    await EnlaceTemporal.create({
      usuarioId: usuario._id,
      token,
      tipo: 'recuperacion' // ← para diferenciar
    });

    const enlace = `${FRONTEND_URL}/cambiar-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });

    await transporter.sendMail({
      from: EMAIL_USER,
      to: usuario.correo,
      subject: '🔑 Cambia tu contraseña - UTHH',
      html: `
        <div style="font-family: Arial; text-align: center; padding: 30px; background: #fff3cd; border-radius: 15px;">
          <h2 style="color: #d97706;">Recuperación de contraseña</h2>
          <p>Has solicitado cambiar tu contraseña.</p>
          <p>Este enlace expira en <strong>15 minutos</strong>.</p>
          <br>
          <a href="${enlace}" style="background:#f59e0b; color:white; padding:15px 40px; text-decoration:none; border-radius:50px; font-weight:bold;">
            Cambiar Contraseña
          </a>
          <br><br>
          <small style="color:#666;">Si no solicitaste esto, ignora este mensaje.</small>
        </div>
      `
    });

    res.json({ message: 'Si el correo está registrado, recibirás un enlace.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
});

// === CAMBIAR CONTRASEÑA CON TOKEN ===
app.post('/api/auth/cambiar-password', async (req, res) => {
  try {
    const { token, nuevaPassword } = req.body;

    if (nuevaPassword.length < 6) {
      return res.status(400).json({ message: 'Contraseña muy corta' });
    }

    const enlace = await EnlaceTemporal.findOne({
      token,
      tipo: 'recuperacion',
      expiraEn: { $gt: new Date() }
    });

    if (!enlace) {
      return res.status(400).json({ message: 'Enlace inválido o expirado' });
    }

    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(nuevaPassword, salt);

    await Usuario.updateOne(
      { _id: enlace.usuarioId },
      { password: passwordHash }
    );

    await EnlaceTemporal.deleteOne({ _id: enlace._id });

    res.json({ message: '¡Contraseña cambiada con éxito!' });

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

    if (!enlace) {
      return res.status(400).json({ message: 'Enlace inválido o expirado' });
    }

    res.json({ valido: true });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

// === LOGIN CON CONTRASEÑA ===
app.post('/api/auth/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    const usuario = await Usuario.findOne({ correo: correo.toLowerCase() });
    if (!usuario) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    const esValida = await bcryptjs.compare(password, usuario.password);
    if (!esValida) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    const sessionToken = jwt.sign(
      { id: usuario._id },
      'clave123',
      { expiresIn: '7d' }
    );

    res.json({
      sessionToken,
      message: '¡Acceso concedido!',
      usuario: { nombre: usuario.nombre, correo: usuario.correo }
    });

  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});