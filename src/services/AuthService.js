import api from "./api"; // Importa la instancia de Axios configurada
import {jwtDecode} from "jwt-decode";

const AuthService = {
  // Función para iniciar sesión
  login: async (username, password) => {
    try {
      // Realiza una petición POST al endpoint de login
      const response = await api.post("/auth/login", { username, password });
      // El backend responde con ApiResponse<{token, id, username, role}>
      if (response.data && response.data.data && response.data.data.token) {
        localStorage.setItem("jwtToken", response.data.data.token);
        // Decodifica el token para obtener el rol real
        const decoded = jwtDecode(response.data.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.data.id,
            username: response.data.data.username,
            role: decoded.role || response.data.data.role || "ADMIN",
          })
        );
      }
      return response.data; // Devuelve la respuesta completa del backend
    } catch (error) {
      console.error(
        "Error durante el login:",
        error.response?.data || error.message
      );
      throw error; // Re-lanza el error para ser manejado por el componente de login
    }
  },

  // Función para registrar un nuevo usuario (si lo implementas)
  register: async (username, password) => {
    try {
      // Realiza una petición POST al endpoint de registro
      const response = await api.post("/auth/register", { username, password }); // Ajusta el endpoint si es diferente
      return response.data;
    } catch (error) {
      console.error(
        "Error durante el registro:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Función para cerrar sesión
  logout: () => {
    localStorage.removeItem("jwtToken"); // Elimina el token JWT
    localStorage.removeItem("user");
  },

  // Función para verificar si hay un usuario logueado (basado en la existencia del token)
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default AuthService;
