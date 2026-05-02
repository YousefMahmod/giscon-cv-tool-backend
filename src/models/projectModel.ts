import pool from "../db/connection.js";
import type {
  Project,
  CreateProjectDTO,
  UpdateProjectDTO,
} from "../types/index.js";

export const projectModel = {
  // Get all projects
  async findAll(): Promise<Project[]> {
    const result = await pool.query(
      "SELECT * FROM projects ORDER BY start_date DESC",
    );
    return result.rows;
  },

  // Get project by ID
  async findById(id: number): Promise<Project | null> {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  },

  // Check if project has assigned staff
  async hasAssignedStaff(id: number): Promise<boolean> {
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM participation WHERE project_id = $1",
      [id],
    );
    return parseInt(result.rows[0].count) > 0;
  },

  // Create new project
  async create(data: CreateProjectDTO): Promise<Project> {
    const result = await pool.query(
      `INSERT INTO projects (name, client, location, start_date, end_date, technologies)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.name,
        data.client,
        data.location,
        data.start_date,
        data.end_date,
        data.technologies,
      ],
    );
    return result.rows[0];
  },

  // Update project
  async update(id: number, data: UpdateProjectDTO): Promise<Project | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.client !== undefined) {
      fields.push(`client = $${paramCount++}`);
      values.push(data.client);
    }
    if (data.location !== undefined) {
      fields.push(`location = $${paramCount++}`);
      values.push(data.location);
    }
    if (data.start_date !== undefined) {
      fields.push(`start_date = $${paramCount++}`);
      values.push(data.start_date);
    }
    if (data.end_date !== undefined) {
      fields.push(`end_date = $${paramCount++}`);
      values.push(data.end_date);
    }
    if (data.technologies !== undefined) {
      fields.push(`technologies = $${paramCount++}`);
      values.push(data.technologies);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE projects SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
      values,
    );

    return result.rows[0] || null;
  },

  // Delete project
  async delete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM projects WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
