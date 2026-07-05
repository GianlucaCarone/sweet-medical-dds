import axiosInstance from "./axiosInstance";

export const getNotificacionesMe = async (leido = false, page = 1, limit = 5) => {
  const response = await axiosInstance.get(
    `/usuarios/me/notificaciones?leido=${leido}&page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getContadoresMe = async () => {
  const response = await axiosInstance.get("/usuarios/me/notificaciones/contadores");
  return response.data;
};

export const marcarNotificacionComoLeida = async (idNotificacion) => {
  const response = await axiosInstance.patch(`/usuarios/me/notificaciones/${idNotificacion}/leer`);
  return response.data;
};

export const marcarNotificacionComoNoLeida = async (idNotificacion) => {
  const response = await axiosInstance.patch(`/usuarios/me/notificaciones/${idNotificacion}/desleer`);
  return response.data;
};
