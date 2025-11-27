# Structured Logging & Monitoring Setup

This document describes the structured logging and monitoring system implemented in the server.

## Overview

The application now uses **Winston** for structured logging with:
- Request ID tracking for tracing requests across the system
- Authentication event logging for security monitoring
- Error tracking with full context
- Response time monitoring
- CloudWatch integration (production)
- File-based logging (optional)

## Features

### 1. Structured Logging

All logs are in JSON format in production, with human-readable format in development.

**Log Levels:**
- `error` - Errors that need immediate attention
- `warn` - Warning conditions
- `info` - Informational messages (default in production)
- `http` - HTTP requests
- `verbose` - Verbose output
- `debug` - Debug messages (development only)
- `silly` - Very detailed debug output

### 2. Request ID Tracking

Every request gets a unique request ID that:
- Is included in all log entries for that request
- Is returned in the `X-Request-ID` response header
- Can be passed from upstream proxies via `X-Request-ID` header
- Enables tracing a request through the entire system

### 3. Authentication Event Logging

All authentication events are logged with security context:
- Login attempts
- Login success/failure
- Logout events
- Session expiration/invalidation
- Authorization failures

### 4. Request & Response Logging

Every HTTP request is logged with:
- Request method, path, query parameters
- User context (if authenticated)
- IP address and user agent
- Response status code
- Response time (duration)
- Error details (if applicable)

### 5. Error Tracking

Errors are logged with:
- Full stack traces
- Request context (request ID, user, path, etc.)
- Error metrics for monitoring

### 6. Metrics

The system tracks:
- Request metrics (response times, status codes)
- Error rates
- Authentication metrics

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Logging
LOG_LEVEL=info                    # Log level: error, warn, info, http, verbose, debug, silly
LOG_FILE_ENABLED=false            # Enable file-based logging
LOG_FILE_PATH=logs/combined.log   # Path for log files

# CloudWatch (Production)
AWS_REGION=us-east-1              # AWS region for CloudWatch
AWS_CLOUDWATCH_LOG_GROUP=/aws/partial/server  # CloudWatch log group name
AWS_CLOUDWATCH_LOG_STREAM_PREFIX=server       # Prefix for log stream names

# Service
SERVICE_NAME=partial-server       # Service name in logs
NODE_ENV=production               # Environment (affects log format)
```

### CloudWatch Setup

1. Create a CloudWatch Log Group:
   ```bash
   aws logs create-log-group --log-group-name /aws/partial/server --region us-east-1
   ```

2. Set IAM permissions for the server to write to CloudWatch:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "logs:CreateLogGroup",
           "logs:CreateLogStream",
           "logs:PutLogEvents"
         ],
         "Resource": "arn:aws:logs:*:*:*"
       }
     ]
   }
   ```

3. Set environment variables in your deployment environment.

### File Logging Setup

To enable file logging:

```bash
LOG_FILE_ENABLED=true
LOG_FILE_PATH=logs/combined.log
```

Make sure the `logs/` directory exists or logs will fail to write.

## Usage

### Basic Logging

```typescript
import { logger } from './lib/logger';

// Info log
logger.info('User created', { userId: 123, email: 'user@example.com' });

// Error log
logger.error('Database connection failed', { error: error.message, stack: error.stack });

// Warning log
logger.warn('Rate limit approaching', { userId: 123, requests: 95, limit: 100 });
```

### Logging with Request Context

The logger automatically includes request context if set via middleware:

```typescript
// Request ID is automatically included
logger.info('Processing request');

// User context is automatically included after authentication
logger.info('User action performed');
```

### Authentication Event Logging

```typescript
import { logAuthEvent, AuthEventType, getAuthContext } from './lib/authLogger';

// Log login success
logAuthEvent({
  eventType: AuthEventType.LOGIN_SUCCESS,
  ...getAuthContext(req),
  email: userInfo.email,
  cognitoId: userInfo.sub,
});

// Log login failure
logAuthEvent({
  eventType: AuthEventType.LOGIN_FAILURE,
  ...getAuthContext(req),
  error: 'Invalid credentials',
  reason: 'Authentication failed',
});
```

### Creating Child Loggers

For logs with additional context:

```typescript
import { createChildLogger } from './lib/logger';

const childLogger = createChildLogger({
  requestId: 'abc-123',
  userId: 456,
  operation: 'update_user',
});

childLogger.info('User updated'); // Includes all context
```

## Log Format Examples

### Development (Human-readable)

```
2024-01-15 10:30:45.123 [info] [abc-123-def] [user:456] [org:789]: Request completed successfully
  Method: GET
  Path: /api/users
  Status Code: 200
  Duration: 45ms
```

### Production (JSON)

```json
{
  "level": "info",
  "message": "Request completed successfully",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "service": "partial-server",
  "environment": "production",
  "requestId": "abc-123-def",
  "userId": 456,
  "organizationId": 789,
  "method": "GET",
  "path": "/api/users",
  "statusCode": 200,
  "duration": 45
}
```

### Authentication Event Log

```json
{
  "level": "info",
  "message": "Auth event: login_success",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "eventType": "login_success",
  "eventCategory": "authentication",
  "securityEvent": true,
  "requestId": "abc-123-def",
  "userId": 456,
  "organizationId": 789,
  "email": "user@example.com",
  "cognitoId": "us-east-1:abc-123",
  "ip": "192.168.1.100"
}
```

## Monitoring & Alerting

### CloudWatch Metrics

Logs can be queried in CloudWatch Insights:

```
fields @timestamp, @message, requestId, userId, statusCode, duration
| filter statusCode >= 500
| stats count() by requestId
```

### Key Metrics to Monitor

1. **Error Rate**: Count of logs with `level = "error"`
2. **Response Times**: Average `duration` field by endpoint
3. **Authentication Failures**: Count of `eventType = "login_failure"`
4. **Rate Limit Violations**: Logs with `securityEvent = true` and rate limit messages

### Alerting Examples

**High Error Rate:**
```
fields @timestamp
| filter level = "error"
| stats count() by bin(5m)
```

**Slow Requests:**
```
fields @timestamp, path, duration
| filter duration > 1000
| stats avg(duration), max(duration) by path
```

**Authentication Failures:**
```
fields @timestamp, ip, email
| filter eventType = "login_failure"
| stats count() by ip, bin(1h)
```

## Best Practices

1. **Use appropriate log levels:**
   - `error` - Only for actual errors that need attention
   - `warn` - Warning conditions that might need investigation
   - `info` - Important events and state changes
   - `debug` - Detailed debugging information

2. **Include context:**
   - Always include relevant IDs (requestId, userId, etc.)
   - Include error details with errors (message, stack)
   - Add metadata for complex operations

3. **Don't log sensitive data:**
   - Never log passwords, tokens, or secrets
   - Be careful with PII (Personally Identifiable Information)
   - Use structured logging to make it easy to filter sensitive fields

4. **Monitor production logs:**
   - Set up CloudWatch alarms for error rates
   - Monitor authentication events for security issues
   - Track response times to identify performance problems

5. **Use request IDs for debugging:**
   - When a user reports an issue, ask for the request ID
   - Search logs by request ID to trace the entire request flow

## Troubleshooting

### Logs not appearing in CloudWatch

1. Check AWS credentials are configured
2. Verify IAM permissions for CloudWatch Logs
3. Check that `AWS_REGION` and `AWS_CLOUDWATCH_LOG_GROUP` are set
4. Look for initialization errors in console logs

### File logging not working

1. Verify `LOG_FILE_ENABLED=true`
2. Check directory permissions for `logs/` directory
3. Ensure `LOG_FILE_PATH` is set correctly

### High log volume

1. Adjust `LOG_LEVEL` to reduce verbose logging
2. Use CloudWatch log retention policies
3. Consider log sampling for high-traffic endpoints

## Migration from console.log

The system has been integrated with:
- ✅ Authentication middleware
- ✅ Auth routes
- ✅ Error handlers
- ✅ Request logging middleware
- ✅ Rate limiter

You can gradually replace remaining `console.log` statements with `logger.info()` calls throughout the codebase.

