import { UserRole } from '../utils/constants';

export interface User {
  id: string;
  name: string;
  email: string;
  registro: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

