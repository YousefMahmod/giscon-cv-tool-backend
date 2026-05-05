import type { Request, Response, NextFunction } from "express";
import { type ValidationError } from "./common.js";
import sendError from "../../utils/errorResponse.js";

// Validate CV export request
export const validateExportCV = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];
  const { template_name, project_ids } = req.body;

  // Validate template_name (required, string)
  if (!template_name) {
    errors.push({
      field: "template_name",
      message: "Template name is required",
    });
  } else if (
    typeof template_name !== "string" ||
    template_name.trim().length === 0
  ) {
    errors.push({
      field: "template_name",
      message: "Template name must be a non-empty string",
    });
  } else if (!/^[a-z0-9-]+$/.test(template_name)) {
    errors.push({
      field: "template_name",
      message:
        "Template name must contain only lowercase letters, numbers, and hyphens",
    });
  }

  // Validate project_ids (required, non-empty string, comma-separated numbers)
  if (!project_ids) {
    errors.push({ field: "project_ids", message: "Project IDs are required" });
  } else if (
    typeof project_ids !== "string" ||
    project_ids.trim().length === 0
  ) {
    errors.push({
      field: "project_ids",
      message: "Project IDs must be a non-empty string",
    });
  } else {
    // Validate comma-separated format
    const ids = project_ids.split(",").map((id) => id.trim());
    const invalidIds = ids.filter((id) => {
      const num = parseInt(id, 10);
      return isNaN(num) || num < 1;
    });

    if (invalidIds.length > 0) {
      errors.push({
        field: "project_ids",
        message:
          "Project IDs must be comma-separated positive numbers (e.g., '1,2,3')",
      });
    }
  }

  if (errors.length > 0) {
    sendError(res, 400, "Validation failed", errors);
    return;
  }

  next();
};
