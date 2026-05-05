# GISCON CV Tool Backend - Project Plan

## Project Overview

A staff and project management system using PostgreSQL to track employees, their projects, and participation details.

---

## Database Schema

### Tables

#### 1. **staff** table

- `id` (PRIMARY KEY, SERIAL)
- `name` (VARCHAR, NOT NULL)
- `email` (VARCHAR, UNIQUE, NOT NULL)
- `phone` (VARCHAR)
- `profile_picture` (VARCHAR) - URL/path to image
- `bio` (TEXT) - Staff member biography/description
- `skills` (TEXT) - comma-separated string
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### 2. **projects** table

- `id` (PRIMARY KEY, SERIAL)
- `name` (VARCHAR, NOT NULL)
- `client` (VARCHAR, NOT NULL)
- `location` (VARCHAR)
- `start_date` (DATE)
- `end_date` (DATE)
- `technologies` (TEXT) - comma-separated string
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### 3. **participation** table (join table)

- `id` (PRIMARY KEY, SERIAL)
- `staff_id` (FOREIGN KEY -> staff.id)
- `staff_name` (VARCHAR)
- `project_id` (FOREIGN KEY -> projects.id)
- `project_name` (VARCHAR)
- `role` (VARCHAR, NOT NULL)
- `responsibilities` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- UNIQUE constraint on (staff_id, project_id)

---

## Implementation Steps

### Phase 1: Database Setup

- [x] Install and configure PostgreSQL locally
- [x] Create `.env` file with database credentials:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=giscon_cv_tool
  DB_USER=your_username
  DB_PASSWORD=your_password
  PORT=5000
  ```
- [x] Create database connection file (`src/db/connection.ts`)
- [x] Create SQL migration file for all tables (`src/db/schema.sql`)
- [x] Run migration to create tables

### Phase 2: Project Structure Setup

- [x] Create folder structure:
  ```
  src/
    ├── db/
    │   ├── connection.ts
    │   └── schema.sql
    ├── models/
    │   ├── staffModel.ts
    │   ├── projectModel.ts
    │   └── participationModel.ts
    ├── controllers/
    │   ├── staffController.ts
    │   ├── projectController.ts
    │   └── participationController.ts
    ├── routes/
    │   ├── staffRoutes.ts
    │   ├── projectRoutes.ts
    │   └── participationRoutes.ts
    ├── middleware/
    │   └── errorHandler.ts
    ├── types/
    │   └── index.ts
    └── index.ts
  ```

### Phase 3: File Upload Configuration

- [x] Install `multer` for handling file uploads: `yarn add multer`
- [x] Install `@types/multer`: `yarn add -D @types/multer`
- [x] Create upload middleware (`src/middleware/upload.ts`)
- [x] Configure storage for profile pictures in `/uploads/profiles/`
- [x] Add file validation (image types only, 5MB max)
- [x] Add upload middleware to staff routes

### Phase 4: Staff API Implementation ✅

#### GET `/staff` - Fetch all staff

- [x] Create route handler
- [x] Query: `SELECT * FROM staff ORDER BY created_at DESC`
- [x] Return array of staff without projects

#### POST `/staff` - Create new staff

- [x] Accept multipart/form-data for image upload
- [x] Validate required fields (name, email)
- [x] Handle optional profile picture upload
- [x] Insert into database
- [x] Return created staff with id

#### PUT `/staff/:id` - Update staff

- [x] Accept staff id as parameter
- [x] Accept optional image upload
- [x] Update staff record
- [x] Handle image replacement if new image provided
- [x] Return updated staff

#### GET `/staff/:id` - Get staff details with projects

- [x] Query staff basic info
- [x] JOIN with participation and projects tables
- [x] Return staff with array of projects (including role, responsibilities)
- [x] Query structure:
  ```sql
  SELECT s.*, p.id as project_id, p.name as project_name, p.client,
         pt.role, pt.responsibilities
  FROM staff s
  LEFT JOIN participation pt ON s.id = pt.staff_id
  LEFT JOIN projects p ON pt.project_id = p.id
  WHERE s.id = $1
  ```

#### GET `/staff/:id/projects` - Get staff with their projects

- [x] Query staff id and name
- [x] Query all projects for this staff
- [x] Return staff basic info with projects array

### Phase 5: Project API Implementation ✅

#### GET `/projects` - Fetch all projects

- [x] Create route handler
- [x] Query: `SELECT * FROM projects ORDER BY start_date DESC`
- [x] Return array of projects

#### POST `/projects` - Create new project

- [x] Validate required fields (name, client)
- [x] Insert into database
- [x] Return created project with id

#### PUT `/projects/:id` - Update project

- [x] Accept project id as parameter
- [x] Update project record
- [x] Return updated project

#### DELETE `/projects/:id` - Delete project

- [x] Check if project has staff assigned (check participation table)
- [x] If has staff, return error 400: "Cannot delete project with assigned staff"
- [x] If no staff, delete project
- [x] Return success message

### Phase 6: Participation API Implementation ✅

#### POST `/staff/participation` - Assign staff to project

- [x] Validate required fields (staff_id, project_id, role)
- [x] staff_name will be sent in payload
- [x] project_name will be be sent in payload
- [x] Insert into participation table
- [x] Handle duplicate assignment error (UNIQUE constraint)
- [x] Return created participation record

#### PUT `/staff/participation` - Update participation

- [x] Accept staff_id and project_id in body
- [x] Update role and/or responsibilities
- [x] Return updated participation record

#### DELETE `/staff/participation` - Remove staff from project

- [x] Accept staff_id and project_id as query params
- [x] Delete participation record
- [x] Return success message

#### GET `/staff/participation` - Get participation details

- [x] Accept staff_id and project_id as query params
- [x] Return participation record

### Phase 7: Error Handling & Validation ✅

- [x] Create global error handler middleware
- [x] Add request validation middleware for all endpoints
- [x] Add input sanitization (trim, normalize spaces)
- [x] Validate email format, required fields, data types
- [x] Validate ID parameters and query strings
- [x] Handle database errors gracefully (duplicate keys, foreign keys, not null)
- [x] Handle Multer file upload errors
- [x] Add proper HTTP status codes (400, 404, 500)
- [x] Return consistent error response format with field-level errors
- [x] Apply validation middleware to all routes

### Phase 8: Testing

- [ ] Test all staff endpoints with Postman/Thunder Client
- [ ] Test all project endpoints
- [ ] Test all participation endpoints
- [ ] Test file upload functionality
- [ ] Test edge cases (deleting project with staff, duplicate participation, etc.)
- [ ] Test error scenarios

### Phase 9: Optimization & Polish

- [ ] Add database indexes for frequently queried columns
- [ ] Add pagination for list endpoints
- [ ] Add search/filter capabilities
- [ ] Add input sanitization
- [ ] Review and optimize SQL queries
- [ ] Add API documentation comments

### Phase 10: CV Export & Template Management ✅

#### Template Management API

- [x] Create `templates` table in database schema with version field
- [x] Create template types and interfaces (`src/types/template.types.ts`)
- [x] Create template model with CRUD operations (`src/models/templateModel.ts`)
- [x] Create template validators (`src/middleware/validators/templateValidators.ts`)
- [x] Create template controller (`src/controllers/templateController.ts`)
- [x] Create template routes (`src/routes/templateRoutes.ts`)
- [x] Register template routes in main app

#### CV Export Feature

- [x] Install Puppeteer: `yarn add puppeteer`
- [x] Create HTML template directory (`src/templates/cv/`)
- [x] Create initial CV template (`template-1.html`) with placeholders
- [x] Create export types (`src/types/export.types.ts`)
- [x] Create export model with JOIN query (`src/models/exportModel.ts`)
- [x] Create export validators (`src/middleware/validators/exportValidators.ts`)
- [x] Create PDF generator utility (`src/utils/pdfGenerator.ts`)
  - Load template by ID
  - Render template with CV data
  - Generate PDF using Puppeteer
  - Return PDF buffer (no file storage)
- [x] Create export controller (`src/controllers/exportController.ts`)
- [x] Create export routes (`src/routes/exportRoutes.ts`)
- [x] Register export routes in main app

#### Template Assets & Seeding

- [x] Create template preview images directory (`uploads/templates/`)
- [x] Create seed file for initial templates (`src/db/seed-templates.sql`)
- [x] Add documentation for template management

---

## API Endpoints Summary

### Staff Endpoints

| Method | Endpoint              | Description                            |
| ------ | --------------------- | -------------------------------------- |
| GET    | `/staff`              | Get all staff (without projects)       |
| POST   | `/staff`              | Create new staff (with optional image) |
| PUT    | `/staff/:id`          | Update staff by ID                     |
| GET    | `/staff/:id`          | Get staff details with projects        |
| GET    | `/staff/:id/projects` | Get staff with their projects list     |

### Project Endpoints

| Method | Endpoint        | Description                           |
| ------ | --------------- | ------------------------------------- |
| GET    | `/projects`     | Get all projects                      |
| POST   | `/projects`     | Create new project                    |
| PUT    | `/projects/:id` | Update project by ID                  |
| DELETE | `/projects/:id` | Delete project (if no staff assigned) |

### Participation Endpoints

| Method | Endpoint                                       | Description                  |
| ------ | ---------------------------------------------- | ---------------------------- |
| POST   | `/staff/participation`                         | Assign staff to project      |
| PUT    | `/staff/participation`                         | Update role/responsibilities |
| DELETE | `/staff/participation?staff_id=X&project_id=Y` | Remove staff from project    |
| GET    | `/staff/participation?staff_id=X&project_id=Y` | Get participation details    |

### Template Endpoints

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| GET    | `/templates`     | Get all CV templates  |
| GET    | `/templates/:id` | Get template by ID    |
| POST   | `/templates`     | Create new template   |
| PUT    | `/templates/:id` | Update template by ID |
| DELETE | `/templates/:id` | Delete template       |

### CV Export Endpoints

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| POST   | `/download-cv/:id` | Export staff CV as PDF |

**Export Request Body:**

```json
{
  "template_id": 1,
  "project_ids": "1,2,3"
}
```

---

## Dependencies to Install

```bash
# Already installed
yarn add express cors dotenv pg multer puppeteer

# Dev dependencies
yarn add -D @types/cors @types/multer
```

---

## Notes

- All timestamps should use PostgreSQL's TIMESTAMP type
- Skills and technologies are stored as comma-separated strings
- Profile pictures are stored as file paths/URLs
- Participation table stores denormalized staff_name and project_name for easier querying
- Project deletion is protected if staff are assigned
- Use parameterized queries to prevent SQL injection
- **CV Export**: PDFs are generated in-memory using Puppeteer, never stored on server
- **CV Export**: Invalid project IDs are silently skipped during export
- **CV Export**: Template HTML files must exist in `src/templates/cv/template-{id}.html`
- **CV Export**: Template preview images stored in `uploads/templates/`
- **CV Export**: Each template has a version field for tracking updates
