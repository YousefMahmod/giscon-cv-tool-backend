import type { Request, Response, NextFunction } from "express";

// Error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", err);

  // Database errors
  if (err.code === "23505") {
    // Unique constraint violation
    res.status(400).json({
      error: "Duplicate entry",
      message: err.detail || "A record with this value already exists",
    });
    return;
  }

  if (err.code === "23503") {
    // Foreign key constraint violation
    res.status(400).json({
      error: "Invalid reference",
      message: "Referenced record does not exist",
    });
    return;
  }

  if (err.code === "23502") {
    // Not null constraint violation
    res.status(400).json({
      error: "Missing required field",
      message: err.column
        ? `${err.column} is required`
        : "Required field is missing",
    });
    return;
  }

  // Multer errors (file upload)
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        error: "File too large",
        message: "Maximum file size is 5MB",
      });
      return;
    }
    res.status(400).json({
      error: "File upload error",
      message: err.message,
    });
    return;
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 Not Found handler
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.path} not found`,
  });
};
