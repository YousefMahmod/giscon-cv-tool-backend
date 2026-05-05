import express from "express";
import { exportController } from "../controllers/exportController.js";
import { validateIdParam } from "../middleware/validators/common.js";
import { validateExportCV } from "../middleware/validators/exportValidators.js";

const router = express.Router();

// POST /download-cv/:id - Export staff CV as PDF
router.post(
  "/download-cv/:id",
  validateIdParam,
  validateExportCV,
  exportController.exportStaffCV,
);

export default router;
