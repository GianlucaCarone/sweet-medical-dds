import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
    headers: {
        "Content-Type": "application/json"
    },
    // withCredentials: true es ESENCIAL para que el browser envíe y reciba
    // las cookies HttpOnly automáticamente en requests cross-origin.
    // Sin esto, las cookies nunca viajan entre frontend y backend.
    withCredentials: true,
    // Serializa los arrays como claves repetidas (estados=A&estados=B) en vez de
    // usar corchetes (estados[]=A). Así el query parser del backend los recibe
    // bajo la clave "estados" y no "estados[]".
    paramsSerializer: { indexes: null },
});

// Interceptor de respuesta: normaliza los errores del backend.
// Extrae el mensaje legible del cuerpo de la respuesta (error.response.data.message)
// y lo pone en error.message, para que cualquier catch en la app pueda usar
// error.message directamente sin repetir la lógica de extracción.
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const mensajeBackend = error.response?.data?.message;
        if (mensajeBackend) {
            error.message = mensajeBackend;
        }

        if (error.response?.status === 403) {
            window.location.href = "/403";
        }

        if (error.response?.status >= 500) {
            window.location.href = "/500";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;