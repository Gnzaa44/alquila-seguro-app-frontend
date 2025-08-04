import api from './api';

const PaymentsService = {
    // Solicitar al backend la creación de una preferencia de pago para una reserva
    createReservationPreference: async (reservationId) => {
        try {
            // Tu backend llamará a la API de Mercado Pago y devolverá el init_point
            const response = await api.post(`/payments/reservations/${reservationId}/create-preference`); // Endpoint: /alquila-seg/payments/reservations/{reservationId}/create-preference
            return response.data; // Espera ApiResponse<String> con la URL de init_point
        } catch (error) {
            console.error('Error al crear preferencia de pago para reserva:', error.response?.data || error.message);
            throw error;
        }
    },

    // Solicitar al backend la creación de una preferencia de pago para una consultoría
    createConsultancyPreference: async (consultancyId) => {
        try {
            const response = await api.post(`/payments/consultancies/${consultancyId}/create-preference`); // Endpoint: /alquila-seg/payments/consultancies/{consultancyId}/create-preference
            return response.data; // Espera ApiResponse<String> con la URL de init_point
        } catch (error) {
            console.error('Error al crear preferencia de pago para consultoría:', error.response?.data || error.message);
            throw error;
        }
    },

};

export default PaymentsService;