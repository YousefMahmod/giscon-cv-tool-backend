# Validators Directory Structure

This directory contains organized validation middleware for all API endpoints.

## Files

### `common.ts`

Shared validation utilities used across all validators:

- `sanitizeString()` - Trims and normalizes whitespace
- `isValidEmail()` - Email format validation
- `validateIdParam()` - Route parameter ID validation
- `validateRequired()` - Generic required fields validator
- `ValidationError` interface

### `staffValidators.ts`

Staff-specific validation middleware:

- `validateStaffCreate` - POST /staff validation
- `validateStaffUpdate` - PUT /staff/:id validation

### `projectValidators.ts`

Project-specific validation middleware:

- `validateProjectCreate` - POST /projects validation
- `validateProjectUpdate` - PUT /projects/:id validation

### `participationValidators.ts`

Participation-specific validation middleware:

- `validateParticipationCreate` - POST /staff/participation validation
- `validateParticipationUpdate` - PUT /staff/participation validation
- `validateParticipationQuery` - GET/DELETE query param validation

## Usage

Import validators from their respective files:

```typescript
// In routes/staffRoutes.ts
import { validateIdParam } from "../middleware/validators/common.js";
import {
  validateStaffCreate,
  validateStaffUpdate,
} from "../middleware/validators/staffValidators.js";

// Apply to routes
router.post(
  "/",
  uploadSingle,
  validateStaffCreate,
  staffController.createStaff,
);
router.put(
  "/:id",
  validateIdParam,
  uploadSingle,
  validateStaffUpdate,
  staffController.updateStaff,
);
```

## Benefits

- **Separation of Concerns**: Each entity has its own validation file
- **Reusability**: Common utilities shared across validators
- **Maintainability**: Easy to locate and update specific validators
- **Testability**: Each validator can be tested independently
- **Scalability**: Easy to add new validators for new entities
