#!/usr/bin/env ts-node
/**
 * Script to remove a specific migration record from Prisma's migration history
 * Use this when a migration directory was deleted but the record still exists in the database
 * 
 * Usage:
 *   DATABASE_URL="your-database-url" ts-node scripts/remove-migration-record.ts <migration-name>
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const MIGRATION_NAME = process.argv[2];

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

if (!MIGRATION_NAME) {
  console.error('ERROR: Please provide a migration name as an argument');
  console.error('Usage: ts-node scripts/remove-migration-record.ts <migration-name>');
  process.exit(1);
}

async function removeMigrationRecord() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  });

  try {
    console.log(`Attempting to remove migration record: ${MIGRATION_NAME}`);
    
    // Delete the specific migration record
    const result = await prisma.$executeRawUnsafe(`
      DELETE FROM "_prisma_migrations"
      WHERE "migration_name" = '${MIGRATION_NAME}';
    `);
    
    console.log(`✓ Successfully removed migration record: ${MIGRATION_NAME}`);
    console.log(`Deleted ${result} record(s)`);
    
    await prisma.$disconnect();
  } catch (error: any) {
    console.error('Error removing migration record:', error.message);
    process.exit(1);
  }
}

removeMigrationRecord();

