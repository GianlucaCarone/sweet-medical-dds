import axiosInstance from "./axiosInstance.js";

export const getTurnosProximosUsuario = async (idPaciente, paginacion) => {
    try {
        const filtros = {
            estados: ['CONFIRMADO', 'RESERVADO', 'PENDIENTECAMBIO'],
            fechaHoraInicio: new Date(),
            pacienteId: idPaciente,
            ordenPorFecha: 'asc'
        }
        const params = Object.fromEntries(
            Object.entries({ ...filtros, ...paginacion })
                .filter(([_, v]) => v !== null && v !== undefined && v !== "")
        );
        const response = await axiosInstance.get('/turno/mis-turnos', { params });
        return response.data;
    } catch (e) {
        console.error("Error obteniendo el id del paciente con id de usuario: " + idPaciente);
        throw e;
    }
}

export const getHistorialUsuario = async (idPaciente, paginacion) => {
    try {
        const filtros = {
            estados: ['REALIZADO', 'CANCELADO'],
            pacienteId: idPaciente,
            ordenPorFecha: 'asc'
        }
        const params = Object.fromEntries(
            Object.entries({ ...filtros, ...paginacion })
                .filter(([_, v]) => v !== null && v !== undefined && v !== "")
        );
        const response = await axiosInstance.get('/turno/mis-turnos', { params } );
        return response.data;
    } catch(e) {
        console.error("Error obteniendo el historial de turnos del usuario con id: " + idPaciente);
        throw e;
    }
}

export const cancelarTurno = async (idTurno, motivo, idUsuario) => {
    try {
        const response = await axiosInstance.patch('/turno/' + idTurno + '/cambiar-estado', {
            nuevoEstado: 'CANCELADO',
            //TODO: USAR AUTH
            quien: idUsuario,
            motivo: motivo
        });
        return response.data;
    } catch(e) {
        console.error("Error cancelando la reserva del turno: " + idTurno);
        throw e;
    }
}