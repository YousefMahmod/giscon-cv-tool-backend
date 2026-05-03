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

  // Get project by ID with its assigned staff (join participation -> staff)
  async findByIdWithStaffs(id: number): Promise<any | null> {
    const result = await pool.query(
      `SELECT p.*, 
              s.id as staff_id,
              s.name as staff_name,
              s.email as staff_email,
              s.phone as staff_phone,
              s.job_title as staff_job_title,
              s.profile_picture as staff_profile_picture,
              pt.role as role,
              pt.responsibilities as responsibilities
       FROM projects p
       LEFT JOIN participation pt ON p.id = pt.project_id
       LEFT JOIN staff s ON pt.staff_id = s.id
       WHERE p.id = $1`,
      [id],
    );

    if (!result.rows || result.rows.length === 0) return null;

    // Build project base from first row
    const row0: any = result.rows[0];
    const project: any = {
      id: row0.id,
      name: row0.name,
      client: row0.client,
      description: row0.description,
      location: row0.location,
      start_date: row0.start_date,
      end_date: row0.end_date,
      technologies: row0.technologies,
      created_at: row0.created_at,
      updated_at: row0.updated_at,
      staffs: [],
    };

    for (const r of result.rows) {
      if (r.staff_id) {
        project.staffs.push({
          id: r.staff_id,
          name: r.staff_name,
          email: r.staff_email,
          phone: r.staff_phone,
          job_title: r.staff_job_title,
          profile_picture: r.staff_profile_picture,
          role: r.role,
          responsibilities: r.responsibilities,
        });
      }
    }

    return project;
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
      `INSERT INTO projects (name, client, description, location, start_date, end_date, technologies)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.name,
        data.client,
        data.description,
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
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
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
