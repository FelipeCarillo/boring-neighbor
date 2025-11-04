import { User } from './user';

export interface LoginCredentials {
  registro: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (registro: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshUserData: () => Promise<User>;
  hasRole: (roles: string | string[]) => boolean;
  isAdmin: () => boolean;
  isSupervisor: () => boolean;
}

