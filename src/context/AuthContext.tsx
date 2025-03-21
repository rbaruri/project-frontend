import { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { api } from '@/api/axios';
import { User } from '@/containers/Login/loginConstants';
import { RootState } from '@/redux/store';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get auth update action from Redux store
  const authUpdateAction = useSelector((state: RootState) => state.login.authUpdateAction);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verify session using cookies
        const response = await api.get('/api/auth/verify');
        if (response.data.isValid && response.data.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verifying auth:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle Redux auth updates
  useEffect(() => {
    if (authUpdateAction?.type === 'login/UPDATE_AUTH_CONTEXT') {
      login(authUpdateAction.payload);
    } else if (authUpdateAction?.type === 'login/LOGOUT') {
      logout();
    }
  }, [authUpdateAction]);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 