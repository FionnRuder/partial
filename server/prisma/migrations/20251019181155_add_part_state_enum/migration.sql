/*
  Warnings:

  - Changed the type of `state` on the `Part` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."PartState" AS ENUM ('Released', 'UnderReview', 'InWork', 'Implementation');

-- AlterTable
-- Add temporary column with new type
ALTER TABLE "public"."Part" ADD COLUMN "state_new" "public"."PartState";

-- Map existing data to new enum values (default to 'Released' if no match)
UPDATE "public"."Part" SET "state_new" = CASE
  WHEN "state" = 'Released' THEN 'Released'::"public"."PartState"
  WHEN "state" = 'Under Review' THEN 'UnderReview'::"public"."PartState"
  WHEN "state" = 'In Work' THEN 'InWork'::"public"."PartState"
  WHEN "state" = 'Implementation' THEN 'Implementation'::"public"."PartState"
  ELSE 'Released'::"public"."PartState"
END;

-- Drop old column and rename new column
ALTER TABLE "public"."Part" DROP COLUMN "state";
ALTER TABLE "public"."Part" RENAME COLUMN "state_new" TO "state";
ALTER TABLE "public"."Part" ALTER COLUMN "state" SET NOT NULL;
