# Audit Log Integration Examples

This document shows how to integrate audit logging into your controllers.

## Basic Usage

### 1. Import audit logging functions

```typescript
import { logCreate, logUpdate, logDelete, logView, getChangedFields, sanitizeForAudit } from "../lib/auditLogger";
```

### 2. Log CREATE operations

```typescript
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // ... create the entity ...
    const newUser = await prisma.user.create({ data: {...} });

    // Log the creation
    await logCreate(
      req,
      "User",
      newUser.userId,
      `User created: ${newUser.name} (${newUser.email})`,
      sanitizeForAudit(newUser) // Sanitize sensitive data
    );

    res.status(201).json(newUser);
  } catch (error) {
    // ... error handling ...
  }
};
```

### 3. Log UPDATE operations

```typescript
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    // Get the existing entity
    const existingUser = await prisma.user.findUnique({
      where: { userId: parseInt(userId) }
    });

    // Perform the update
    const updatedUser = await prisma.user.update({
      where: { userId: parseInt(userId) },
      data: { ...req.body }
    });

    // Compute changed fields
    const changedFields = getChangedFields(existingUser, updatedUser);

    // Log the update
    await logUpdate(
      req,
      "User",
      updatedUser.userId,
      `User updated: ${updatedUser.name}`,
      sanitizeForAudit(existingUser),
      sanitizeForAudit(updatedUser),
      changedFields
    );

    res.json(updatedUser);
  } catch (error) {
    // ... error handling ...
  }
};
```

### 4. Log DELETE operations

```typescript
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    // Get the entity before deletion
    const userToDelete = await prisma.user.findUnique({
      where: { userId: parseInt(userId) }
    });

    // Delete the entity
    await prisma.user.delete({
      where: { userId: parseInt(userId) }
    });

    // Log the deletion
    await logDelete(
      req,
      "User",
      parseInt(userId),
      `User deleted: ${userToDelete?.name} (${userToDelete?.email})`,
      sanitizeForAudit(userToDelete)
    );

    res.status(204).send();
  } catch (error) {
    // ... error handling ...
  }
};
```

### 5. Log VIEW operations (for sensitive data)

```typescript
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: parseInt(req.params.userId) }
    });

    // Log viewing sensitive data
    await logView(
      req,
      "User",
      user.userId,
      `User profile viewed: ${user.name}`,
      { viewedBy: req.auth.userId }
    );

    res.json(user);
  } catch (error) {
    // ... error handling ...
  }
};
```

### 6. Custom audit logs with full control

```typescript
import { auditLogFromRequest } from "../lib/auditLogger";

export const customOperation = async (req: Request, res: Response): Promise<void> => {
  try {
    // ... perform operation ...

    // Log with custom metadata
    await auditLogFromRequest(req, {
      action: AuditAction.EXPORT,
      entityType: "WorkItem",
      entityId: undefined, // Bulk operation
      description: `Exported ${count} work items`,
      metadata: {
        format: "CSV",
        filters: req.query,
        recordCount: count,
      },
    });

    res.json({ success: true });
  } catch (error) {
    // ... error handling ...
  }
};
```

## Best Practices

1. **Always sanitize sensitive data** - Use `sanitizeForAudit()` to remove passwords, tokens, etc.
2. **Log after successful operations** - Don't log failed operations (unless intentional)
3. **Use descriptive descriptions** - Include entity names/IDs in descriptions
4. **Include metadata for context** - Add relevant context to help debugging
5. **Handle errors gracefully** - Audit logging failures shouldn't break the operation

## Sensitive Fields

The `sanitizeForAudit` function automatically redacts:
- password
- token
- secret
- apiKey
- privateKey
- accessToken
- refreshToken
- sessionSecret

Add custom fields:
```typescript
sanitizeForAudit(data, ["customSecretField", "anotherSecret"]);
```


