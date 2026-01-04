-- Fix any existing user ID columns that are INTEGER instead of TEXT
-- This handles cases where tables were created with wrong types from previous migrations
DO $$ 
BEGIN
    -- Fix StatusLog.engineerUserId
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'StatusLog' 
        AND column_name = 'engineerUserId' 
        AND data_type = 'integer'
    ) THEN
        ALTER TABLE "StatusLog" ALTER COLUMN "engineerUserId" TYPE TEXT USING "engineerUserId"::TEXT;
    END IF;
    
    -- Fix AuditLog.userId
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'AuditLog' 
        AND column_name = 'userId' 
        AND data_type = 'integer'
    ) THEN
        ALTER TABLE "AuditLog" ALTER COLUMN "userId" TYPE TEXT USING "userId"::TEXT;
    END IF;
END $$;

-- CreateEnum (idempotent)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Priority') THEN
        CREATE TYPE "Priority" AS ENUM ('Urgent', 'High', 'Medium', 'Low', 'Backlog');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Status') THEN
        CREATE TYPE "Status" AS ENUM ('ToDo', 'WorkInProgress', 'UnderReview', 'Completed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'WorkItemType') THEN
        CREATE TYPE "WorkItemType" AS ENUM ('Task', 'Deliverable', 'Issue');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PartState') THEN
        CREATE TYPE "PartState" AS ENUM ('Released', 'UnderReview', 'InWork', 'Implementation');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
        CREATE TYPE "UserRole" AS ENUM ('Admin', 'Manager', 'ProgramManager', 'Engineer', 'Viewer');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AuditAction') THEN
        CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT');
    END IF;
END $$;

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "user" (
    "id" TEXT NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "profilePictureUrl" TEXT,
    "disciplineTeamId" INTEGER,
    "emailNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailWorkItemAssignment" BOOLEAN NOT NULL DEFAULT true,
    "emailWorkItemStatusChange" BOOLEAN NOT NULL DEFAULT true,
    "emailWorkItemComment" BOOLEAN NOT NULL DEFAULT true,
    "emailInvitation" BOOLEAN NOT NULL DEFAULT true,
    "emailApproachingDeadline" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "DisciplineTeam" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "teamManagerUserId" TEXT,

    CONSTRAINT "DisciplineTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "Program" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "programManagerUserId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "DisciplineTeamToProgram" (
    "id" SERIAL NOT NULL,
    "disciplineTeamId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,

    CONSTRAINT "DisciplineTeamToProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "Milestone" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "programId" INTEGER NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "Part" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "partName" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "state" "PartState" NOT NULL,
    "revisionLevel" TEXT NOT NULL,
    "assignedUserId" TEXT NOT NULL,
    "programId" INTEGER NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "WorkItem" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "workItemType" "WorkItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "priority" "Priority" NOT NULL,
    "tags" TEXT,
    "dateOpened" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "estimatedCompletionDate" TIMESTAMP(3) NOT NULL,
    "actualCompletionDate" TIMESTAMP(3),
    "percentComplete" INTEGER NOT NULL,
    "inputStatus" TEXT NOT NULL,
    "programId" INTEGER NOT NULL,
    "dueByMilestoneId" INTEGER NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "assignedUserId" TEXT NOT NULL,

    CONSTRAINT "WorkItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "IssueDetail" (
    "id" INTEGER NOT NULL,
    "issueTypeId" INTEGER NOT NULL,
    "rootCause" TEXT,
    "correctiveAction" TEXT,

    CONSTRAINT "IssueDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "DeliverableDetail" (
    "id" INTEGER NOT NULL,
    "deliverableTypeId" INTEGER NOT NULL,

    CONSTRAINT "DeliverableDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "DeliverableType" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliverableType_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "IssueType" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueType_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "WorkItemToPart" (
    "id" SERIAL NOT NULL,
    "workItemId" INTEGER NOT NULL,
    "partId" INTEGER NOT NULL,

    CONSTRAINT "WorkItemToPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "Attachment" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "dateAttached" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedByUserId" TEXT NOT NULL,
    "workItemId" INTEGER,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "Comment" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "dateCommented" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commenterUserId" TEXT NOT NULL,
    "workItemId" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "StatusLog" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "dateLogged" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "engineerUserId" TEXT NOT NULL,
    "workItemId" INTEGER NOT NULL,

    CONSTRAINT "StatusLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "Invitation" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "invitedEmail" TEXT,
    "role" "UserRole" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "usedByUserId" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "Feedback" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" "Priority" NOT NULL DEFAULT 'Medium',
    "submittedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "resolvedByUserId" TEXT,
    "adminNotes" TEXT,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
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

-- CreateTable (idempotent)
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

-- CreateTable (idempotent)
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

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (idempotent)
CREATE UNIQUE INDEX IF NOT EXISTS "user_organizationId_username_key" ON "user"("organizationId", "username");
CREATE UNIQUE INDEX IF NOT EXISTS "user_organizationId_email_key" ON "user"("organizationId", "email");
CREATE UNIQUE INDEX IF NOT EXISTS "Part_organizationId_number_key" ON "Part"("organizationId", "number");
CREATE INDEX IF NOT EXISTS "DeliverableType_organizationId_idx" ON "DeliverableType"("organizationId");
CREATE UNIQUE INDEX IF NOT EXISTS "DeliverableType_organizationId_name_key" ON "DeliverableType"("organizationId", "name");
CREATE INDEX IF NOT EXISTS "IssueType_organizationId_idx" ON "IssueType"("organizationId");
CREATE UNIQUE INDEX IF NOT EXISTS "IssueType_organizationId_name_key" ON "IssueType"("organizationId", "name");
CREATE UNIQUE INDEX IF NOT EXISTS "Invitation_token_key" ON "Invitation"("token");
CREATE INDEX IF NOT EXISTS "Invitation_token_idx" ON "Invitation"("token");
CREATE INDEX IF NOT EXISTS "Invitation_organizationId_idx" ON "Invitation"("organizationId");
CREATE INDEX IF NOT EXISTS "Invitation_invitedEmail_idx" ON "Invitation"("invitedEmail");
CREATE INDEX IF NOT EXISTS "Feedback_organizationId_idx" ON "Feedback"("organizationId");
CREATE INDEX IF NOT EXISTS "Feedback_status_idx" ON "Feedback"("status");
CREATE INDEX IF NOT EXISTS "Feedback_type_idx" ON "Feedback"("type");
CREATE INDEX IF NOT EXISTS "Feedback_priority_idx" ON "Feedback"("priority");
CREATE INDEX IF NOT EXISTS "Feedback_submittedByUserId_idx" ON "Feedback"("submittedByUserId");
CREATE INDEX IF NOT EXISTS "AuditLog_organizationId_idx" ON "AuditLog"("organizationId");
CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS "AuditLog_entityType_idx" ON "AuditLog"("entityType");
CREATE INDEX IF NOT EXISTS "AuditLog_entityId_idx" ON "AuditLog"("entityId");
CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX IF NOT EXISTS "AuditLog_organizationId_entityType_entityId_idx" ON "AuditLog"("organizationId", "entityType", "entityId");
CREATE INDEX IF NOT EXISTS "AuditLog_organizationId_createdAt_idx" ON "AuditLog"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "session_token_key" ON "session"("token");
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account"("userId");
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification"("identifier");

-- AddForeignKey (idempotent)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_organizationId_fkey') THEN
        ALTER TABLE "user" ADD CONSTRAINT "user_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey (idempotent)
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_disciplineTeamId_fkey') THEN ALTER TABLE "user" ADD CONSTRAINT "user_disciplineTeamId_fkey" FOREIGN KEY ("disciplineTeamId") REFERENCES "DisciplineTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DisciplineTeam_organizationId_fkey') THEN ALTER TABLE "DisciplineTeam" ADD CONSTRAINT "DisciplineTeam_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DisciplineTeam_teamManagerUserId_fkey') THEN ALTER TABLE "DisciplineTeam" ADD CONSTRAINT "DisciplineTeam_teamManagerUserId_fkey" FOREIGN KEY ("teamManagerUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Program_organizationId_fkey') THEN ALTER TABLE "Program" ADD CONSTRAINT "Program_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Program_programManagerUserId_fkey') THEN ALTER TABLE "Program" ADD CONSTRAINT "Program_programManagerUserId_fkey" FOREIGN KEY ("programManagerUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DisciplineTeamToProgram_disciplineTeamId_fkey') THEN ALTER TABLE "DisciplineTeamToProgram" ADD CONSTRAINT "DisciplineTeamToProgram_disciplineTeamId_fkey" FOREIGN KEY ("disciplineTeamId") REFERENCES "DisciplineTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DisciplineTeamToProgram_programId_fkey') THEN ALTER TABLE "DisciplineTeamToProgram" ADD CONSTRAINT "DisciplineTeamToProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Milestone_organizationId_fkey') THEN ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Milestone_programId_fkey') THEN ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Part_organizationId_fkey') THEN ALTER TABLE "Part" ADD CONSTRAINT "Part_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Part_assignedUserId_fkey') THEN ALTER TABLE "Part" ADD CONSTRAINT "Part_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Part_programId_fkey') THEN ALTER TABLE "Part" ADD CONSTRAINT "Part_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Part_parentId_fkey') THEN ALTER TABLE "Part" ADD CONSTRAINT "Part_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Part"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WorkItem_organizationId_fkey') THEN ALTER TABLE "WorkItem" ADD CONSTRAINT "WorkItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;

-- AddForeignKey (idempotent)
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WorkItem_programId_fkey') THEN ALTER TABLE "WorkItem" ADD CONSTRAINT "WorkItem_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WorkItem_dueByMilestoneId_fkey') THEN ALTER TABLE "WorkItem" ADD CONSTRAINT "WorkItem_dueByMilestoneId_fkey" FOREIGN KEY ("dueByMilestoneId") REFERENCES "Milestone"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WorkItem_authorUserId_fkey') THEN ALTER TABLE "WorkItem" ADD CONSTRAINT "WorkItem_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WorkItem_assignedUserId_fkey') THEN ALTER TABLE "WorkItem" ADD CONSTRAINT "WorkItem_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'IssueDetail_id_fkey') THEN ALTER TABLE "IssueDetail" ADD CONSTRAINT "IssueDetail_id_fkey" FOREIGN KEY ("id") REFERENCES "WorkItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'IssueDetail_issueTypeId_fkey') THEN ALTER TABLE "IssueDetail" ADD CONSTRAINT "IssueDetail_issueTypeId_fkey" FOREIGN KEY ("issueTypeId") REFERENCES "IssueType"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DeliverableDetail_id_fkey') THEN ALTER TABLE "DeliverableDetail" ADD CONSTRAINT "DeliverableDetail_id_fkey" FOREIGN KEY ("id") REFERENCES "WorkItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DeliverableDetail_deliverableTypeId_fkey') THEN ALTER TABLE "DeliverableDetail" ADD CONSTRAINT "DeliverableDetail_deliverableTypeId_fkey" FOREIGN KEY ("deliverableTypeId") REFERENCES "DeliverableType"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DeliverableType_organizationId_fkey') THEN ALTER TABLE "DeliverableType" ADD CONSTRAINT "DeliverableType_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'IssueType_organizationId_fkey') THEN ALTER TABLE "IssueType" ADD CONSTRAINT "IssueType_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WorkItemToPart_workItemId_fkey') THEN ALTER TABLE "WorkItemToPart" ADD CONSTRAINT "WorkItemToPart_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WorkItemToPart_partId_fkey') THEN ALTER TABLE "WorkItemToPart" ADD CONSTRAINT "WorkItemToPart_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Attachment_organizationId_fkey') THEN ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Attachment_uploadedByUserId_fkey') THEN ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Attachment_workItemId_fkey') THEN ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_organizationId_fkey') THEN ALTER TABLE "Comment" ADD CONSTRAINT "Comment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_commenterUserId_fkey') THEN ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commenterUserId_fkey" FOREIGN KEY ("commenterUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_workItemId_fkey') THEN ALTER TABLE "Comment" ADD CONSTRAINT "Comment_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StatusLog_organizationId_fkey') THEN ALTER TABLE "StatusLog" ADD CONSTRAINT "StatusLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ 
BEGIN 
    -- Fix column type if it's wrong (INTEGER instead of TEXT)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'StatusLog' 
        AND column_name = 'engineerUserId' 
        AND data_type = 'integer'
    ) THEN
        ALTER TABLE "StatusLog" ALTER COLUMN "engineerUserId" TYPE TEXT USING "engineerUserId"::TEXT;
    END IF;
    
    -- Add foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StatusLog_engineerUserId_fkey') THEN 
        ALTER TABLE "StatusLog" ADD CONSTRAINT "StatusLog_engineerUserId_fkey" FOREIGN KEY ("engineerUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; 
    END IF; 
END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StatusLog_workItemId_fkey') THEN ALTER TABLE "StatusLog" ADD CONSTRAINT "StatusLog_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Invitation_organizationId_fkey') THEN ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Invitation_createdByUserId_fkey') THEN ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Invitation_usedByUserId_fkey') THEN ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_usedByUserId_fkey" FOREIGN KEY ("usedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Feedback_organizationId_fkey') THEN ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Feedback_submittedByUserId_fkey') THEN ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Feedback_resolvedByUserId_fkey') THEN ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AuditLog_organizationId_fkey') THEN ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AuditLog_userId_fkey') THEN ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_userId_fkey') THEN ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'account_userId_fkey') THEN ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
