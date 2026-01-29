-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "WorkItemDependency" (
    "id" SERIAL NOT NULL,
    "workItemId" INTEGER NOT NULL,
    "dependencyWorkItemId" INTEGER NOT NULL,

    CONSTRAINT "WorkItemDependency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "WorkItemDependency_workItemId_dependencyWorkItemId_key" ON "WorkItemDependency"("workItemId", "dependencyWorkItemId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WorkItemDependency_workItemId_idx" ON "WorkItemDependency"("workItemId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WorkItemDependency_dependencyWorkItemId_idx" ON "WorkItemDependency"("dependencyWorkItemId");

-- AddForeignKey
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'WorkItemDependency_workItemId_fkey'
    ) THEN
        ALTER TABLE "WorkItemDependency" ADD CONSTRAINT "WorkItemDependency_workItemId_fkey" 
        FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'WorkItemDependency_dependencyWorkItemId_fkey'
    ) THEN
        ALTER TABLE "WorkItemDependency" ADD CONSTRAINT "WorkItemDependency_dependencyWorkItemId_fkey" 
        FOREIGN KEY ("dependencyWorkItemId") REFERENCES "WorkItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
