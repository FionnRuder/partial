import { beforeAll, afterAll, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// This file runs before all tests
// Use it to set up test environment, database connections, etc.

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

beforeAll(async () => {
  // Connect to test database
  // Note: In a real setup, you might want to use a separate test database
  // For now, we'll use the same database but clean up after tests
});

afterAll(async () => {
  // Disconnect from database
  await prisma.$disconnect();
});

afterEach(async () => {
  // Clean up test data after each test
  // Be careful: This will delete all data in the database!
  // In production, use a separate test database or transactions
  // await prisma.user.deleteMany();
  // await prisma.organization.deleteMany();
  // etc.
});

// Export prisma instance for use in tests
export { prisma };
