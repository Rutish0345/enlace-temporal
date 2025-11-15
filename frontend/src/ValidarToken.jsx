// src/CambiarPassword.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API_URL from './config.js';

function CambiarPassword() {
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Enlace inválido');
      return;
    }

    // Verificar token al cargar
    const verificar = async () => {
      try {
       const res = await fetch(`${API_URL}/api/auth/verificar-token-recuperacion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setMensaje('Enlace válido. Ingresa tu nueva contraseña.');
      } catch (err) {
        setError('Enlace inválido o expirado');
      }
    };

    verificar();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Mínimo 6 caracteres');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/cambiar-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nuevaPassword: password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMensaje(data.message);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="right-side" style={{ width: '100%' }}>
        <div className="login-box">
          <h2>Nueva Contraseña</h2>
          <p className="subtitle">Mínimo 6 caracteres</p>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
            <button type="submit">Cambiar</button>
          </form>

          {mensaje && <p style={{ color: 'lightgreen', marginTop: '10px' }}>{mensaje}</p>}
          {error && <p style={{ color: '#ff6b6b', marginTop: '10px' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default CambiarPassword;
// src/Dashboard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="right-side" style={{ width: '100%' }}>
        <div className="login-box">
          <h2>¡Bienvenid@, {usuario.nombre || 'Usuario'}!</h2>
          <p className="subtitle">Has iniciado sesión</p>
          
          <div style={{ margin: '20px 0', padding: '15px', background: '#557c95ff', borderRadius: '8px', textAlign: 'center' }}>
            <p><strong>Correo:</strong> {usuario.correo}</p>
          </div>

          <button onClick={handleLogout} style={{ background: '#ef4444' }}>
            Cerrar Sesion
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
// src/Login.jsx - RESPONSIVO + PROFESIONAL
import React, { useState } from 'react';
import API_URL from './config.js';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');

      localStorage.setItem('sessionToken', data.sessionToken);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="logo-circle">A</div>
      </div>

      <div className="right-side">
        <div className="login-box">
          <h2>Iniciar sesión</h2>
          <p className="subtitle">Acceso exclusivo para empleados autorizados</p>

          <form onSubmit={handleSubmit}>
            <label>Usuario</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="20230047@uthh.edu.mx"
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>

            {error && <p style={{ color: '#f87171', marginTop: '10px', fontSize: '14px' }}>{error}</p>}
          </form>

          <Link to="/registro" className="link">
            ¿Primera vez? Crear cuenta
          </Link>

          <Link to="/recuperar-password" className="link">
            ¿Olvidaste tu contraseña?
          </Link>

          <div className="divider">O</div>

          <Link to="/solicitar-enlace">
            <button style={{
              background: '#10b981',
              backgroundImage: 'linear-gradient(90deg, #10b981, #34d399)',
              marginTop: '8px'
            }}>
              Acceder con enlace temporal
            </button>
          </Link>

          <div className="footer">
            <p>soporte@empresa.com • +52 77 11 89 12 65</p>
            <p>© 2025 Empresa — Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registro from './Registro.jsx';
import RecuperarPassword from './RecuperarPassword.jsx';
import CambiarPassword from './CambiarPassword.jsx';
import Dashboard from './Dashboard.jsx';
import Login from './Login.jsx';        
import SolicitarEnlace from './SolicitarEnlace.jsx';
import ValidarToken from './ValidarToken.jsx';

import './index.css';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/cambiar-password" element={<CambiarPassword />} />
        <Route path="/solicitar-enlace" element={<SolicitarEnlace />} />
        <Route path="/validar-acceso" element={<ValidarToken />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
// src/RecuperarPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from './config.js';

function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/recuperar-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      setMensaje(data.message || 'Revisa tu correo');
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="login-container">
      <div className="right-side" style={{ width: '100%' }}>
        <div className="login-box">
          <h2>Recuperar Contraseña</h2>
          <p className="subtitle">Ingresa tu correo y te enviaremos un enlace para cambiarla.</p>

          <form onSubmit={handleSubmit}>
            <label>Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="20230047@uthh.edu.mx"
            />
            <button type="submit">Enviar Enlace</button>
          </form>

          {mensaje && <p style={{ color: 'lightgreen', marginTop: '10px' }}>{mensaje}</p>}
          {error && <p style={{ color: '#ff6b6b', marginTop: '10px' }}>{error}</p>}

          <Link to="/" className="link orange" style={{ marginTop: '16px' }}>
                     ← Volver al inicio de sesión
        </Link>
        </div>
      </div>
    </div>
  );
}

export default RecuperarPassword;
// src/Registro.jsx - CON BOTÓN DE REGRESO CLARO
import React, { useState } from 'react';
import API_URL from './config.js';
import { Link, useNavigate } from 'react-router-dom';

function Registro() {
  const [form, setForm] = useState({ nombre: '', correo: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMensaje(data.message);
      setForm({ nombre: '', correo: '', password: '' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="right-side" style={{ width: '100%', padding: '40px' }}>
        <div className="login-box">
          <h2>Crear Cuenta</h2>
          <p className="subtitle">Regístrate para usar enlaces mágicos</p>

          <form onSubmit={handleSubmit}>
            <label>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />

            <label>Correo institucional</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="20230047@uthh.edu.mx"
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Registrarme</button>

            {mensaje && <p style={{ color: 'lightgreen', fontSize: '14px', marginTop: '10px' }}>{mensaje}</p>}
            {error && <p style={{ color: '#f87171', fontSize: '14px', marginTop: '10px' }}>{error}</p>}
          </form>

          <Link to="/solicitar-enlace" className="link">
            ¿Ya tienes cuenta? Usa enlace mágico
          </Link>

          <Link to="/" className="link orange" style={{ marginTop: '16px' }}>
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Registro;
// src/SolicitarEnlace.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from './config.js';

function SolicitarEnlace() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setCargando(true);

    try {
      const response = await fetch('${API_URL}/api/auth/generar-enlace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }) // ← clave: body bien formado
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error del servidor');
      }

      setMensaje(data.message || '¡Enlace enviado! Revisa tu correo.');
    } catch (err) {
      setError(err.message || 'Error de red. Verifica que el backend esté corriendo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="right-side" style={{ width: '100%' }}>
        <div className="login-box">
          <h2>Acceso por Enlace</h2>
          <p className="subtitle">Ingresa tu correo y te enviaremos un enlace mágico para acceder.</p>
          
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="20230047@uthh.edu.mx"
            />
            
            <button type="submit" disabled={cargando}>
              {cargando ? 'Enviando...' : 'Enviar Enlace'}
            </button>
            
            {mensaje && <p style={{ color: 'lightgreen', marginTop: '10px' }}>{mensaje}</p>}
            {error && <p style={{ color: '#ff6b6b', marginTop: '10px' }}>{error}</p>}
          </form>

          <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: '#60a5fa' }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SolicitarEnlace;
// src/ValidarToken.jsx - SOLO PARA LOGIN MÁGICO
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API_URL from './config.js';

function ValidarToken() {
  const [mensaje, setMensaje] = useState('Validando enlace...');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
  if (!token) {
    setError('Enlace inválido');
    return;
  }

  const validar = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/validar-enlace`, {        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // GUARDAR SESIÓN Y USUARIO
      localStorage.setItem('sessionToken', data.sessionToken);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      setMensaje('¡Acceso concedido!');
      setTimeout(() => navigate('/dashboard'), 1000);

    } catch (err) {
      setError(err.message);
    }
  };

  validar();
}, [token, navigate]);

  return (
    <div className="login-container">
      <div className="right-side" style={{ width: '100%' }}>
        <div className="login-box">
          <h2>Validando...</h2>
          <p style={{ margin: '20px 0', textAlign: 'center' }}>
            {error ? (
              <span style={{ color: '#ff6b6b' }}>{error}</span>
            ) : (
              <span style={{ color: 'lightgreen' }}>{mensaje}</span>
            )}
          </p>
          {error && (
            <button onClick={() => navigate('/')} style={{ width: '100%' }}>
              Volver al login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ValidarToken;
