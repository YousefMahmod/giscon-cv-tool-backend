import type { Request, Response } from "express";
import { participationModel } from "../models/participationModel.js";
import {
  buildCreateParticipationDTO,
  buildUpdateParticipationDTO,
} from "../utils/dtoBuilders.js";
import sendError from "../utils/errorResponse.js";

export const participationController = {
  // GET /staff/participation - Get participation details
  async getParticipation(req: Request, res: Response) {
    try {
      const staffId = req.query?.staff_id
        ? parseInt(req.query.staff_id as string)
        : undefined;
      const projectId = req.query?.project_id
        ? parseInt(req.query.project_id as string)
        : undefined;

      // If both are provided, get specific participation
      if (staffId && projectId) {
        const participation = await participationModel.findByStaffAndProject(
          staffId,
          projectId,
        );
        if (!participation) {
          sendError(res, 404, "Participation not found", [
            { field: "id", message: "No participation found" },
          ]);
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
      sendError(res, 500, "Failed to fetch participation", [
        { field: "id", message: "Error fetching participation" },
      ]);
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
        sendError(res, 400, "Staff is already assigned to this project", [
          {
            field: "staff_id",
            message: "Staff is already assigned to this project",
          },
        ]);
        return;
      }

      const participationData = buildCreateParticipationDTO(req.body);
      const newParticipation =
        await participationModel.create(participationData);

      res.status(201).json(newParticipation);
    } catch (error) {
      console.error("Error creating participation:", error);
      sendError(res, 500, "Failed to create participation", [
        { field: "id", message: "Error creating participation" },
      ]);
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
        sendError(res, 404, "Participation not found", [
          { field: "staff_id", message: "No participation with this staff ID" },
          {
            field: "project_id",
            message: "No participation with this project ID",
          },
        ]);
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
      sendError(res, 500, "Failed to update participation", [
        { field: "id", message: "Error updating participation" },
      ]);
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
        sendError(res, 404, "Participation not found", [
          { field: "staff_id", message: "No participation with this staff ID" },
          {
            field: "project_id",
            message: "No participation with this project ID",
          },
        ]);
        return;
      }

      await participationModel.delete(staffId, projectId);
      res.json({ message: "Participation deleted successfully" });
    } catch (error) {
      console.error("Error deleting participation:", error);
      sendError(res, 500, "Failed to delete participation", [
        { field: "id", message: "Error deleting participation" },
      ]);
    }
  },
};
