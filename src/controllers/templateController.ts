import type { Request, Response } from "express";
import { templateModel } from "../models/templateModel.js";
import {
  transformTemplateWithUrls,
  transformTemplateArrayWithUrls,
} from "../utils/urlBuilder.js";
import sendError from "../utils/errorResponse.js";

export const templateController = {
  // GET /templates - Get all templates
  async getAllTemplates(req: Request, res: Response) {
    try {
      const templates = await templateModel.findAll();
      const templatesWithUrls = transformTemplateArrayWithUrls(templates, req);
      res.json(templatesWithUrls);
    } catch (error) {
      console.error("Error fetching templates:", error);
      sendError(res, 500, "Failed to fetch templates");
    }
  },

  // GET /templates/:id - Get template by ID
  async getTemplateById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      const template = await templateModel.findById(id);
      if (!template) {
        sendError(res, 404, "Template not found", [
          { field: "id", message: "No template with this ID" },
        ]);
        return;
      }

      const templateWithUrls = transformTemplateWithUrls(template, req);
      res.json(templateWithUrls);
    } catch (error) {
      console.error("Error fetching template:", error);
      sendError(res, 500, "Failed to fetch template");
    }
  },

  // POST /templates - Create new template
  async createTemplate(req: Request, res: Response) {
    try {
      // Validation is handled by middleware
      const { title, subtitle, img, template_name, version } = req.body;

      const templateData = {
        title,
        subtitle,
        img,
        template_name,
        version,
      };

      const newTemplate = await templateModel.create(templateData);
      const templateWithUrls = transformTemplateWithUrls(newTemplate, req);
      res.status(201).json(templateWithUrls);
    } catch (error) {
      console.error("Error creating template:", error);
      sendError(res, 500, "Failed to create template");
    }
  },

  // PUT /templates/:id - Update template
  async updateTemplate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      // Check if template exists
      const existingTemplate = await templateModel.findById(id);
      if (!existingTemplate) {
        sendError(res, 404, "Template not found", [
          { field: "id", message: "No template with this ID" },
        ]);
        return;
      }

      const { title, subtitle, img, template_name, version } = req.body;
      const updateData = {
        title,
        subtitle,
        img,
        template_name,
        version,
      };

      const updatedTemplate = await templateModel.update(id, updateData);
      const templateWithUrls = transformTemplateWithUrls(updatedTemplate, req);
      res.json(templateWithUrls);
    } catch (error) {
      console.error("Error updating template:", error);
      sendError(res, 500, "Failed to update template");
    }
  },

  // DELETE /templates/:id - Delete template
  async deleteTemplate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      // Check if template exists
      const existingTemplate = await templateModel.findById(id);
      if (!existingTemplate) {
        sendError(res, 404, "Template not found", [
          { field: "id", message: "No template with this ID" },
        ]);
        return;
      }

      await templateModel.delete(id);
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Error deleting template:", error);
      sendError(res, 500, "Failed to delete template");
    }
  },
};
