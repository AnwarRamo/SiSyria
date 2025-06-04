import { create } from 'zustand';
import { AuthService } from '../services/auth.service';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

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
      set({ error, loading: false, user: null });
      throw error;
    }
  },

  hydrate: async () => {
    if (get().user || !get().loading) {
      if (!get().user) set({ loading: true });
      else return;
    }

    try {
      const userData = await AuthService.getCurrentUser();
      const user = userData?.user;

      if (user?._id) {
        const formattedUser = {
          id: user._id,
          username: user.username,
          displayName: user.displayName || user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          avatar: user.avatar,
        };

        set({ user: formattedUser, loading: false, error: null });
      } else {
        set({ user: null, loading: false, error: null });
      }
    } catch (error) {
      console.error('Hydration error:', error);
      set({
        user: null,
        loading: false,
        error: { code: 'HYDRATE_ERROR', message: 'Failed to check session' },
      });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await AuthService.logout();
      set({ user: null, loading: false });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      set({
        user: null,
        error: { code: 'LOGOUT_ERROR', message: error.message || 'Logout failed' },
        loading: false,
      });
    }
  },
  savedTrips: [],
addTripToProfile: (trip) => {
  const currentTrips = get().savedTrips || [];
  // Prevent duplicates
  if (currentTrips.some(t => t.id === trip.id)) return;
  set({ savedTrips: [...currentTrips, trip] });
},

  isAdmin: () => get().user?.role === 'admin',
}));
