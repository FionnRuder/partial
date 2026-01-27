# CI/CD Setup

This project uses GitHub Actions to automatically run tests on every commit and pull request.

## Workflow Overview

The CI pipeline runs two parallel test jobs:

1. **Client Tests** - Tests the Next.js frontend application
2. **Server Tests** - Tests the Express/Prisma backend application

## What Gets Tested

### On Every Push
- All tests run automatically when you push to `main`, `develop`, or `master` branches
- Tests also run on pull requests targeting these branches

### Client Tests
- Unit tests for React components
- Utility function tests
- RTK Query mutation tests
- Authentication and authorization tests

### Server Tests
- API endpoint tests
- Controller tests
- Database integration tests
- Authentication middleware tests

## CI Configuration

The CI configuration is located at `.github/workflows/ci.yml`.

### Client Test Job
- Uses Node.js 20
- Installs dependencies with `npm ci`
- Runs tests with `npm test`
- Sets `NEXT_PUBLIC_API_BASE_URL` environment variable

### Server Test Job
- Uses Node.js 20
- Sets up PostgreSQL database service (PostgreSQL 15)
- Installs dependencies with `npm ci`
- Generates Prisma client
- Runs database migrations
- Runs tests with `npm test`
- Configures required environment variables for testing

## Environment Variables

The CI pipeline automatically sets up the following environment variables:

### Client
- `NEXT_PUBLIC_API_BASE_URL`: `http://localhost:8000`

### Server
- `DATABASE_URL`: PostgreSQL connection string for test database
- `NODE_ENV`: `test`
- `JWT_SECRET`: Test JWT secret
- `SESSION_SECRET`: Test session secret
- `BETTER_AUTH_SECRET`: Test Better Auth secret
- `BETTER_AUTH_URL`: `http://localhost:8000`
- `PORT`: `8000`

## Viewing CI Results

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Select the workflow run you want to view
4. Click on individual jobs to see detailed logs

## Test Artifacts

Test results are automatically uploaded as artifacts and retained for 7 days:
- `client-test-results` - Client test output
- `server-test-results` - Server test output

## Troubleshooting

### Tests Fail in CI but Pass Locally

1. **Database Issues**: Ensure your local database matches the CI PostgreSQL version (15)
2. **Environment Variables**: Check that all required environment variables are set in the workflow
3. **Dependencies**: Run `npm ci` locally to match CI behavior (uses exact versions from lock file)
4. **Node Version**: Ensure you're using Node.js 20 locally

### Common Issues

- **Prisma Migration Errors**: The CI runs `prisma migrate deploy` - ensure migrations are up to date
- **Port Conflicts**: CI uses port 5432 for PostgreSQL and 8000 for the server
- **Timeout Issues**: If tests take too long, consider optimizing slow tests or increasing timeout

## Adding New Tests

When you add new tests:

1. Write your test file following existing patterns
2. Ensure tests can run in CI environment (no local dependencies)
3. Push your changes - CI will automatically run the tests
4. Check the Actions tab to verify tests pass

## Manual CI Trigger

You can manually trigger the CI workflow:

1. Go to Actions tab in GitHub
2. Select "CI" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Best Practices

1. **Always run tests locally** before pushing: `npm test` in both client and server directories
2. **Keep tests fast** - CI has time limits, slow tests can cause failures
3. **Use environment variables** - Don't hardcode values that differ between local and CI
4. **Mock external services** - Tests should not depend on external APIs or services
5. **Clean up resources** - Ensure tests clean up after themselves (database records, files, etc.)
