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

// GET /staff/with-projects - Get all staff with projects from participation table and return with each project its details from project table
router.get("/with-projects", staffController.getAllStaffWithProjects);

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

export default router;
