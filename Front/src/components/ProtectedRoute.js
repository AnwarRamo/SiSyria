import React from 'react'; // Import React
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../api/stores/auth.store';
import LoadingSpinner from './LodingSpinner'; // Corrected import name LodingSpinner -> LoadingSpinner

const ProtectedRoute = ({ adminOnly = false }) => {
  // Subscribe to specific state slices for performance optimization
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);
  const isAdmin = useAuthStore(state => state.isAdmin); // Use the selector directly

  // Handle loading state first
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // If not loading, check for user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, check admin requirement
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />; // Redirect non-admins trying to access admin routes
  }

  // If user exists and meets admin requirement (if any), render the child route
  return <Outlet />; // Renders the nested route component
};

export default ProtectedRoute;