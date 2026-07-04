import axiosInstance from './axiosInstance';

export const getTurnos = async (params) => {
    // params can contain: page, limit, medicoId, estado, etc.
    const response = await axiosInstance.get('/turno', { params });
    return response.data;
};

export const getMisTurnos = async (params) => {
    // Endpoint para obtener los turnos del usuario autenticado
    const response = await axiosInstance.get('/turno/mis-turnos', { params });
    return response.data;
};

export const cambiarEstadoTurno = async (id, nuevoEstado, quien, motivo = '') => {
    const response = await axiosInstance.patch(`/turno/${id}/cambiar-estado`, {
        nuevoEstado,
        quien,
        motivo
    });
    return response.data;
};

export const solicitarCambioFecha = async (id, nuevaFechaHora, usuarioId) => {
    const response = await axiosInstance.patch(`/turno/${id}/solicitar-cambio-fecha`, {
        nuevaFechaHora,
        usuarioId
    });
    return response.data;
};

export const responderCambioFecha = async (id, aceptado, usuarioId) => {
    const response = await axiosInstance.patch(`/turno/${id}/responder-cambio-fecha`, {
        aceptado,
        usuarioId
    });
    return response.data;
};

export const getContadoresTurnos = async (params) => {
    const response = await axiosInstance.get('/turno/contadores', { params });
    return response.data;
};
