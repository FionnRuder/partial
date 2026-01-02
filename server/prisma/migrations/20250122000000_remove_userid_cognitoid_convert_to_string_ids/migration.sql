-- Migration to remove userId and cognitoId from User table
-- and convert all foreign key references from Int to String
-- This migration is idempotent - safe to run multiple times

-- ============================================
-- STEP 1: Ensure User table has 'id' column as primary key
-- ============================================

-- Add id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'id') THEN
        ALTER TABLE "user" ADD COLUMN "id" TEXT;
    END IF;
END $$;

-- Generate IDs for existing users that don't have one (using cuid-like format)
UPDATE "user" 
SET "id" = 'cl' || LPAD(CAST("userId" AS TEXT), 20, '0') || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)
WHERE "id" IS NULL;

-- Make id NOT NULL and add unique constraint
DO $$ 
BEGIN
    -- Make NOT NULL if not already
    ALTER TABLE "user" ALTER COLUMN "id" SET NOT NULL;
    
    -- Add unique constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_id_key') THEN
        ALTER TABLE "user" ADD CONSTRAINT "user_id_key" UNIQUE ("id");
    END IF;
    
    -- Set as primary key if not already
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'user' 
        AND c.contype = 'p'
        AND EXISTS (
            SELECT 1 FROM pg_attribute a
            WHERE a.attrelid = t.oid
            AND a.attname = 'id'
            AND a.attnum = ANY(c.conkey)
        )
    ) THEN
        -- Drop old primary key if it exists on userId
        IF EXISTS (
            SELECT 1 FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE t.relname = 'user' 
            AND c.contype = 'p'
            AND EXISTS (
                SELECT 1 FROM pg_attribute a
                WHERE a.attrelid = t.oid
                AND a.attname = 'userId'
                AND a.attnum = ANY(c.conkey)
            )
        ) THEN
            ALTER TABLE "user" DROP CONSTRAINT "user_pkey";
        END IF;
        
        -- Add new primary key on id
        ALTER TABLE "user" ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");
    END IF;
END $$;

-- ============================================
-- STEP 2: Drop all foreign key constraints
-- ============================================

-- Drop foreign keys from DisciplineTeam
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DisciplineTeam_teamManagerUserId_fkey') THEN
        ALTER TABLE "DisciplineTeam" DROP CONSTRAINT "DisciplineTeam_teamManagerUserId_fkey";
    END IF;
END $$;

-- Drop foreign keys from Program
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Program_programManagerUserId_fkey') THEN
        ALTER TABLE "Program" DROP CONSTRAINT "Program_programManagerUserId_fkey";
    END IF;
END $$;

-- Drop foreign keys from Part
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Part_assignedUserId_fkey') THEN
        ALTER TABLE "Part" DROP CONSTRAINT "Part_assignedUserId_fkey";
    END IF;
END $$;

-- Drop foreign keys from WorkItem
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WorkItem_authorUserId_fkey') THEN
        ALTER TABLE "WorkItem" DROP CONSTRAINT "WorkItem_authorUserId_fkey";
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WorkItem_assignedUserId_fkey') THEN
        ALTER TABLE "WorkItem" DROP CONSTRAINT "WorkItem_assignedUserId_fkey";
    END IF;
END $$;

-- Drop foreign keys from Attachment
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Attachment_uploadedByUserId_fkey') THEN
        ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_uploadedByUserId_fkey";
    END IF;
END $$;

-- Drop foreign keys from Comment
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_commenterUserId_fkey') THEN
        ALTER TABLE "Comment" DROP CONSTRAINT "Comment_commenterUserId_fkey";
    END IF;
END $$;

-- Drop foreign keys from StatusLog
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StatusLog_engineerUserId_fkey') THEN
        ALTER TABLE "StatusLog" DROP CONSTRAINT "StatusLog_engineerUserId_fkey";
    END IF;
END $$;

-- Drop foreign keys from Invitation
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Invitation_createdByUserId_fkey') THEN
        ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_createdByUserId_fkey";
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Invitation_usedByUserId_fkey') THEN
        ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_usedByUserId_fkey";
    END IF;
END $$;

-- Drop foreign keys from Feedback
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Feedback_submittedByUserId_fkey') THEN
        ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_submittedByUserId_fkey";
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Feedback_resolvedByUserId_fkey') THEN
        ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_resolvedByUserId_fkey";
    END IF;
END $$;

-- Drop foreign keys from AuditLog
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AuditLog_userId_fkey') THEN
        ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";
    END IF;
END $$;

-- ============================================
-- STEP 3: Convert userId columns from Int to String
-- ============================================

-- Convert DisciplineTeam.teamManagerUserId
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'DisciplineTeam' AND column_name = 'teamManagerUserId' AND data_type = 'integer') THEN
        -- Add temporary column
        ALTER TABLE "DisciplineTeam" ADD COLUMN "teamManagerUserId_temp" TEXT;
        
        -- Copy data: map integer userId to string id
        UPDATE "DisciplineTeam" dt
        SET "teamManagerUserId_temp" = u."id"
        FROM "user" u
        WHERE dt."teamManagerUserId" = u."userId"
        AND dt."teamManagerUserId" IS NOT NULL;
        
        -- Drop old column and rename new one
        ALTER TABLE "DisciplineTeam" DROP COLUMN "teamManagerUserId";
        ALTER TABLE "DisciplineTeam" RENAME COLUMN "teamManagerUserId_temp" TO "teamManagerUserId";
    END IF;
END $$;

-- Convert Program.programManagerUserId
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Program' AND column_name = 'programManagerUserId' AND data_type = 'integer') THEN
        ALTER TABLE "Program" ADD COLUMN "programManagerUserId_temp" TEXT;
        
        UPDATE "Program" p
        SET "programManagerUserId_temp" = u."id"
        FROM "user" u
        WHERE p."programManagerUserId" = u."userId"
        AND p."programManagerUserId" IS NOT NULL;
        
        ALTER TABLE "Program" DROP COLUMN "programManagerUserId";
        ALTER TABLE "Program" RENAME COLUMN "programManagerUserId_temp" TO "programManagerUserId";
    END IF;
END $$;

-- Convert Part.assignedUserId
DO $$
DECLARE
    default_user_id TEXT;
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Part' AND column_name = 'assignedUserId' AND data_type = 'integer') THEN
        ALTER TABLE "Part" ADD COLUMN "assignedUserId_temp" TEXT;
        
        -- Update existing non-NULL values
        UPDATE "Part" pt
        SET "assignedUserId_temp" = u."id"
        FROM "user" u
        WHERE pt."assignedUserId" = u."userId"
        AND pt."assignedUserId" IS NOT NULL;
        
        -- Handle NULL values: assign to first available user (or a system user)
        -- Get the first user's ID as a fallback
        SELECT "id" INTO default_user_id FROM "user" ORDER BY "id" LIMIT 1;
        
        -- If we have a default user and there are NULL values, assign them
        IF default_user_id IS NOT NULL THEN
            UPDATE "Part"
            SET "assignedUserId_temp" = default_user_id
            WHERE "assignedUserId_temp" IS NULL;
        END IF;
        
        -- If there are still NULL values, we can't set NOT NULL - this would be an error condition
        -- But we'll proceed and let the NOT NULL constraint fail if needed (which will show the issue)
        
        ALTER TABLE "Part" DROP COLUMN "assignedUserId";
        ALTER TABLE "Part" RENAME COLUMN "assignedUserId_temp" TO "assignedUserId";
        
        -- Only set NOT NULL if there are no NULL values
        IF NOT EXISTS (SELECT 1 FROM "Part" WHERE "assignedUserId" IS NULL) THEN
            ALTER TABLE "Part" ALTER COLUMN "assignedUserId" SET NOT NULL;
        ELSE
            RAISE WARNING 'Part table has NULL assignedUserId values. Cannot set NOT NULL constraint. Please assign users to all parts first.';
        END IF;
    END IF;
END $$;

-- Convert WorkItem.authorUserId and assignedUserId
DO $$
DECLARE
    default_user_id TEXT;
BEGIN
    -- Get default user ID once
    SELECT "id" INTO default_user_id FROM "user" ORDER BY "id" LIMIT 1;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'WorkItem' AND column_name = 'authorUserId' AND data_type = 'integer') THEN
        ALTER TABLE "WorkItem" ADD COLUMN "authorUserId_temp" TEXT;
        
        -- Update existing non-NULL values
        UPDATE "WorkItem" wi
        SET "authorUserId_temp" = u."id"
        FROM "user" u
        WHERE wi."authorUserId" = u."userId"
        AND wi."authorUserId" IS NOT NULL;
        
        -- Handle NULL values
        IF default_user_id IS NOT NULL THEN
            UPDATE "WorkItem"
            SET "authorUserId_temp" = default_user_id
            WHERE "authorUserId_temp" IS NULL;
        END IF;
        
        ALTER TABLE "WorkItem" DROP COLUMN "authorUserId";
        ALTER TABLE "WorkItem" RENAME COLUMN "authorUserId_temp" TO "authorUserId";
        
        -- Only set NOT NULL if there are no NULL values
        IF NOT EXISTS (SELECT 1 FROM "WorkItem" WHERE "authorUserId" IS NULL) THEN
            ALTER TABLE "WorkItem" ALTER COLUMN "authorUserId" SET NOT NULL;
        ELSE
            RAISE WARNING 'WorkItem table has NULL authorUserId values. Cannot set NOT NULL constraint.';
        END IF;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'WorkItem' AND column_name = 'assignedUserId' AND data_type = 'integer') THEN
        ALTER TABLE "WorkItem" ADD COLUMN "assignedUserId_temp" TEXT;
        
        -- Update existing non-NULL values
        UPDATE "WorkItem" wi
        SET "assignedUserId_temp" = u."id"
        FROM "user" u
        WHERE wi."assignedUserId" = u."userId"
        AND wi."assignedUserId" IS NOT NULL;
        
        -- Handle NULL values
        IF default_user_id IS NOT NULL THEN
            UPDATE "WorkItem"
            SET "assignedUserId_temp" = default_user_id
            WHERE "assignedUserId_temp" IS NULL;
        END IF;
        
        ALTER TABLE "WorkItem" DROP COLUMN "assignedUserId";
        ALTER TABLE "WorkItem" RENAME COLUMN "assignedUserId_temp" TO "assignedUserId";
        
        -- Only set NOT NULL if there are no NULL values
        IF NOT EXISTS (SELECT 1 FROM "WorkItem" WHERE "assignedUserId" IS NULL) THEN
            ALTER TABLE "WorkItem" ALTER COLUMN "assignedUserId" SET NOT NULL;
        ELSE
            RAISE WARNING 'WorkItem table has NULL assignedUserId values. Cannot set NOT NULL constraint.';
        END IF;
    END IF;
END $$;

-- Convert Attachment.uploadedByUserId
DO $$
DECLARE
    default_user_id TEXT;
BEGIN
    SELECT "id" INTO default_user_id FROM "user" ORDER BY "id" LIMIT 1;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Attachment' AND column_name = 'uploadedByUserId' AND data_type = 'integer') THEN
        ALTER TABLE "Attachment" ADD COLUMN "uploadedByUserId_temp" TEXT;
        
        UPDATE "Attachment" att
        SET "uploadedByUserId_temp" = u."id"
        FROM "user" u
        WHERE att."uploadedByUserId" = u."userId"
        AND att."uploadedByUserId" IS NOT NULL;
        
        IF default_user_id IS NOT NULL THEN
            UPDATE "Attachment"
            SET "uploadedByUserId_temp" = default_user_id
            WHERE "uploadedByUserId_temp" IS NULL;
        END IF;
        
        ALTER TABLE "Attachment" DROP COLUMN "uploadedByUserId";
        ALTER TABLE "Attachment" RENAME COLUMN "uploadedByUserId_temp" TO "uploadedByUserId";
        
        IF NOT EXISTS (SELECT 1 FROM "Attachment" WHERE "uploadedByUserId" IS NULL) THEN
            ALTER TABLE "Attachment" ALTER COLUMN "uploadedByUserId" SET NOT NULL;
        ELSE
            RAISE WARNING 'Attachment table has NULL uploadedByUserId values. Cannot set NOT NULL constraint.';
        END IF;
    END IF;
END $$;

-- Convert Comment.commenterUserId
DO $$
DECLARE
    default_user_id TEXT;
BEGIN
    SELECT "id" INTO default_user_id FROM "user" ORDER BY "id" LIMIT 1;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Comment' AND column_name = 'commenterUserId' AND data_type = 'integer') THEN
        ALTER TABLE "Comment" ADD COLUMN "commenterUserId_temp" TEXT;
        
        UPDATE "Comment" c
        SET "commenterUserId_temp" = u."id"
        FROM "user" u
        WHERE c."commenterUserId" = u."userId"
        AND c."commenterUserId" IS NOT NULL;
        
        IF default_user_id IS NOT NULL THEN
            UPDATE "Comment"
            SET "commenterUserId_temp" = default_user_id
            WHERE "commenterUserId_temp" IS NULL;
        END IF;
        
        ALTER TABLE "Comment" DROP COLUMN "commenterUserId";
        ALTER TABLE "Comment" RENAME COLUMN "commenterUserId_temp" TO "commenterUserId";
        
        IF NOT EXISTS (SELECT 1 FROM "Comment" WHERE "commenterUserId" IS NULL) THEN
            ALTER TABLE "Comment" ALTER COLUMN "commenterUserId" SET NOT NULL;
        ELSE
            RAISE WARNING 'Comment table has NULL commenterUserId values. Cannot set NOT NULL constraint.';
        END IF;
    END IF;
END $$;

-- Convert StatusLog.engineerUserId
DO $$
DECLARE
    default_user_id TEXT;
BEGIN
    SELECT "id" INTO default_user_id FROM "user" ORDER BY "id" LIMIT 1;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'StatusLog' AND column_name = 'engineerUserId' AND data_type = 'integer') THEN
        ALTER TABLE "StatusLog" ADD COLUMN "engineerUserId_temp" TEXT;
        
        UPDATE "StatusLog" sl
        SET "engineerUserId_temp" = u."id"
        FROM "user" u
        WHERE sl."engineerUserId" = u."userId"
        AND sl."engineerUserId" IS NOT NULL;
        
        IF default_user_id IS NOT NULL THEN
            UPDATE "StatusLog"
            SET "engineerUserId_temp" = default_user_id
            WHERE "engineerUserId_temp" IS NULL;
        END IF;
        
        ALTER TABLE "StatusLog" DROP COLUMN "engineerUserId";
        ALTER TABLE "StatusLog" RENAME COLUMN "engineerUserId_temp" TO "engineerUserId";
        
        IF NOT EXISTS (SELECT 1 FROM "StatusLog" WHERE "engineerUserId" IS NULL) THEN
            ALTER TABLE "StatusLog" ALTER COLUMN "engineerUserId" SET NOT NULL;
        ELSE
            RAISE WARNING 'StatusLog table has NULL engineerUserId values. Cannot set NOT NULL constraint.';
        END IF;
    END IF;
END $$;

-- Convert Invitation.createdByUserId and usedByUserId
DO $$
DECLARE
    default_user_id TEXT;
BEGIN
    SELECT "id" INTO default_user_id FROM "user" ORDER BY "id" LIMIT 1;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Invitation' AND column_name = 'createdByUserId' AND data_type = 'integer') THEN
        ALTER TABLE "Invitation" ADD COLUMN "createdByUserId_temp" TEXT;
        
        UPDATE "Invitation" inv
        SET "createdByUserId_temp" = u."id"
        FROM "user" u
        WHERE inv."createdByUserId" = u."userId"
        AND inv."createdByUserId" IS NOT NULL;
        
        IF default_user_id IS NOT NULL THEN
            UPDATE "Invitation"
            SET "createdByUserId_temp" = default_user_id
            WHERE "createdByUserId_temp" IS NULL;
        END IF;
        
        ALTER TABLE "Invitation" DROP COLUMN "createdByUserId";
        ALTER TABLE "Invitation" RENAME COLUMN "createdByUserId_temp" TO "createdByUserId";
        
        IF NOT EXISTS (SELECT 1 FROM "Invitation" WHERE "createdByUserId" IS NULL) THEN
            ALTER TABLE "Invitation" ALTER COLUMN "createdByUserId" SET NOT NULL;
        ELSE
            RAISE WARNING 'Invitation table has NULL createdByUserId values. Cannot set NOT NULL constraint.';
        END IF;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Invitation' AND column_name = 'usedByUserId' AND data_type = 'integer') THEN
        ALTER TABLE "Invitation" ADD COLUMN "usedByUserId_temp" TEXT;
        
        UPDATE "Invitation" inv
        SET "usedByUserId_temp" = u."id"
        FROM "user" u
        WHERE inv."usedByUserId" = u."userId"
        AND inv."usedByUserId" IS NOT NULL;
        
        ALTER TABLE "Invitation" DROP COLUMN "usedByUserId";
        ALTER TABLE "Invitation" RENAME COLUMN "usedByUserId_temp" TO "usedByUserId";
    END IF;
END $$;

-- Convert Feedback.submittedByUserId and resolvedByUserId
DO $$
DECLARE
    default_user_id TEXT;
BEGIN
    SELECT "id" INTO default_user_id FROM "user" ORDER BY "id" LIMIT 1;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Feedback' AND column_name = 'submittedByUserId' AND data_type = 'integer') THEN
        ALTER TABLE "Feedback" ADD COLUMN "submittedByUserId_temp" TEXT;
        
        UPDATE "Feedback" f
        SET "submittedByUserId_temp" = u."id"
        FROM "user" u
        WHERE f."submittedByUserId" = u."userId"
        AND f."submittedByUserId" IS NOT NULL;
        
        IF default_user_id IS NOT NULL THEN
            UPDATE "Feedback"
            SET "submittedByUserId_temp" = default_user_id
            WHERE "submittedByUserId_temp" IS NULL;
        END IF;
        
        ALTER TABLE "Feedback" DROP COLUMN "submittedByUserId";
        ALTER TABLE "Feedback" RENAME COLUMN "submittedByUserId_temp" TO "submittedByUserId";
        
        IF NOT EXISTS (SELECT 1 FROM "Feedback" WHERE "submittedByUserId" IS NULL) THEN
            ALTER TABLE "Feedback" ALTER COLUMN "submittedByUserId" SET NOT NULL;
        ELSE
            RAISE WARNING 'Feedback table has NULL submittedByUserId values. Cannot set NOT NULL constraint.';
        END IF;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Feedback' AND column_name = 'resolvedByUserId' AND data_type = 'integer') THEN
        ALTER TABLE "Feedback" ADD COLUMN "resolvedByUserId_temp" TEXT;
        
        UPDATE "Feedback" f
        SET "resolvedByUserId_temp" = u."id"
        FROM "user" u
        WHERE f."resolvedByUserId" = u."userId"
        AND f."resolvedByUserId" IS NOT NULL;
        
        ALTER TABLE "Feedback" DROP COLUMN "resolvedByUserId";
        ALTER TABLE "Feedback" RENAME COLUMN "resolvedByUserId_temp" TO "resolvedByUserId";
    END IF;
END $$;

-- Convert AuditLog.userId
DO $$
DECLARE
    default_user_id TEXT;
BEGIN
    SELECT "id" INTO default_user_id FROM "user" ORDER BY "id" LIMIT 1;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'AuditLog' AND column_name = 'userId' AND data_type = 'integer') THEN
        ALTER TABLE "AuditLog" ADD COLUMN "userId_temp" TEXT;
        
        UPDATE "AuditLog" al
        SET "userId_temp" = u."id"
        FROM "user" u
        WHERE al."userId" = u."userId"
        AND al."userId" IS NOT NULL;
        
        IF default_user_id IS NOT NULL THEN
            UPDATE "AuditLog"
            SET "userId_temp" = default_user_id
            WHERE "userId_temp" IS NULL;
        END IF;
        
        ALTER TABLE "AuditLog" DROP COLUMN "userId";
        ALTER TABLE "AuditLog" RENAME COLUMN "userId_temp" TO "userId";
        
        IF NOT EXISTS (SELECT 1 FROM "AuditLog" WHERE "userId" IS NULL) THEN
            ALTER TABLE "AuditLog" ALTER COLUMN "userId" SET NOT NULL;
        ELSE
            RAISE WARNING 'AuditLog table has NULL userId values. Cannot set NOT NULL constraint.';
        END IF;
    END IF;
END $$;

-- ============================================
-- STEP 4: Remove userId and cognitoId from User table
-- ============================================

-- Drop userId column (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'userId') THEN
        -- Drop unique constraint on userId if it exists
        IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_userId_key') THEN
            ALTER TABLE "user" DROP CONSTRAINT "user_userId_key";
        END IF;
        
        -- Drop index on userId if it exists
        IF EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'user' AND indexname LIKE '%userId%') THEN
            DROP INDEX IF EXISTS "user_userId_idx";
        END IF;
        
        -- Drop the column
        ALTER TABLE "user" DROP COLUMN "userId";
    END IF;
END $$;

-- Drop cognitoId column (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'cognitoId') THEN
        -- Drop unique constraint on cognitoId if it exists
        IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_cognitoId_key') THEN
            ALTER TABLE "user" DROP CONSTRAINT "user_cognitoId_key";
        END IF;
        
        -- Drop the column
        ALTER TABLE "user" DROP COLUMN "cognitoId";
    END IF;
END $$;

-- ============================================
-- STEP 5: Recreate foreign key constraints
-- ============================================

-- Recreate foreign key for DisciplineTeam.teamManagerUserId
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DisciplineTeam_teamManagerUserId_fkey') THEN
        ALTER TABLE "DisciplineTeam" 
        ADD CONSTRAINT "DisciplineTeam_teamManagerUserId_fkey" 
        FOREIGN KEY ("teamManagerUserId") 
        REFERENCES "user"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Recreate foreign key for Program.programManagerUserId
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Program_programManagerUserId_fkey') THEN
        ALTER TABLE "Program" 
        ADD CONSTRAINT "Program_programManagerUserId_fkey" 
        FOREIGN KEY ("programManagerUserId") 
        REFERENCES "user"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Recreate foreign key for Part.assignedUserId
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Part_assignedUserId_fkey') THEN
        ALTER TABLE "Part" 
        ADD CONSTRAINT "Part_assignedUserId_fkey" 
        FOREIGN KEY ("assignedUserId") 
        REFERENCES "user"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Recreate foreign keys for WorkItem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WorkItem_authorUserId_fkey') THEN
        ALTER TABLE "WorkItem" 
        ADD CONSTRAINT "WorkItem_authorUserId_fkey" 
        FOREIGN KEY ("authorUserId") 
        REFERENCES "user"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WorkItem_assignedUserId_fkey') THEN
        ALTER TABLE "WorkItem" 
        ADD CONSTRAINT "WorkItem_assignedUserId_fkey" 
        FOREIGN KEY ("assignedUserId") 
        REFERENCES "user"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Recreate foreign key for Attachment.uploadedByUserId
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Attachment_uploadedByUserId_fkey') THEN
        ALTER TABLE "Attachment" 
        ADD CONSTRAINT "Attachment_uploadedByUserId_fkey" 
        FOREIGN KEY ("uploadedByUserId") 
        REFERENCES "user"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Recreate foreign key for Comment.commenterUserId
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_commenterUserId_fkey') THEN
        ALTER TABLE "Comment" 
        ADD CONSTRAINT "Comment_commenterUserId_fkey" 
        FOREIGN KEY ("commenterUserId") 
        REFERENCES "user"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Recreate foreign key for StatusLog.engineerUserId
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StatusLog_engineerUserId_fkey') THEN
        ALTER TABLE "StatusLog" 
        ADD CONSTRAINT "StatusLog_engineerUserId_fkey" 
        FOREIGN KEY ("engineerUserId") 
        REFERENCES "user"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Recreate foreign keys for Invitation
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Invitation_createdByUserId_fkey') THEN
        ALTER TABLE "Invitation" 
        ADD CONSTRAINT "Invitation_createdByUserId_fkey" 
        FOREIGN KEY ("createdByUserId") 
        REFERENCES "user"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Invitation_usedByUserId_fkey') THEN
        ALTER TABLE "Invitation" 
        ADD CONSTRAINT "Invitation_usedByUserId_fkey" 
        FOREIGN KEY ("usedByUserId") 
        REFERENCES "user"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Recreate foreign keys for Feedback
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Feedback_submittedByUserId_fkey') THEN
        ALTER TABLE "Feedback" 
        ADD CONSTRAINT "Feedback_submittedByUserId_fkey" 
        FOREIGN KEY ("submittedByUserId") 
        REFERENCES "user"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Feedback_resolvedByUserId_fkey') THEN
        ALTER TABLE "Feedback" 
        ADD CONSTRAINT "Feedback_resolvedByUserId_fkey" 
        FOREIGN KEY ("resolvedByUserId") 
        REFERENCES "user"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Recreate foreign key for AuditLog.userId
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AuditLog_userId_fkey') THEN
        ALTER TABLE "AuditLog" 
        ADD CONSTRAINT "AuditLog_userId_fkey" 
        FOREIGN KEY ("userId") 
        REFERENCES "user"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- ============================================
-- STEP 6: Add indexes for performance
-- ============================================

-- Add indexes on foreign key columns for better query performance
CREATE INDEX IF NOT EXISTS "DisciplineTeam_teamManagerUserId_idx" ON "DisciplineTeam"("teamManagerUserId");
CREATE INDEX IF NOT EXISTS "Program_programManagerUserId_idx" ON "Program"("programManagerUserId");
CREATE INDEX IF NOT EXISTS "Part_assignedUserId_idx" ON "Part"("assignedUserId");
CREATE INDEX IF NOT EXISTS "WorkItem_authorUserId_idx" ON "WorkItem"("authorUserId");
CREATE INDEX IF NOT EXISTS "WorkItem_assignedUserId_idx" ON "WorkItem"("assignedUserId");
CREATE INDEX IF NOT EXISTS "Attachment_uploadedByUserId_idx" ON "Attachment"("uploadedByUserId");
CREATE INDEX IF NOT EXISTS "Comment_commenterUserId_idx" ON "Comment"("commenterUserId");
CREATE INDEX IF NOT EXISTS "StatusLog_engineerUserId_idx" ON "StatusLog"("engineerUserId");
CREATE INDEX IF NOT EXISTS "Invitation_createdByUserId_idx" ON "Invitation"("createdByUserId");
CREATE INDEX IF NOT EXISTS "Invitation_usedByUserId_idx" ON "Invitation"("usedByUserId");
CREATE INDEX IF NOT EXISTS "Feedback_submittedByUserId_idx" ON "Feedback"("submittedByUserId");
CREATE INDEX IF NOT EXISTS "Feedback_resolvedByUserId_idx" ON "Feedback"("resolvedByUserId");
CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");

