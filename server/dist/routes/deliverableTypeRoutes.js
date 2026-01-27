"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deliverableTypeController_1 = require("../controllers/deliverableTypeController");
const authenticate_1 = require("../middleware/authenticate");
const requireRole_1 = require("../middleware/requireRole");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(authenticate_1.authenticate);
// Get all deliverable types for the organization (all authenticated users can view)
router.get("/", deliverableTypeController_1.getDeliverableTypes);
// Create a new deliverable type (requires Admin, Manager, or Program Manager role)
router.post("/", (0, requireRole_1.requireRole)(["Admin", "Manager", "Program Manager"]), deliverableTypeController_1.createDeliverableType);
// Update a deliverable type (requires Admin, Manager, or Program Manager role)
router.patch("/:id", (0, requireRole_1.requireRole)(["Admin", "Manager", "Program Manager"]), deliverableTypeController_1.updateDeliverableType);
// Delete a deliverable type (requires Admin, Manager, or Program Manager role)
router.delete("/:id", (0, requireRole_1.requireRole)(["Admin", "Manager", "Program Manager"]), deliverableTypeController_1.deleteDeliverableType);
exports.default = router;
