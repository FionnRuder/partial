/*
  Warnings:

  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `Invitation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Manager', 'ProgramManager', 'Engineer', 'Viewer');

-- Step 1: Update existing "Program Manager" values to "ProgramManager" in User table
UPDATE "User" SET "role" = 'ProgramManager' WHERE "role" = 'Program Manager';

-- Step 2: Update existing "Program Manager" values to "ProgramManager" in Invitation table (if it exists)
UPDATE "Invitation" SET "role" = 'ProgramManager' WHERE "Invitation"."role" = 'Program Manager';

-- Step 3: Map any other common role variations to valid enum values
-- Handle case-insensitive matching and common variations
UPDATE "User" SET "role" = 'Engineer' 
WHERE LOWER("role") IN ('engineer', 'design engineer', 'electrical eng', 'mechanical eng', 'test engineer', 'electrical engineer', 'mechanical engineer');

UPDATE "User" SET "role" = 'ProgramManager' 
WHERE LOWER("role") IN ('program manager', 'project manager', 'programmanager');

UPDATE "User" SET "role" = 'Manager' 
WHERE LOWER("role") IN ('manager', 'admin manager');

UPDATE "User" SET "role" = 'Admin' 
WHERE LOWER("role") IN ('admin', 'administrator');

UPDATE "User" SET "role" = 'Viewer' 
WHERE LOWER("role") IN ('viewer', 'readonly', 'read-only', 'guest');

-- Step 4: Set any remaining invalid roles to 'Engineer' as a safe default
-- This handles any unexpected role values
UPDATE "User" SET "role" = 'Engineer' 
WHERE "role" NOT IN ('Admin', 'Manager', 'ProgramManager', 'Engineer', 'Viewer');

-- Step 5: Do the same for Invitation table (if it has data)
UPDATE "Invitation" SET "role" = 'Engineer' 
WHERE LOWER("Invitation"."role") IN ('engineer', 'design engineer', 'electrical eng', 'mechanical eng', 'test engineer');

UPDATE "Invitation" SET "role" = 'ProgramManager' 
WHERE LOWER("Invitation"."role") IN ('program manager', 'project manager', 'programmanager');

UPDATE "Invitation" SET "role" = 'Manager' 
WHERE LOWER("Invitation"."role") IN ('manager', 'admin manager');

UPDATE "Invitation" SET "role" = 'Admin' 
WHERE LOWER("Invitation"."role") IN ('admin', 'administrator');

UPDATE "Invitation" SET "role" = 'Viewer' 
WHERE LOWER("Invitation"."role") IN ('viewer', 'readonly', 'read-only', 'guest');

UPDATE "Invitation" SET "role" = 'Engineer' 
WHERE "Invitation"."role" NOT IN ('Admin', 'Manager', 'ProgramManager', 'Engineer', 'Viewer');

-- Step 6: Alter User table - convert string to enum using USING clause
ALTER TABLE "User" 
  ALTER COLUMN "role" TYPE "UserRole" USING "role"::text::"UserRole";

-- Step 7: Alter Invitation table - convert string to enum using USING clause  
ALTER TABLE "Invitation" 
  ALTER COLUMN "role" TYPE "UserRole" USING "role"::text::"UserRole";
