import type { Request, Response, NextFunction } from "express";
import {
  sanitizeString,
  isValidEmail,
  type ValidationError,
} from "./common.js";

// Validate staff creation
export const validateStaffCreate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];
  const { name, email, phone } = req.body;

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

  // Validate email
  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!isValidEmail(email)) {
    errors.push({ field: "email", message: "Invalid email format" });
  } else {
    req.body.email = email.trim().toLowerCase();
  }

  // Validate phone (optional)
  if (phone !== undefined && phone !== null && phone !== "") {
    if (typeof phone !== "string") {
      errors.push({ field: "phone", message: "Phone must be a string" });
    } else {
      req.body.phone = sanitizeString(phone);
    }
  }

  // Sanitize optional text fields
  if (req.body.job_title)
    req.body.job_title = sanitizeString(req.body.job_title);
  if (req.body.bio) req.body.bio = sanitizeString(req.body.bio);
  if (req.body.skills) req.body.skills = sanitizeString(req.body.skills);

  if (errors.length > 0) {
    res.status(400).json({
      error: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Validate staff update
export const validateStaffUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];
  const { name, email, phone } = req.body;

  // Check if at least one field is provided
  if (
    !name &&
    !email &&
    !phone &&
    !req.body.job_title &&
    !req.body.bio &&
    !req.body.skills &&
    !req.file
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

  // Validate email if provided
  if (email !== undefined) {
    if (typeof email !== "string" || !isValidEmail(email)) {
      errors.push({ field: "email", message: "Invalid email format" });
    } else {
      req.body.email = email.trim().toLowerCase();
    }
  }

  // Sanitize optional fields
  if (phone) req.body.phone = sanitizeString(phone);
  if (req.body.job_title)
    req.body.job_title = sanitizeString(req.body.job_title);
  if (req.body.bio) req.body.bio = sanitizeString(req.body.bio);
  if (req.body.skills) req.body.skills = sanitizeString(req.body.skills);

  if (errors.length > 0) {
    res.status(400).json({
      error: "Validation failed",
      errors,
    });
    return;
  }

  next();
};
