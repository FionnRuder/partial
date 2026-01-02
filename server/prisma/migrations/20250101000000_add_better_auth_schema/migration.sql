-- Migration to add Better Auth support
-- This migration adds the 'id' field as primary key while keeping 'userId' for backward compatibility
-- This migration is idempotent - safe to run multiple times

-- Step 1: Add id column to user table (nullable first, if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'id') THEN
        ALTER TABLE "user" ADD COLUMN "id" TEXT;
    END IF;
END $$;

-- Step 2: Generate IDs for existing users that don't have one
UPDATE "user" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;

-- Step 3: Make id NOT NULL and add unique constraint
DO $$ 
BEGIN
    -- Make NOT NULL if not already
    ALTER TABLE "user" ALTER COLUMN "id" SET NOT NULL;
    
    -- Add unique constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_id_key') THEN
        ALTER TABLE "user" ADD CONSTRAINT "user_id_key" UNIQUE ("id");
    END IF;
END $$;

-- Step 4: Make cognitoId nullable (if it's not already)
DO $$
BEGIN
    -- Check if column is currently NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user' 
        AND column_name = 'cognitoId' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE "user" ALTER COLUMN "cognitoId" DROP NOT NULL;
    END IF;
END $$;

-- Step 5: Drop the old primary key constraint if it exists
-- We'll drop it if it exists, regardless of which column it's on
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'user' 
        AND c.contype = 'p'
        AND c.conname = 'user_pkey'
    ) THEN
        ALTER TABLE "user" DROP CONSTRAINT "user_pkey";
    END IF;
END $$;

-- Step 6: Create new primary key on id (if it doesn't exist)
DO $$
BEGIN
    -- Check if any primary key constraint exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'user' 
        AND c.contype = 'p'
    ) THEN
        ALTER TABLE "user" ADD PRIMARY KEY ("id");
    END IF;
END $$;

-- Step 7: Ensure userId has unique constraint (skip if already exists)
-- Note: userId might already be unique from being the old primary key
DO $$ 
BEGIN
    -- Only add constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_userId_key') THEN
        -- Check if userId is already unique via an index
        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename = 'user' 
            AND indexname LIKE '%userId%' 
            AND indexdef LIKE '%UNIQUE%'
        ) THEN
            ALTER TABLE "user" ADD CONSTRAINT "user_userId_key" UNIQUE ("userId");
        END IF;
    END IF;
END $$;

-- Step 8: Add index on userId for backward compatibility (if it doesn't exist)
CREATE INDEX IF NOT EXISTS "user_userId_idx" ON "user"("userId");

-- Step 9: Create Better Auth tables (only if they don't exist)
-- Session table
CREATE TABLE IF NOT EXISTS "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- Account table
CREATE TABLE IF NOT EXISTS "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- Verification table
CREATE TABLE IF NOT EXISTS "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- Step 10: Add unique constraints and indexes for Better Auth tables
CREATE UNIQUE INDEX IF NOT EXISTS "session_token_key" ON "session"("token");
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session"("userId");
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account"("userId");
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification"("identifier");

-- Step 11: Add foreign key constraints for Better Auth tables
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_userId_fkey') THEN
        ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'account_userId_fkey') THEN
        ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
