# Prisma Client Regeneration Required

## Issue
The `Invitation.role` field was updated in the Prisma schema to use the `UserRole` enum instead of `String`. The database was already migrated, but the Prisma client needs to be regenerated to match.

## Solution

1. **Stop the server** (if it's running)

2. **Regenerate Prisma Client**:
   ```bash
   cd server
   npx prisma generate
   ```

3. **Restart the server**

## What Changed

- Updated `server/prisma/schema.prisma`: Changed `Invitation.role` from `String` to `UserRole` enum
- The database was already migrated in a previous migration (`20251118050813_add_user_role_enum`)
- The code in `invitationController.ts` is already using `roleToPrismaEnum()` to convert display names to enum values

## Temporary Workaround

The code currently uses `(prisma as any).invitation.create()` to bypass TypeScript type checking until the Prisma client is regenerated. This is safe because:
- The database already uses the enum type
- The `roleToPrismaEnum()` function ensures correct enum values are passed
- Once Prisma client is regenerated, we can remove the `as any` assertions

