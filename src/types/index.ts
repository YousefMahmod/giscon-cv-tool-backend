// Staff Types
export interface Staff {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profile_picture?: string;
  bio?: string;
  skills?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateStaffDTO {
  name: string;
  email: string;
  phone?: string;
  profile_picture?: string;
  bio?: string;
  skills?: string;
}

export interface UpdateStaffDTO {
  name?: string;
  email?: string;
  phone?: string;
  profile_picture?: string;
  bio?: string;
  skills?: string;
}

// Project Types
export interface Project {
  id: number;
  name: string;
  client: string;
  location?: string;
  start_date?: Date;
  end_date?: Date;
  technologies?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProjectDTO {
  name: string;
  client: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  technologies?: string;
}

export interface UpdateProjectDTO {
  name?: string;
  client?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  technologies?: string;
}

// Participation Types
export interface Participation {
  id: number;
  staff_id: number;
  staff_name: string;
  project_id: number;
  project_name: string;
  role: string;
  responsibilities?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateParticipationDTO {
  staff_id: number;
  staff_name: string;
  project_id: number;
  project_name: string;
  role: string;
  responsibilities?: string;
}

export interface UpdateParticipationDTO {
  role?: string;
  responsibilities?: string;
}

// Combined Types for detailed responses
export interface StaffWithProjects extends Staff {
  projects?: Array<{
    project_id: number;
    project_name: string;
    client: string;
    role: string;
    responsibilities?: string;
  }>;
}
