import axiosInstance from "./axiosInstance.js";

export const getTurnosUsuario = async (idUsuario) => {
    try {
        const response = await axiosInstance.get('/turno/mis-turnos', { params: { idUsuario } });
        console.log("response: " + JSON.stringify(response));
        return response.data;
    } catch (e) {
        console.error("Error obteniendo el id del paciente con id de usuario: " + idUsuario);
        throw e;
    }
}

export const getHistorialUsuario = async (idUsuario, paginacion) => {
    try {
        const response = await axiosInstance.get('/turno/historial', { params: { idUsuario, ...paginacion } } )
        console.log("response: " + JSON.stringify(response));
        return response.data;
    }catch(e){
        console.error("Error obteniendo el historial de turnos del usuario con id: " + idUsuario);
        throw e;
    }
}