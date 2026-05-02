import type { Request, Response } from "express";
import { projectModel } from "../models/projectModel.js";
import {
  buildCreateProjectDTO,
  buildUpdateProjectDTO,
} from "../utils/dtoBuilders.js";

export const projectController = {
  // GET /projects - Get all projects
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await projectModel.findAll();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  },

  // POST /projects - Create new project
  async createProject(req: Request, res: Response) {
    try {
      // Validation is handled by middleware
      const projectData = buildCreateProjectDTO(req.body);
      const newProject = await projectModel.create(projectData);

      res.status(201).json(newProject);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  },

  // PUT /projects/:id - Update project
  async updateProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      // Check if project exists
      const existingProject = await projectModel.findById(id);
      if (!existingProject) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      const updateData = buildUpdateProjectDTO(req.body);
      const updatedProject = await projectModel.update(id, updateData);

      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  },

  // DELETE /projects/:id - Delete project
  async deleteProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      // Check if project exists
      const existingProject = await projectModel.findById(id);
      if (!existingProject) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      // Check if project has assigned staff
      const hasStaff = await projectModel.hasAssignedStaff(id);
      if (hasStaff) {
        res
          .status(400)
          .json({ error: "Cannot delete project with assigned staff" });
        return;
      }

      await projectModel.delete(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  },
};
