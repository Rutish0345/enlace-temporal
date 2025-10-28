// backend/models/Usuario.js
const mongoose = require('mongoose');

// Basado en tu captura de pantalla
const usuarioSchema = new mongoose.Schema({
  id_usuario: String,
  nombre: String,
  correo: String, // ¡El campo clave!
  pin_seguridad: String,
  fecha_creacion: Date,
  ultimo_acceso: Date,
  estado_cuenta: String
}, { 
  collection: 'usuarios' 
}); 

module.exports = mongoose.model('Usuario', usuarioSchema);