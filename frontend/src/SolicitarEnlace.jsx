// src/SolicitarEnlace.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
      const response = await fetch('/api/auth/generar-enlace', {
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