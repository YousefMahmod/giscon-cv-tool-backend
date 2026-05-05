import type { Request, Response } from "express";
import { exportModel } from "../models/exportModel.js";
import { templateModel } from "../models/templateModel.js";
import {
  loadTemplate,
  renderTemplate,
  generatePDF,
} from "../utils/pdfGenerator.js";
import { buildFileUrl } from "../utils/urlBuilder.js";
import sendError from "../utils/errorResponse.js";

export const exportController = {
  // POST /download-cv/:id - Export staff CV as PDF
  async exportStaffCV(req: Request, res: Response) {
    try {
      const staffId = parseInt(req.params.id as string);
      const { template_name, project_ids } = req.body;

      // Parse comma-separated project IDs into array
      const projectIdsArray = project_ids
        .split(",")
        .map((id: string) => parseInt(id.trim(), 10));

      // Fetch staff with selected projects
      const cvData = await exportModel.getStaffWithSelectedProjects(
        staffId,
        projectIdsArray,
      );

      // Validate staff exists
      if (!cvData) {
        sendError(res, 404, "Staff not found", [
          { field: "id", message: "No staff with this ID" },
        ]);
        return;
      }

      // Validate template exists
      const template = await templateModel.findByName(template_name);
      if (!template) {
        sendError(res, 404, "Template not found", [
          { field: "template_name", message: "No template with this name" },
        ]);
        return;
      }

      // Load HTML template
      let html: string;
      try {
        html = await loadTemplate(template_name);
      } catch (error) {
        sendError(res, 500, "Template file not found", [
          {
            field: "template_name",
            message: `Template HTML file for template '${template_name}' does not exist`,
          },
        ]);
        return;
      }

      // Transform profile_picture to full URL
      if (cvData.staff.profile_picture) {
        const fullUrl = buildFileUrl(cvData.staff.profile_picture, req);
        if (fullUrl) {
          cvData.staff.profile_picture = fullUrl;
        }
      }

      // Render template with CV data
      const renderedHtml = renderTemplate(html, cvData, template_name);

      // Generate PDF
      let pdfBuffer: Buffer;
      try {
        pdfBuffer = await generatePDF(renderedHtml, template_name);
      } catch (error) {
        console.error("PDF generation error:", error);
        sendError(res, 500, "Failed to generate PDF");
        return;
      }

      // Create filename with timestamp
      const timestamp = Date.now();
      const staffName = cvData.staff.name.replace(/\s+/g, "-").toLowerCase();
      const filename = `cv-${staffName}-${timestamp}.pdf`;

      // Set response headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      // Stream PDF buffer directly to response
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error exporting CV:", error);
      sendError(res, 500, "Failed to export CV");
    }
  },
};
