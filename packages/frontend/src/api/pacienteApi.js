import axiosInstance from "./axiosInstance.js";

/**
 * Obtiene el perfil del paciente del usuario logueado.
 * Requiere cookie de sesión válida.
 * @returns {Promise<Object>} DTO del paciente
 */
export const getMiPerfil = async () => {
    const response = await axiosInstance.get("/pacientes/me");
    return response.data.data;
};

/**
 * Actualiza los datos del paciente.
 * @param {string} idPaciente - ObjectId del paciente
 * @param {Object} payload - Campos a actualizar (obraSocial, plan, etc.)
 * @returns {Promise<Object>} DTO del paciente actualizado
 */
export const actualizarPaciente = async (idPaciente, payload) => {
    const response = await axiosInstance.put(`/pacientes/${idPaciente}`, payload);
    return response.data.data;
};
