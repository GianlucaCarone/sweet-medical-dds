import axiosInstance from "./axiosInstance";

const API_BASE_URL = process.env.REACT_APP_API_URL

export const getMedicoByIdUsuario = async (idUsuario) => {
    try {
        const response = await axiosInstance.get(`/medicos/usuario/${idUsuario}`);
        console.log(response.data);
        return response.data;
    } catch (e) {
        if (e.response?.status === 404) {
            return null; // usuario sin medico
        }
        console.error("Error obteniendo el medico con id de usuario: " + idUsuario, e);
        throw e;
    }
}

export const getMedicoById = async (id) => {
    try {
        const response = await axiosInstance.get(`/medicos/${id}`);
        console.log(response.data);
        return response.data;
    } catch (e) {
        if (e.response?.status === 404) {
            return null; // id de medico no encontrado
        }
        console.error("Error obteniendo el medico con id: " + id, e);
        throw e;
    }
}

export const getListadoMedicos = async () => {
    try {
        const response = await axiosInstance.get('/medicos');
        console.log(response.data);
        return response.data;
    } catch (e) {
        console.error("Error obteniendo los medicos");
        throw e;
    }
}

// --- SERVICIOS ---
export const agregarServicio = async (idMedico, idServicio) => {
    try {
        const response = await axiosInstance.post(`/medicos/${idMedico}/servicios/${idServicio}`);
        return response.data;
    } catch (e) {
        console.error("Error agregando servicio:", e);
        throw e;
    }
}

export const eliminarServicio = async (idMedico, idServicio) => {
    try {
        const response = await axiosInstance.delete(`/medicos/${idMedico}/servicios/${idServicio}`);
        return response.data;
    } catch (e) {
        console.error("Error eliminando servicio:", e);
        throw e;
    }
}

// --- SEDES ---
export const agregarSede = async (idMedico, idSede) => {
    try {
        const response = await axiosInstance.post(`/medicos/${idMedico}/sedes/${idSede}`);
        return response.data;
    } catch (e) {
        console.error("Error agregando sede:", e);
        throw e;
    }
}

export const eliminarSede = async (idMedico, idSede) => {
    try {
        const response = await axiosInstance.delete(`/medicos/${idMedico}/sedes/${idSede}`);
        return response.data;
    } catch (e) {
        console.error("Error eliminando sede:", e);
        throw e;
    }
}

// --- DISPONIBILIDADES ---
export const agregarDisponibilidad = async (idMedico, disponibilidadData) => {
    try {
        const response = await axiosInstance.post(`/medicos/${idMedico}/disponibilidades`, disponibilidadData);
        return response.data;
    } catch (e) {
        console.error("Error agregando disponibilidad:", e);
        throw e;
    }
}

export const modificarDisponibilidad = async (idMedico, disponibilidadData) => {
    try {
        const response = await axiosInstance.put(`/medicos/${idMedico}/disponibilidades`, disponibilidadData);
        return response.data;
    } catch (e) {
        console.error("Error modificando disponibilidad:", e);
        throw e;
    }
}

export const eliminarDisponibilidad = async (idMedico, diaSemana) => {
    try {
        const response = await axiosInstance.delete(`/medicos/${idMedico}/disponibilidades`, { data: { diaSemana } });
        return response.data;
    } catch (e) {
        console.error("Error eliminando disponibilidad:", e);
        throw e;
    }
}

export const updateMedico = async (idMedico, medicoData) => {
    try {
        const response = await axiosInstance.put(`/medicos/${idMedico}`, medicoData);
        return response.data;
    } catch (e) {
        console.error("Error actualizando medico:", e);
        throw e;
    }
}
