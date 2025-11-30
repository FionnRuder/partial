import { Router } from "express";
import {
  healthCheck,
  livenessCheck,
  readinessCheck,
} from "../controllers/healthController";

const router = Router();

// Health check endpoint - comprehensive status check
router.get("/health", healthCheck);

// Liveness probe - just checks if server is running
router.get("/health/live", livenessCheck);

// Readiness probe - checks if service can accept traffic
router.get("/health/ready", readinessCheck);

export default router;


