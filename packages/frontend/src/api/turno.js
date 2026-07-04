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

export const cambiarEstadoTurno = async (id, nuevoEstado, motivo = '') => {
    const response = await axiosInstance.patch(`/turno/${id}/cambiar-estado`, {
        nuevoEstado,
        motivo
    });
    return response.data;
};

export const solicitarCambioFecha = async (id, nuevaFechaHora) => {
    const response = await axiosInstance.patch(`/turno/${id}/solicitar-cambio-fecha`, {
        nuevaFechaHora
    });
    return response.data;
};

export const responderCambioFecha = async (id, aceptado) => {
    const response = await axiosInstance.patch(`/turno/${id}/responder-cambio-fecha`, {
        aceptado
    });
    return response.data;
};

export const getContadoresTurnos = async () => {
    const response = await axiosInstance.get('/turno/contadores');
    return response.data;
};
