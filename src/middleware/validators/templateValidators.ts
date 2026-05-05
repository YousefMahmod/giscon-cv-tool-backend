import type { Request, Response, NextFunction } from "express";
import { sanitizeString, type ValidationError } from "./common.js";
import { templateModel } from "../../models/templateModel.js";
import sendError from "../../utils/errorResponse.js";
import type { UpdateTemplateDTO } from "../../types/template.types.js";

// Validate template creation
export const validateCreateTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];
  const { title, subtitle, img, template_name, version } = req.body;

  // Validate title (required)
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (title.trim().length < 2) {
    errors.push({
      field: "title",
      message: "Title must be at least 2 characters",
    });
  } else {
    req.body.title = sanitizeString(title);
  }

  // Validate template_name (required)
  if (
    !template_name ||
    typeof template_name !== "string" ||
    template_name.trim().length === 0
  ) {
    errors.push({
      field: "template_name",
      message: "Template name is required",
    });
  } else if (!/^[a-z0-9-]+$/.test(template_name)) {
    errors.push({
      field: "template_name",
      message:
        "Template name must contain only lowercase letters, numbers, and hyphens",
    });
  } else {
    req.body.template_name = sanitizeString(template_name);
  }

  // Check uniqueness of template_name
  try {
    const existing = await templateModel.findByName(req.body.template_name);
    if (existing) {
      errors.push({
        field: "template_name",
        message: "Template name already in use",
      });
    }
  } catch (err) {
    console.error("Error checking template_name uniqueness:", err);
    sendError(res, 500, "Failed to validate template name uniqueness");
    return;
  }

  // Sanitize optional fields
  validateOptionalStringField("subtitle", subtitle, req.body, errors);
  validateOptionalStringField("img", img, req.body, errors);
  validateOptionalStringField("version", version, req.body, errors);

  if (errors.length > 0) {
    sendError(res, 400, "Validation failed", errors);
    return;
  }

  next();
};

// Validate template update
export const validateUpdateTemplate = async (
  req: Request<{ id: string }, {}, UpdateTemplateDTO>,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];
  const { title, subtitle, template_name, img, version } = req.body;

  // Check if at least one field is provided
  if (!title && !subtitle && !img && !template_name && !version) {
    sendError(res, 400, "Validation failed", [
      { field: "body", message: "At least one field must be provided" },
    ]);
    return;
  }

  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length < 2) {
      errors.push({
        field: "title",
        message: "Title must be at least 2 characters",
      });
    } else {
      req.body.title = sanitizeString(title);
    }
  }

  // Validate template_name if provided
  if (template_name !== undefined) {
    if (typeof template_name !== "string") {
      errors.push({
        field: "template_name",
        message: "Template name must be a string",
      });
    } else if (!/^[a-z0-9-]+$/.test(template_name)) {
      errors.push({
        field: "template_name",
        message:
          "Template name must contain only lowercase letters, numbers, and hyphens",
      });
    } else {
      req.body.template_name = sanitizeString(template_name);
    }
  }

  // If template_name provided, ensure uniqueness (not counting current template)
  if (template_name !== undefined && typeof template_name === "string") {
    const idParam = parseInt(req.params.id || "", 10) || NaN;
    const name = req.body.template_name as string;
    try {
      const existing = await templateModel.findByName(name);
      if (existing && existing.id !== idParam) {
        errors.push({
          field: "template_name",
          message: "Template name already in use by another template",
        });
      }
    } catch (err) {
      console.error("Error checking template_name uniqueness:", err);
      sendError(res, 500, "Failed to validate template name uniqueness");
      return;
    }
  }

  // Validate subtitle if provided
  validateOptionalStringField("subtitle", subtitle, req.body, errors);

  // Validate img if provided
  validateOptionalStringField("img", img, req.body, errors);

  // Validate version if provided
  validateOptionalStringField("version", version, req.body, errors);

  if (errors.length > 0) {
    sendError(res, 400, "Validation failed", errors);
    return;
  }

  next();
};

/**
 * Helper function to validate and sanitize optional string fields
 */
function validateOptionalStringField(
  field: string,
  value: any,
  body: any,
  errors: ValidationError[],
): void {
  if (value) {
    if (typeof value !== "string") {
      errors.push({
        field,
        message: `${field} must be a string`,
      });
    } else {
      body[field] = sanitizeString(value);
    }
  }
}
