import axiosInstance from "./axiosInstance.js";

/**
 * Obtiene todas las obras sociales con sus planes incluidos.
 * @returns {Promise<Array>} Lista de obras sociales
 */
export const getObrasSociales = async () => {
    const response = await axiosInstance.get("/obra-social");
    return response.data.data;
};
