import { Router } from "express";
import {
  createFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedback,
  getMyFeedback,
  getUnreadFeedbackCount,
} from "../controllers/feedbackController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";

const router = Router();

// Routes that require authentication (any user can submit feedback)
router.post("/", authenticate, createFeedback);
router.get("/my", authenticate, getMyFeedback);

// Routes that require admin role only
router.get("/unread-count", authenticate, requireRole(["Admin"]), getUnreadFeedbackCount);
router.get("/", authenticate, requireRole(["Admin"]), getFeedback);
router.get("/:id", authenticate, requireRole(["Admin"]), getFeedbackById);
router.patch("/:id", authenticate, requireRole(["Admin"]), updateFeedback);

export default router;

