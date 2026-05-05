# GISCON CV Tool Backend

A TypeScript/Express backend API for managing staff, projects, and generating customizable PDF resumes with multiple templates.

## Getting Started

### Prerequisites

Before running the server, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
  - brew install postgresql
- **npm** or **yarn** package manager

### Database Setup

Before running the steps below, ensure the PostgreSQL server is running on your machine. On macOS you can start it with Homebrew:

```bash
brew services start postgresql
# or for a specific version, e.g. postgresql@16
brew services start postgresql@16
```

1. Create a PostgreSQL database:

```bash
createdb giscon_cv_tool
```

2. Run the schema migration:

```bash
psql -U your_username -d giscon_cv_tool -f src/db/schema.sql
```

3. Seed the templates (optional):

```bash
psql -U your_username -d giscon_cv_tool -f src/db/seed-templates.sql
```

4. Create a `.env` file in the root directory:

```env
PORT=3001
HOST=localhost
DB_USER=your_username
DB_HOST=localhost
DB_NAME=giscon_cv_tool
DB_PASSWORD=your_password
DB_PORT=5432
```

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd giscon-cv-tool-backend
```

2. Install dependencies:

```bash
npm install
```

### Running the Server

**Development mode** (with hot reload):

```bash
npm run dev
```

The server will start on `http://localhost:3001` (or the port specified in `.env`).

---

## Project Structure

```
giscon-cv-tool-backend/
├── src/
│   ├── index.ts                      # Application entry point
│   ├── .env                          # Environment variables
│   │
│   ├── controllers/                  # Request handlers
│   │   ├── exportController.ts       # CV PDF export logic
│   │   ├── participationController.ts
│   │   ├── projectController.ts
│   │   ├── staffController.ts
│   │   └── templateController.ts
│   │
│   ├── db/                           # Database files
│   │   ├── connection.ts             # PostgreSQL connection setup
│   │   ├── schema.sql                # Database schema definition
│   │   └── seed-templates.sql        # Template seed data
│   │
│   ├── middleware/                   # Express middleware
│   │   ├── errorHandler.ts           # Global error handler
│   │   ├── upload.ts                 # Multer file upload config
│   │   └── validators/               # Request validation
│   │       ├── common.ts
│   │       ├── exportValidators.ts
│   │       ├── participationValidators.ts
│   │       ├── projectValidators.ts
│   │       ├── staffValidators.ts
│   │       └── templateValidators.ts
│   │
│   ├── models/                       # Database models (data layer)
│   │   ├── exportModel.ts            # CV export queries
│   │   ├── participationModel.ts
│   │   ├── projectModel.ts
│   │   ├── staffModel.ts
│   │   └── templateModel.ts
│   │
│   ├── routes/                       # API route definitions
│   │   ├── exportRoutes.ts           # POST /download-cv/:id
│   │   ├── participationRoutes.ts
│   │   ├── projectRoutes.ts
│   │   ├── staffRoutes.ts
│   │   └── templateRoutes.ts
│   │
│   ├── templates/                    # HTML CV templates
│   │   └── icons.ts                  # export icons used in templates
│   │   └── cv/
│   │       ├── atlantic-blue.html    # Dark sidebar template
│   │       ├── classic-serif.html    # Traditional serif template
│   │       └── mercury-flow.html     # Modern header template
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── export.types.ts
│   │   ├── index.ts
│   │   ├── participation.types.ts
│   │   ├── project.types.ts
│   │   ├── staff.types.ts
│   │   └── template.types.ts
│   │
│   ├── uploads/                      # File upload storage
│   │   ├── profiles/                 # Staff profile pictures
│   │   └── templates/                # Template preview images
│   │
│   └── utils/                        # Utility functions
│       ├── dtoBuilders.ts            # Data Transfer Object builders
│       ├── errorResponse.ts          # Error response formatter
│       ├── pdfGenerator.ts           # Puppeteer PDF generation
│       ├── templateRegistry.ts       # Template configuration registry
│       └── urlBuilder.ts             # Full URL builder for files
│
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

---

## Key Libraries

### Core Framework

- **Express** (v5.2.1) - Fast, minimalist web framework for Node.js
- **TypeScript** (v6.0.3) - Static typing for JavaScript
- **Node.js** - JavaScript runtime

### Database

- **pg** (v8.20.0) - PostgreSQL client for Node.js
- Raw SQL queries with connection pooling

### PDF Generation

- **Puppeteer** (v24.42.0) - Headless Chrome for HTML to PDF conversion
- Renders HTML templates with dynamic data into professional PDFs
- A4 format with custom margins per template

### File Upload

- **Multer** (v2.1.1) - Multipart/form-data handling for file uploads
- Used for staff profile pictures and template preview images

### Utilities

- **dotenv** (v17.4.2) - Environment variable management
- **cors** (v2.8.6) - Cross-Origin Resource Sharing middleware

### Development Tools

- **tsx** (v4.21.0) - TypeScript execution for development
- **nodemon** (v3.1.14) - Auto-restart server on file changes
- **@types/** packages - TypeScript type definitions

---

## API Endpoints

### Staff Management

- `GET /staff` - Get all staff
- `GET /staff/:id` - Get staff by ID
- `POST /staff` - Create new staff (with profile picture upload)
- `PUT /staff/:id` - Update staff
- `DELETE /staff/:id` - Delete staff

### Project Management

- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Participation (Staff-Project Link)

- `GET /participation` - Get all participations
- `GET /participation/:staffId/:projectId` - Get specific participation
- `POST /participation` - Link staff to project
- `PUT /participation/:staffId/:projectId` - Update participation
- `DELETE /participation/:staffId/:projectId` - Remove participation

### Template Management

- `GET /templates` - Get all CV templates
- `GET /templates/:id` - Get template by ID
- `POST /templates` - Create new template
- `PUT /templates/:id` - Update template
- `DELETE /templates/:id` - Delete template

### CV Export

- `POST /download-cv/:staffId` - Generate and download CV as PDF
  ```json
  {
    "template_name": "classic-serif",
    "project_ids": "1,2,3"
  }
  ```

---

## Available CV Templates

1. **classic-serif** - Traditional professional CV with serif fonts
2. **mercury-flow** - Modern CV with gray header banner
3. **atlantic-blue** - Two-column CV with dark sidebar

Each template supports dynamic data insertion and PDF generation with custom styling.

---

## License

MIT
