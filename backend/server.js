// backend/server.js  ← versión INFALIBLE (sin depender del .env)

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

// GENERAR ENLACE
app.post('/api/auth/generar-enlace', async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ correo: email?.trim() });

    if (usuario) {
      await EnlaceTemporal.deleteMany({ usuarioId: usuario._id });
      const token = crypto.randomBytes(32).toString('hex');
      await EnlaceTemporal.create({ usuarioId: usuario._id, token });

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
        html: `<h2>Hola ${usuario.nombre}</h2>
               <p>Da clic para entrar (expira en 15 min):</p>
               <a href="${enlace}" style="background:#007bff;color:white;padding:15px 30px;text-decoration:none;border-radius:10px;font-size:18px;">Entrar ahora</a>`
      });

      console.log('Correo enviado a:', usuario.correo);
    }

    res.json({ message: 'Si el correo está registrado, recibirás un enlace.' });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Error' });
  }
});

// VALIDAR ENLACE
app.post('/api/auth/validar-enlace', async (req, res) => {
  try {
    const { token } = req.body;
    const enlace = await EnlaceTemporal.findOne({ token }).populate('usuarioId');

    if (!enlace || (enlace.expiraEn && enlace.expiraEn < new Date())) {
      return res.status(400).json({ message: 'Enlace inválido o expirado' });
    }

    await EnlaceTemporal.deleteOne({ _id: enlace._id });
    const sessionToken = jwt.sign({ id: enlace.usuarioId._id }, 'clave123', { expiresIn: '7d' });

    res.json({ sessionToken, message: '¡Acceso concedido!' });

  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

app.listen(3001, () => {
  console.log('Backend corriendo en http://localhost:3001');
});