// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registro from './Registro.jsx';
import RecuperarPassword from './RecuperarPassword.jsx';
import CambiarPassword from './CambiarPassword.jsx';
import Dashboard from './Dashboard.jsx';
import Login from './Login.jsx';        
import SolicitarEnlace from './SolicitarEnlace.jsx';
import ValidarToken from './ValidarToken.jsx';

import './index.css';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/cambiar-password" element={<CambiarPassword />} />
        <Route path="/solicitar-enlace" element={<SolicitarEnlace />} />
        <Route path="/validar-acceso" element={<ValidarToken />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);