-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "StatusLog" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "dateLogged" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "engineerUserId" INTEGER NOT NULL,
    "workItemId" INTEGER NOT NULL,

    CONSTRAINT "StatusLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey (only if referenced tables exist)
DO $$ 
BEGIN
    -- Add Organization foreign key if Organization table exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Organization'
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StatusLog_organizationId_fkey') THEN
            ALTER TABLE "StatusLog" ADD CONSTRAINT "StatusLog_organizationId_fkey" 
                FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") 
                ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
    END IF;
    
    -- Add User foreign key if User table exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND (table_name = 'User' OR table_name = 'user')
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StatusLog_engineerUserId_fkey') THEN
            -- Check for User table with userId column
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'User' 
                AND column_name = 'userId'
            ) THEN
                ALTER TABLE "StatusLog" ADD CONSTRAINT "StatusLog_engineerUserId_fkey" 
                    FOREIGN KEY ("engineerUserId") REFERENCES "User"("userId") 
                    ON DELETE RESTRICT ON UPDATE CASCADE;
            END IF;
        END IF;
    END IF;
    
    -- Add WorkItem foreign key if WorkItem table exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'WorkItem'
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StatusLog_workItemId_fkey') THEN
            ALTER TABLE "StatusLog" ADD CONSTRAINT "StatusLog_workItemId_fkey" 
                FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id") 
                ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
    END IF;
END $$;
