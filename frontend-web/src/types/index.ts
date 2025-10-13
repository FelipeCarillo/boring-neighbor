export type UserRole = 'admin' | 'supervisor' | 'worker' | 'viewer';

export interface User {
  id: string;
  rg: string;
  name: string;
  email?: string;
  role: UserRole;
  is_active: boolean;
}

export interface Obra {
  id: string;
  nome: string;
  descricao: string;
  endereco: string;
  status: 'Em Andamento' | 'Concluída' | 'Pausada' | 'Cancelada';
  dataInicio: Date;
  dataFim?: Date;
  modeloBIM?: string;
  analistas: string[]; // IDs dos analistas
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalistaObra {
  id: string;
  analistaId: string;
  obraId: string;
  permissoes: string[];
  dataInicio: Date;
  dataFim?: Date;
  status: 'Ativo' | 'Inativo';
}

export interface AuthContextType {
  user: User | null;
  login: (rg: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface LoginFormData {
  rg: string;
  password: string;
}

export interface SignupFormData {
  rg: string;
  name: string;
  email?: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyFormData {
  code: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
