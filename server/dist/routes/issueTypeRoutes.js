"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issueTypeController_1 = require("../controllers/issueTypeController");
const authenticate_1 = require("../middleware/authenticate");
const requireRole_1 = require("../middleware/requireRole");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(authenticate_1.authenticate);
// Get all issue types for the organization (all authenticated users can view)
router.get("/", issueTypeController_1.getIssueTypes);
// Create a new issue type (requires Admin, Manager, or Program Manager role)
router.post("/", (0, requireRole_1.requireRole)(["Admin", "Manager", "Program Manager"]), issueTypeController_1.createIssueType);
// Update an issue type (requires Admin, Manager, or Program Manager role)
router.patch("/:id", (0, requireRole_1.requireRole)(["Admin", "Manager", "Program Manager"]), issueTypeController_1.updateIssueType);
// Delete an issue type (requires Admin, Manager, or Program Manager role)
router.delete("/:id", (0, requireRole_1.requireRole)(["Admin", "Manager", "Program Manager"]), issueTypeController_1.deleteIssueType);
exports.default = router;
