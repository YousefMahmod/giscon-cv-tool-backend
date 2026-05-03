import type { Request, Response } from "express";
import { projectModel } from "../models/projectModel.js";
import {
  buildCreateProjectDTO,
  buildUpdateProjectDTO,
} from "../utils/dtoBuilders.js";
import {
  buildFileUrl,
  transformStaffArrayWithUrls,
} from "../utils/urlBuilder.js";
import sendError from "../utils/errorResponse.js";

export const projectController = {
  // GET /projects - Get all projects
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await projectModel.findAll();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      sendError(res, 500, "Failed to fetch projects");
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
      sendError(res, 500, "Failed to create project");
    }
  },

  // PUT /projects/:id - Update project
  async updateProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      // Check if project exists
      const existingProject = await projectModel.findById(id);
      if (!existingProject) {
        sendError(res, 404, "Project not found", [
          { field: "id", message: "No project with this ID" },
        ]);
        return;
      }

      const updateData = buildUpdateProjectDTO(req.body);
      const updatedProject = await projectModel.update(id, updateData);

      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      sendError(res, 500, "Failed to update project");
    }
  },

  // DELETE /projects/:id - Delete project
  async deleteProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      // Check if project exists
      const existingProject = await projectModel.findById(id);
      if (!existingProject) {
        sendError(res, 404, "Project not found", [
          { field: "id", message: "No project with this ID" },
        ]);
        return;
      }

      // Check if project has assigned staff
      const hasStaff = await projectModel.hasAssignedStaff(id);
      if (hasStaff) {
        sendError(res, 400, "Cannot delete project with assigned staff", [
          { field: "id", message: "Project has assigned staff" },
        ]);
        return;
      }

      await projectModel.delete(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      sendError(res, 500, "Failed to delete project");
    }
  },

  // GET /projects/:id/staffs - Get project details with assigned staffs
  async getProjectWithStaffs(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      const project = await projectModel.findByIdWithStaffs(id);
      if (!project) {
        sendError(res, 404, "Project not found", [
          { field: "id", message: "No project with this ID" },
        ]);
        return;
      }

      // Convert staff profile_picture relative paths to full URLs
      if (Array.isArray(project.staffs)) {
        project.staffs = transformStaffArrayWithUrls(
          project.staffs,
          req as any,
        );
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching project with staffs:", error);
      sendError(res, 500, "Failed to fetch project", [
        { field: "id", message: "Error fetching project with staffs" },
      ]);
    }
  },
};
