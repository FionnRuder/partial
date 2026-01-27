"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthController_1 = require("../controllers/healthController");
const router = (0, express_1.Router)();
// Health check endpoint - comprehensive status check
router.get("/health", healthController_1.healthCheck);
// Liveness probe - just checks if server is running
router.get("/health/live", healthController_1.livenessCheck);
// Readiness probe - checks if service can accept traffic
router.get("/health/ready", healthController_1.readinessCheck);
exports.default = router;
