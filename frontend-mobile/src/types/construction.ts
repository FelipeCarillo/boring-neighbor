import { ConstructionStatus } from '../utils/constants';
import { User } from './user';

export interface Construction {
  id: string;
  name: string;
  description: string | null;
  location: string;
  start_date: string;
  end_date: string | null;
  status: ConstructionStatus;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  assigned_users?: User[];
  bim_references?: BIMReference[];
  
  // BIM/Modelo 3D
  bim_reference_id?: string | null;
  model_3d_file_name?: string | null;
  model_3d_file_type?: string | null;
  model_3d_presigned_url?: string | null;
}

export interface BIMReference {
  id: string;
  construction_id: string;
  name: string;
  file_name: string;
  file_url: string;
  presigned_url?: string;
  created_at: string;
}

export interface ConstructionListItem {
  id: string;
  name: string;
  description: string | null;
  location: string;
  start_date: string;
  status: ConstructionStatus;
  progress_percentage: number;
  assigned_users_count?: number;
}

export interface ConstructionFormData {
  name: string;
  description: string;
  location: string;
  start_date: string;
  end_date?: string;
  status: ConstructionStatus;
}

