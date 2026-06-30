import axiosInstance from "./axiosInstance.js";

export const getTurnosPaciente = async (idPaciente) => {
    try {
        const response = await axiosInstance.get('/pacientes/${idUsuario}');
        return response.data;
    } catch (e) {
        console.error("Error obteniendo el id del paciente con id de usuario: " + idUsuario);
        throw e;
    }
}