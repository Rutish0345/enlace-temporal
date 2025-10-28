// src/SolicitarEnlace.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css'; 

function SolicitarEnlace() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/generar-enlace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el enlace');
      }

      setMensaje(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="right-side" style={{width: '100%'}}>
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
            />
            
            <button type="submit">Enviar Enlace</button>
            
            {mensaje && <p className="error" style={{color: 'green'}}>{mensaje}</p>}
            {error && <p className="error" style={{color: 'red'}}>{error}</p>}
          </form>

          <Link to="/" className="forgot" style={{textAlign: 'center', display: 'block', marginTop: '15px'}}>
            Volver al inicio de sesión
          </Link>
          
        </div>
      </div>
    </div>
  );
}

export default SolicitarEnlace;