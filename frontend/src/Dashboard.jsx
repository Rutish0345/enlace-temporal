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