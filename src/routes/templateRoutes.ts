import express from "express";
import { templateController } from "../controllers/templateController.js";
import { validateIdParam } from "../middleware/validators/common.js";
import {
  validateCreateTemplate,
  validateUpdateTemplate,
} from "../middleware/validators/templateValidators.js";

const router = express.Router();

// GET /templates - Get all templates
router.get("/", templateController.getAllTemplates);

// GET /templates/:id - Get template by ID
router.get("/:id", validateIdParam, templateController.getTemplateById);

// POST /templates - Create new template
router.post("/", validateCreateTemplate, templateController.createTemplate);

// PUT /templates/:id - Update template
router.put(
  "/:id",
  validateIdParam,
  validateUpdateTemplate,
  templateController.updateTemplate,
);

// DELETE /templates/:id - Delete template
router.delete("/:id", validateIdParam, templateController.deleteTemplate);

export default router;
