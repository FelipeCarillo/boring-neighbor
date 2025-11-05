export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'OPERADOR';

export interface User {
  id: number;
  nome: string;
  registro: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface Construction {
  id: number;
  name: string;
  description?: string;
  location?: string;
  status: string;
  progress_percentage?: number;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  assigned_users?: User[];
  bim_references?: BIMReference[];
  model_3d_presigned_url?: string;
  model_3d_file_name?: string;
  model_3d_file_size?: number;
  model_3d_file_type?: string;
}

export interface BIMReference {
  id: number;
  construction_id: number;
  file_name?: string;
  s3_key?: string;
  presigned_url?: string;
  description?: string;
  created_at?: string;
}

export interface Progress {
  id: number;
  construction_id: number;
  construction?: Construction;
  bim_reference_id?: string;
  bim_reference?: BIMReference;
  s3_photo_key?: string;
  presigned_url?: string;
  registered_by?: string;
  notes?: string;
  deviation_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PhotoUpload {
  uri: string;
  type: string;
  name: string;
}

