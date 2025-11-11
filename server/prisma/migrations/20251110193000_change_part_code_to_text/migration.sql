-- AlterTable
ALTER TABLE "public"."PartNumber"
ALTER COLUMN "number" TYPE TEXT USING "number"::TEXT;

