import { Router } from "express";
import { createOrganizationAndUser, joinOrganization } from "../controllers/onboardingController";
import { requireCognitoSession } from "../middleware/requireCognitoSession";

const router = Router();

// These routes require Cognito session but don't require user to exist in database yet
// They handle new user signup and organization joining after Cognito authentication
router.post("/signup", requireCognitoSession, createOrganizationAndUser);
router.post("/join", requireCognitoSession, joinOrganization);

export default router;

