// src/ValidarToken.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './App.css'; // Usa los estilos existentes

function ValidarToken() {
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const validarEnlace = async () => {
      if (!token) {
        setError('Token no válido.');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/auth/validar-enlace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al validar el enlace.');
        }

        setMensaje('¡Acceso confirmado! Sesión iniciada.');
        // Aquí podrías redirigir al usuario a una página de dashboard o inicio
        // Ejemplo: window.location.href = '/dashboard';
      } catch (err) {
        setError(err.message);
      }
    };

    validarEnlace();
  }, [token]);

  return (
    <div className="login-container">
      <div className="right-side" style={{ width: '100%' }}>
        <div className="login-box">
          <h2>Validación de Acceso</h2>
          {mensaje && <p className="error" style={{ color: 'green' }}>{mensaje}</p>}
          {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
          {!mensaje && !error && <p>Validando tu enlace, por favor espera...</p>}
        </div>
      </div>
    </div>
  );
}

export default ValidarToken;