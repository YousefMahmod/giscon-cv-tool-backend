import pool from "../db/connection.js";
import type { ExportCVData } from "../types/export.types.js";

export const exportModel = {
  // Get staff with their selected projects for CV export
  async getStaffWithSelectedProjects(
    staffId: number,
    projectIds: number[],
  ): Promise<ExportCVData | null> {
    // First, get staff info
    const staffResult = await pool.query("SELECT * FROM staff WHERE id = $1", [
      staffId,
    ]);

    if (!staffResult.rows || staffResult.rows.length === 0) {
      return null;
    }

    const staffData = staffResult.rows[0];

    // Then get selected projects with participation details
    // Query will automatically filter out invalid project IDs or projects that don't belong to this staff
    const projectsResult = await pool.query(
      `SELECT 
        p.id,
        p.name,
        p.client,
        p.description,
        p.location,
        p.start_date,
        p.end_date,
        p.technologies,
        pt.role,
        pt.responsibilities
       FROM projects p
       INNER JOIN participation pt ON p.id = pt.project_id
       WHERE pt.staff_id = $1 AND p.id = ANY($2)
       ORDER BY p.start_date DESC`,
      [staffId, projectIds],
    );

    // Build the export data structure
    const exportData: ExportCVData = {
      staff: {
        id: staffData.id,
        name: staffData.name,
        email: staffData.email,
        phone: staffData.phone,
        job_title: staffData.job_title,
        profile_picture: staffData.profile_picture,
        bio: staffData.bio,
        skills: staffData.skills,
      },
      projects: projectsResult.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        client: row.client,
        description: row.description,
        location: row.location,
        start_date: row.start_date,
        end_date: row.end_date,
        technologies: row.technologies,
        role: row.role,
        responsibilities: row.responsibilities,
      })),
    };

    return exportData;
  },
};
