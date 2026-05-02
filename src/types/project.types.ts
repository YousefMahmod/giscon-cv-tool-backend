// Request body types for project endpoints
export interface ProjectCreateRequest {
  name: string;
  client: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  technologies?: string;
}

export interface ProjectUpdateRequest {
  name?: string;
  client?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  technologies?: string;
}
