import { useState } from 'react'
import './App.css'

function App() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (user === 'admin' && password === '12345') {
      setError('')
      alert('Inicio de sesión exitoso ✅')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  return (
    <div className="login-container">
      {/* Lado izquierdo */}
      <div className="left-side">
        <img
          src="https://cdn-icons-png.flaticon.com/512/906/906343.png"
          alt="logo"
          className="logo"
        />
        <h2>Sistema de cotización</h2>
        <p>
          Plataforma interna para la gestión y control de datos.  
          Acceso restringido al personal autorizado de la empresa.
        </p>

        <div className="help-box">
          <h4>¿Necesitas ayuda?</h4>
          <p>Contacta al departamento de TI para asistencia con tu cuenta.</p>
        </div>
      </div>

      {/* Lado derecho */}
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
          </form>

          <p className="footer">
            soporte@empresa.com · +52 77 **** ****  
            <br />© 2025 Empresa — Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
