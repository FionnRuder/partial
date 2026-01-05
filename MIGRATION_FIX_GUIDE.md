# Migration Fix Guide

You're encountering two issues:

1. **Shadow database validation error** - Prisma can't validate migrations against a shadow database
2. **Previous migration conflict** - The `AuditAction` enum already exists in your database

## Solution: Apply Better Auth Migration Manually

Since Prisma migrations are having issues, you have two options:

### Option 1: Run SQL Migration Manually (Recommended)

1. **Open your PostgreSQL database client** (pgAdmin, DBeaver, or any SQL client)

2. **Connect to your database** using the connection string from your `.env` file:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/partial2
   ```

3. **Run the migration SQL file** located at:
   ```
   server/prisma/migrations/20250101000000_add_better_auth_schema/migration.sql
   ```

   You can copy the contents of that file and execute it in your SQL client.

4. **After running the SQL**, mark the migration as applied:
   ```bash
   cd server
   npx prisma migrate resolve --applied 20250101000000_add_better_auth_schema
   ```

5. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

### Option 2: Fix Previous Migration First, Then Apply Better Auth

1. **Mark the conflicting migration as applied** (if the enum already exists):
   ```bash
   cd server
   npx prisma migrate resolve --applied 20250120000000_add_audit_logs
   ```

2. **Then try applying Better Auth migration again**:
   ```bash
   npx prisma migrate deploy
   ```

### Option 3: Use Prisma DB Push (Development Only)

If you're in development and can accept some risk:

```bash
cd server
# This will push the schema directly without migrations
npx prisma db push --accept-data-loss
```

**Warning**: This may cause data loss if there are conflicts. Only use in development!

## Verify Migration Success

After applying the migration, verify it worked:

```bash
cd server
npx prisma studio
```

Check that:
- The `user` table has an `id` column (String, primary key)
- The `session` table exists
- The `account` table exists  
- The `verification` table exists

## Next Steps

Once the migration is applied:

1. **Set environment variables**:
   ```env
   BETTER_AUTH_SECRET=<generate-with-openssl-rand-base64-32>
   BETTER_AUTH_URL=http://localhost:3000
   ```

2. **Test the authentication**:
   - Start your server: `npm run dev`
   - Try signing up: `POST /api/auth/sign-up/email`
   - Try signing in: `POST /api/auth/sign-in/email`

## Troubleshooting

If you encounter foreign key constraint errors:
- Make sure all existing users have valid `userId` values
- The migration preserves `userId` as a unique, non-null field for backward compatibility
- Foreign keys continue to reference `userId` (not the new `id` field)

