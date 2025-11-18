// src/config.js
// En producción, usar la misma URL (rutas relativas)
// En desarrollo, usar localhost si es necesario
const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';

export default API_URL;