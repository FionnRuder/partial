#!/usr/bin/env ts-node
/**
 * Script to reset Prisma migration history
 * WARNING: This will clear all migration records from the database.
 * Only use this if the database is empty or in development.
 * 
 * Usage:
 *   DATABASE_URL="your-database-url" ts-node scripts/reset-migration-history.ts
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function resetMigrationHistory() {
  // Create a direct database connection (not through Prisma Client)
  const { PrismaClient: Prisma } = require('@prisma/client');
  const prisma = new Prisma({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  });

  try {
    console.log('⚠️  WARNING: This will delete all migration history!');
    console.log('Connecting to database...');
    
    // Delete all records from _prisma_migrations table
    const result = await prisma.$executeRawUnsafe(`
      DELETE FROM "_prisma_migrations";
    `);
    
    console.log(`✓ Successfully reset migration history (deleted ${result} records)`);
    console.log('You can now run: npx prisma migrate deploy');
    
    await prisma.$disconnect();
  } catch (error: any) {
    console.error('Error resetting migration history:', error.message);
    process.exit(1);
  }
}

resetMigrationHistory();

