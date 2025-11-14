-- AlterTable
ALTER TABLE "public"."Part"
ALTER COLUMN "number" TYPE TEXT USING "number"::TEXT;

