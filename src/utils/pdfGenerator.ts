import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";
import type { ExportCVData } from "../types/export.types.js";
import { getTemplateConfig, renderProjects } from "./templateRegistry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load HTML template file by template name
 */
export async function loadTemplate(templateName: string): Promise<string> {
  const config = getTemplateConfig(templateName);
  if (!config) {
    throw new Error(`Template ${templateName} not found in registry`);
  }

  const templatePath = path.join(__dirname, "../templates", config.path);

  try {
    const html = await fs.readFile(templatePath, "utf-8");
    return html;
  } catch (error) {
    throw new Error(`Template ${templateName} not found`);
  }
}

/**
 * Render HTML template with CV data
 */
export function renderTemplate(
  html: string,
  data: ExportCVData,
  templateName: string,
): string {
  let rendered = html;

  // Replace staff placeholders
  rendered = rendered.replace(/{{staffName}}/g, data.staff.name || "");
  rendered = rendered.replace(/{{email}}/g, data.staff.email || "");
  rendered = rendered.replace(
    /{{jobTitle}}/g,
    data.staff.job_title || "Professional",
  );

  // Phone - simple inline text
  const phoneText = data.staff.phone ? `<span>${data.staff.phone}</span>` : "";
  rendered = rendered.replace(/{{phone}}/g, phoneText);

  // Profile picture - img element or placeholder
  const profilePicture = data.staff.profile_picture
    ? `<img src="${data.staff.profile_picture}" alt="${data.staff.name}" />`
    : `<span class="profile-placeholder-text">Photo</span>`;
  rendered = rendered.replace(/{{profilePicture}}/g, profilePicture);

  // Bio - just the text content
  rendered = rendered.replace(/{{bio}}/g, data.staff.bio || "No bio available");

  // Skills - just the list items
  let skillsList = "";
  if (data.staff.skills) {
    const skillsArray = data.staff.skills.split(",").map((s) => s.trim());
    skillsList = skillsArray.map((skill) => `<li>${skill}</li>`).join("");
  }
  rendered = rendered.replace(/{{skillsList}}/g, skillsList);

  // Projects content - use template registry
  const projectsContent = renderProjects(templateName, data.projects);
  rendered = rendered.replace(/{{projectsContent}}/g, projectsContent);

  return rendered;
}

/**
 * Generate PDF from HTML content using Puppeteer
 */
export async function generatePDF(
  html: string,
  templateName: string,
): Promise<Buffer> {
  let browser = null;

  try {
    // Launch a new browser instance
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();

    // Set content and wait for rendering
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Get margins from template configuration
    const config = getTemplateConfig(templateName);
    const margins = config?.margins || {
      top: "15mm",
      right: "15mm",
      bottom: "15mm",
      left: "15mm",
    };

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: margins,
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  } finally {
    // Always close the browser
    if (browser) {
      await browser.close();
    }
  }
}
