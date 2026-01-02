# Migration: Remove userId/cognitoId and Convert to String IDs

This migration performs the following operations:

## Steps

1. **Ensures User table has 'id' column as primary key**
   - Adds `id` column if it doesn't exist
   - Generates IDs for existing users
   - Sets `id` as primary key

2. **Drops all foreign key constraints** that reference userId columns

3. **Converts all userId columns from Int to String**:
   - `DisciplineTeam.teamManagerUserId`
   - `Program.programManagerUserId`
   - `Part.assignedUserId`
   - `WorkItem.authorUserId` and `assignedUserId`
   - `Attachment.uploadedByUserId`
   - `Comment.commenterUserId`
   - `StatusLog.engineerUserId`
   - `Invitation.createdByUserId` and `usedByUserId`
   - `Feedback.submittedByUserId` and `resolvedByUserId`
   - `AuditLog.userId`

4. **Removes userId and cognitoId columns** from User table

5. **Recreates all foreign key constraints** with proper ON DELETE/ON UPDATE actions

6. **Adds indexes** on foreign key columns for performance

## How to Run

### Option 1: Run via Prisma (Recommended)

```bash
cd server
npx prisma migrate resolve --rolled-back 20250122000000_remove_userid_cognitoid_convert_to_string_ids
npx prisma migrate deploy
```

### Option 2: Run Manually in pgAdmin or psql

1. Open the migration file: `migration.sql`
2. Copy the entire contents
3. Execute in your PostgreSQL database (pgAdmin, psql, or your preferred tool)
4. Mark as applied:
   ```bash
   npx prisma migrate resolve --applied 20250122000000_remove_userid_cognitoid_convert_to_string_ids
   ```

## Important Notes

- **Backup your database first!** This migration modifies critical data structures.
- The migration is **idempotent** - safe to run multiple times (it checks for existence before operations).
- The migration maps existing integer `userId` values to the corresponding string `id` values from the User table.
- If a user's `id` doesn't exist, the foreign key will be set to NULL (for nullable columns).

## Troubleshooting

If you encounter errors:

1. **Check if User table has 'id' column**: The migration should create it, but verify first
2. **Check foreign key constraints**: Some may have different names - adjust the migration if needed
3. **Verify data integrity**: Ensure all userId references have corresponding User records

## Rollback

If you need to rollback, you would need to:
1. Re-add `userId` and `cognitoId` columns to User table
2. Convert all string IDs back to integers (requires mapping)
3. Recreate foreign keys

**Note**: Rollback is complex and may result in data loss. Always backup first!

