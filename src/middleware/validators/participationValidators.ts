import type { Request, Response, NextFunction } from "express";
import { sanitizeString, type ValidationError } from "./common.js";

// Validate participation creation
export const validateParticipationCreate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];
  const { staff_id, staff_name, project_id, project_name, role } = req.body;

  // Validate staff_id
  if (!staff_id || !Number.isInteger(Number(staff_id)) || staff_id <= 0) {
    errors.push({
      field: "staff_id",
      message: "Valid staff_id is required (positive integer)",
    });
  }

  // Validate staff_name
  if (
    !staff_name ||
    typeof staff_name !== "string" ||
    staff_name.trim().length === 0
  ) {
    errors.push({ field: "staff_name", message: "staff_name is required" });
  } else {
    req.body.staff_name = sanitizeString(staff_name);
  }

  // Validate project_id
  if (!project_id || !Number.isInteger(Number(project_id)) || project_id <= 0) {
    errors.push({
      field: "project_id",
      message: "Valid project_id is required (positive integer)",
    });
  }

  // Validate project_name
  if (
    !project_name ||
    typeof project_name !== "string" ||
    project_name.trim().length === 0
  ) {
    errors.push({ field: "project_name", message: "project_name is required" });
  } else {
    req.body.project_name = sanitizeString(project_name);
  }

  // Validate role
  if (!role || typeof role !== "string" || role.trim().length === 0) {
    errors.push({ field: "role", message: "role is required" });
  } else {
    req.body.role = sanitizeString(role);
  }

  // Sanitize responsibilities if provided
  if (req.body.responsibilities)
    req.body.responsibilities = sanitizeString(req.body.responsibilities);

  if (errors.length > 0) {
    res.status(400).json({
      error: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Validate participation update
export const validateParticipationUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];
  const { staff_id, project_id, role } = req.body;

  // Validate staff_id
  if (!staff_id || !Number.isInteger(Number(staff_id)) || staff_id <= 0) {
    errors.push({
      field: "staff_id",
      message: "Valid staff_id is required (positive integer)",
    });
  }

  // Validate project_id
  if (!project_id || !Number.isInteger(Number(project_id)) || project_id <= 0) {
    errors.push({
      field: "project_id",
      message: "Valid project_id is required (positive integer)",
    });
  }

  // Check if at least one update field is provided
  if (!role && !req.body.responsibilities) {
    errors.push({
      field: "body",
      message: "At least one field (role or responsibilities) must be provided",
    });
  }

  // Sanitize fields if provided
  if (role) req.body.role = sanitizeString(role);
  if (req.body.responsibilities)
    req.body.responsibilities = sanitizeString(req.body.responsibilities);

  if (errors.length > 0) {
    res.status(400).json({
      error: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Validate query parameters for participation
export const validateParticipationQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { staff_id, project_id } = req.query;

  if (staff_id) {
    const id = parseInt(staff_id as string);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({
        error: "Validation failed",
        errors: [
          { field: "staff_id", message: "staff_id must be a positive integer" },
        ],
      });
      return;
    }
  }

  if (project_id) {
    const id = parseInt(project_id as string);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({
        error: "Validation failed",
        errors: [
          {
            field: "project_id",
            message: "project_id must be a positive integer",
          },
        ],
      });
      return;
    }
  }

  next();
};
