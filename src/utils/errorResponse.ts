import type { Response } from "express";
import type { FieldError, ErrorPayload } from "../types/index.js";

export function sendError(
  res: Response,
  status: number,
  message: string,
  errors?: FieldError[],
) {
  const payload: ErrorPayload = { error: message };
  if (errors && errors.length) payload.errors = errors;
  return res.status(status).json(payload);
}

export default sendError;
