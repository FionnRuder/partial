import { Router } from "express";
import {
  createInvitation,
  validateInvitation,
  acceptInvitation,
  getInvitations,
  revokeInvitation,
} from "../controllers/invitationController";
// TODO: Replace with better-auth.com authentication middleware
// import { requireAuthSession } from "../middleware/requireAuthSession";
import { authenticate } from "../middleware/authenticate";

const router = Router();

// Public route - validate invitation token (no auth required, token is the auth)
router.get("/validate/:token", validateInvitation);

// Routes that require authentication and proper role (admin/manager)
router.post("/", authenticate, createInvitation);
router.get("/", authenticate, getInvitations);
router.delete("/:invitationId", authenticate, revokeInvitation);

// Route that requires authentication session
// TODO: Replace requireCognitoSession with better-auth.com middleware
router.post("/accept", acceptInvitation);

export default router;

