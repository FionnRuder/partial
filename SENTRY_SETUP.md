# Sentry Error Tracking Setup

This document describes the Sentry error tracking integration for both server and client.

## Overview

Sentry is integrated to track and monitor errors across the application:
- **Server-side error tracking** - Captures errors from Express API
- **Client-side error tracking** - Captures errors from Next.js frontend
- **Error grouping** - Automatically groups similar errors
- **Performance monitoring** - Tracks slow requests and transactions
- **User context** - Associates errors with users
- **Release tracking** - Tracks which version introduced errors

## Setup

### 1. Create Sentry Account and Project

1. Sign up at [sentry.io](https://sentry.io)
2. Create a new project:
   - Select "Node.js" for the server project
   - Select "Next.js" for the client project
3. Get your DSN (Data Source Name) from project settings

### 2. Server Configuration

Add to `server/.env`:

```bash
# Sentry Configuration
SENTRY_DSN=https://your-dsn@your-org.ingest.sentry.io/project-id
SENTRY_TRACES_SAMPLE_RATE=0.1          # 10% of transactions for performance monitoring
SENTRY_PROFILES_SAMPLE_RATE=0.1        # 10% of profiles
SENTRY_RELEASE=partial-server@1.0.0    # Optional: Track releases
```

### 3. Client Configuration

Add to `client/.env.local`:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@your-org.ingest.sentry.io/project-id
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1    # 10% of transactions
NEXT_PUBLIC_SENTRY_REPLAYS_SAMPLE_RATE=0.1   # 10% of sessions for replay
NEXT_PUBLIC_SENTRY_RELEASE=partial-client@1.0.0
```

## Features

### Automatic Error Tracking

Errors are automatically captured from:

**Server-side:**
- Unhandled exceptions in Express routes
- Errors caught by error middleware
- Database query errors
- Authentication failures

**Client-side:**
- React Error Boundary catches
- Unhandled promise rejections
- API request errors
- JavaScript runtime errors

### User Context

User information is automatically attached to errors:

```typescript
// Server-side (automatically set after authentication)
Sentry.setUser({
  id: userId.toString(),
  organizationId: organizationId.toString(),
  email: userEmail,
});

// Client-side (set in AuthContext)
Sentry.setUser({
  id: userId.toString(),
});
```

### Error Grouping

Sentry automatically groups similar errors by:
- Error message
- Stack trace
- Error location
- Custom fingerprinting (can be customized)

### Performance Monitoring

Transaction tracking for:
- HTTP requests (server-side)
- Page loads (client-side)
- Database queries
- External API calls

## Configuration Options

### Sample Rates

Adjust sample rates to control volume:

```bash
# Server
SENTRY_TRACES_SAMPLE_RATE=0.1      # 10% of transactions
SENTRY_PROFILES_SAMPLE_RATE=0.1    # 10% of profiles

# Client
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_REPLAYS_SAMPLE_RATE=0.1
```

**Recommendations:**
- **Development**: 1.0 (100%) - Capture all errors
- **Production**: 0.1 (10%) - Sample to control costs
- **High-traffic**: 0.01 (1%) - Very low sampling

### Error Filtering

Errors are filtered out by default:
- Validation errors (client-side)
- 404 errors (not found)
- 4xx client errors (except 401/403)

To customize filtering, edit:
- `server/src/lib/sentry.ts` - `beforeSend` function
- `client/sentry.client.config.ts` - `beforeSend` function

### Release Tracking

Set release version to track which version introduced errors:

```bash
# Server
SENTRY_RELEASE=partial-server@1.0.0

# Client
NEXT_PUBLIC_SENTRY_RELEASE=partial-client@1.0.0
```

## Usage

### Manual Error Reporting

**Server-side:**
```typescript
import { captureException, setContext } from './lib/sentry';

try {
  // Your code
} catch (error) {
  setContext('operation', { type: 'user_update', userId: 123 });
  captureException(error);
}
```

**Client-side:**
```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error);
}
```

### Setting User Context

**Server-side (automatic after authentication):**
User context is automatically set in the authentication middleware.

**Client-side:**
```typescript
import * as Sentry from '@sentry/nextjs';

// Set user when logged in
Sentry.setUser({
  id: user.userId.toString(),
  email: user.email,
});

// Clear user on logout
Sentry.setUser(null);
```

### Adding Custom Context

**Server-side:**
```typescript
import { setContext, setTag } from './lib/sentry';

setContext('request', {
  method: 'POST',
  endpoint: '/api/users',
  requestId: 'abc-123',
});

setTag('feature', 'user-management');
```

**Client-side:**
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.withScope((scope) => {
  scope.setContext('checkout', {
    cartValue: 99.99,
    items: 3,
  });
  scope.setTag('page', 'checkout');
  // Your code that might error
});
```

## Alerts Setup

### 1. Create Alert in Sentry Dashboard

1. Go to **Alerts** → **Create Alert Rule**
2. Configure:
   - **Name**: "Critical Errors"
   - **Conditions**: 
     - Issue frequency is greater than 10 in 5 minutes
     - Issue state changes to resolved
   - **Actions**: Email, Slack, PagerDuty, etc.

### 2. Recommended Alerts

**Critical Errors:**
- Condition: Issue frequency > 10 in 5 minutes
- Severity: Error level
- Action: Email + Slack

**Authentication Failures:**
- Condition: Issue contains "login_failure" or "authentication"
- Frequency: > 5 in 1 minute
- Action: Security team notification

**Performance Degradation:**
- Condition: Transaction duration > 2 seconds
- Frequency: > 20% of transactions
- Action: Performance team notification

**New Issue:**
- Condition: New issue detected
- Action: Email notification

## Error Trends

View error trends in Sentry dashboard:

1. **Issues** - List of all errors grouped by type
2. **Performance** - Transaction performance metrics
3. **Releases** - Errors by release version
4. **Users** - Errors affecting specific users

## Session Replay (Client-side)

Session Replay records user sessions when errors occur:
- See exactly what users did before the error
- Replay the session to reproduce issues
- Configured to mask sensitive data (text and media)

Enable/disable in `client/sentry.client.config.ts`:
```typescript
replaysOnErrorSampleRate: 1.0,      // 100% of error sessions
replaysSessionSampleRate: 0.1,      // 10% of all sessions
```

## Performance Monitoring

Transaction traces show:
- Request duration breakdown
- Database query times
- External API call durations
- Function execution times

View in Sentry dashboard: **Performance** → **Transactions**

## Best Practices

1. **Set appropriate sample rates**
   - Start high in development (1.0)
   - Reduce in production based on volume (0.1-0.01)

2. **Use release tracking**
   - Tag releases with version numbers
   - Track which version introduced errors

3. **Filter noise**
   - Exclude expected errors (404s, validation errors)
   - Focus on unexpected errors

4. **Set up alerts**
   - Alert on critical errors
   - Alert on error spikes
   - Alert on performance degradation

5. **Monitor trends**
   - Review error trends regularly
   - Track error resolution progress
   - Monitor performance metrics

6. **Use context effectively**
   - Set user context for user-specific issues
   - Add custom context for debugging
   - Use tags for filtering and grouping

## Troubleshooting

### Errors not appearing in Sentry

1. Check DSN is configured correctly
2. Verify environment variables are set
3. Check Sentry initialization is called
4. Review browser console for Sentry errors
5. Check network tab for Sentry API calls

### Too many errors / High volume

1. Reduce sample rates
2. Add more filters in `beforeSend`
3. Review and exclude noisy errors
4. Use error fingerprinting to group similar errors

### Performance impact

1. Reduce sample rates
2. Disable profiling in production (set to 0)
3. Use async transport (configured by default)
4. Batch error reporting

## Integration with Existing Logging

Sentry works alongside the Winston logging system:
- **Winston logs** → CloudWatch / files (detailed logs)
- **Sentry** → Error tracking dashboard (errors and exceptions)

Use both:
- Winston for detailed application logs
- Sentry for error tracking and alerting

## Security Considerations

- **DSN is safe to expose** in client code (it's public)
- **Sensitive data** is automatically masked in Session Replay
- **Custom data** should not include passwords, tokens, or PII
- **User context** only includes user ID and email (safe)

## Cost Management

Sentry free tier includes:
- 5,000 errors/month
- 10,000 performance units/month
- 1,000 replay sessions/month

To manage costs:
- Reduce sample rates
- Filter out expected errors
- Use error grouping effectively
- Upgrade plan if needed

## Next Steps

1. Set up your Sentry account and projects
2. Configure environment variables
3. Test error tracking (trigger test errors)
4. Set up alerts
5. Monitor error dashboard
6. Configure release tracking for deployments


