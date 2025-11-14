import { Router } from "express";
import { createOrganizationAndUser, joinOrganization } from "../controllers/onboardingController";

const router = Router();

// These routes are NOT protected by authenticate middleware
// They handle new user signup and organization joining
router.post("/signup", createOrganizationAndUser);
router.post("/join", joinOrganization);

export default router;

