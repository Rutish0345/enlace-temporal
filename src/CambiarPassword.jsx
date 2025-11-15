// src/CambiarPassword.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

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
        const res = await fetch('http://localhost:3001/api/auth/verificar-token-recuperacion', {
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
      const res = await fetch('http://localhost:3001/api/auth/cambiar-password', {
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