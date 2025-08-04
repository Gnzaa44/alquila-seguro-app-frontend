import api from "./api";

const ReservationsService = {
  // Crear una pre-reserva (público, antes del pago)
  createReservation: async (reservationData) => {
    try {
      // Asegúrate de que reservationData contenga propertyId, startDate, endDate, y datos del cliente
      const response = await api.post("/reservations", reservationData); // Endpoint: /alquila-seg/reservations
      return response.data; // Espera ApiResponse con el ID de la reserva creada
    } catch (error) {
      console.error(
        "Error al crear la pre-reserva:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // --- Métodos para el Panel de Administración (Requieren Autenticación y Rol ADMIN) ---

  // Obtener todas las reservas para el panel de admin
  getAllReservations: async () => {
    try {
      const response = await api.get("/reservations"); // Endpoint: /alquila-seg/reservations
      return response.data;
    } catch (error) {
      console.error(
        "Error al obtener reservas para admin:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  // Obtener una reserva específica por ID de propiedad.

  getReservationsByPropertyId: async (id) => {
    try {
      const response = await api.get(`/reservations/property/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error al obtener reservas por propiedad:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Confirmar una reserva
  confirmReservation: async (id) => {
    try {
      const response = await api.put(`/reservations/${id}/confirm`); // Endpoint: /alquila-seg/reservations/{id}/confirm
      return response.data;
    } catch (error) {
      console.error(
        `Error al confirmar reserva con ID ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cancelar una reserva
  cancelReservation: async (id) => {
    try {
      const response = await api.put(`/reservations/${id}/cancel`); // Endpoint: /alquila-seg/reservations/{id}/cancel
      return response.data;
    } catch (error) {
      console.error(
        `Error al cancelar reserva con ID ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
  completeReservation: async (id) => {
    try {
      const response = await api.put(`/reservations/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error(
        `Error al completar reserva ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default ReservationsService;
