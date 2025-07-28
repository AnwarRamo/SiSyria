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
    if (!userData) {
      return null;
    }
    
    if (!userData._id) {
      return null;
    }
    
    const formatted = {
      id: userData._id,
      username: userData.username,
      displayName: userData.displayName || userData.username,
      email: userData.email,
      role: userData.role,
      createdAt: userData.createdAt,
      avatar: userData.avatar,
    };
    
    return formatted;
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await AuthService.login(credentials);

      // ✅ نأخذ المستخدم مباشرة من data
      const user = response.data;
      if (!user) throw new Error("User data not found in response");

      const formatted = get()._formatUser(user);

      set({ 
        user: formatted,
        _hasFetchedRegisteredTrips: false 
      });

      return formatted;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      set({ error: { message: msg }, loading: false });
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  register: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await AuthService.register(credentials);
      // Handle both response formats: { user: userData } and direct userData
      const userData = response.data?.user || response.data;
      const formatted = get()._formatUser(userData);
      
      if (!formatted) {
        throw new Error('Failed to format user data after registration');
      }
      
      set({ 
        user: formatted,
        _hasFetchedRegisteredTrips: false 
      });
      
      return formatted;
    } catch (err) {
      
      let msg = 'Registration failed';
      
      if (err.response?.status === 409) {
        msg = err.response?.data?.message || 'Username or email already exists. Please choose different credentials.';
      } else if (err.response?.data?.code === 'USER_EXISTS') {
        msg = 'Username or email already exists. Please choose different credentials.';
      } else if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        // Handle validation errors
        const firstError = err.response.data.errors[0];
        msg = firstError.msg || 'Please check your input and try again.';
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      }
      
      set({ error: { message: msg }, loading: false });
      throw err; // Throw the original error to preserve response data
    } finally {
      set({ loading: false });
    }
  },

  hydrate: async () => {
    // Skip if already hydrated
    if (!get().loading && get().user !== null) return;
    
    console.log('🔄 Starting hydration...');
    set({ loading: true, error: null });
    
    try {
      console.log('📡 Calling getCurrentUser...');
      const userData = await AuthService.getCurrentUser();
      console.log('📡 getCurrentUser response:', userData);
      
      if (userData === null) {
        console.log('👤 No user found, setting user to null');
        set({ user: null, loading: false });
      } else {
        // Handle both response formats: { user: {...}, stats: {...} } and direct userData
        const actualUserData = userData.data?.user || userData.data || userData;
        console.log('👤 User data found:', actualUserData);
        const formatted = get()._formatUser(actualUserData);
        console.log('👤 Formatted user:', formatted);
        set({ user: formatted, loading: false });
      }
    } catch (err) {
      console.error('❌ Hydration error:', err);
      // Only set error for unexpected errors
      if (!err.response || err.response.status !== 401) {
        set({ error: { message: 'Failed to load user data' }, loading: false });
      } else {
        // For 401, just set loading to false
        set({ loading: false });
      }
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await AuthService.logout();
    } catch (err) {
      // Ignore logout errors
    } finally {
      set({ 
        user: null,
        savedTrips: [], 
        _hasFetchedRegisteredTrips: false 
      });
      // Redirect without reloading the entire app
      window.location.href = '/login';
    }
  },

  fetchRegisteredTrips: async () => {
    const st = get();
    if (!st.user || st._hasFetchedRegisteredTrips) return;
    
    try {
      const trips = (await TripService.getRegisteredTrips()) || [];
      set({ savedTrips: trips, _hasFetchedRegisteredTrips: true });
    } catch (err) {
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
      throw new Error('Could not update trip registration.');
    }
  },

  isAdmin: () => get().user?.role === 'admin',
  isLoggedIn: () => !!get().user,
}));