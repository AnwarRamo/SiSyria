// components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { useNavigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : null;
};