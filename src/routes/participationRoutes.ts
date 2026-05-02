import express from "express";
import { participationController } from "../controllers/participationController.js";

const router = express.Router();

// GET /staff/participation?staff_id=X&project_id=Y - Get participation details
router.get("/", participationController.getParticipation);

// POST /staff/participation - Assign staff to project
router.post("/", participationController.createParticipation);

// PUT /staff/participation - Update participation
router.put("/", participationController.updateParticipation);

// DELETE /staff/participation?staff_id=X&project_id=Y - Remove staff from project
router.delete("/", participationController.deleteParticipation);

export default router;
