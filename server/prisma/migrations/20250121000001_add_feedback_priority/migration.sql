-- AlterTable
ALTER TABLE "public"."Feedback" ADD COLUMN "priority" TEXT NOT NULL DEFAULT 'Medium';

-- CreateIndex
CREATE INDEX "Feedback_priority_idx" ON "public"."Feedback"("priority");

