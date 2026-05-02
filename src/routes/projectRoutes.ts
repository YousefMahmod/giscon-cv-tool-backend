import express from "express";
import { projectController } from "../controllers/projectController.js";

const router = express.Router();

// GET /projects - Get all projects
router.get("/", projectController.getAllProjects);

// POST /projects - Create new project
router.post("/", projectController.createProject);

// PUT /projects/:id - Update project
router.put("/:id", projectController.updateProject);

// DELETE /projects/:id - Delete project
router.delete("/:id", projectController.deleteProject);

export default router;
