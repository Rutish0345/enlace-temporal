// backend/models/Usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  id_usuario: String,
  nombre: String,
  correo: String, 
  pin_seguridad: String,
  fecha_creacion: Date,
  ultimo_acceso: Date,
  estado_cuenta: String
}, { 
  collection: 'usuarios' 
}); 

module.exports = mongoose.model('Usuario', usuarioSchema);