import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import {
  getNotificacionesLeidas,
  getNotificacionesNoLeidas,
  marcarNotificacionComoLeida,
  marcarNotificacionComoNoLeida
} from "../api/notificacion";

const NotificacionContext = createContext();

export const NotificacionProvider = ({ children }) => {
  const { user } = useAuth();
  const [notificacionesLeidas, setNotificacionesLeidas] = useState([]);
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const pollingTimerRef = useRef(null);

  // Carga todas las notificaciones desde el backend
  const obtenerNotificaciones = useCallback(async () => {
    if (!user || !user.id) return;
    try {
      setCargando(true);
      const [leidasRes, noLeidasRes] = await Promise.all([
        getNotificacionesLeidas(user.id),
        getNotificacionesNoLeidas(user.id)
      ]);
      setNotificacionesLeidas(leidasRes.data || []);
      setNotificacionesNoLeidas(noLeidasRes.data || []);
    } catch (error) {
      console.error("[NotificacionContext]: Error al obtener notificaciones", error);
    } finally {
      setCargando(false);
    }
  }, [user]);

  // Carga de notificaciones silenciosa (para el polling)
  const refrescarSilencioso = useCallback(async () => {
    if (!user || !user.id) return;
    try {
      const [leidasRes, noLeidasRes] = await Promise.all([
        getNotificacionesLeidas(user.id),
        getNotificacionesNoLeidas(user.id)
      ]);
      setNotificacionesLeidas(leidasRes.data || []);
      setNotificacionesNoLeidas(noLeidasRes.data || []);
    } catch (error) {
      console.error("[NotificacionContext]: Error en refresco silencioso", error);
    }
  }, [user]);

  // Marcar una notificación individual como leída
  const marcarComoLeida = async (idNotificacion) => {
    if (!user || !user.id) return;
    
    // Búsqueda en la lista actual de no leídas
    const targetNotif = notificacionesNoLeidas.find((n) => n.id === idNotificacion);
    if (!targetNotif) return;

    // Actualización optimista: mover localmente de inmediato para mejorar UX
    setNotificacionesNoLeidas((prev) => prev.filter((n) => n.id !== idNotificacion));
    setNotificacionesLeidas((prev) => [
      { ...targetNotif, leida: true, fechaHoraLeida: new Date().toISOString() },
      ...prev
    ]);

    try {
      await marcarNotificacionComoLeida(user.id, idNotificacion);
    } catch (error) {
      console.error("[NotificacionContext]: Error al marcar como leída", error);
      // Revertir en caso de fallo
      obtenerNotificaciones();
    }
  };

  // Marcar una notificación individual como no leída
  const marcarComoNoLeida = async (idNotificacion) => {
    if (!user || !user.id) return;

    // Búsqueda en la lista actual de leídas
    const targetNotif = notificacionesLeidas.find((n) => n.id === idNotificacion);
    if (!targetNotif) return;

    // Actualización optimista: mover localmente de inmediato
    setNotificacionesLeidas((prev) => prev.filter((n) => n.id !== idNotificacion));
    setNotificacionesNoLeidas((prev) => [
      { ...targetNotif, leida: false, fechaHoraLeida: null },
      ...prev
    ]);

    try {
      await marcarNotificacionComoNoLeida(user.id, idNotificacion);
    } catch (error) {
      console.error("[NotificacionContext]: Error al marcar como no leída", error);
      // Revertir en caso de fallo
      obtenerNotificaciones();
    }
  };

  // Marcar todas las notificaciones pendientes como leídas
  const marcarTodasComoLeidas = async () => {
    if (!user || !user.id || notificacionesNoLeidas.length === 0) return;

    const noLeidasClon = [...notificacionesNoLeidas];
    
    // Actualización optimista
    setNotificacionesNoLeidas([]);
    setNotificacionesLeidas((prev) => [
      ...noLeidasClon.map((n) => ({ ...n, leida: true, fechaHoraLeida: new Date().toISOString() })),
      ...prev
    ]);

    try {
      // Mandamos todos los requests en paralelo
      await Promise.all(
        noLeidasClon.map((n) => marcarNotificacionComoLeida(user.id, n.id))
      );
    } catch (error) {
      console.error("[NotificacionContext]: Error al marcar todas como leídas", error);
      // Revertir
      obtenerNotificaciones();
    }
  };

  // Efecto para inicializar la carga y configurar/limpiar el polling
  useEffect(() => {
    if (user && user.id) {
      obtenerNotificaciones();

      // Configurar polling cada 30 segundos
      pollingTimerRef.current = setInterval(() => {
        refrescarSilencioso();
      }, 30000);
    } else {
      // Limpiar estados al cerrar sesión
      setNotificacionesLeidas([]);
      setNotificacionesNoLeidas([]);
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
    }

    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
    };
  }, [user, obtenerNotificaciones, refrescarSilencioso]);

  const cantidadNoLeidas = notificacionesNoLeidas.length;
  const cantidadLeidas = notificacionesLeidas.length;

  return (
    <NotificacionContext.Provider
      value={{
        notificacionesLeidas,
        notificacionesNoLeidas,
        cargando,
        cantidadNoLeidas,
        cantidadLeidas,
        obtenerNotificaciones,
        marcarComoLeida,
        marcarComoNoLeida,
        marcarTodasComoLeidas
      }}
    >
      {children}
    </NotificacionContext.Provider>
  );
};

export const useNotificaciones = () => {
  const context = useContext(NotificacionContext);
  if (!context) {
    throw new Error("useNotificaciones debe usarse dentro de un NotificacionProvider");
  }
  return context;
};
