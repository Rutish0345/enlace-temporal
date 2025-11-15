// src/Login.jsx - RESPONSIVO + PROFESIONAL
import React, { useState } from 'react';
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
      const res = await fetch('/api/auth/login', {
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
              placeholder="correo@.com"
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