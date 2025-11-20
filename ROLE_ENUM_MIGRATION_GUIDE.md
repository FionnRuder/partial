# Role Enum Migration Guide

## Overview

Roles have been converted from free-form `String` to a `UserRole` enum in Prisma. This provides:
- **Type safety** - Prevents invalid roles from being stored
- **Database constraints** - Database enforces valid role values
- **Centralized validation** - Single source of truth for roles
- **Better IDE support** - Autocomplete and type checking

## Changes Made

### 1. Prisma Schema (`server/prisma/schema.prisma`)

**Added UserRole enum:**
```prisma
enum UserRole {
  Admin
  Manager
  ProgramManager  // Note: No space - Prisma enum format
  Engineer
  Viewer
}
```

**Updated models:**
- `User.role`: Changed from `String` to `UserRole`
- `Invitation.role`: Changed from `String` to `UserRole`

### 2. Centralized Role Management (`server/src/lib/roles.ts`)

Created a centralized role management module with:
- `UserRole` enum (TypeScript)
- `VALID_ROLES` array
- Permission helper functions (`canCreateInvitations`, `canManageUsers`, etc.)
- Conversion functions (`roleToPrismaEnum`, `prismaEnumToRole`)

**Important:** Prisma enum uses `ProgramManager` (no space), but the display name is `"Program Manager"` (with space). The conversion functions handle this.

### 3. Updated Controllers

All controllers now:
- Import role validation from `server/src/lib/roles.ts`
- Validate roles using `isValidRole()`
- Convert display names to Prisma enum format using `roleToPrismaEnum()`
- Convert Prisma enum values to display names using `prismaEnumToRole()`

## Role Definitions

### Valid Roles:
1. **Admin** - Full system access, can manage everything
2. **Manager** - Can manage users, teams, programs, and create invitations
3. **Program Manager** - Can manage programs, teams, and create invitations
4. **Engineer** - Can manage work items and parts assigned to them
5. **Viewer** - Read-only access

### Role Permissions:

| Permission | Admin | Manager | Program Manager | Engineer | Viewer |
|------------|-------|---------|-----------------|----------|--------|
| Create Invitations | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage Teams | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage Programs | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Analytics | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage Work Items | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Data | ✅ | ✅ | ✅ | ✅ | ✅ |

## Migration Steps

### 1. Generate Prisma Migration

```bash
cd server
npx prisma migrate dev --name add_user_role_enum
```

This will:
- Create the `UserRole` enum in the database
- Update `User.role` column to use the enum
- Update `Invitation.role` column to use the enum
- **Migrate existing data** - Prisma will attempt to convert existing string values to enum values

### 2. Handle Existing Data

**Important:** If you have existing users with roles that don't match the enum values, you'll need to:

1. **Check existing roles:**
   ```sql
   SELECT DISTINCT role FROM "User";
   ```

2. **Update any invalid roles** before running the migration:
   ```sql
   -- Example: Update "Program Manager" to "ProgramManager"
   UPDATE "User" SET role = 'ProgramManager' WHERE role = 'Program Manager';
   ```

3. **Or update after migration** (if migration fails):
   ```sql
   -- If migration fails, fix data and try again
   UPDATE "User" SET role = 'Engineer' WHERE role NOT IN ('Admin', 'Manager', 'ProgramManager', 'Engineer', 'Viewer');
   ```

### 3. Regenerate Prisma Client

```bash
cd server
npx prisma generate
```

### 4. Update Frontend (if needed)

The frontend already uses string values like `"Program Manager"` (with space). The backend conversion functions handle this automatically, so no frontend changes are needed.

## Role Conversion

### Display Name → Prisma Enum

| Display Name | Prisma Enum Value |
|--------------|-------------------|
| "Admin" | `Admin` |
| "Manager" | `Manager` |
| "Program Manager" | `ProgramManager` |
| "Engineer" | `Engineer` |
| "Viewer" | `Viewer` |

### Prisma Enum → Display Name

| Prisma Enum Value | Display Name |
|-------------------|--------------|
| `Admin` | "Admin" |
| `Manager` | "Manager" |
| `ProgramManager` | "Program Manager" |
| `Engineer` | "Engineer" |
| `Viewer` | "Viewer" |

## API Behavior

### Creating Users/Invitations

**Request (frontend sends display name):**
```json
{
  "role": "Program Manager"  // Display name with space
}
```

**Backend converts to Prisma enum:**
```typescript
const prismaRole = roleToPrismaEnum("Program Manager"); // Returns "ProgramManager"
```

**Database stores:**
```
ProgramManager  // Prisma enum value
```

### Reading Users/Invitations

**Database returns:**
```
ProgramManager  // Prisma enum value
```

**Backend converts to display name:**
```typescript
const displayRole = prismaEnumToRole("ProgramManager"); // Returns "Program Manager"
```

**Response (frontend receives display name):**
```json
{
  "role": "Program Manager"  // Display name with space
}
```

## Testing

After migration, test:

1. ✅ Create user with each role
2. ✅ Create invitation with each role
3. ✅ Verify role validation rejects invalid roles
4. ✅ Verify permission checks work correctly
5. ✅ Verify existing users still work
6. ✅ Verify role display in UI is correct

## Rollback (if needed)

If you need to rollback:

1. **Revert Prisma schema:**
   ```prisma
   role String  // Instead of UserRole
   ```

2. **Create rollback migration:**
   ```bash
   npx prisma migrate dev --name rollback_role_enum
   ```

3. **Remove enum conversion code** from controllers

## Notes

- **Program Manager** is the only role with a space in the display name
- All other roles match exactly between display name and Prisma enum
- The conversion functions handle this automatically
- Frontend code doesn't need changes - it continues using display names
- Backend automatically converts between display names and Prisma enum values

