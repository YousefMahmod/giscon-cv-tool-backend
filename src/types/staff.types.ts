// Request body types for staff endpoints
export interface StaffCreateRequest {
  name: string;
  email: string;
  phone?: string;
  job_title?: string;
  bio?: string;
  skills?: string;
  // profile_picture comes from multer file upload
}

export interface StaffUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  job_title?: string;
  bio?: string;
  skills?: string;
  // profile_picture comes from multer file upload
}
