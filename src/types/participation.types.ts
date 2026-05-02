// Request body types for participation endpoints
export interface ParticipationCreateRequest {
  staff_id: number;
  staff_name: string;
  project_id: number;
  project_name: string;
  role: string;
  responsibilities?: string;
}

export interface ParticipationUpdateRequest {
  staff_id: number;
  project_id: number;
  role?: string;
  responsibilities?: string;
}
