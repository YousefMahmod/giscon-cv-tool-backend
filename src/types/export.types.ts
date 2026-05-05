// Request body type for CV export endpoint
export interface ExportCVRequest {
  template_name: string; // Template name that matches HTML filename (e.g., "classic-serif")
  project_ids: string; // comma-separated project IDs, e.g., "1,2,3"
}

// Data structure for CV export (staff with selected projects)
export interface ExportCVData {
  staff: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    job_title?: string;
    profile_picture?: string;
    bio?: string;
    skills?: string;
  };
  projects: Array<{
    id: number;
    name: string;
    client: string;
    description?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    technologies?: string;
    role: string;
    responsibilities?: string;
  }>;
}

// Type for template rendering functions
export type TemplateRenderer = (data: ExportCVData) => string;
