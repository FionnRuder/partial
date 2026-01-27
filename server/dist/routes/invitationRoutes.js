"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invitationController_1 = require("../controllers/invitationController");
// TODO: Replace with better-auth.com authentication middleware
// import { requireAuthSession } from "../middleware/requireAuthSession";
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// Public route - validate invitation token (no auth required, token is the auth)
router.get("/validate/:token", invitationController_1.validateInvitation);
// Routes that require authentication and proper role (admin/manager)
router.post("/", authenticate_1.authenticate, invitationController_1.createInvitation);
router.get("/", authenticate_1.authenticate, invitationController_1.getInvitations);
router.delete("/:invitationId", authenticate_1.authenticate, invitationController_1.revokeInvitation);
// Route that requires authentication session
// TODO: Replace requireCognitoSession with better-auth.com middleware
router.post("/accept", invitationController_1.acceptInvitation);
exports.default = router;
