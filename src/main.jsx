// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './login.jsx';
import SolicitarEnlace from './SolicitarEnlace.jsx';
import ValidarToken from './ValidarToken.jsx'; // Nuevo import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/solicitar-enlace" element={<SolicitarEnlace />} />
        <Route path="/validar-acceso" element={<ValidarToken />} /> {/* Nueva ruta */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);