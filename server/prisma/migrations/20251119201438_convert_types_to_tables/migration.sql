-- First, rename the existing enum types to avoid naming conflicts with the new tables
ALTER TYPE "public"."DeliverableType" RENAME TO "DeliverableType_old_enum";
ALTER TYPE "public"."IssueType" RENAME TO "IssueType_old_enum";

-- Note: The columns will automatically use the renamed enum types

-- Create DeliverableType table
CREATE TABLE "public"."DeliverableType" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliverableType_pkey" PRIMARY KEY ("id")
);

-- Create IssueType table
CREATE TABLE "public"."IssueType" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueType_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX "DeliverableType_organizationId_name_key" ON "public"."DeliverableType"("organizationId", "name");
CREATE INDEX "DeliverableType_organizationId_idx" ON "public"."DeliverableType"("organizationId");
CREATE UNIQUE INDEX "IssueType_organizationId_name_key" ON "public"."IssueType"("organizationId", "name");
CREATE INDEX "IssueType_organizationId_idx" ON "public"."IssueType"("organizationId");

-- Add foreign key constraints
ALTER TABLE "public"."DeliverableType" ADD CONSTRAINT "DeliverableType_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."IssueType" ADD CONSTRAINT "IssueType_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed system deliverable types for all existing organizations
DO $$
DECLARE
    org_record RECORD;
    deliverable_type_name TEXT;
    deliverable_types TEXT[] := ARRAY[
        'System/Subsystem Requirements Specification (SRS)',
        'Interface Control Document (ICD)',
        'Preliminary Design Review (PDR) Package',
        'Risk/Failure Mode & Effects Analysis (FMEA/DFMEA) Report',
        'Development & Verification Plan / V&V Matrix',
        'Engineering Drawing & CAD Model',
        'Bill of Materials (BOM)',
        'Stress/Structural Analysis Report',
        'Thermal Analysis Report',
        'Electrical Schematics / PCB Layouts',
        'Design for Manufacturability (DFM) & Design for Test (DFT) Review Report',
        'Critical Design Review (CDR) Package',
        'Work Instructions / Assembly Procedures',
        'First Article Inspection (FAI) Report',
        'Supplier Quality Records / Certificates of Conformance (CoC)',
        'Test Plans and Procedures',
        'Qualification Test Report',
        'Acceptance Test Procedure (ATP) & Report',
        'Calibration Certificates',
        'Non-Conformance / Corrective Action Report (NCR/CAR)',
        'Requirements Verification Report',
        'As-Built Configuration / End-Item Data Package',
        'User / Operations Manual',
        'Maintenance & Repair Manual / Spare Parts List',
        'Certificates of Compliance',
        'Lessons-Learned & Post-Project Report',
        'Other'
    ];
BEGIN
    FOR org_record IN SELECT id FROM "public"."Organization" LOOP
        FOREACH deliverable_type_name IN ARRAY deliverable_types LOOP
            INSERT INTO "public"."DeliverableType" ("organizationId", "name", "isSystem", "createdAt", "updatedAt")
            VALUES (org_record.id, deliverable_type_name, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- Seed system issue types for all existing organizations
DO $$
DECLARE
    org_record RECORD;
    issue_type_name TEXT;
    issue_types TEXT[] := ARRAY[
        'Defect',
        'Failure',
        'Requirement Waiver',
        'Non-Conformance Report (NCR)',
        'Process / Manufacturing Issue',
        'Supply-Chain / Procurement Issue',
        'Integration / Interface Issue',
        'Test / Verification Anomaly',
        'Environmental / Reliability Issue',
        'Configuration / Documentation Control Issue',
        'Safety / Regulatory Issue',
        'Programmatic / Risk Item',
        'Obsolescence / End-of-Life Issue',
        'Other'
    ];
BEGIN
    FOR org_record IN SELECT id FROM "public"."Organization" LOOP
        FOREACH issue_type_name IN ARRAY issue_types LOOP
            INSERT INTO "public"."IssueType" ("organizationId", "name", "isSystem", "createdAt", "updatedAt")
            VALUES (org_record.id, issue_type_name, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- Add new columns to IssueDetail and DeliverableDetail (nullable initially)
ALTER TABLE "public"."IssueDetail" ADD COLUMN "issueTypeId" INTEGER;
ALTER TABLE "public"."DeliverableDetail" ADD COLUMN "deliverableTypeId" INTEGER;

-- Migrate existing enum data to foreign keys
-- For IssueDetail: map enum values to IssueType IDs
UPDATE "public"."IssueDetail" id
SET "issueTypeId" = (
    SELECT it.id
    FROM "public"."IssueType" it
    INNER JOIN "public"."WorkItem" wi ON wi.id = id.id
    WHERE it."name" = id."issueType"::TEXT
    AND it."organizationId" = wi."organizationId"
    LIMIT 1
);

-- For DeliverableDetail: map enum values to DeliverableType IDs
UPDATE "public"."DeliverableDetail" dd
SET "deliverableTypeId" = (
    SELECT dt.id
    FROM "public"."DeliverableType" dt
    INNER JOIN "public"."WorkItem" wi ON wi.id = dd.id
    WHERE dt."name" = dd."deliverableType"::TEXT
    AND dt."organizationId" = wi."organizationId"
    LIMIT 1
);

-- Make the new columns NOT NULL (after migration)
ALTER TABLE "public"."IssueDetail" ALTER COLUMN "issueTypeId" SET NOT NULL;
ALTER TABLE "public"."DeliverableDetail" ALTER COLUMN "deliverableTypeId" SET NOT NULL;

-- Add foreign key constraints
ALTER TABLE "public"."IssueDetail" ADD CONSTRAINT "IssueDetail_issueTypeId_fkey" FOREIGN KEY ("issueTypeId") REFERENCES "public"."IssueType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."DeliverableDetail" ADD CONSTRAINT "DeliverableDetail_deliverableTypeId_fkey" FOREIGN KEY ("deliverableTypeId") REFERENCES "public"."DeliverableType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop old enum columns (after migration is complete)
ALTER TABLE "public"."IssueDetail" DROP COLUMN "issueType";
ALTER TABLE "public"."DeliverableDetail" DROP COLUMN "deliverableType";

-- Drop the renamed enum types (now that columns are dropped, we can safely drop them)
DROP TYPE IF EXISTS "public"."DeliverableType_old_enum";
DROP TYPE IF EXISTS "public"."IssueType_old_enum";

