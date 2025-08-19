import  apiClient  from '../config/axiosConfig';

class TicketService {
  // Book a ticket for a trip
  static async bookTicket(ticketData) {
    try {
      const response = await apiClient.post('/api/tickets/book', ticketData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to book ticket');
    }
  }

  // Get user's tickets
  static async getUserTickets() {
    try {
      const response = await apiClient.get('/api/tickets/my-tickets');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user tickets');
    }
  }

  // Update ticket status
  static async updateTicketStatus(tripId, ticketNumber, statusData) {
    try {
      const response = await apiClient.put(`/api/tickets/${tripId}/${ticketNumber}/status`, statusData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update ticket status');
    }
  }

  // Cancel ticket
  static async cancelTicket(tripId, ticketNumber) {
    try {
      const response = await apiClient.delete(`/api/tickets/${tripId}/${ticketNumber}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel ticket');
    }
  }

  // Get available seats for a trip
  static async getAvailableSeats(tripId) {
    try {
      const response = await apiClient.get(`/api/tickets/${tripId}/available-seats`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch available seats');
    }
  }

  // Get ticket details
  static async getTicketDetails(tripId, ticketNumber) {
    try {
      const response = await apiClient.get(`/api/tickets/${tripId}/${ticketNumber}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch ticket details');
    }
  }

  // Admin: list tickets
  static async listTickets(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/api/tickets${query ? `?${query}` : ''}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tickets');
    }
  }
}

export default TicketService; 