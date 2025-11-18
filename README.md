# Sistema de Enlace Temporal y Recuperación de Contraseña

Sistema completo de autenticación con enlaces temporales, registro, inicio de sesión y recuperación de contraseña.

## 🚀 Características

- ✅ Registro de usuarios
- ✅ Inicio de sesión con contraseña
- ✅ Enlace mágico temporal (sin contraseña)
- ✅ Recuperación de contraseña por email
- ✅ Tokens JWT para sesiones
- ✅ Enlaces temporales con expiración (15 minutos)

## 📁 Estructura del Proyecto

```
enlace-temporal/
├── api/                    # Backend (Serverless Functions para Vercel)
│   ├── index.js           # Handler principal de la API
│   └── models/            # Modelos de MongoDB
│       ├── Usuario.js
│       └── EnlaceTemporal.js
├── backend/                # Backend local (desarrollo)
│   ├── server.js
│   └── models/
├── frontend/               # Frontend React + Vite
│   ├── src/
│   └── dist/              # Build de producción
├── vercel.json            # Configuración de Vercel
└── package.json           # Dependencias del backend
```

## 🔧 Configuración Local

### Backend
```bash
cd backend
npm install
# Crear archivo .env con:
# MONGO_URI=tu_uri_mongodb
# EMAIL_USER=tu_email@gmail.com
# EMAIL_PASS=tu_app_password
# JWT_SECRET=tu_secret_key
# FRONTEND_URL=http://localhost:5173
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Despliegue en Vercel

### 1. Preparación

El proyecto ya está configurado para Vercel con:
- ✅ Carpeta `api/` con funciones serverless
- ✅ `vercel.json` configurado
- ✅ `package.json` en la raíz con dependencias

### 2. Variables de Entorno en Vercel

Configura estas variables en el dashboard de Vercel (Settings → Environment Variables):

```
MONGO_URI=tu_uri_mongodb
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_gmail
JWT_SECRET=tu_secret_key_seguro
FRONTEND_URL=https://tu-dominio.vercel.app
```

**Importante:** 
- `FRONTEND_URL` debe ser la URL de tu proyecto en Vercel
- `EMAIL_PASS` debe ser una "App Password" de Gmail, no tu contraseña normal

### 3. Desplegar

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Desde la raíz del proyecto
vercel

# O conecta tu repositorio en vercel.com
```

### 4. Verificar Despliegue

- Las rutas `/api/*` se manejan por `api/index.js`
- El frontend se sirve desde `frontend/dist/`
- Todas las rutas del frontend redirigen a `/index.html` (SPA)

## 📝 Notas Importantes

1. **Estructura para Vercel**: El backend está en `api/index.js` como función serverless
2. **Rutas relativas**: El frontend usa rutas relativas (`/api/...`) que funcionan automáticamente en Vercel
3. **Build del frontend**: Vercel construye automáticamente el frontend usando `npm run build` en la carpeta `frontend/`
4. **MongoDB**: Asegúrate de que tu MongoDB esté accesible desde internet (MongoDB Atlas recomendado)

## 🐛 Solución de Problemas

### "No muestra nada en Vercel"
- Verifica que las variables de entorno estén configuradas
- Revisa los logs de build en Vercel
- Asegúrate de que `FRONTEND_URL` apunte a tu dominio de Vercel

### "Error de conexión a MongoDB"
- Verifica que `MONGO_URI` esté correcta
- Asegúrate de que tu IP esté permitida en MongoDB Atlas (o usa 0.0.0.0/0 para desarrollo)

### "Emails no se envían"
- Verifica `EMAIL_USER` y `EMAIL_PASS`
- Usa una "App Password" de Gmail, no tu contraseña normal
- Habilita "Acceso de aplicaciones menos seguras" o usa App Passwords

## 📄 Licencia

MIT
