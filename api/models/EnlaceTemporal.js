// api/models/EnlaceTemporal.js
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
  tipo: {
    type: String,
    enum: ['login', 'recuperacion'],
    default: 'login'
  },
  expiraEn: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 60 * 1000),
    index: { expires: '15m' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EnlaceTemporal', enlaceTemporalSchema);

