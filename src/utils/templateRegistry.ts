import type { ExportCVData } from "../types/export.types.js";

interface ProjectData {
  name: string;
  role: string;
  client: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  responsibilities?: string;
}

interface TemplateConfig {
  path: string;
  margins: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  renderProject: (
    project: ProjectData,
    dateRange: string,
    location: string,
  ) => string;
}

/**
 * Format date to readable string
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Template Registry
 * Define all template-specific configurations and rendering logic here
 */
export const TemplateRegistry: Record<string, TemplateConfig> = {
  "classic-serif": {
    path: "cv/classic-serif.html",
    margins: { top: "0", right: "0", bottom: "0", left: "0" },
    renderProject: (project, dateRange, location) => {
      const responsibilities = buildResponsibilitiesList(
        project.responsibilities,
      );

      return `<div class="project">
                <div class="project-header">
                  <div class="project-title-row">
                    <div class="project-title">${project.role}</div>
                    <div class="project-dates">${dateRange}</div>
                  </div>
                  <div class="project-company-row">
                    <div class="project-company">${project.client || ""}</div>
                    <div class="project-location">${location}</div>
                  </div>
                </div>
                ${responsibilities}
              </div>`;
    },
  },

  "mercury-flow": {
    path: "cv/mercury-flow.html",
    margins: { top: "0", right: "0", bottom: "0", left: "0" },
    renderProject: (project, dateRange, location) => {
      const responsibilities = buildResponsibilitiesList(
        project.responsibilities,
      );

      return `<div class="project">
                <div class="project-left">
                    <div class="project-dates">${dateRange}</div>
                    <div class="project-location">${location}</div>
                </div>
                <div class="project-right">
                    <div class="project-company">${project.client || ""}</div>
                    <div class="project-title">${project.role}</div>
                    <ul class="project-responsibilities">
                        ${responsibilities} <!-- Each bullet as an <li> -->
                    </ul>
                </div>
            </div>`;
    },
  },

  "atlantic-blue": {
    path: "cv/atlantic-blue.html",
    margins: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    renderProject: (project, dateRange, location) => {
      const datesLocation = [dateRange, location].filter(Boolean).join(" | ");
      const responsibilities = buildResponsibilitiesList(
        project.responsibilities,
      );

      return `<div class="project">
                <div class="project-header">
                <div class="project-title">${project.name}</div>
                <div class="project-company">${project.role}</div>
                ${datesLocation ? `<div class="project-dates-location">${datesLocation}</div>` : ""}
                </div>
                ${responsibilities}
              </div>`;
    },
  },
};

/**
 * Get template configuration by name
 */
export function getTemplateConfig(templateName: string): TemplateConfig | null {
  return TemplateRegistry[templateName] || null;
}

/**
 * Render projects based on template configuration
 */
export function renderProjects(
  templateName: string,
  projects: ProjectData[],
): string {
  const config = getTemplateConfig(templateName);
  if (!config) {
    throw new Error(`Template configuration for '${templateName}' not found`);
  }

  if (projects.length === 0) {
    return `<div class="empty-projects">No projects selected</div>`;
  }

  return projects
    .map((project) => {
      const dateRange =
        project.start_date && project.end_date
          ? `${formatDate(project.start_date)} — ${formatDate(project.end_date)}`
          : project.start_date
            ? `${formatDate(project.start_date)} — Present`
            : "";

      const location = project.location || "";

      return config.renderProject(project, dateRange, location);
    })
    .join("");
}

/**
 * Build responsibilities list from string
 */
function buildResponsibilitiesList(responsibilities?: string): string {
  if (!responsibilities) return "";

  const respList = responsibilities
    .split("\n")
    .map((r) => r.trim())
    .filter((r) => r.length > 0)
    .map((r) => `<li>${r}</li>`)
    .join("");

  return respList
    ? `<ul class="project-responsibilities">${respList}</ul>`
    : "";
}
