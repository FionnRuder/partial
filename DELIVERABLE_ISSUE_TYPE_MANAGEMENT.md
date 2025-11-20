# DeliverableType and IssueType Management

## Overview

DeliverableType and IssueType have been converted from Prisma enums to table-based models to allow dynamic management by Admins, Managers, and Program Managers.

## Changes Made

### 1. Schema Changes (`server/prisma/schema.prisma`)

- **Removed**: `enum DeliverableType` and `enum IssueType`
- **Added**: `DeliverableType` and `IssueType` models (tables)
- **Updated**: `IssueDetail` and `DeliverableDetail` to reference the new tables via foreign keys

### 2. New Controllers

- `server/src/controllers/deliverableTypeController.ts` - CRUD operations for deliverable types
- `server/src/controllers/issueTypeController.ts` - CRUD operations for issue types

### 3. New Routes

- `GET /deliverableTypes` - Get all deliverable types for organization
- `POST /deliverableTypes` - Create new deliverable type (Admin/Manager/Program Manager only)
- `DELETE /deliverableTypes/:id` - Delete deliverable type (Admin/Manager/Program Manager only)

- `GET /issueTypes` - Get all issue types for organization
- `POST /issueTypes` - Create new issue type (Admin/Manager/Program Manager only)
- `DELETE /issueTypes/:id` - Delete issue type (Admin/Manager/Program Manager only)

### 4. Role-Based Access Control

- **View**: All authenticated users can view types
- **Create/Delete**: Only Admins, Managers, and Program Managers can create/delete types
- **Protection**: System types (isSystem=true) cannot be deleted
- **In-Use Protection**: Types that are in use by existing deliverables/issues cannot be deleted

### 5. System Types Initialization

When a new organization is created, system types are automatically initialized with the original enum values.

## Migration Required

⚠️ **IMPORTANT**: Before deploying, you must:

1. **Create and run a migration** to:
   - Create the new `DeliverableType` and `IssueType` tables
   - Migrate existing enum values to the new tables
   - Update `IssueDetail` and `DeliverableDetail` to use foreign keys
   - Seed system types for existing organizations

2. **Update workItemController** to use the new table-based approach:
   - Change from enum values to type IDs when creating/updating work items
   - Update queries to join with type tables

3. **Update frontend** to:
   - Fetch types from API instead of hardcoded enum values
   - Display types in dropdowns/selects
   - Allow Admins/Managers/Program Managers to manage types

## Migration Steps

### Step 1: Create Migration

```bash
cd server
npx prisma migrate dev --create-only --name convert_types_to_tables
```

### Step 2: Edit Migration SQL

The migration SQL needs to:
1. Create `DeliverableType` and `IssueType` tables
2. For each existing organization:
   - Insert system types
3. Update `IssueDetail` and `DeliverableDetail`:
   - Add new foreign key columns
   - Populate foreign keys based on enum values
   - Drop old enum columns
4. Drop the enum types

### Step 3: Update workItemController

Update `createWorkItem` and `updateWorkItem` to:
- Accept type IDs or type names
- Look up type IDs if names are provided
- Use type IDs when creating/updating details

### Step 4: Regenerate Prisma Client

```bash
npx prisma generate
```

## API Usage Examples

### Get Deliverable Types
```bash
GET /deliverableTypes
Authorization: (session cookie)
```

Response:
```json
[
  {
    "id": 1,
    "organizationId": 1,
    "name": "SystemSubsystemRequirementsSpecificationSRS",
    "isSystem": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 28,
    "organizationId": 1,
    "name": "Custom Type",
    "isSystem": false,
    "createdAt": "2024-01-02T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
]
```

### Create Deliverable Type
```bash
POST /deliverableTypes
Authorization: (session cookie)
Content-Type: application/json

{
  "name": "Custom Deliverable Type"
}
```

### Delete Deliverable Type
```bash
DELETE /deliverableTypes/:id
Authorization: (session cookie)
```

**Error Responses:**
- `403`: Cannot delete system types
- `409`: Type is in use by existing deliverables

## Security Considerations

1. **Organization Isolation**: Types are scoped to organizations
2. **Role-Based Access**: Only privileged roles can modify types
3. **System Type Protection**: System types cannot be deleted
4. **In-Use Protection**: Types in use cannot be deleted

## Next Steps

1. ✅ Schema updated
2. ✅ Controllers created
3. ✅ Routes created
4. ✅ Role-based middleware created
5. ⏳ Migration needs to be created and run
6. ⏳ workItemController needs to be updated
7. ⏳ Frontend UI needs to be created

