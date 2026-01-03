# Fixing Failed Prisma Migration on Railway

If you see this error:
```
Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied.
The `20250101000000_add_better_auth_schema` migration started at ... failed
```

## Quick Fix (Recommended)

### Via Railway Web Console:

**Step-by-step:**

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click on your **project** (the one containing your PostgreSQL service)
3. Click on your **PostgreSQL** service card (it should show "PostgreSQL" as the service type)
4. Look for a **"Connect"** or **"Data"** tab/button at the top of the service page
5. Click on it to see connection options
6. You should see tabs like **"Variables"**, **"Database"**, **"Query"**, or **"SQL"**
7. Click the **"Query"** or **"SQL"** tab
8. You should see a SQL query editor/text area
9. Paste and run this SQL:

```sql
UPDATE "_prisma_migrations" 
SET "finished_at" = NOW(), 
    "rolled_back_at" = NOW(),
    "logs" = 'Manually resolved - migration was rolled back'
WHERE "migration_name" = '20250101000000_add_better_auth_schema' 
  AND "finished_at" IS NULL;
```

6. Redeploy your server service

### Via Railway CLI (Easiest Alternative):

If you have Railway CLI installed:

```bash
# Install Railway CLI if you haven't (one-time)
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project (if not already linked)
railway link

# Connect to your PostgreSQL service
railway connect

# This will open a psql connection. Then run:
UPDATE "_prisma_migrations" 
SET "finished_at" = NOW(), 
    "rolled_back_at" = NOW(),
    "logs" = 'Manually resolved - migration was rolled back'
WHERE "migration_name" = '20250101000000_add_better_auth_schema' 
  AND "finished_at" IS NULL;

# Or use Prisma's resolve command (if you're in the server directory):
npx prisma migrate resolve --rolled-back 20250101000000_add_better_auth_schema
```

### Via External Database Client:

If the Query tab isn't available, you can use any PostgreSQL client:

1. Get your database connection string from Railway:
   - Go to your PostgreSQL service
   - Click **"Variables"** tab
   - Copy the `DATABASE_URL` or `POSTGRES_URL` value

2. Connect using a tool like:
   - **pgAdmin** (GUI)
   - **DBeaver** (GUI)
   - **TablePlus** (GUI)
   - **psql** (command line)
   - **VS Code** with PostgreSQL extension

3. Run the SQL query from the web console section above

### Via Local Script:

If you have `DATABASE_URL` set to your Railway database:

```bash
cd server
npm run resolve-migrations
```

## What This Does

The migration `20250101000000_add_better_auth_schema` failed because it tried to modify a `user` table that didn't exist yet (it runs before the initial migration that creates the table).

We've fixed the migration to handle this case, but Prisma won't apply new migrations until you resolve the failed one. Marking it as "rolled back" tells Prisma that the migration was intentionally rolled back, allowing new migrations to proceed.

After resolving, the fixed migration will run successfully on the next deployment.

