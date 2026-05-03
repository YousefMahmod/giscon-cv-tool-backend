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

export const staffController = {
  // GET /staff - Get all staff
  async getAllStaff(req: Request, res: Response) {
    try {
      const staff = await staffModel.findAll();
      const staffWithUrls = transformStaffArrayWithUrls(staff, req);
      res.json(staffWithUrls);
    } catch (error) {
      console.error("Error fetching staff:", error);
      res.status(500).json({ error: "Failed to fetch staff" });
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
        res.status(400).json({ error: "Email already exists" });
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
      res.status(500).json({ error: "Failed to create staff" });
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
        res.status(404).json({ error: "Staff not found" });
        return;
      }

      // If email is being updated, check if it's already taken
      if (email && email !== existingStaff.email) {
        const emailExists = await staffModel.findByEmail(email);
        if (emailExists) {
          res.status(400).json({ error: "Email already exists" });
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
      res.status(500).json({ error: "Failed to update staff" });
    }
  },

  // GET /staff/:id - Get staff details with projects
  async getStaffById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const staff = await staffModel.findByIdWithProjects(id);

      if (!staff) {
        res.status(404).json({ error: "Staff not found" });
        return;
      }

      const staffWithUrls = transformStaffWithUrls(staff, req);
      res.json(staffWithUrls);
    } catch (error) {
      console.error("Error fetching staff details:", error);
      res.status(500).json({ error: "Failed to fetch staff details" });
    }
  },

  // GET /staff/:id/projects - Get staff with their projects list
  async getStaffProjects(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const staff = await staffModel.findByIdWithProjectsList(id);

      if (!staff) {
        res.status(404).json({ error: "Staff not found" });
        return;
      }

      const staffWithUrls = transformStaffWithUrls(staff, req);
      res.json(staffWithUrls);
    } catch (error) {
      console.error("Error fetching staff projects:", error);
      res.status(500).json({ error: "Failed to fetch staff projects" });
    }
  },
};
