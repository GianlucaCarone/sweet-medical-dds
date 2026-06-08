import React, { createContext, useState, useContext, useEffect } from 'react';
//import api from '../api/axiosConfig';

// api mock
const api = {
  post: (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url === '/auth/login' && data.email === 'user@example.com' && data.password === 'password') {
          resolve({
            data: {
              user: { id: 1, email: data.email },
              token: 'mock-jwt-token'
            }
          });
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  }
}; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, revisamos si ya había una sesión guardada
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Usamos nuestra instancia de Axios
      const response = await api.post('/auth/login', { email, password });
      
      // Asumiendo que el back devuelve { user: {...}, token: "jwt..." }
      const { user: userData, token } = response.data; 

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData; // Retornamos para que el ModalLogin sepa que salió bien
    } catch (error) {
      // Axios guarda el mensaje del backend en error.response.data
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);