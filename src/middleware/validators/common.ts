import type { Request, Response, NextFunction } from "express";

// Validation result type
export interface ValidationError {
  field: string;
  message: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sanitize string input (trim and remove extra spaces)
export const sanitizeString = (value: string): string => {
  return value.trim().replace(/\s+/g, " ");
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

// Validate ID parameter (used by multiple entities)
export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = parseInt(req.params.id as string);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({
      error: "Validation failed",
      errors: [{ field: "id", message: "Valid ID is required" }],
    });
    return;
  }

  next();
};

// Generic required fields validator
export const validateRequired = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: ValidationError[] = [];

    for (const field of fields) {
      const value = req.body[field];
      if (value === undefined || value === null || value === "") {
        errors.push({
          field,
          message: `${field} is required`,
        });
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        error: "Validation failed",
        errors,
      });
      return;
    }

    next();
  };
};
