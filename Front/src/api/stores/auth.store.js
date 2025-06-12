import { create } from 'zustand';
import { AuthService } from '../services/auth.service';
import { TripService } from '../services/trip.service';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,
  savedTrips: [],

  login: async (credentials) => {
    try {
      set({ loading: true, error: null });
      const userData = await AuthService.login(credentials);

      const formattedUser = {
        id: userData._id,
        username: userData.username,
        displayName: userData.displayName || userData.username,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt,
        avatar: userData.avatar,
      };

      set({ user: formattedUser, loading: false });
      return formattedUser;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: { message: errorMessage }, loading: false, user: null });
      throw new Error(errorMessage);
    }
  },

  register: async (credentials) => {
    try {
      set({ loading: true, error: null });
      const userData = await AuthService.register(credentials);
      const formattedUser = {
        id: userData._id,
        username: userData.username,
        displayName: userData.displayName || userData.username,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt,
        avatar: userData.avatar,
      };
      set({ user: formattedUser, loading: false });
      return formattedUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: { message: errorMessage }, loading: false, user: null });
      throw new Error(errorMessage);
    }
  },

  hydrate: async () => {
    if (get().user) {
      set({ loading: false });
      return;
    }
    if (!localStorage.getItem('accessToken')) {
      set({ user: null, loading: false, error: null });
      return;
    }
    try {
      const { user: userData } = await AuthService.getCurrentUser();
      if (userData?._id) {
        const formattedUser = { /* ...user formatting... */ };
        set({ user: formattedUser, loading: false, error: null });
      } else {
        set({ user: null, loading: false, error: null });
      }
    } catch (error) {
      console.error('Hydration error:', error);
      set({ user: null, loading: false, error: null });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await AuthService.logout();
      set({ user: null, savedTrips: [], loading: false });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      set({ user: null, savedTrips: [], error: { message: 'Logout failed' }, loading: false });
    }
  },

  fetchRegisteredTrips: async (force = false) => {
    // BUG FIX: Add a check to ensure a user is logged in before fetching.
    if (!get().user) {
      return;
    }
    if (!force && get().savedTrips.length > 0) {
      return;
    }
    try {
      const trips = await TripService.getRegisteredTrips();
      set({ savedTrips: trips || [] });
    } catch (error) {
      console.error("Failed to fetch registered trips:", error);
    }
  },

  toggleTripRegistration: async (tripId) => {
    const isRegistered = get().savedTrips.some(trip => trip._id === tripId);
    try {
      if (isRegistered) {
        await TripService.unregisterTrip(tripId);
        set(state => ({
          savedTrips: state.savedTrips.filter(trip => trip._id !== tripId)
        }));
      } else {
        const registeredTrip = await TripService.registerTrip(tripId);
        set(state => ({
          savedTrips: [...state.savedTrips, registeredTrip]
        }));
      }
    } catch (error) {
      console.error('Failed to toggle trip registration:', error);
      throw new Error('Could not update trip registration.');
    }
  },

  isAdmin: () => get().user?.role === 'admin',
}));
