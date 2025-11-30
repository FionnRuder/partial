import { PrismaClient, AuditAction } from "@prisma/client";
import { Request } from "express";

const prisma = new PrismaClient();

/**
 * Interface for audit log data
 */
export interface AuditLogData {
  organizationId: number;
  userId: number;
  action: AuditAction;
  entityType: string;
  entityId?: number;
  description: string;
  changes?: {
    before?: any;
    after?: any;
    fields?: string[]; // List of fields that changed
  };
  metadata?: {
    path?: string;
    method?: string;
    query?: any;
    params?: any;
    [key: string]: any;
  };
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

/**
 * Get client IP address from request
 */
function getClientIp(req: Request): string | undefined {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return ips.split(",")[0].trim();
  }
  const realIp = req.headers["x-real-ip"];
  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }
  return req.ip || req.socket.remoteAddress || undefined;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        organizationId: data.organizationId,
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        description: data.description,
        changes: data.changes ? JSON.parse(JSON.stringify(data.changes)) : null,
        metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        requestId: data.requestId,
      },
    });
  } catch (error) {
    // Don't throw - audit logging failures shouldn't break the application
    console.error("Failed to create audit log:", error);
  }
}

/**
 * Create audit log from Express request
 */
export async function auditLogFromRequest(
  req: Request,
  data: {
    action: AuditAction;
    entityType: string;
    entityId?: number;
    description: string;
    changes?: {
      before?: any;
      after?: any;
      fields?: string[];
    };
    metadata?: Record<string, any>;
  }
): Promise<void> {
  const userId = (req as any).auth?.userId;
  const organizationId = (req as any).auth?.organizationId;
  const requestId = (req as any).requestId;

  if (!userId || !organizationId) {
    // Can't log if user/org context is missing
    return;
  }

  await createAuditLog({
    organizationId,
    userId,
    action: data.action,
    entityType: data.entityType,
    entityId: data.entityId,
    description: data.description,
    changes: data.changes,
    metadata: {
      path: req.path,
      method: req.method,
      query: req.query,
      params: req.params,
      ...data.metadata,
    },
    ipAddress: getClientIp(req),
    userAgent: req.headers["user-agent"],
    requestId,
  });
}

/**
 * Helper to create audit log for CREATE operations
 */
export async function logCreate(
  req: Request,
  entityType: string,
  entityId: number,
  description: string,
  data?: any
): Promise<void> {
  await auditLogFromRequest(req, {
    action: AuditAction.CREATE,
    entityType,
    entityId,
    description,
    changes: data ? { after: data } : undefined,
  });
}

/**
 * Helper to create audit log for UPDATE operations
 */
export async function logUpdate(
  req: Request,
  entityType: string,
  entityId: number,
  description: string,
  before: any,
  after: any,
  changedFields?: string[]
): Promise<void> {
  await auditLogFromRequest(req, {
    action: AuditAction.UPDATE,
    entityType,
    entityId,
    description,
    changes: {
      before,
      after,
      fields: changedFields,
    },
  });
}

/**
 * Helper to create audit log for DELETE operations
 */
export async function logDelete(
  req: Request,
  entityType: string,
  entityId: number,
  description: string,
  data?: any
): Promise<void> {
  await auditLogFromRequest(req, {
    action: AuditAction.DELETE,
    entityType,
    entityId,
    description,
    changes: data ? { before: data } : undefined,
  });
}

/**
 * Helper to create audit log for VIEW operations (sensitive data access)
 */
export async function logView(
  req: Request,
  entityType: string,
  entityId: number,
  description: string,
  metadata?: Record<string, any>
): Promise<void> {
  await auditLogFromRequest(req, {
    action: AuditAction.VIEW,
    entityType,
    entityId,
    description,
    metadata,
  });
}

/**
 * Helper to compute changed fields between two objects
 */
export function getChangedFields(before: any, after: any): string[] {
  const changed: string[] = [];
  const allKeys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);

  for (const key of allKeys) {
    const beforeVal = before?.[key];
    const afterVal = after?.[key];

    // Deep comparison for objects/arrays
    if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
      changed.push(key);
    }
  }

  return changed;
}

/**
 * Helper to sanitize sensitive fields from audit logs
 */
export function sanitizeForAudit(data: any, sensitiveFields: string[] = []): any {
  const defaultSensitiveFields = [
    "password",
    "token",
    "secret",
    "apiKey",
    "privateKey",
    "accessToken",
    "refreshToken",
    "sessionSecret",
  ];

  const allSensitiveFields = [...defaultSensitiveFields, ...sensitiveFields];

  if (!data || typeof data !== "object") {
    return data;
  }

  const sanitized = { ...data };

  for (const field of allSensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = "[REDACTED]";
    }
  }

  return sanitized;
}


