import { Router } from "express";
import {
  getIssueTypes,
  createIssueType,
  updateIssueType,
  deleteIssueType,
} from "../controllers/issueTypeController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all issue types for the organization (all authenticated users can view)
router.get("/", getIssueTypes);

// Create a new issue type (requires Admin, Manager, or Program Manager role)
router.post("/", requireRole(["Admin", "Manager", "Program Manager"]), createIssueType);

// Update an issue type (requires Admin, Manager, or Program Manager role)
router.patch("/:id", requireRole(["Admin", "Manager", "Program Manager"]), updateIssueType);

// Delete an issue type (requires Admin, Manager, or Program Manager role)
router.delete("/:id", requireRole(["Admin", "Manager", "Program Manager"]), deleteIssueType);

export default router;

