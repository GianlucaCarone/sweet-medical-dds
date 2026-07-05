import axiosInstance from "./axiosInstance.js";

export const actualizarUsuario = async (payload) => {
    const response = await axiosInstance.put(`/usuarios/me`, payload);
    return response.data;
};
