// src/Registro.jsx - CON BOTÓN DE REGRESO CLARO
import React, { useState } from 'react';
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
      const res = await fetch('/api/auth/registro', {
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