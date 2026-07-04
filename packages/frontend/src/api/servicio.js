import axiosInstance from "./axiosInstance";

export const getAllServicios = async () => {
    try {
        const response = await axiosInstance.get('/servicios');
        return response.data;
    } catch (e) {
        console.error("Error obteniendo los servicios:", e);
        throw e;
    }
}
