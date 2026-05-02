import express from "express";
import { participationController } from "../controllers/participationController.js";
import {
  validateParticipationCreate,
  validateParticipationUpdate,
  validateParticipationQuery,
} from "../middleware/validators/participationValidators.js";

const router = express.Router();

// GET /staff/participation - Get participation with optional filters
router.get(
  "/",
  validateParticipationQuery,
  participationController.getParticipation,
);

// POST /staff/participation - Assign staff to project
router.post(
  "/",
  validateParticipationCreate,
  participationController.createParticipation,
);

// PUT /staff/participation - Update participation
router.put(
  "/",
  validateParticipationUpdate,
  participationController.updateParticipation,
);

// DELETE /staff/participation - Remove staff from project
router.delete(
  "/",
  validateParticipationQuery,
  participationController.deleteParticipation,
);

export default router;
