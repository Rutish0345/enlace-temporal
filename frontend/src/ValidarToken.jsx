// src/ValidarToken.jsx - SOLO PARA LOGIN MÁGICO
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

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
      const res = await fetch('/api/auth/validar-enlace', {
        method: 'POST',
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