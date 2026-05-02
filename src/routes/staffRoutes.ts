import express from "express";
import { staffController } from "../controllers/staffController.js";
import { uploadSingle } from "../middleware/upload.js";
import { validateIdParam } from "../middleware/validators/common.js";
import {
  validateStaffCreate,
  validateStaffUpdate,
} from "../middleware/validators/staffValidators.js";

const router = express.Router();

// GET /staff - Get all staff
router.get("/", staffController.getAllStaff);

// POST /staff - Create new staff (with profile picture)
router.post(
  "/",
  uploadSingle,
  validateStaffCreate,
  staffController.createStaff,
);

// PUT /staff/:id - Update staff
router.put(
  "/:id",
  validateIdParam,
  uploadSingle,
  validateStaffUpdate,
  staffController.updateStaff,
);

// GET /staff/:id - Get staff by ID with projects
router.get("/:id", validateIdParam, staffController.getStaffById);

// GET /staff/:id/projects - Get staff with their projects
router.get("/:id/projects", validateIdParam, staffController.getStaffProjects);

export default router;
