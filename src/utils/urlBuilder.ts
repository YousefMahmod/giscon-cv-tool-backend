import type { Request } from "express";

/**
 * Get the base URL from request or environment
 * Priority: 1. Request object, 2. Environment variable, 3. Fallback
 */
export function getBaseUrl(req?: Request): string {
  // If request is provided, construct from request
  if (req) {
    const protocol = req.protocol;
    const host = req.get("host");
    return `${protocol}://${host}`;
  }

  // Otherwise use environment variable or fallback
  const port = process.env.PORT || 5000;
  const host = process.env.HOST || "localhost";
  return `http://${host}:${port}`;
}

/**
 * Convert a relative file path to a full URL
 */
export function buildFileUrl(
  relativePath: string | null | undefined,
  req?: Request,
): string | null {
  if (!relativePath) return null;

  // If already a full URL, return as is
  if (
    relativePath.startsWith("http://") ||
    relativePath.startsWith("https://")
  ) {
    return relativePath;
  }

  const baseUrl = getBaseUrl(req);
  // Ensure path starts with /
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${baseUrl}${path}`;
}

/**
 * Transform staff object to include full URLs for images
 */
export function transformStaffWithUrls(staff: any, req?: Request): any {
  if (!staff) return null;

  return {
    ...staff,
    profile_picture: buildFileUrl(staff.profile_picture, req),
  };
}

/**
 * Transform array of staff objects to include full URLs
 */
export function transformStaffArrayWithUrls(
  staffArray: any[],
  req?: Request,
): any[] {
  return staffArray.map((staff) => transformStaffWithUrls(staff, req));
}
