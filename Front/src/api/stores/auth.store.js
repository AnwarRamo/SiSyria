// src/api/stores/auth.store.js
import { create } from 'zustand';
import { AuthService } from '../services/auth.service';
import { TripService } from '../services/trip.service';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true, // IMPORTANT: true initially, set to false ONLY after hydration attempt
  error: null,
  savedTrips: [],
  _hasFetchedRegisteredTrips: false, // Flag to prevent re-fetching

  // Helper to format user data consistently
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

  // Helper to compare user objects deeply (by ID for efficiency)
  _areUsersSameById: (user1, user2) => {
    if (!user1 && !user2) return true; // Both null/undefined, consider equal
    if (!user1 || !user2) return false; // One is null/undefined, the other isn't
    return user1.id === user2.id;
  },

  login: async (credentials) => {
    set({ loading: true, error: null }); // Use 'loading' for auth specific operations too
    try {
      const userData = await AuthService.login(credentials);
      const newFormattedUser = get()._formatUser(userData);
      const currentUser = get().user;

      // Only update user if it's genuinely different to prevent extra renders
      if (!get()._areUsersSameById(currentUser, newFormattedUser)) {
        set({ user: newFormattedUser, _hasFetchedRegisteredTrips: false }); // Reset flag on *new* user login
      }
      set({ loading: false }); // Finished login loading
      return newFormattedUser; // Return the new user object
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: { message: errorMessage }, loading: false, user: null });
      throw new Error(errorMessage);
    }
  },

  register: async (credentials) => {
    set({ loading: true, error: null }); // Use 'loading' for auth specific operations too
    try {
      const userData = await AuthService.register(credentials);
      const newFormattedUser = get()._formatUser(userData);
      const currentUser = get().user;

      if (!get()._areUsersSameById(currentUser, newFormattedUser)) {
        set({ user: newFormattedUser, _hasFetchedRegisteredTrips: false }); // Reset flag on *new* user register
      }
      set({ loading: false }); // Finished registration loading
      return newFormattedUser; // Return the new user object
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: { message: errorMessage }, loading: false, user: null });
      throw new Error(errorMessage);
    }
  },

  // MODIFIED HYDRATE FUNCTION
  hydrate: async () => {
    // Check if hydration has already been attempted or if user is already set.
    // get().loading being true at this point (after initial state) means hydration is in progress.
    if (get().user !== null || get().loading === false) {
      // If user is already set, or if loading is false (meaning hydration already completed)
      // then we don't need to hydrate again.
      return;
    }

    // Set loading to true ONLY if it's the very first time hydrate is called and user is null
    set({ loading: true, error: null });

    try {
      const { user: userData } = await AuthService.getCurrentUser();
      const newFormattedUser = get()._formatUser(userData);
      const currentUser = get().user;

      if (!get()._areUsersSameById(currentUser, newFormattedUser)) {
         set({ user: newFormattedUser, _hasFetchedRegisteredTrips: false });
      } else if (newFormattedUser === null && currentUser !== null) {
        // If API says no user, but store still has one, clear it
        set({ user: null, _hasFetchedRegisteredTrips: false }); // Clear _hasFetchedRegisteredTrips as well
      }

      set({ loading: false, error: null }); // Hydration complete (success or no user)

    } catch (error) {
      console.error('Hydration error:', error);
      // On error, ensure user is null (if not already) and set loading to false
      if (get().user !== null) {
        set({ user: null });
      }
      set({ loading: false, error: null });
    }
  },

  logout: async () => {
    set({ loading: true, error: null }); // Set loading for the logout operation
    try {
      await AuthService.logout();
      // On logout, explicitly clear user and reset flag
      set({ user: null, savedTrips: [], loading: false, _hasFetchedRegisteredTrips: false });
      window.location.href = '/login'; // Redirect after state update
    } catch (error) {
      console.error('Logout failed:', error);
      set({ user: null, savedTrips: [], error: { message: 'Logout failed' }, loading: false });
    }
  },

  fetchRegisteredTrips: async () => {
    const currentState = get();
    // Only fetch if user exists AND we haven't fetched them yet in this session
    // This ensures it only runs once per authenticated session
    if (!currentState.user || currentState._hasFetchedRegisteredTrips) {
      return;
    }

    try {
      const trips = await TripService.getRegisteredTrips() || [];
      // Only update savedTrips if they actually changed (deep compare for content)
      const currentSavedTrips = currentState.savedTrips;
      const tripsChanged =
        trips.length !== currentSavedTrips.length ||
        trips.some((t, i) => t._id !== currentSavedTrips[i]?._id);

      if (tripsChanged) {
        set({ savedTrips: trips });
      }
      set({ _hasFetchedRegisteredTrips: true }); // Always set flag to true after successful attempt to prevent refetch
    } catch (error) {
      console.error("Failed to fetch registered trips:", error);
      // You might consider resetting _hasFetchedRegisteredTrips to false here
      // if you want to retry fetching registered trips on subsequent renders after an error.
      // For now, leaving it true to prioritize stopping the loop.
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