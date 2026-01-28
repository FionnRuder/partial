/**
 * IMPORTANT: Import instrument.ts FIRST before any other imports
 * This ensures Sentry initializes before Express, allowing proper instrumentation
 */
import "./instrument";

import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
/* ROUTE IMPORTS */
import milestoneRoutes from "./routes/milestoneRoutes";
import partRoutes from "./routes/partRoutes";
import programRoutes from "./routes/programRoutes";
import searchRoutes from "./routes/searchRoutes";
import teamRoutes from "./routes/teamRoutes";
import userRoutes from "./routes/userRoutes";
import workItemRoutes from "./routes/workItemRoutes";
import onboardingRoutes from "./routes/onboardingRoutes";
import invitationRoutes from "./routes/invitationRoutes";
import deliverableTypeRoutes from "./routes/deliverableTypeRoutes";
import issueTypeRoutes from "./routes/issueTypeRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import healthRoutes from "./routes/healthRoutes";
import auditLogRoutes from "./routes/auditLogRoutes";
import authRoutes from "./routes/authRoutes";
import organizationRoutes from "./routes/organizationRoutes";
import { authenticate } from "./middleware/authenticate";
import {
  ipRateLimiter,
  userRateLimiter,
  authRateLimiter,
  publicEndpointRateLimiter,
} from "./middleware/rateLimiter";
import {
  requestIdMiddleware,
  httpRequestLogger,
  loggerContextMiddleware,
} from "./middleware/requestLogger";
import { errorLogger } from "./middleware/errorLogger";
import { logger } from "./lib/logger";
import {
  setUserContext,
  setupSentryErrorHandler,
  captureException,
} from "./lib/sentry";


/* CONFIGURATIONS */
dotenv.config();

const app = express();

// Sentry integrations handle request/tracing automatically
// No need for separate middleware with expressIntegration()

// Session configuration
// Determine if we're in production based on NODE_ENV or if FRONTEND_URL uses HTTPS
const isProduction = process.env.NODE_ENV === 'production' || 
                     (process.env.FRONTEND_URL && process.env.FRONTEND_URL.startsWith('https://'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'some secret - change this in production',
  name: 'connect.sid', // Explicit session cookie name
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction ? true : false, // Use secure cookies in production (HTTPS only)
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax' | 'strict', // Allow cross-site cookies in production if needed
    path: '/', // Ensure cookie is available for all paths
  },
}));

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent with requests
}));

// Trust proxy for accurate IP addresses (important for rate limiting behind proxies/load balancers)
app.set('trust proxy', 1);

// Request ID middleware (must be early to attach ID to all requests)
app.use(requestIdMiddleware);

// HTTP request logging middleware (logs all requests with timing)
app.use(httpRequestLogger);

/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

// Debug endpoint to test Sentry (only in development)
if (process.env.NODE_ENV === "development") {
  app.get("/debug-sentry", (req, res) => {
    throw new Error("Sentry test error - this is intentional!");
  });
}

// Health check routes (public, no authentication required, no rate limiting)
// These should be accessible without restrictions for monitoring systems
app.use(healthRoutes);

// Production-safe Sentry test endpoint (public, no auth/rate limiting)
// This endpoint safely captures an error without crashing the server
// Remove or restrict this after verifying Sentry is working
// Available at both /api/test-sentry and /test-sentry for flexibility
const handleSentryTest = (req: Request, res: Response) => {
  const testError = new Error("Production Sentry test - safe error (intentional)");
  
  // Manually capture the error with Sentry
  captureException(testError, {
    component: "test-endpoint",
    action: "sentry-verification",
  });
  
  // Return success response (error was captured, server continues running)
  res.status(200).json({ 
    message: "Test error sent to Sentry. Check your Sentry dashboard.",
    timestamp: new Date().toISOString(),
  });
};

app.get("/api/test-sentry", handleSentryTest);
app.get("/test-sentry", handleSentryTest);

// Apply global IP rate limiting to all other routes
app.use(ipRateLimiter);

// Better Auth routes - public endpoints for authentication
app.use("/api/auth", authRateLimiter, authRoutes);

// Onboarding routes (require Cognito session but user may not exist in DB yet)
// Apply public endpoint rate limiting (similar to invitations)
app.use("/onboarding", publicEndpointRateLimiter, onboardingRoutes);

// Invitation routes - some public (validate), some require auth (handled in route file)
// Public endpoint rate limiting applied to all invitation routes (validates endpoint handles it)
app.use("/invitations", publicEndpointRateLimiter, invitationRoutes);

// Auth routes that require authentication (like /auth/me)
// Mount before global authenticate middleware so we can handle auth manually
app.use("/auth", authRoutes);

// All other routes require authentication and user-based rate limiting
app.use(authenticate);
app.use(loggerContextMiddleware); // Add user context to logger after authentication
app.use(userRateLimiter);

app.use("/milestones", milestoneRoutes);
app.use("/parts", partRoutes);
app.use("/programs", programRoutes);
app.use("/search", searchRoutes);
app.use("/teams", teamRoutes);
app.use("/users", userRoutes);
app.use("/workItems", workItemRoutes);
app.use("/deliverableTypes", deliverableTypeRoutes);
app.use("/issueTypes", issueTypeRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/auditLogs", auditLogRoutes);
app.use("/organizations", organizationRoutes);
// Note: /invitations routes are above the authenticate middleware
// Some routes are public (validate), others require auth (create, get, revoke)

/* 404 HANDLER (must come after routes) */
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

/* SENTRY ERROR HANDLER (must come before other error handlers) */
setupSentryErrorHandler(app);

/* ERROR HANDLING MIDDLEWARE (must come last) */
// Error logging middleware (logs errors with context and Sentry)
app.use(errorLogger);

// Error response handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Error is already logged by errorLogger middleware and Sentry
  res.status(500).json({ 
    message: "Something went wrong!",
    requestId: (req as any).requestId,
  });
});

/* SERVER */
const port = Number(process.env.PORT) || 3000;

// Handle uncaught errors
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
try {
  app.listen(port, "0.0.0.0", () => {
    logger.info("Server started successfully", {
      port,
      environment: process.env.NODE_ENV || "development",
    });
  });
} catch (error: any) {
  logger.error("Failed to start server:", error);
  process.exit(1);
}
