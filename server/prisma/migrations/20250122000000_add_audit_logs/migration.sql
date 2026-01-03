-- CreateEnum (idempotent)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AuditAction') THEN
        CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT');
    END IF;
END $$;

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER,
    "description" TEXT NOT NULL,
    "changes" JSONB,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "requestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (idempotent)
CREATE INDEX IF NOT EXISTS "AuditLog_organizationId_idx" ON "AuditLog"("organizationId");
CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS "AuditLog_entityType_idx" ON "AuditLog"("entityType");
CREATE INDEX IF NOT EXISTS "AuditLog_entityId_idx" ON "AuditLog"("entityId");
CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX IF NOT EXISTS "AuditLog_organizationId_entityType_entityId_idx" ON "AuditLog"("organizationId", "entityType", "entityId");
CREATE INDEX IF NOT EXISTS "AuditLog_organizationId_createdAt_idx" ON "AuditLog"("organizationId", "createdAt");

-- AddForeignKey (only if referenced tables exist)
DO $$ 
BEGIN
    -- Add Organization foreign key if Organization table exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Organization'
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AuditLog_organizationId_fkey') THEN
            ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organizationId_fkey" 
                FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") 
                ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
    END IF;
    
    -- Add User foreign key if User table exists
    -- Check for both "User" (capital U) and "user" (lowercase) table names
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND (table_name = 'User' OR table_name = 'user')
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AuditLog_userId_fkey') THEN
            -- Try to determine which User table exists and what the ID column is called
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'User' 
                AND column_name = 'userId'
            ) THEN
                ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" 
                    FOREIGN KEY ("userId") REFERENCES "User"("userId") 
                    ON DELETE RESTRICT ON UPDATE CASCADE;
            ELSIF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'user' 
                AND column_name = 'id'
            ) THEN
                -- If user table uses 'id' instead of 'userId', we need to handle this
                -- But for now, skip if userId column doesn't exist
                NULL;
            END IF;
        END IF;
    END IF;
END $$;

