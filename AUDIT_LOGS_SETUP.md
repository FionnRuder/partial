# Activity/Audit Logs Implementation

This document describes the comprehensive audit logging system implemented for tracking all system activities.

## Overview

The audit logging system provides a complete audit trail of all create, update, delete, and view operations in the system. It tracks:
- Who performed the action (user)
- When the action occurred (timestamp)
- What action was performed (CREATE, UPDATE, DELETE, VIEW, etc.)
- What entity was affected (entity type and ID)
- What changed (before/after values for updates)
- Request context (IP address, user agent, request ID)

## Database Schema

### AuditLog Model

```prisma
model AuditLog {
  id             Int        @id @default(autoincrement())
  organizationId Int
  userId         Int
  action         AuditAction
  entityType     String     // e.g., "WorkItem", "User", "Part"
  entityId       Int?
  description    String
  changes        Json?      // before/after values
  metadata       Json?      // additional context
  ipAddress      String?
  userAgent      String?
  requestId      String?
  createdAt      DateTime   @default(now())
}
```

### AuditAction Enum

- `CREATE` - Entity created
- `UPDATE` - Entity updated
- `DELETE` - Entity deleted
- `VIEW` - Entity viewed (for sensitive data)
- `LOGIN` - User logged in
- `LOGOUT` - User logged out
- `EXPORT` - Data exported
- `IMPORT` - Data imported

## Setup

### 1. Run Migration

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

This will create the `AuditLog` table and `AuditAction` enum in your database.

### 2. Access Audit Log Viewer

Navigate to `/audit-logs` in your application. Only users with Admin role can access this page.

## Usage

### Logging Operations

See `AUDIT_LOG_INTEGRATION_EXAMPLE.md` for detailed examples of how to integrate audit logging into your controllers.

**Basic Example:**

```typescript
import { logCreate, logUpdate, logDelete } from "../lib/auditLogger";

// Log creation
await logCreate(
  req,
  "WorkItem",
  newWorkItem.id,
  `Work item created: ${newWorkItem.title}`,
  sanitizeForAudit(newWorkItem)
);

// Log update
await logUpdate(
  req,
  "WorkItem",
  workItem.id,
  `Work item updated: ${workItem.title}`,
  sanitizeForAudit(existingWorkItem),
  sanitizeForAudit(updatedWorkItem),
  getChangedFields(existingWorkItem, updatedWorkItem)
);

// Log deletion
await logDelete(
  req,
  "WorkItem",
  workItemId,
  `Work item deleted: ${workItem.title}`,
  sanitizeForAudit(workItem)
);
```

## API Endpoints

All endpoints require Admin role:

### GET /auditLogs

Get audit logs with filtering and pagination.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `action` - Filter by action type
- `entityType` - Filter by entity type
- `entityId` - Filter by entity ID
- `userId` - Filter by user ID
- `startDate` - Filter from date (ISO format)
- `endDate` - Filter to date (ISO format)
- `search` - Search in descriptions

**Response:**
```json
{
  "auditLogs": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000,
    "totalPages": 20
  }
}
```

### GET /auditLogs/:id

Get a specific audit log by ID.

### GET /auditLogs/entity/:entityType/:entityId

Get all audit logs for a specific entity.

### GET /auditLogs/stats

Get audit log statistics.

**Query Parameters:**
- `startDate` - Filter from date (ISO format)
- `endDate` - Filter to date (ISO format)

**Response:**
```json
{
  "totalLogs": 1000,
  "actionsCount": [
    { "action": "CREATE", "count": 500 },
    { "action": "UPDATE", "count": 300 }
  ],
  "entityTypesCount": [
    { "entityType": "WorkItem", "count": 400 }
  ],
  "topUsers": [...]
}
```

## Features

### 1. Comprehensive Tracking

- All CRUD operations are logged
- User context automatically included
- Request context (IP, user agent) captured
- Changes tracked for updates

### 2. Security

- Sensitive data automatically sanitized
- IP addresses and user agents logged
- Request IDs for tracing
- Organization isolation enforced

### 3. Filtering & Search

- Filter by action, entity type, user, date range
- Search in descriptions
- Pagination for large datasets
- Statistics dashboard

### 4. Admin Viewer

- Clean, searchable interface
- Real-time statistics
- Export capabilities (future)
- Detailed change tracking

## Best Practices

1. **Log after successful operations** - Don't log failed operations
2. **Use descriptive descriptions** - Include entity names/IDs
3. **Sanitize sensitive data** - Use `sanitizeForAudit()` helper
4. **Log all important operations** - Create, update, delete should always be logged
5. **Use VIEW action sparingly** - Only for sensitive data access

## Sensitive Data Handling

The `sanitizeForAudit()` function automatically redacts:
- passwords
- tokens
- secrets
- apiKeys
- privateKeys
- accessTokens
- refreshTokens
- sessionSecrets

Add custom sensitive fields:
```typescript
sanitizeForAudit(data, ["customSecretField"]);
```

## Integration Checklist

To add audit logging to a controller:

- [ ] Import audit logging functions
- [ ] Add logging after successful CREATE operations
- [ ] Add logging after successful UPDATE operations (with before/after)
- [ ] Add logging after successful DELETE operations
- [ ] Sanitize sensitive data before logging
- [ ] Use descriptive descriptions

## Frontend Access

The audit log viewer is available at `/audit-logs` and includes:
- Statistics dashboard
- Advanced filtering
- Search functionality
- Pagination
- Detailed log entries with change tracking

## Performance Considerations

- Audit logs are created asynchronously (don't block operations)
- Indexes on common query fields (organizationId, entityType, createdAt)
- Pagination to limit query size
- Consider archiving old logs (older than X months)

## Future Enhancements

- Export audit logs to CSV/PDF
- Email alerts for sensitive operations
- Audit log retention policies
- Real-time audit log streaming
- Audit log analytics and reporting


