# Testing Quick Start Guide

## Installation

### Server
```bash
cd server
npm install
```

### Client
```bash
cd client
npm install
```

## Running Tests

### Server Tests
```bash
cd server
npm test              # Run all tests once
npm run test:watch    # Watch mode (re-runs on file changes)
npm run test:ui       # Visual test runner (opens in browser)
npm run test:coverage # Generate coverage report
```

### Client Tests
```bash
cd client
npm test              # Run all tests once
npm run test:watch    # Watch mode (re-runs on file changes)
npm run test:ui       # Visual test runner (opens in browser)
npm run test:coverage # Generate coverage report
```

## Example Test Files

We've created example test files to help you get started:

### Server Examples
- `server/src/controllers/__tests__/userController.test.ts` - Controller unit test
- `server/src/routes/__tests__/healthRoutes.integration.test.ts` - API integration test

### Client Examples
- `client/src/lib/__tests__/passwordValidation.test.ts` - Utility function test
- `client/src/lib/__tests__/imageUtils.test.ts` - Utility function test
- `client/src/components/UserCard/__tests__/UserCard.test.tsx` - Component test

## Next Steps

1. **Run the example tests** to verify everything is set up correctly:
   ```bash
   cd server && npm test
   cd client && npm test
   ```

2. **Start writing tests for your critical paths**:
   - Authentication flows
   - Data mutations (create, update, delete)
   - Business logic functions
   - API endpoints

3. **Add tests incrementally**:
   - Write tests for new features as you build them
   - Add tests when fixing bugs
   - Refactor existing code and add tests

4. **Set up CI/CD** to run tests automatically on every commit

## Troubleshooting

### Tests not running
- Make sure you've installed dependencies: `npm install`
- Check that Vitest is installed: `npm list vitest`

### Type errors in tests
- Make sure TypeScript is configured correctly
- Check that test files are included in `tsconfig.json`

### Coverage not generating
- Make sure `@vitest/coverage-v8` is installed
- Check that coverage provider is set in `vitest.config.ts`

## Resources

- See `TESTING_GUIDE.md` for comprehensive testing documentation
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
