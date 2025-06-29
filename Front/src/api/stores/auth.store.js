import { create } from 'zustand';
import { AuthService } from '../services/auth.service';
import { TripService } from '../services/trip.service';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,
  savedTrips: [],
  _hasFetchedRegisteredTrips: false,

  _formatUser: (userData) => {
    if (!userData || !userData._id) return null;
    return {
      id: userData._id,
      username: userData.username,
      displayName: userData.displayName || userData.username,
      email: userData.email,
      role: userData.role,
      createdAt: userData.createdAt,
      avatar: userData.avatar,
    };
  },

  _areUsersSameById: (u1, u2) => {
    if (!u1 && !u2) return true;
    if (!u1 || !u2) return false;
    return u1.id === u2.id;
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const userData = await AuthService.login(credentials);
      console.log('🧩 Raw userData from API:', userData);

      const formatted = get()._formatUser(userData);
      console.log('🧩 Formatted user:', formatted);

      if (!get()._areUsersSameById(get().user, formatted)) {
        set({ user: formatted, _hasFetchedRegisteredTrips: false });
      }
      set({ loading: false });
      return formatted;
    } catch (err) {
      console.error('🔴 Login error:', err);
      const msg = err.response?.data?.message || err.message || 'Login failed';
      set({ error: { message: msg }, loading: false, user: null });
      throw new Error(msg);
    }
  },

  register: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const userData = await AuthService.register(credentials);
      const formatted = get()._formatUser(userData);
      if (!get()._areUsersSameById(get().user, formatted)) {
        set({ user: formatted, _hasFetchedRegisteredTrips: false });
      }
      set({ loading: false });
      return formatted;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      set({ error: { message: msg }, loading: false, user: null });
      throw new Error(msg);
    }
  },

  hydrate: async () => {
    if (get().user !== null || get().loading === false) return;
    set({ loading: true, error: null });
    try {
      const userData = await AuthService.getCurrentUser();
      console.log('🌱 Hydration raw:', userData);
      const formatted = get()._formatUser(userData);
      if (!get()._areUsersSameById(get().user, formatted)) {
        set({ user: formatted, _hasFetchedRegisteredTrips: false });
      }
      set({ loading: false });
    } catch (err) {
      console.error('🔴 Hydration error:', err);
      if (get().user !== null) {
        set({ user: null });
      }
      set({ loading: false, error: null });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await AuthService.logout();
      set({ user: null, savedTrips: [], loading: false, _hasFetchedRegisteredTrips: false });
      window.location.href = '/login';
    } catch (err) {
      console.error('🔴 Logout error:', err);
      set({ user: null, savedTrips: [], error: { message: 'Logout failed' }, loading: false });
    }
  },

  fetchRegisteredTrips: async () => {
    const st = get();
    if (!st.user || st._hasFetchedRegisteredTrips) return;
    try {
      const trips = (await TripService.getRegisteredTrips()) || [];
      const changed = trips.length !== st.savedTrips.length ||
        trips.some((t, i) => t._id !== st.savedTrips[i]?._id);
      if (changed) set({ savedTrips: trips });
      set({ _hasFetchedRegisteredTrips: true });
    } catch (err) {
      console.error('🔴 Trips fetch error:', err);
      set({ _hasFetchedRegisteredTrips: true });
    }
  },

  toggleTripRegistration: async (tripId) => {
    const registered = get().savedTrips.some(t => t._id === tripId);
    try {
      if (registered) {
        await TripService.unregisterTrip(tripId);
        set(state => ({ savedTrips: state.savedTrips.filter(t => t._id !== tripId) }));
      } else {
        const newTrip = await TripService.registerTrip(tripId);
        set(state => ({ savedTrips: [...state.savedTrips, newTrip] }));
      }
    } catch (err) {
      console.error('🔴 Toggle trip error:', err);
      throw new Error('Could not update trip registration.');
    }
  },

  isAdmin: () => get().user?.role === 'admin',
}));
