// src/login.jsx

import { useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom' 
function Login() { 
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // Esta es la lógica de Benilde (PIN) o una temporal
    if (user === 'admin' && password === '12345') {
      setError('')
      alert('Inicio de sesión exitoso')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  return (
    <div className="login-container">
      {}
      <div className="left-side">
        <img
          src="https://cdn-icons-png.flaticon.com/512/906/906343.png"
          alt="logo"
          className="logo-large"
        />
      </div>

      {/* Lado derecho: formulario */}
      <div className="right-side">
        <div className="login-box">
          <h2>Iniciar sesión</h2>
          <p className="subtitle">Acceso exclusivo para empleados autorizados</p>

          <form onSubmit={handleLogin}>
            <label>Usuario</label>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="error">{error}</p>}

            <a href="#" className="forgot">
              ¿Olvidaste tu contraseña?
            </a>

            <button type="submit">Iniciar sesión</button>
            
            {}
            <Link to="/solicitar-enlace" className="forgot" style={{textAlign: 'center', display: 'block', marginTop: '15px'}}>
              O acceder con enlace temporal
            </Link>
            {}
            
          </form>

          <p className="footer">
            soporte@empresa.com · +52 77 11 89 12 65
            <br />© 2025 Empresa — Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  )
  
}

export default Login // <-- 2. (Continuación) Exportamos Login