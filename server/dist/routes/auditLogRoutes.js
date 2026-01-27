"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditLogController_1 = require("../controllers/auditLogController");
const requireRole_1 = require("../middleware/requireRole");
const router = (0, express_1.Router)();
// All routes require Admin role
router.use((0, requireRole_1.requireRole)(["Admin"]));
// Get audit logs with filtering and pagination
router.get("/", auditLogController_1.getAuditLogs);
// Get audit log statistics
router.get("/stats", auditLogController_1.getAuditLogStats);
// Get audit log by ID
router.get("/:id", auditLogController_1.getAuditLogById);
// Get audit logs for a specific entity
router.get("/entity/:entityType/:entityId", auditLogController_1.getEntityAuditLogs);
exports.default = router;
