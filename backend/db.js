// backend/db.js
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://uniactividades75_db_user:ZfI4XJjRHngtIhcB@practica.dz6w7ti.mongodb.net/seguridad?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Conectado ✅ a la base de datos: seguridad');
  } catch (err) {
    console.error('Error de conexión a MongoDB ❌:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;