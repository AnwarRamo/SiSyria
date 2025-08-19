import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Verify token with backend
        const response = await authAPI.getProfile();
        setUser(response.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await AsyncStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      const { token, user } = response;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      await AsyncStorage.setItem('token', token);
      setUser(user);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (error.response?.status === 400) {
        throw new Error('Please fill in all required fields correctly.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Login failed. Please check your internet connection and try again.');
      }
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData);
      
      const { token, user, needsLogin } = response;
      
      if (needsLogin) {
        // If registration didn't return a token, we need to login
        console.log('Registration successful but no token, attempting login...');
        const loginResponse = await authAPI.login(userData.email, userData.password);
        const { token: loginToken, user: loginUser } = loginResponse;
        
        if (!loginToken) {
          throw new Error('Login after registration failed - no token received');
        }
        
        await AsyncStorage.setItem('token', loginToken);
        setUser(loginUser);
      } else if (token) {
        await AsyncStorage.setItem('token', token);
        setUser(user);
      } else {
        throw new Error('No token received from server');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await AsyncStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateProfile = async (userData: any) => {
    try {
      const response = await authAPI.updateProfile(userData);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 