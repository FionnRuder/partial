import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => {
  server.resetHandlers();
  // Cleanup is handled automatically by React Testing Library in most cases
  // Only call it if needed to avoid React rendering conflicts
  try {
    cleanup();
  } catch (e) {
    // Ignore cleanup errors - React might still be rendering
  }
});

// Clean up after the tests are finished
afterAll(() => {
  server.close();
});
