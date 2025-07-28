import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/config/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data } = await apiClient.get('/auth/me'); // الكوكيز ترسل تلقائياً
      setUser(data.user || data); // حسب استجابة السيرفر
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.post('/auth/login', credentials);
      setUser(data.user || data);
      navigate('/profile');
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout'); // ممكن السيرفر يمسح الكوكيز
    } catch (error) {
      // Optionally, handle logout error
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
