
// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { useAuth } from '../context/AuthContext'; // Asumiendo que crearon el contexto

const Login = () => {
  // Estados para manejar los inputs del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  //const { login } = useAuth(); // Función global que setea el usuario
  const navigate = useNavigate(); // Hook para redireccionar de pantalla

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitamos que la página se recargue (comportamiento por defecto del form)
    setError('');

    /* try {
      // Endpoint de autenticación (¡Ajustalo a la ruta real de tu backend!)
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Si el backend responde bien, guardamos el usuario/token en el estado global
      login(data.user, data.token); 
      
      // Redirigimos al perfil del usuario
      navigate('/perfil'); 

    } catch (err) {
      console.error("Error en el login:", err);
      setError(err.message);
    } */
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión - Sweet Medical</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        {/* Mostramos errores si los hay */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;