# Testing Infrastructure Guide

This document outlines the testing strategy and infrastructure for the Partial application.

## Overview

We've implemented a comprehensive testing setup to catch bugs before deployment:

- **Server**: Unit tests, integration tests, and API endpoint tests
- **Client**: Component tests, hook tests, and utility function tests
- **E2E**: (Future) End-to-end tests with Playwright or Cypress

## Testing Stack

### Server-Side Testing
- **Vitest**: Fast test runner with TypeScript support
- **Supertest**: HTTP assertion library for API testing
- **@vitest/ui**: Visual test runner interface
- **Prisma Mock**: For database mocking in tests

### Client-Side Testing
- **Vitest**: Fast test runner optimized for Next.js
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: DOM matchers
- **MSW (Mock Service Worker)**: API mocking for component tests

## Test Structure

```
server/
├── src/
│   ├── __tests__/          # Test files co-located with source
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── lib/
│   └── ...
├── tests/
│   ├── integration/        # Integration tests
│   ├── fixtures/           # Test data and fixtures
│   └── setup.ts            # Test setup and teardown
└── vitest.config.ts

client/
├── src/
│   ├── __tests__/          # Test files co-located with source
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   └── ...
├── tests/
│   ├── setup.ts            # Test setup
│   └── fixtures/           # Test fixtures
└── vitest.config.ts
```

## Running Tests

### Server Tests
```bash
cd server
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # Visual test runner
npm run test:coverage # Coverage report
```

### Client Tests
```bash
cd client
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # Visual test runner
npm run test:coverage # Coverage report
```

## Writing Tests

### Server-Side Testing Patterns

#### 1. Controller Tests (Unit Tests)
Test individual controller functions with mocked dependencies:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { getUserById } from '../controllers/userController';

describe('getUserById', () => {
  it('should return user when found', async () => {
    // Mock Prisma
    const mockUser = { id: '1', name: 'Test User' };
    vi.mock('@prisma/client', () => ({
      PrismaClient: vi.fn(() => ({
        user: {
          findFirst: vi.fn().mockResolvedValue(mockUser),
        },
      })),
    }));

    const req = { params: { userId: '1' }, auth: { organizationId: 'org1' } } as any;
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() } as any;

    await getUserById(req, res);

    expect(res.json).toHaveBeenCalledWith(mockUser);
  });
});
```

#### 2. API Integration Tests
Test full request/response cycle:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('GET /users', () => {
  it('should return list of users', async () => {
    const response = await request(app)
      .get('/users')
      .set('Cookie', 'session=valid-session')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });
});
```

#### 3. Middleware Tests
Test authentication, authorization, and other middleware:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { authenticate } from '../middleware/authenticate';

describe('authenticate middleware', () => {
  it('should reject requests without valid session', async () => {
    const req = { session: {} } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
```

### Client-Side Testing Patterns

#### 1. Component Tests
Test React components with React Testing Library:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserCard } from '../components/UserCard';

describe('UserCard', () => {
  it('should render user name', () => {
    const user = { id: '1', name: 'John Doe' };
    render(<UserCard user={user} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

#### 2. Hook Tests
Test custom React hooks:

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';

describe('useAuth', () => {
  it('should return user when authenticated', async () => {
    const { result } = renderHook(() => useAuth());
    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    });
  });
});
```

#### 3. Utility Function Tests
Test pure utility functions:

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from '../lib/utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('Jan 15, 2024');
  });
});
```

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage for business logic
- **Integration Tests**: All critical API endpoints
- **Component Tests**: All reusable components
- **Critical Paths**: 100% coverage (auth, payments, data mutations)

## Best Practices

### 1. Test Organization
- Co-locate test files with source files (`__tests__` folders)
- Use descriptive test names: `should return error when user not found`
- Group related tests with `describe` blocks

### 2. Test Isolation
- Each test should be independent
- Use `beforeEach`/`afterEach` for setup/teardown
- Mock external dependencies (database, APIs, file system)

### 3. Test Data
- Use factories/fixtures for consistent test data
- Avoid hardcoding test data in multiple places
- Use realistic but minimal test data

### 4. Assertions
- Test behavior, not implementation
- Use meaningful assertions with clear error messages
- Test edge cases and error conditions

### 5. Performance
- Keep tests fast (< 100ms per test when possible)
- Use mocks instead of real database/API calls in unit tests
- Run tests in parallel when possible

## Database Testing

### Option 1: Test Database (Recommended for Integration Tests)
Use a separate test database:

```typescript
// tests/setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

beforeAll(async () => {
  // Run migrations
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  // Clean up test data
  await prisma.user.deleteMany();
});
```

### Option 2: Mocking (Recommended for Unit Tests)
Mock Prisma client for fast unit tests:

```typescript
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    user: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  })),
}));
```

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Run server tests
  run: |
    cd server
    npm test -- --coverage

- name: Run client tests
  run: |
    cd client
    npm test -- --coverage
```

## Common Testing Scenarios

### Authentication Tests
- Login/logout flows
- Protected route access
- Session expiration
- Role-based access control

### API Endpoint Tests
- Request validation
- Response format
- Error handling
- Rate limiting
- Authentication requirements

### Component Tests
- Rendering
- User interactions
- State changes
- Error states
- Loading states

### Data Validation Tests
- Input validation
- Business rule enforcement
- Data transformation
- Edge cases

## Next Steps

1. **Start with Critical Paths**: Test authentication, data mutations, and payment flows first
2. **Add Tests Incrementally**: Write tests for new features as you build them
3. **Refactor Existing Code**: Add tests when fixing bugs or refactoring
4. **Set Coverage Thresholds**: Gradually increase coverage requirements
5. **E2E Testing**: Consider adding Playwright or Cypress for end-to-end tests

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
