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
exports.getAuditLogStats = exports.getEntityAuditLogs = exports.getAuditLogById = exports.getAuditLogs = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Get audit logs with filtering and pagination
 * Requires Admin role
 */
const getAuditLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const { page = "1", limit = "50", action, entityType, entityId, userId, startDate, endDate, search, } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // Build where clause
        const where = {
            organizationId,
        };
        if (action) {
            where.action = action;
        }
        if (entityType) {
            where.entityType = entityType;
        }
        if (entityId) {
            where.entityId = parseInt(entityId, 10);
        }
        if (userId) {
            where.userId = userId;
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }
        if (search) {
            where.description = {
                contains: search,
                mode: "insensitive",
            };
        }
        // Get audit logs with user information
        const [auditLogs, total] = yield Promise.all([
            prisma.auditLog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            username: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limitNum,
            }),
            prisma.auditLog.count({ where }),
        ]);
        res.json({
            auditLogs,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAuditLogs = getAuditLogs;
/**
 * Get audit log by ID
 * Requires Admin role
 */
const getAuditLogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const { id } = req.params;
        const auditLog = yield prisma.auditLog.findFirst({
            where: {
                id: parseInt(id, 10),
                organizationId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true,
                    },
                },
            },
        });
        if (!auditLog) {
            res.status(404).json({ error: "Audit log not found" });
            return;
        }
        res.json(auditLog);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAuditLogById = getAuditLogById;
/**
 * Get audit logs for a specific entity
 */
const getEntityAuditLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const { entityType, entityId } = req.params;
        const auditLogs = yield prisma.auditLog.findMany({
            where: {
                organizationId,
                entityType,
                entityId: parseInt(entityId, 10),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 100, // Limit to recent 100 logs per entity
        });
        res.json(auditLogs);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getEntityAuditLogs = getEntityAuditLogs;
/**
 * Get audit log statistics
 */
const getAuditLogStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const { startDate, endDate } = req.query;
        const dateFilter = {};
        if (startDate) {
            dateFilter.gte = new Date(startDate);
        }
        if (endDate) {
            dateFilter.lte = new Date(endDate);
        }
        const where = Object.assign({ organizationId }, (Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }));
        const [totalLogs, actionsCount, entityTypesCount, topUsers,] = yield Promise.all([
            prisma.auditLog.count({ where }),
            prisma.auditLog.groupBy({
                by: ["action"],
                where,
                _count: true,
            }),
            prisma.auditLog.groupBy({
                by: ["entityType"],
                where,
                _count: true,
            }),
            prisma.auditLog.groupBy({
                by: ["userId"],
                where,
                _count: true,
                orderBy: {
                    _count: {
                        userId: "desc",
                    },
                },
                take: 10,
            }),
        ]);
        // Get user details for top users
        const topUsersWithDetails = yield Promise.all(topUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const userDetails = yield prisma.user.findUnique({
                where: { id: user.userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                },
            });
            return Object.assign(Object.assign({}, user), { user: userDetails });
        })));
        res.json({
            totalLogs,
            actionsCount: actionsCount.map((a) => ({
                action: a.action,
                count: a._count,
            })),
            entityTypesCount: entityTypesCount.map((e) => ({
                entityType: e.entityType,
                count: e._count,
            })),
            topUsers: topUsersWithDetails.map((u) => ({
                userId: u.userId,
                count: u._count,
                user: u.user,
            })),
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAuditLogStats = getAuditLogStats;
