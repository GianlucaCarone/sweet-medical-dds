import axiosInstance from "./axiosInstance";

export const getAllSedes = async () => {
    try {
        const response = await axiosInstance.get('/sedes');
        return response.data;
    } catch (e) {
        console.error("Error obteniendo las sedes:", e);
        throw e;
    }
}
