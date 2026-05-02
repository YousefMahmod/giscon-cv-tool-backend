import type { Request, Response } from "express";
import { participationModel } from "../models/participationModel.js";
import {
  buildCreateParticipationDTO,
  buildUpdateParticipationDTO,
} from "../utils/dtoBuilders.js";

export const participationController = {
  // GET /staff/participation - Get participation details
  async getParticipation(req: Request, res: Response) {
    try {
      const staffId = req.query.staff_id
        ? parseInt(req.query.staff_id as string)
        : undefined;
      const projectId = req.query.project_id
        ? parseInt(req.query.project_id as string)
        : undefined;

      // If both are provided, get specific participation
      if (staffId && projectId) {
        const participation = await participationModel.findByStaffAndProject(
          staffId,
          projectId,
        );
        if (!participation) {
          res.status(404).json({ error: "Participation not found" });
          return;
        }
        res.json(participation);
        return;
      }

      // Otherwise get filtered list
      const participations = await participationModel.findAll(
        staffId,
        projectId,
      );
      res.json(participations);
    } catch (error) {
      console.error("Error fetching participation:", error);
      res.status(500).json({ error: "Failed to fetch participation" });
    }
  },

  // POST /staff/participation - Assign staff to project
  async createParticipation(req: Request, res: Response) {
    try {
      // Validation is handled by middleware
      const { staff_id, project_id } = req.body;

      // Check if participation already exists
      const existingParticipation =
        await participationModel.findByStaffAndProject(staff_id, project_id);
      if (existingParticipation) {
        res
          .status(400)
          .json({ error: "Staff is already assigned to this project" });
        return;
      }

      const participationData = buildCreateParticipationDTO(req.body);
      const newParticipation =
        await participationModel.create(participationData);

      res.status(201).json(newParticipation);
    } catch (error) {
      console.error("Error creating participation:", error);
      res.status(500).json({ error: "Failed to create participation" });
    }
  },

  // PUT /staff/participation - Update participation
  async updateParticipation(req: Request, res: Response) {
    try {
      // Validation is handled by middleware
      const { staff_id, project_id } = req.body;

      // Check if participation exists
      const existingParticipation =
        await participationModel.findByStaffAndProject(staff_id, project_id);
      if (!existingParticipation) {
        res.status(404).json({ error: "Participation not found" });
        return;
      }

      const updateData = buildUpdateParticipationDTO(req.body);
      const updatedParticipation = await participationModel.update(
        staff_id,
        project_id,
        updateData,
      );

      res.json(updatedParticipation);
    } catch (error) {
      console.error("Error updating participation:", error);
      res.status(500).json({ error: "Failed to update participation" });
    }
  },

  // DELETE /staff/participation - Remove staff from project
  async deleteParticipation(req: Request, res: Response) {
    try {
      // Validation is handled by middleware
      const staffId = parseInt(req.query.staff_id as string);
      const projectId = parseInt(req.query.project_id as string);

      // Check if participation exists
      const existingParticipation =
        await participationModel.findByStaffAndProject(staffId, projectId);
      if (!existingParticipation) {
        res.status(404).json({ error: "Participation not found" });
        return;
      }

      await participationModel.delete(staffId, projectId);
      res.json({ message: "Participation deleted successfully" });
    } catch (error) {
      console.error("Error deleting participation:", error);
      res.status(500).json({ error: "Failed to delete participation" });
    }
  },
};
