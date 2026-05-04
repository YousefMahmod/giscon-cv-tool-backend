import pool from "../db/connection.js";
import type { Staff, CreateStaffDTO, UpdateStaffDTO } from "../types/index.js";

export const staffModel = {
  // Get all staff
  async findAll(): Promise<Staff[]> {
    const result = await pool.query(
      "SELECT * FROM staff ORDER BY created_at DESC",
    );
    return result.rows;
  },

  // Get staff by ID
  async findById(id: number): Promise<Staff | null> {
    const result = await pool.query("SELECT * FROM staff WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  // Get staff by email
  async findByEmail(email: string): Promise<Staff | null> {
    const result = await pool.query("SELECT * FROM staff WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  },

  // Get staff with their projects
  async findByIdWithProjects(id: number): Promise<any> {
    const result = await pool.query(
      `SELECT 
        s.*,
        p.id as project_id,
        p.name as project_name,
        p.client,
        p.location,
        p.start_date,
        p.end_date,
        p.technologies,
        pt.role,
        pt.responsibilities
      FROM staff s
      LEFT JOIN participation pt ON s.id = pt.staff_id
      LEFT JOIN projects p ON pt.project_id = p.id
      WHERE s.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    // Transform the result to group projects
    const staff = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      phone: result.rows[0].phone,
      job_title: result.rows[0].job_title,
      profile_picture: result.rows[0].profile_picture,
      bio: result.rows[0].bio,
      skills: result.rows[0].skills,
      created_at: result.rows[0].created_at,
      updated_at: result.rows[0].updated_at,
      projects: result.rows
        .filter((row) => row.project_id !== null)
        .map((row) => ({
          project_id: row.project_id,
          project_name: row.project_name,
          client: row.client,
          location: row.location,
          start_date: row.start_date,
          end_date: row.end_date,
          technologies: row.technologies,
          role: row.role,
          responsibilities: row.responsibilities,
        })),
    };

    return staff;
  },

  // Create new staff
  async create(data: CreateStaffDTO): Promise<Staff> {
    const result = await pool.query(
      `INSERT INTO staff (name, email, phone, job_title, profile_picture, bio, skills)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.name,
        data.email,
        data.phone,
        data.job_title,
        data.profile_picture,
        data.bio,
        data.skills,
      ],
    );
    return result.rows[0];
  },

  // Update staff
  async update(id: number, data: UpdateStaffDTO): Promise<Staff | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(data.phone);
    }
    if (data.job_title !== undefined) {
      fields.push(`job_title = $${paramCount++}`);
      values.push(data.job_title);
    }
    if (data.profile_picture !== undefined) {
      fields.push(`profile_picture = $${paramCount++}`);
      values.push(data.profile_picture);
    }
    if (data.bio !== undefined) {
      fields.push(`bio = $${paramCount++}`);
      values.push(data.bio);
    }
    if (data.skills !== undefined) {
      fields.push(`skills = $${paramCount++}`);
      values.push(data.skills);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE staff SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
      values,
    );

    return result.rows[0] || null;
  },

  // Delete staff
  async delete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM staff WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  },

  // Get all staff with their projects (optimized with JOIN)
  async findAllWithProjects(): Promise<any[]> {
    const result = await pool.query(
      `SELECT 
        s.*,
        p.id as project_id,
        p.name as project_name,
        p.client,
        p.description,
        p.location,
        p.start_date,
        p.end_date,
        p.technologies,
        pt.role,
        pt.responsibilities
      FROM staff s
      LEFT JOIN participation pt ON s.id = pt.staff_id
      LEFT JOIN projects p ON pt.project_id = p.id
      ORDER BY s.created_at DESC, p.start_date DESC`,
    );

    // Group results by staff
    const staffMap = new Map<number, any>();

    for (const row of result.rows) {
      if (!staffMap.has(row.id)) {
        staffMap.set(row.id, {
          staff_id: row.id,
          staff_name: row.name,
          email: row.email,
          phone: row.phone,
          job_title: row.job_title,
          profile_picture: row.profile_picture,
          bio: row.bio,
          skills: row.skills,
          created_at: row.created_at,
          updated_at: row.updated_at,
          projects: [],
        });
      }

      // Add project if exists
      if (row.project_id) {
        staffMap.get(row.id)!.projects.push({
          project_id: row.project_id,
          project_name: row.project_name,
          role: row.role,
          responsibilities: row.responsibilities,
          client: row.client,
          description: row.description,
          location: row.location,
          start_date: row.start_date,
          end_date: row.end_date,
          technologies: row.technologies,
        });
      }
    }

    return Array.from(staffMap.values());
  },
};
