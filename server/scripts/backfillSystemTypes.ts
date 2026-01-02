/**
 * Backfill script to ensure all existing organizations have the standard deliverable and issue types.
 * 
 * This script is idempotent - it will only create missing types, not duplicates.
 * 
 * Usage:
 *   npx ts-node server/scripts/backfillSystemTypes.ts
 * 
 * Or compile and run:
 *   npm run build
 *   node dist/scripts/backfillSystemTypes.js
 */

import { PrismaClient } from "@prisma/client";
import {
  initializeSystemDeliverableTypes,
} from "../src/controllers/deliverableTypeController";
import {
  initializeSystemIssueTypes,
} from "../src/controllers/issueTypeController";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting backfill of system types for all organizations...");

  try {
    // Get all organizations
    const organizations = await prisma.organization.findMany({
      select: { id: true, name: true },
    });

    console.log(`Found ${organizations.length} organizations`);

    // Initialize system types for each organization
    for (const org of organizations) {
      console.log(`Processing organization: ${org.name} (ID: ${org.id})`);

      try {
        await initializeSystemDeliverableTypes(org.id);
        console.log(`  ✓ Deliverable types initialized for ${org.name}`);

        await initializeSystemIssueTypes(org.id);
        console.log(`  ✓ Issue types initialized for ${org.name}`);
      } catch (error: any) {
        console.error(
          `  ✗ Error initializing types for ${org.name}: ${error.message}`
        );
      }
    }

    console.log("\nBackfill completed!");
  } catch (error: any) {
    console.error("Error during backfill:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

