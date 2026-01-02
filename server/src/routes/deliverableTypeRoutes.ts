import { Router } from "express";
import {
  getDeliverableTypes,
  createDeliverableType,
  updateDeliverableType,
  deleteDeliverableType,
} from "../controllers/deliverableTypeController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all deliverable types for the organization (all authenticated users can view)
router.get("/", getDeliverableTypes);

// Create a new deliverable type (requires Admin, Manager, or Program Manager role)
router.post("/", requireRole(["Admin", "Manager", "Program Manager"]), createDeliverableType);

// Update a deliverable type (requires Admin, Manager, or Program Manager role)
router.patch("/:id", requireRole(["Admin", "Manager", "Program Manager"]), updateDeliverableType);

// Delete a deliverable type (requires Admin, Manager, or Program Manager role)
router.delete("/:id", requireRole(["Admin", "Manager", "Program Manager"]), deleteDeliverableType);

export default router;

