export type UserRole = 'ADMMaster' | 'Analista';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyFormData {
  code: string;
}
