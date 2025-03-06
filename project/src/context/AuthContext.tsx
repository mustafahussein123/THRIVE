import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Set default headers for all axios requests
        axios.defaults.headers.common['x-auth-token'] = token;
        
        // In a real app, we would verify the token with the backend
        // For now, we'll just simulate a successful auth
        const mockUser = {
          id: 1,
          name: 'Test User',
          email: 'test@example.com'
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setError('Authentication failed. Please log in again.');
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, we would make an API call to login
      // For now, we'll just simulate a successful login
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: 1,
          name: 'Test User',
          email
        }
      };
      
      localStorage.setItem('token', mockResponse.token);
      axios.defaults.headers.common['x-auth-token'] = mockResponse.token;
      
      setUser(mockResponse.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, we would make an API call to register
      // For now, we'll just simulate a successful registration
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: 1,
          name,
          email
        }
      };
      
      localStorage.setItem('token', mockResponse.token);
      axios.defaults.headers.common['x-auth-token'] = mockResponse.token;
      
      setUser(mockResponse.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;