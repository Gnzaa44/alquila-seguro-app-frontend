import api from './api'; // Importa la instancia de Axios configurada

const PropertiesService = {
    // Obtener todas las propiedades disponibles (público)
    getAllProperties: async () => {
        try {
            const response = await api.get('/properties'); // Endpoint: /alquila-seg/properties
            return response.data; // Espera un formato { success: true, message: "...", data: [...] }
        } catch (error) {
            console.error('Error al obtener todas las propiedades:', error.response?.data || error.message);
            throw error;
        }
    },

    // Obtener una propiedad específica por ID (público)
    getPropertyById: async (id) => {
        try {
            const response = await api.get(`/properties/${id}`); // Endpoint: /alquila-seg/properties/{id}
            return response.data;
        } catch (error) {
            console.error(`Error al obtener propiedad con ID ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // --- Métodos para el Panel de Administración (Requieren Autenticación y Rol ADMIN) ---

    // Crear una nueva propiedad
    createProperty: async (propertyData) => {
        try {
            // El interceptor de api.js añadirá el JWT automáticamente
            const response = await api.post('/properties', propertyData); // Endpoint: /alquila-seg/properties
            return response.data;
        } catch (error) {
            console.error('Error al crear propiedad:', error.response?.data || error.message);
            throw error;
        }
    },

    // Actualizar una propiedad existente
    updateProperty: async (id, propertyData) => {
        try {
            const response = await api.put(`/properties/${id}`, propertyData); // Endpoint: /alquila-seg/properties/{id}
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar propiedad con ID ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Eliminar una propiedad
    deleteProperty: async (id) => {
        try {
            const response = await api.delete(`/properties/${id}`); // Endpoint: /alquila-seg/properties/{id}
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar propiedad con ID ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },
};

export default PropertiesService;