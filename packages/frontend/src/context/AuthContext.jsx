import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, intentamos restaurar la sesión consultando GET /auth/me.
  // El browser envía la cookie HttpOnly automáticamente (gracias a withCredentials: true).
  // Si la cookie es válida, el backend devuelve el usuario autenticado.
  // Si no hay cookie o expiró, el backend devuelve 401 y el usuario queda como null.
  useEffect(() => {
    const restaurarSesion = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        setUser(response.data.usuario);
      } catch {
        // 401 u otro error → no hay sesión activa, es el estado normal
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restaurarSesion();
  }, []);

  /**
   * Inicia sesión enviando las credenciales al backend.
   * El backend verifica la contraseña, firma el JWT y lo setea como cookie HttpOnly.
   */
  const login = async (nombreUsuario, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { nombreUsuario, password });
      const { usuario } = response.data;
      setUser(usuario);
      return usuario;
    } catch (error) {
      // El interceptor de axiosInstance ya extrajo el mensaje del backend
      // en error.message. Solo lo repassamos con un fallback genérico.
      throw new Error(error.message || 'Error al iniciar sesión. Intentá de nuevo.');
    }
  };

  /**
   * Cierra sesión llamando al backend para que borre la cookie HttpOnly.
   * El frontend no puede borrar una HttpOnly cookie por sí solo.
   */
  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      // Limpiamos el estado local siempre, incluso si el request falla
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);