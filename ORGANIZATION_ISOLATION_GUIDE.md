# Organization Isolation with Amazon Cognito

## Overview

Your application uses **application-level multi-tenancy** where:
- All organizations share the same Cognito User Pool
- Organization membership is stored in your database
- Data isolation is enforced at the application/database level using `organizationId`

## Current Architecture

### 1. Authentication Flow

```
User → Cognito Login → Session Created → Database Lookup → organizationId Attached
```

1. User authenticates via Cognito (OIDC)
2. Session stores Cognito `userInfo` (email, sub, etc.)
3. `authenticate` middleware looks up user in database by `email` or `cognitoId`
4. `req.auth.organizationId` is set from the user's database record
5. All subsequent queries filter by `organizationId`

### 2. Current Implementation Status

✅ **What's Already Working:**
- Authentication middleware sets `req.auth.organizationId` correctly
- All controllers filter queries by `organizationId`
- Users can only see data from their own organization
- New users are assigned to organizations during onboarding

## Security Best Practices

### 1. **Always Use `req.auth.organizationId`**

**✅ CORRECT:**
```typescript
const teams = await prisma.disciplineTeam.findMany({
  where: {
    organizationId: req.auth.organizationId, // ✅ Always use from req.auth
  },
});
```

**❌ WRONG:**
```typescript
// ❌ Never trust client-provided organizationId
const teams = await prisma.disciplineTeam.findMany({
  where: {
    organizationId: req.body.organizationId, // ❌ Security risk!
  },
});
```

### 2. **Validate Related Resources**

When accessing related resources (e.g., a program's work items), always verify the parent resource belongs to the user's organization:

```typescript
// ✅ CORRECT: Verify program belongs to organization first
const program = await prisma.program.findFirst({
  where: { id: programId, organizationId: req.auth.organizationId },
});

if (!program) {
  res.status(404).json({ message: "Program not found" });
  return;
}

// Then query work items
const workItems = await prisma.workItem.findMany({
  where: { programId, organizationId: req.auth.organizationId },
});
```

### 3. **Include Organization Check in Updates/Deletes**

```typescript
// ✅ CORRECT: Include organizationId in update/delete queries
await prisma.workItem.updateMany({
  where: {
    id: workItemId,
    organizationId: req.auth.organizationId, // ✅ Prevents cross-org updates
  },
  data: { status: 'Completed' },
});
```

### 4. **Validate Foreign Key Relationships**

When creating relationships, ensure all related entities belong to the same organization:

```typescript
// ✅ CORRECT: Validate all related entities
const program = await prisma.program.findFirst({
  where: { id: programId, organizationId: req.auth.organizationId },
});

const part = await prisma.part.findFirst({
  where: { id: partId, organizationId: req.auth.organizationId },
});

if (!program || !part) {
  res.status(400).json({ message: "Program or part not found in your organization" });
  return;
}
```

## Cognito-Specific Considerations

### 1. **Single User Pool for All Organizations**

**Current Approach:** ✅ Recommended for most use cases
- Simpler to manage
- Lower cost
- Easier user management
- Organization isolation handled at application level

**Alternative (Not Recommended):** Separate User Pool per Organization
- More complex to manage
- Higher AWS costs
- Harder to implement cross-organization features later
- Only needed for strict compliance requirements

### 2. **User Pool Attributes**

Your current setup uses standard Cognito attributes:
- `email` - Used to identify users
- `sub` (cognitoId) - Unique identifier
- `name` - User's full name

**Recommendation:** Keep using standard attributes. Don't store `organizationId` in Cognito user attributes - it belongs in your database.

### 3. **User Pool Groups (Optional Enhancement)**

You could use Cognito Groups for role-based access, but your current database-based role system is sufficient:

```typescript
// Optional: If you want to use Cognito Groups
const groups = userInfo['cognito:groups'] || [];
const isAdmin = groups.includes('admin');
```

However, your current `role` field in the database is more flexible and easier to manage.

## Database Schema Considerations

### Current Schema (Good!)

Your Prisma schema already has `organizationId` on all relevant tables:
- ✅ `User.organizationId`
- ✅ `Program.organizationId`
- ✅ `Part.organizationId`
- ✅ `WorkItem.organizationId`
- ✅ `Milestone.organizationId`
- ✅ `DisciplineTeam.organizationId`
- ✅ `Comment.organizationId`
- ✅ `Attachment.organizationId`

### Indexing Recommendations

Ensure you have indexes on `organizationId` for performance:

```prisma
// In your schema.prisma, add indexes:
model User {
  // ... fields
  @@index([organizationId])
}

model Program {
  // ... fields
  @@index([organizationId])
}

// ... etc for all tables with organizationId
```

## Testing Organization Isolation

### 1. **Manual Testing Checklist**

- [ ] Create two test organizations
- [ ] Create users in each organization
- [ ] Verify users can only see their organization's data
- [ ] Verify users cannot access other organization's resources by ID
- [ ] Test API endpoints with different organization users
- [ ] Verify search only returns results from user's organization

### 2. **Automated Testing Example**

```typescript
// Example test for organization isolation
describe('Organization Isolation', () => {
  it('should only return work items from user\'s organization', async () => {
    // Create two organizations
    const org1 = await createOrganization('Org 1');
    const org2 = await createOrganization('Org 2');
    
    // Create users in each
    const user1 = await createUser(org1.id);
    const user2 = await createUser(org2.id);
    
    // Create work items in each organization
    const workItem1 = await createWorkItem(org1.id);
    const workItem2 = await createWorkItem(org2.id);
    
    // User 1 should only see workItem1
    const user1WorkItems = await getWorkItems(user1.session);
    expect(user1WorkItems).toContain(workItem1);
    expect(user1WorkItems).not.toContain(workItem2);
    
    // User 2 should only see workItem2
    const user2WorkItems = await getWorkItems(user2.session);
    expect(user2WorkItems).toContain(workItem2);
    expect(user2WorkItems).not.toContain(workItem1);
  });
});
```

## Common Pitfalls to Avoid

### 1. **❌ Trusting Client-Provided organizationId**

```typescript
// ❌ NEVER DO THIS
const { organizationId } = req.body;
await prisma.workItem.create({
  data: {
    organizationId, // ❌ Client could send any organizationId!
    // ...
  },
});

// ✅ ALWAYS DO THIS
await prisma.workItem.create({
  data: {
    organizationId: req.auth.organizationId, // ✅ From authenticated session
    // ...
  },
});
```

### 2. **❌ Missing organizationId in Related Queries**

```typescript
// ❌ WRONG: Missing organizationId check
const workItem = await prisma.workItem.findFirst({
  where: { id: workItemId },
  include: {
    comments: true, // ❌ Comments might be from different org!
  },
});

// ✅ CORRECT: Filter related data too
const workItem = await prisma.workItem.findFirst({
  where: { 
    id: workItemId,
    organizationId: req.auth.organizationId,
  },
  include: {
    comments: {
      where: {
        organizationId: req.auth.organizationId, // ✅ Filter comments too
      },
    },
  },
});
```

### 3. **❌ Forgetting organizationId in Joins**

```typescript
// ❌ WRONG: Join without organization check
const users = await prisma.user.findMany({
  where: {
    disciplineTeam: {
      programs: {
        some: { id: programId }, // ❌ Program might be from different org!
      },
    },
  },
});

// ✅ CORRECT: Include organizationId in all conditions
const users = await prisma.user.findMany({
  where: {
    organizationId: req.auth.organizationId,
    disciplineTeam: {
      organizationId: req.auth.organizationId,
      programs: {
        some: { 
          id: programId,
          organizationId: req.auth.organizationId, // ✅ Verify program's org
        },
      },
    },
  },
});
```

## Monitoring and Auditing

### 1. **Log Organization Access**

Add logging to detect potential isolation issues:

```typescript
// In authenticate middleware
console.log(`User ${user.userId} from organization ${user.organizationId} accessing ${req.path}`);
```

### 2. **Audit Trail**

Consider adding an audit log table:

```prisma
model AuditLog {
  id            Int      @id @default(autoincrement())
  organizationId Int
  userId        Int
  action        String   // "CREATE", "UPDATE", "DELETE", "VIEW"
  resourceType  String   // "WorkItem", "Program", etc.
  resourceId    Int?
  timestamp     DateTime @default(now())
  
  organization  Organization @relation(fields: [organizationId], references: [id])
  user          User         @relation(fields: [userId], references: [userId])
}
```

## Migration Strategy (If Needed)

If you need to add organization isolation to existing data:

1. **Create default organization** for existing users
2. **Assign all existing data** to default organization
3. **Update all queries** to include `organizationId` filter
4. **Test thoroughly** before deploying

## Summary

Your current implementation is **correct and secure**. The key principles are:

1. ✅ **Always use `req.auth.organizationId`** - Never trust client input
2. ✅ **Filter all queries** by `organizationId`
3. ✅ **Validate related resources** belong to the same organization
4. ✅ **Include organizationId** in all create/update/delete operations
5. ✅ **Test isolation** regularly

The combination of Cognito for authentication and database-level organization isolation is a solid, scalable approach for multi-tenant applications.

