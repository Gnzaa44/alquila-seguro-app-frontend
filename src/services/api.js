import axios from 'axios';

// La URL base de la API, obtenida de las variables de entorno.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Crea una instancia de Axios con la URL base
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de solicitudes: añade el token JWT a todas las peticiones si está disponible
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken'); // Recupera el token JWT del almacenamiento local
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Si existe, añade la cabecera de autorización
        }
        return config; // Retorna la configuración de la solicitud modificada
    },
    (error) => {
        return Promise.reject(error); // Maneja cualquier error en la configuración de la solicitud
    }
);

// Interceptor de respuestas: maneja errores de autenticación (401/403)
api.interceptors.response.use(
    (response) => response, // Si la respuesta es exitosa, la devuelve sin cambios
    (error) => {
        // Si el error es 401 (No autorizado) o 403 (Prohibido)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error('Acceso no autorizado o token expirado. Redirigiendo a login...');
            localStorage.removeItem('jwtToken'); // Elimina el token inválido
        }
        return Promise.reject(error); // Re-lanza el error para que sea capturado por el componente que hizo la llamada
    }
);

export default api; // Exporta la instancia de Axios configurada