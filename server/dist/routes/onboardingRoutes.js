"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const onboardingController_1 = require("../controllers/onboardingController");
const requireAuthSession_1 = require("../middleware/requireAuthSession");
const router = (0, express_1.Router)();
// These routes require Better Auth session but don't require user to exist in database yet
// They handle new user signup and organization joining after authentication
router.post("/signup", requireAuthSession_1.requireAuthSession, onboardingController_1.createOrganizationAndUser);
router.post("/join", requireAuthSession_1.requireAuthSession, onboardingController_1.joinOrganization);
exports.default = router;
