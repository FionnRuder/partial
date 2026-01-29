# Running WorkItemDependency Migration on Railway

The `WorkItemDependency` table is missing from your production database. This migration adds it.

## Option 1: Run Migration via Railway Database Console (Easiest)

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click on your **project** (the one containing your PostgreSQL service)
3. Click on your **PostgreSQL** service card
4. Click the **"Query"** or **"SQL"** tab
5. Copy and paste the contents of `server/prisma/migrations/20260129000000_add_work_item_dependency/migration.sql`
6. Click **"Run"** or **"Execute"**
7. Verify the table was created by running: `SELECT * FROM "WorkItemDependency" LIMIT 1;`

## Option 2: Run Migration via Railway CLI

```bash
# Install Railway CLI if you haven't (one-time)
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project (if not already linked)
railway link

# Set the DATABASE_URL environment variable
railway variables

# Run the migration
cd server
railway run npx prisma migrate deploy
```

## Option 3: Add Migration Step to Railway Build (Recommended for Future)

Add this to your Railway service's build command or create a separate migration service:

1. In Railway dashboard, go to your **server** service
2. Click **"Settings"** → **"Deploy"**
3. Add a **"Deploy Command"** or modify the build command to include:

```bash
npm run build && npx prisma migrate deploy && npm start
```

Or create a separate Railway service that runs migrations:

1. Create a new service in Railway
2. Set the **"Source"** to your repository
3. Set the **"Root Directory"** to `server`
4. Set the **"Start Command"** to: `npx prisma migrate deploy`
5. Set it to run on every deploy

## Option 4: Run Migration Locally (If DATABASE_URL points to Railway)

If you have `DATABASE_URL` set to your Railway database:

```bash
cd server
npx prisma migrate deploy
```

## Verify Migration

After running the migration, verify it worked:

1. Connect to your Railway database (via Query tab or external client)
2. Run: `SELECT * FROM "_prisma_migrations" WHERE migration_name = '20260129000000_add_work_item_dependency';`
3. You should see a record with `finished_at` set
4. Try creating a work item with dependencies - it should work now!

## Troubleshooting

If you get an error that the migration already exists:
- Check `_prisma_migrations` table
- If it exists but failed, mark it as rolled back: `UPDATE "_prisma_migrations" SET "rolled_back_at" = NOW() WHERE migration_name = '20260129000000_add_work_item_dependency';`
- Then run `npx prisma migrate deploy` again
