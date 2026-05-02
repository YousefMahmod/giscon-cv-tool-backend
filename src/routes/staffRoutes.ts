import express from "express";
import { staffController } from "../controllers/staffController.js";
import { uploadSingle } from "../middleware/upload.js";

const router = express.Router();

// GET /staff - Get all staff
router.get("/", staffController.getAllStaff);

// POST /staff - Create new staff (with optional image upload)
router.post("/", uploadSingle, staffController.createStaff);

// PUT /staff/:id - Update staff (with optional image upload)
router.put("/:id", uploadSingle, staffController.updateStaff);

// GET /staff/:id - Get staff details with projects
router.get("/:id", staffController.getStaffById);

// GET /staff/:id/projects - Get staff with their projects list
router.get("/:id/projects", staffController.getStaffProjects);

export default router;
