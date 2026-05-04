import type { Request, Response } from "express";
import { staffModel } from "../models/staffModel.js";
import {
  buildCreateStaffDTO,
  buildUpdateStaffDTO,
} from "../utils/dtoBuilders.js";
import {
  transformStaffWithUrls,
  transformStaffArrayWithUrls,
} from "../utils/urlBuilder.js";
import sendError from "../utils/errorResponse.js";

export const staffController = {
  // GET /staff - Get all staff
  async getAllStaff(req: Request, res: Response) {
    try {
      const staff = await staffModel.findAll();
      const staffWithUrls = transformStaffArrayWithUrls(staff, req);
      res.json(staffWithUrls);
    } catch (error) {
      console.error("Error fetching staff:", error);
      sendError(res, 500, "Failed to fetch staff");
    }
  },

  // POST /staff - Create new staff
  async createStaff(req: Request, res: Response) {
    try {
      // Validation is handled by middleware
      const { email } = req.body;

      // Check if email already exists
      const existingStaff = await staffModel.findByEmail(email);
      if (existingStaff) {
        sendError(res, 400, "Email already exists", [
          { field: "email", message: "Email already exists" },
        ]);
        return;
      }

      // Handle profile picture from multer (if uploaded)
      const profile_picture = req.file
        ? `/uploads/profiles/${req.file.filename}`
        : "/uploads/profiles/profile-placeholder.webp"; // Default placeholder

      const staffData = buildCreateStaffDTO(req.body, profile_picture);
      const newStaff = await staffModel.create(staffData);
      const staffWithUrls = transformStaffWithUrls(newStaff, req);

      res.status(201).json(staffWithUrls);
    } catch (error) {
      console.error("Error creating staff:", error);
      sendError(res, 500, "Failed to create staff");
    }
  },

  // PUT /staff/:id - Update staff
  async updateStaff(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const { email } = req.body;

      // Check if staff exists
      const existingStaff = await staffModel.findById(id);
      if (!existingStaff) {
        sendError(res, 404, "Staff not found", [
          { field: "id", message: "No staff with this ID" },
        ]);
        return;
      }

      // If email is being updated, check if it's already taken
      if (email && email !== existingStaff.email) {
        const emailExists = await staffModel.findByEmail(email);
        if (emailExists) {
          sendError(res, 400, "Email already exists", [
            { field: "email", message: "Email already exists" },
          ]);
          return;
        }
      }

      // Handle profile picture update
      const profile_picture = req.file
        ? `/uploads/profiles/${req.file.filename}`
        : undefined;

      const updateData = buildUpdateStaffDTO(req.body, profile_picture);
      const updatedStaff = await staffModel.update(id, updateData);
      const staffWithUrls = transformStaffWithUrls(updatedStaff, req);

      res.json(staffWithUrls);
    } catch (error) {
      console.error("Error updating staff:", error);
      sendError(res, 500, "Failed to update staff");
    }
  },

  // GET /staff/:id - Get staff details with projects
  async getStaffById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const staff = await staffModel.findByIdWithProjects(id);

      if (!staff) {
        sendError(res, 404, "Staff not found", [
          { field: "id", message: "No staff with this ID" },
        ]);
        return;
      }

      const staffWithUrls = transformStaffWithUrls(staff, req);
      res.json(staffWithUrls);
    } catch (error) {
      console.error("Error fetching staff details:", error);
      sendError(res, 500, "Failed to fetch staff details");
    }
  },

  // GET /staff/with-projects - Get all staff with projects (optimized with JOIN)
  async getAllStaffWithProjects(req: Request, res: Response) {
    try {
      const staffWithProjects = await staffModel.findAllWithProjects();
      const staffWithUrls = staffWithProjects.map((s) =>
        transformStaffWithUrls(s, req),
      );
      res.json(staffWithUrls);
    } catch (error) {
      console.error("Error fetching staff with projects:", error);
      sendError(res, 500, "Failed to fetch staff with projects");
    }
  },
};
