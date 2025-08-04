import api from './api';

const ConsultancyService = {
    // Crear una solicitud de consultoría (público, antes del pago)
    createConsultancy: async (consultancyData) => {
        try {
            const response = await api.post('/consultancies', consultancyData); // Endpoint: /alquila-seg/consultancies
            return response.data; // Espera ApiResponse con el ID de la consultoría creada
        } catch (error) {
            console.error('Error al crear consultoría:', error.response?.data || error.message);
            throw error;
        }
    },

    // --- Métodos para el Panel de Administración (Requieren Autenticación y Rol ADMIN) ---

    // Obtener todas las consultorías para el panel de admin
    getAllConsultancies: async () => {
        try {
            const response = await api.get('/consultancies'); // Endpoint: /alquila-seg/consultancies
            return response.data;
        } catch (error) {
            console.error('Error al obtener consultorías para admin:', error.response?.data || error.message);
            throw error;
        }
    },

    // Marcar una consultoría como revisada/resuelta
    markConsultancyAsReviewed: async (id) => {
        try {
            const response = await api.put(`/consultancies/${id}/status?status=RESPONDED`); // Endpoint: /alquila-seg/consultancies/{id}/status
            return response.data;
        } catch (error) {
            console.error(`Error al marcar consultoría ${id} como revisada:`, error.response?.data || error.message);
            throw error;
        }
    },
};

export default ConsultancyService;