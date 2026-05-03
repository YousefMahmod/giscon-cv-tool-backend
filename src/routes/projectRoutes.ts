import express from "express";
import { projectController } from "../controllers/projectController.js";
import { validateIdParam } from "../middleware/validators/common.js";
import {
  validateProjectCreate,
  validateProjectUpdate,
} from "../middleware/validators/projectValidators.js";

const router = express.Router();

// GET /projects - Get all projects
router.get("/", projectController.getAllProjects);

// POST /projects - Create new project
router.post("/", validateProjectCreate, projectController.createProject);

// PUT /projects/:id - Update project
router.put(
  "/:id",
  validateIdParam,
  validateProjectUpdate,
  projectController.updateProject,
);

// DELETE /projects/:id - Delete project
router.delete("/:id", validateIdParam, projectController.deleteProject);

// GET /projects/:id - Get project details with assigned staffs
router.get("/:id", validateIdParam, projectController.getProjectWithStaffs);

export default router;
