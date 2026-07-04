import axiosInstance from "./axiosInstance";

export const getNotificacionesLeidas = async (idUsuario) => {
  const response = await axiosInstance.get(`/usuarios/${idUsuario}/notificaciones/leidas`);
  return response.data;
};

export const getNotificacionesNoLeidas = async (idUsuario) => {
  const response = await axiosInstance.get(`/usuarios/${idUsuario}/notificaciones/no-leidas`);
  return response.data;
};

export const marcarNotificacionComoLeida = async (idUsuario, idNotificacion) => {
  const response = await axiosInstance.patch(`/usuarios/${idUsuario}/notificaciones/${idNotificacion}/leer`);
  return response.data;
};

export const marcarNotificacionComoNoLeida = async (idUsuario, idNotificacion) => {
  const response = await axiosInstance.patch(`/usuarios/${idUsuario}/notificaciones/${idNotificacion}/desleer`);
  return response.data;
};
