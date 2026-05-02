import type { Request, Response, NextFunction } from "express";
import { sanitizeString, type ValidationError } from "./common.js";

// Validate project creation
export const validateProjectCreate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];
  const { name, client } = req.body;

  // Validate name
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push({ field: "name", message: "Name is required" });
  } else if (name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "Name must be at least 2 characters",
    });
  } else {
    req.body.name = sanitizeString(name);
  }

  // Validate client
  if (!client || typeof client !== "string" || client.trim().length === 0) {
    errors.push({ field: "client", message: "Client is required" });
  } else {
    req.body.client = sanitizeString(client);
  }

  // Sanitize optional fields
  if (req.body.location) req.body.location = sanitizeString(req.body.location);
  if (req.body.technologies)
    req.body.technologies = sanitizeString(req.body.technologies);

  if (errors.length > 0) {
    res.status(400).json({
      error: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Validate project update
export const validateProjectUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];
  const { name, client } = req.body;

  // Check if at least one field is provided
  if (
    !name &&
    !client &&
    !req.body.location &&
    !req.body.start_date &&
    !req.body.end_date &&
    !req.body.technologies
  ) {
    res.status(400).json({
      error: "Validation failed",
      errors: [
        { field: "body", message: "At least one field must be provided" },
      ],
    });
    return;
  }

  // Validate name if provided
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      errors.push({
        field: "name",
        message: "Name must be at least 2 characters",
      });
    } else {
      req.body.name = sanitizeString(name);
    }
  }

  // Validate client if provided
  if (client !== undefined) {
    if (typeof client !== "string" || client.trim().length === 0) {
      errors.push({ field: "client", message: "Client cannot be empty" });
    } else {
      req.body.client = sanitizeString(client);
    }
  }

  // Sanitize optional fields
  if (req.body.location) req.body.location = sanitizeString(req.body.location);
  if (req.body.technologies)
    req.body.technologies = sanitizeString(req.body.technologies);

  if (errors.length > 0) {
    res.status(400).json({
      error: "Validation failed",
      errors,
    });
    return;
  }

  next();
};
