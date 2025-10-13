import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { authApi } from '../api/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const token = authApi.getToken();
    if (token) {
      // Verify token by fetching user info
      authApi.getMe()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          // Token is invalid, clear it
          authApi.logout();
        });
    }
  }, []);

  const login = async (rg: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authApi.login(rg, password);
      
      // Store token
      authApi.setToken(response.access_token);
      
      // Fetch user info
      const userData = await authApi.getMe();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authApi.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
