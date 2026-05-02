import type {
  CreateStaffDTO,
  UpdateStaffDTO,
  CreateProjectDTO,
  UpdateProjectDTO,
  CreateParticipationDTO,
  UpdateParticipationDTO,
} from "../types/index.js";
import type {
  StaffCreateRequest,
  StaffUpdateRequest,
} from "../types/staff.types.js";
import type {
  ProjectCreateRequest,
  ProjectUpdateRequest,
} from "../types/project.types.js";
import type {
  ParticipationCreateRequest,
  ParticipationUpdateRequest,
} from "../types/participation.types.js";

// ============================================
// Staff DTO Builders
// ============================================

export function buildCreateStaffDTO(
  body: StaffCreateRequest,
  profilePicturePath?: string,
): CreateStaffDTO {
  return {
    name: body.name,
    email: body.email,
    ...(body.phone && { phone: body.phone }),
    ...(profilePicturePath && { profile_picture: profilePicturePath }),
    ...(body.bio && { bio: body.bio }),
    ...(body.skills && { skills: body.skills }),
  };
}

export function buildUpdateStaffDTO(
  body: StaffUpdateRequest,
  profilePicturePath?: string,
): UpdateStaffDTO {
  return {
    ...(body.name && { name: body.name }),
    ...(body.email && { email: body.email }),
    ...(body.phone !== undefined && { phone: body.phone }),
    ...(profilePicturePath && { profile_picture: profilePicturePath }),
    ...(body.bio !== undefined && { bio: body.bio }),
    ...(body.skills !== undefined && { skills: body.skills }),
  };
}

// ============================================
// Project DTO Builders
// ============================================

export function buildCreateProjectDTO(
  body: ProjectCreateRequest,
): CreateProjectDTO {
  return {
    name: body.name,
    client: body.client,
    ...(body.location && { location: body.location }),
    ...(body.start_date && { start_date: body.start_date }),
    ...(body.end_date && { end_date: body.end_date }),
    ...(body.technologies && { technologies: body.technologies }),
  };
}

export function buildUpdateProjectDTO(
  body: ProjectUpdateRequest,
): UpdateProjectDTO {
  return {
    ...(body.name && { name: body.name }),
    ...(body.client && { client: body.client }),
    ...(body.location !== undefined && { location: body.location }),
    ...(body.start_date !== undefined && { start_date: body.start_date }),
    ...(body.end_date !== undefined && { end_date: body.end_date }),
    ...(body.technologies !== undefined && { technologies: body.technologies }),
  };
}

// ============================================
// Participation DTO Builders
// ============================================

export function buildCreateParticipationDTO(
  body: ParticipationCreateRequest,
): CreateParticipationDTO {
  return {
    staff_id: body.staff_id,
    staff_name: body.staff_name,
    project_id: body.project_id,
    project_name: body.project_name,
    role: body.role,
    ...(body.responsibilities && { responsibilities: body.responsibilities }),
  };
}

export function buildUpdateParticipationDTO(
  body: ParticipationUpdateRequest,
): UpdateParticipationDTO {
  return {
    ...(body.role && { role: body.role }),
    ...(body.responsibilities !== undefined && {
      responsibilities: body.responsibilities,
    }),
  };
}
