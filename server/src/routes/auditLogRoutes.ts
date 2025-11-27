import { Router } from "express";
import {
  getAuditLogs,
  getAuditLogById,
  getEntityAuditLogs,
  getAuditLogStats,
} from "../controllers/auditLogController";
import { requireRole } from "../middleware/requireRole";

const router = Router();

// All routes require Admin role
router.use(requireRole(["Admin"]));

// Get audit logs with filtering and pagination
router.get("/", getAuditLogs);

// Get audit log statistics
router.get("/stats", getAuditLogStats);

// Get audit log by ID
router.get("/:id", getAuditLogById);

// Get audit logs for a specific entity
router.get("/entity/:entityType/:entityId", getEntityAuditLogs);

export default router;

