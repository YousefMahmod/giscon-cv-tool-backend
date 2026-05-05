// Template interface matching database schema
export interface Template {
  id: number;
  title: string;
  subtitle?: string;
  img?: string;
  template_name: string;
  version: string;
  created_at: Date;
  updated_at: Date;
}

// Request body types for template endpoints
export interface CreateTemplateDTO {
  title: string;
  subtitle?: string;
  img?: string;
  template_name: string;
  version?: string;
}

export interface UpdateTemplateDTO {
  title?: string;
  subtitle?: string;
  img?: string;
  template_name?: string;
  version?: string;
}
