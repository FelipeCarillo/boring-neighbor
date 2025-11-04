import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService } from '../services/auth';
import { saveAuthTokens, clearAuthTokens, saveUser, getUser } from '../utils/storage';
import { User } from '../types/user';
import { AuthContextType } from '../types/auth';
import { USER_ROLES } from '../utils/constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Carrega usuário do storage ao iniciar o app
   */
  const loadUserFromStorage = useCallback(async () => {
    try {
      const storedUser = await getUser<User>();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  /**
   * Faz login do usuário
   */
  const login = async (
    registro: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const data = await authService.login(registro, password);

      // Salva tokens e usuário
      await saveAuthTokens(data.access_token, data.refresh_token);
      await saveUser(data.user);

      setUser(data.user);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erro ao fazer login',
      };
    }
  };

  /**
   * Faz logout do usuário
   */
  const logout = useCallback(async () => {
    try {
      await clearAuthTokens();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  /**
   * Atualiza os dados do usuário
   */
  const updateUser = useCallback(async (updatedUser: User) => {
    setUser(updatedUser);
    await saveUser(updatedUser);
  }, []);

  /**
   * Recarrega os dados do usuário do backend
   */
  const refreshUserData = async (): Promise<User> => {
    try {
      const userData = await authService.getMe();
      await updateUser(userData);
      return userData;
    } catch (error: any) {
      console.error('Error refreshing user data:', error);
      if (error.response?.status === 401) {
        await logout();
      }
      throw error;
    }
  };

  /**
   * Verifica se o usuário possui uma determinada role
   */
  const hasRole = useCallback(
    (roles: string | string[]): boolean => {
      if (!user) return false;
      if (Array.isArray(roles)) {
        return roles.includes(user.role);
      }
      return user.role === roles;
    },
    [user]
  );

  /**
   * Verifica se é admin
   */
  const isAdmin = useCallback((): boolean => {
    return hasRole(USER_ROLES.ADMIN);
  }, [hasRole]);

  /**
   * Verifica se é supervisor ou admin
   */
  const isSupervisor = useCallback((): boolean => {
    return hasRole([USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR]);
  }, [hasRole]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    refreshUserData,
    hasRole,
    isAdmin,
    isSupervisor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para usar o AuthContext
 */
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

