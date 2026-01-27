"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedbackController_1 = require("../controllers/feedbackController");
const authenticate_1 = require("../middleware/authenticate");
const requireRole_1 = require("../middleware/requireRole");
const router = (0, express_1.Router)();
// Routes that require authentication (any user can submit feedback)
router.post("/", authenticate_1.authenticate, feedbackController_1.createFeedback);
router.get("/my", authenticate_1.authenticate, feedbackController_1.getMyFeedback);
// Routes that require admin role only
router.get("/unread-count", authenticate_1.authenticate, (0, requireRole_1.requireRole)(["Admin"]), feedbackController_1.getUnreadFeedbackCount);
router.get("/", authenticate_1.authenticate, (0, requireRole_1.requireRole)(["Admin"]), feedbackController_1.getFeedback);
router.get("/:id", authenticate_1.authenticate, (0, requireRole_1.requireRole)(["Admin"]), feedbackController_1.getFeedbackById);
router.patch("/:id", authenticate_1.authenticate, (0, requireRole_1.requireRole)(["Admin"]), feedbackController_1.updateFeedback);
exports.default = router;
