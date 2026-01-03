#!/usr/bin/env ts-node
/**
 * Script to resolve failed Prisma migrations
 * This is useful when a migration fails and needs to be marked as rolled back
 * before new migrations can be applied.
 * 
 * Usage:
 *   ts-node scripts/resolve-migrations.ts
 *   or
 *   npm run resolve-migrations
 */

import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const FAILED_MIGRATION = '20250101000000_add_better_auth_schema';

try {
  console.log(`Attempting to resolve failed migration: ${FAILED_MIGRATION}...`);
  
  // Try to resolve the failed migration by marking it as rolled back
  // This allows new migrations to be applied
  try {
    execSync(`npx prisma migrate resolve --rolled-back ${FAILED_MIGRATION}`, {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL },
    });
    console.log(`✓ Successfully resolved failed migration: ${FAILED_MIGRATION}`);
    process.exit(0);
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    
    // Check if migration is already resolved or doesn't exist in failed state
    if (errorMessage.includes('not found') || 
        errorMessage.includes('does not exist') ||
        errorMessage.includes('No failed migration')) {
      console.log(`✓ Migration ${FAILED_MIGRATION} is not in a failed state (already resolved or never failed)`);
      process.exit(0);
    } else {
      // If it's a different error, show it
      console.error(`✗ Error resolving migration: ${errorMessage}`);
      console.error('\nYou may need to manually resolve this via Railway\'s database console.');
      console.error('See instructions in the error message above or check Railway documentation.');
      process.exit(1);
    }
  }
} catch (error) {
  console.error('Unexpected error:', error);
  process.exit(1);
}

