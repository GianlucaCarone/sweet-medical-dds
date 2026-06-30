import axiosInstance from './axiosInstance.js';

export const getPacienteByIdUsuario = async (idUsuario) => {
    try {
        const response = await axiosInstance.get('/pacientes/${idUsuario}');
        return response.data;
    } catch (e) {
        console.error("Error obteniendo el id del paciente con id de usuario: " + idUsuario);
        throw e;
    }
}

export const getTurnosDisponiblesFiltradoPaginado = async (filtros, paginacion) => {
    try {
        const params = Object.fromEntries(
            Object.entries({ ...filtros, ...paginacion })
                .filter(([_, v]) => v !== null && v !== undefined && v !== "")
        );

        const response = await axiosInstance.get('/turno', { params });
        return response.data;
    } catch (e) {
        console.error("Error obteniendo los turnos");
        throw e;
    }
}

export const getListadoMedicos = async () => {
    try {
        const response = await axiosInstance.get('/medicos');
        return response.data;
    } catch (e) {
        console.error("Error obteniendo los medicos");
        throw e;
    }
}

export const getListadoServicios = async () => {
    try {
        const response = await axiosInstance.get('/servicios');
        return response.data;
    } catch (e) {
        console.error("Error obteniendo las especialidades");
        throw e;
    }
}

export const getListadoSedes = async () => {
    try {
        const response = await axiosInstance.get('/sedes');
        return response.data;
    } catch (e) {
        console.error("Error obteniendo las sedes");
        throw e;
    }
}

export const reservarTurno = async (turnoId, pacienteId, costo) => {
    try {
        const response = await axiosInstance.post('/turnos/${turnoId}', {
            body: {
                'pacienteId': pacienteId,
                'costo': costo
            }
        });
        return response.data;
    } catch (e) {
        console.error("Error reservando el turno de id: " + turnoId);
        throw e;
    }
}

export const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'user@example.com' && password === 'password') {
          resolve({ user: { id: 1, email: email }, token: 'mock-jwt-token' });
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  }; 