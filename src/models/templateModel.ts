import pool from "../db/connection.js";
import type {
  Template,
  CreateTemplateDTO,
  UpdateTemplateDTO,
} from "../types/template.types.js";

export const templateModel = {
  // Get all templates
  async findAll(): Promise<Template[]> {
    const result = await pool.query("SELECT * FROM templates ORDER BY id ASC");
    return result.rows;
  },

  // Get template by ID
  async findById(id: number): Promise<Template | null> {
    const result = await pool.query("SELECT * FROM templates WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  },

  // Get template by name
  async findByName(templateName: string): Promise<Template | null> {
    const result = await pool.query(
      "SELECT * FROM templates WHERE template_name = $1",
      [templateName],
    );
    return result.rows[0] || null;
  },

  // Create new template
  async create(template: CreateTemplateDTO): Promise<Template> {
    const { title, subtitle, img, template_name, version } = template;
    const result = await pool.query(
      `INSERT INTO templates (title, subtitle, img, template_name, version) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [title, subtitle || null, img || null, template_name, version || "1.0"],
    );
    return result.rows[0];
  },

  // Update template
  async update(
    id: number,
    template: UpdateTemplateDTO,
  ): Promise<Template | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (template.title !== undefined) {
      fields.push(`title = $${paramCount}`);
      values.push(template.title);
      paramCount++;
    }

    if (template.subtitle !== undefined) {
      fields.push(`subtitle = $${paramCount}`);
      values.push(template.subtitle);
      paramCount++;
    }

    if (template.img !== undefined) {
      fields.push(`img = $${paramCount}`);
      values.push(template.img);
      paramCount++;
    }

    if (template.template_name !== undefined) {
      fields.push(`template_name = $${paramCount}`);
      values.push(template.template_name);
      paramCount++;
    }

    if (template.version !== undefined) {
      fields.push(`version = $${paramCount}`);
      values.push(template.version);
      paramCount++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE templates SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
      values,
    );

    return result.rows[0] || null;
  },

  // Delete template
  async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM templates WHERE id = $1 RETURNING id",
      [id],
    );
    return result.rowCount !== null && result.rowCount > 0;
  },
};
