// src/RecuperarPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/auth/recuperar-password', {
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