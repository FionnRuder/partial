"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = createAuditLog;
exports.auditLogFromRequest = auditLogFromRequest;
exports.logCreate = logCreate;
exports.logUpdate = logUpdate;
exports.logDelete = logDelete;
exports.logView = logView;
exports.getChangedFields = getChangedFields;
exports.sanitizeForAudit = sanitizeForAudit;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Get client IP address from request
 */
function getClientIp(req) {
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
function createAuditLog(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.auditLog.create({
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
        }
        catch (error) {
            // Don't throw - audit logging failures shouldn't break the application
            console.error("Failed to create audit log:", error);
        }
    });
}
/**
 * Create audit log from Express request
 */
function auditLogFromRequest(req, data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const organizationId = (_b = req.auth) === null || _b === void 0 ? void 0 : _b.organizationId;
        const requestId = req.requestId;
        if (!userId || !organizationId) {
            // Can't log if user/org context is missing
            return;
        }
        yield createAuditLog({
            organizationId,
            userId,
            action: data.action,
            entityType: data.entityType,
            entityId: typeof data.entityId === 'string' ? undefined : data.entityId, // User.id is string, skip entityId for User entities
            description: data.description,
            changes: data.changes,
            metadata: Object.assign({ path: req.path, method: req.method, query: req.query, params: req.params }, data.metadata),
            ipAddress: getClientIp(req),
            userAgent: req.headers["user-agent"],
            requestId,
        });
    });
}
/**
 * Helper to create audit log for CREATE operations
 */
function logCreate(req, entityType, entityId, description, data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield auditLogFromRequest(req, {
            action: client_1.AuditAction.CREATE,
            entityType,
            entityId,
            description,
            changes: data ? { after: data } : undefined,
        });
    });
}
/**
 * Helper to create audit log for UPDATE operations
 */
function logUpdate(req, entityType, entityId, description, before, after, changedFields) {
    return __awaiter(this, void 0, void 0, function* () {
        yield auditLogFromRequest(req, {
            action: client_1.AuditAction.UPDATE,
            entityType,
            entityId,
            description,
            changes: {
                before,
                after,
                fields: changedFields,
            },
        });
    });
}
/**
 * Helper to create audit log for DELETE operations
 */
function logDelete(req, entityType, entityId, description, data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield auditLogFromRequest(req, {
            action: client_1.AuditAction.DELETE,
            entityType,
            entityId,
            description,
            changes: data ? { before: data } : undefined,
        });
    });
}
/**
 * Helper to create audit log for VIEW operations (sensitive data access)
 */
function logView(req, entityType, entityId, description, metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        yield auditLogFromRequest(req, {
            action: client_1.AuditAction.VIEW,
            entityType,
            entityId,
            description,
            metadata,
        });
    });
}
/**
 * Helper to compute changed fields between two objects
 */
function getChangedFields(before, after) {
    const changed = [];
    const allKeys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
    for (const key of allKeys) {
        const beforeVal = before === null || before === void 0 ? void 0 : before[key];
        const afterVal = after === null || after === void 0 ? void 0 : after[key];
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
function sanitizeForAudit(data, sensitiveFields = []) {
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
    const sanitized = Object.assign({}, data);
    for (const field of allSensitiveFields) {
        if (field in sanitized) {
            sanitized[field] = "[REDACTED]";
        }
    }
    return sanitized;
}
