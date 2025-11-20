import { Router } from "express";
import {
  createInvitation,
  validateInvitation,
  acceptInvitation,
  getInvitations,
  revokeInvitation,
} from "../controllers/invitationController";
import { requireCognitoSession } from "../middleware/requireCognitoSession";
import { authenticate } from "../middleware/authenticate";

const router = Router();

// Public route - validate invitation token (no auth required, token is the auth)
router.get("/validate/:token", validateInvitation);

// Routes that require authentication and proper role (admin/manager)
router.post("/", authenticate, createInvitation);
router.get("/", authenticate, getInvitations);
router.delete("/:invitationId", authenticate, revokeInvitation);

// Route that requires Cognito session (user must be logged in via Cognito)
router.post("/accept", requireCognitoSession, acceptInvitation);

export default router;

