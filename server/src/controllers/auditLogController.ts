import { Request, Response } from "express";
import { PrismaClient, AuditAction } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get audit logs with filtering and pagination
 * Requires Admin role
 */
export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    const {
      page = "1",
      limit = "50",
      action,
      entityType,
      entityId,
      userId,
      startDate,
      endDate,
      search,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      organizationId,
    };

    if (action) {
      where.action = action as AuditAction;
    }

    if (entityType) {
      where.entityType = entityType as string;
    }

    if (entityId) {
      where.entityId = parseInt(entityId as string, 10);
    }

    if (userId) {
      where.userId = userId as string;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    if (search) {
      where.description = {
        contains: search as string,
        mode: "insensitive",
      };
    }

    // Get audit logs with user information
    const [auditLogs, total] = await Promise.all([
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get audit log by ID
 * Requires Admin role
 */
export const getAuditLogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    const { id } = req.params;

    const auditLog = await prisma.auditLog.findFirst({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get audit logs for a specific entity
 */
export const getEntityAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    const { entityType, entityId } = req.params;

    const auditLogs = await prisma.auditLog.findMany({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get audit log statistics
 */
export const getAuditLogStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    const { startDate, endDate } = req.query;

    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate as string);
    }

    const where = {
      organizationId,
      ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
    };

    const [
      totalLogs,
      actionsCount,
      entityTypesCount,
      topUsers,
    ] = await Promise.all([
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
    const topUsersWithDetails = await Promise.all(
      topUsers.map(async (user) => {
        const userDetails = await prisma.user.findUnique({
          where: { id: user.userId },
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
          },
        });
        return {
          ...user,
          user: userDetails,
        };
      })
    );

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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};




