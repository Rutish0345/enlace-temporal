// backend/models/EnlaceTemporal.js
const mongoose = require('mongoose');

const enlaceTemporalSchema = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  token: { 
    type: String, 
    required: true,
    unique: true 
  },
  expiraEn: { 
    type: Date, 
    default: () => Date.now() + 15 * 60 * 1000, 
    expires: 900 
  }
}, { 
  collection: 'enlaces_temporales' 
});

module.exports = mongoose.model('EnlaceTemporal', enlaceTemporalSchema);