import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/axios';

interface User {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: { user: User }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/api/auth/verify');
      if (response.data.isValid && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (userData: { user: User }) => {
    setUser(userData.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading) {
    return <div></div>; 
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the context separately for cases where direct access is needed
export { AuthContext }; 