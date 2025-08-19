import apiClient from '../config/axiosConfig';

export const EventService = {
  getEventTypes: async () => {
    const { data } = await apiClient.get('/api/events/types');
    return data;
  },
  getOrganized: async () => {
    const { data } = await apiClient.get('/api/events/organized');
    return data.events;
  },
  bookEvent: async (payload) => {
    const { data } = await apiClient.post('/api/events/book', payload);
    return data.booking;
  },
  listBookings: async () => {
    const { data } = await apiClient.get('/api/events/bookings');
    return data.items;
  },
  myBookings: async () => {
    const { data } = await apiClient.get('/api/events/my-bookings');
    return data.items;
  },
};

export default EventService;



