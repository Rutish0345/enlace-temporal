// src/ValidarToken.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function ValidarToken() {
  const [mensaje, setMensaje] = useState('Validando tu enlace...');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('No se encontró token en el enlace.');
      return;
    }

    const validar = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/validar-enlace', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Enlace inválido o expirado');
        }

        setMensaje('¡Acceso concedido! Bienvenido.');
        // Aquí puedes guardar el JWT en localStorage si quieres
        localStorage.setItem('sessionToken', data.sessionToken);
        
        // Redirigir al dashboard (puedes cambiar la ruta)
        setTimeout(() => navigate('/'), 2000);

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
          <h2>Validando Acceso</h2>
          <p style={{ margin: '20px 0', fontSize: '16px' }}>
            {mensaje || error ? (
              <span style={{ color: error ? '#ff6b6b' : 'lightgreen' }}>
                {error || mensaje}
              </span>
            ) : (
              'Por favor espera...'
            )}
          </p>
          <button onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default ValidarToken;