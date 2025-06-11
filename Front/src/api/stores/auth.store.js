// src/stores/auth.store.js
import { create } from 'zustand';
import { AuthService } from '../services/auth.service';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true, // Start with loading: true to indicate initial hydration is pending
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
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, loading: false, user: null });
      throw new Error(errorMessage);
    }
  },

  hydrate: async () => {
    // Prevent re-hydration if a user is already loaded
    if (get().user) {
        set({ loading: false });
        return;
    }

    // Ensure we don't have a tokenless hydration attempt causing flashes
    if (!localStorage.getItem('accessToken')) {
        set({ user: null, loading: false, error: null });
        return;
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
      // This catch is critical for new users or expired sessions
      set({ user: null, loading: false, error: null });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await AuthService.logout();
      set({ user: null, loading: false });
      // In a real app, you would use React Router's navigate function here
      // For this example, we'll use window.location
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      set({
        user: null, // Still log the user out on the frontend
        error: { code: 'LOGOUT_ERROR', message: 'Logout failed on server' },
        loading: false,
      });
    }
  },
  
  savedTrips: [],
  addTripToProfile: (trip) => {
    const currentTrips = get().savedTrips || [];
    if (currentTrips.some(t => t.id === trip.id)) return;
    set({ savedTrips: [...currentTrips, trip] });
  },

  isAdmin: () => get().user?.role === 'admin',
}));