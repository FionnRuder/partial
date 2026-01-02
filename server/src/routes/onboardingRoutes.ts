import { Router } from "express";
import { createOrganizationAndUser, joinOrganization } from "../controllers/onboardingController";
import { requireAuthSession } from "../middleware/requireAuthSession";

const router = Router();

// These routes require Better Auth session but don't require user to exist in database yet
// They handle new user signup and organization joining after authentication
router.post("/signup", requireAuthSession, createOrganizationAndUser);
router.post("/join", requireAuthSession, joinOrganization);

export default router;

