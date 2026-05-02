import pool from "../db/connection.js";
import type {
  Participation,
  CreateParticipationDTO,
  UpdateParticipationDTO,
} from "../types/index.js";

export const participationModel = {
  // Get participation by staff_id and project_id
  async findByStaffAndProject(
    staffId: number,
    projectId: number,
  ): Promise<Participation | null> {
    const result = await pool.query(
      "SELECT * FROM participation WHERE staff_id = $1 AND project_id = $2",
      [staffId, projectId],
    );
    return result.rows[0] || null;
  },

  // Get all participation records (with optional filters)
  async findAll(
    staffId?: number,
    projectId?: number,
  ): Promise<Participation[]> {
    let query = "SELECT * FROM participation WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (staffId !== undefined) {
      query += ` AND staff_id = $${paramCount++}`;
      params.push(staffId);
    }

    if (projectId !== undefined) {
      query += ` AND project_id = $${paramCount++}`;
      params.push(projectId);
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    return result.rows;
  },

  // Create new participation
  async create(data: CreateParticipationDTO): Promise<Participation> {
    const result = await pool.query(
      `INSERT INTO participation (staff_id, staff_name, project_id, project_name, role, responsibilities)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.staff_id,
        data.staff_name,
        data.project_id,
        data.project_name,
        data.role,
        data.responsibilities,
      ],
    );
    return result.rows[0];
  },

  // Update participation
  async update(
    staffId: number,
    projectId: number,
    data: UpdateParticipationDTO,
  ): Promise<Participation | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.role !== undefined) {
      fields.push(`role = $${paramCount++}`);
      values.push(data.role);
    }
    if (data.responsibilities !== undefined) {
      fields.push(`responsibilities = $${paramCount++}`);
      values.push(data.responsibilities);
    }

    if (fields.length === 0) {
      return this.findByStaffAndProject(staffId, projectId);
    }

    values.push(staffId, projectId);
    const result = await pool.query(
      `UPDATE participation 
       SET ${fields.join(", ")} 
       WHERE staff_id = $${paramCount++} AND project_id = $${paramCount}
       RETURNING *`,
      values,
    );

    return result.rows[0] || null;
  },

  // Delete participation
  async delete(staffId: number, projectId: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM participation WHERE staff_id = $1 AND project_id = $2",
      [staffId, projectId],
    );
    return (result.rowCount ?? 0) > 0;
  },
};
