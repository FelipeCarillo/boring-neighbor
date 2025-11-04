export interface Progress {
  id: string;
  construction_id: string;
  user_id: string;
  bim_reference_id: string | null;
  photo_url: string;
  presigned_url?: string;
  notes: string | null;
  deviation_score: number | null;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos populados
  user?: {
    id: string;
    name: string;
    email: string;
  };
  bim_reference?: {
    id: string;
    name: string;
    presigned_url?: string;
  };
  construction?: {
    id: string;
    name: string;
  };
}

export interface ProgressFormData {
  construction_id: string;
  bim_reference_id?: string;
  notes?: string;
  photo: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface ProgressUploadData {
  construction_id: string;
  bim_reference_id?: string;
  notes?: string;
}

