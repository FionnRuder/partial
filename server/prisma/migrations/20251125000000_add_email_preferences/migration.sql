-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "emailWorkItemAssignment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "emailWorkItemStatusChange" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "emailWorkItemComment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "emailInvitation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "emailApproachingDeadline" BOOLEAN NOT NULL DEFAULT true;

