"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * IMPORTANT: Import instrument.ts FIRST before any other imports
 * This ensures Sentry initializes before Express, allowing proper instrumentation
 */
require("./instrument");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
/* ROUTE IMPORTS */
const milestoneRoutes_1 = __importDefault(require("./routes/milestoneRoutes"));
const partRoutes_1 = __importDefault(require("./routes/partRoutes"));
const programRoutes_1 = __importDefault(require("./routes/programRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const workItemRoutes_1 = __importDefault(require("./routes/workItemRoutes"));
const onboardingRoutes_1 = __importDefault(require("./routes/onboardingRoutes"));
const invitationRoutes_1 = __importDefault(require("./routes/invitationRoutes"));
const deliverableTypeRoutes_1 = __importDefault(require("./routes/deliverableTypeRoutes"));
const issueTypeRoutes_1 = __importDefault(require("./routes/issueTypeRoutes"));
const feedbackRoutes_1 = __importDefault(require("./routes/feedbackRoutes"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const auditLogRoutes_1 = __importDefault(require("./routes/auditLogRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const organizationRoutes_1 = __importDefault(require("./routes/organizationRoutes"));
const authenticate_1 = require("./middleware/authenticate");
const rateLimiter_1 = require("./middleware/rateLimiter");
const requestLogger_1 = require("./middleware/requestLogger");
const errorLogger_1 = require("./middleware/errorLogger");
const logger_1 = require("./lib/logger");
const sentry_1 = require("./lib/sentry");
/* CONFIGURATIONS */
dotenv_1.default.config();
const app = (0, express_1.default)();
// Sentry integrations handle request/tracing automatically
// No need for separate middleware with expressIntegration()
// Session configuration
// Determine if we're in production based on NODE_ENV or if FRONTEND_URL uses HTTPS
const isProduction = process.env.NODE_ENV === 'production' ||
    (process.env.FRONTEND_URL && process.env.FRONTEND_URL.startsWith('https://'));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'some secret - change this in production',
    name: 'connect.sid', // Explicit session cookie name
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction ? true : false, // Use secure cookies in production (HTTPS only)
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: (isProduction ? 'none' : 'lax'), // Allow cross-site cookies in production if needed
        path: '/', // Ensure cookie is available for all paths
    },
}));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // Allow cookies to be sent with requests
}));
// Trust proxy for accurate IP addresses (important for rate limiting behind proxies/load balancers)
app.set('trust proxy', 1);
// Request ID middleware (must be early to attach ID to all requests)
app.use(requestLogger_1.requestIdMiddleware);
// HTTP request logging middleware (logs all requests with timing)
app.use(requestLogger_1.httpRequestLogger);
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
app.use(healthRoutes_1.default);
// Production-safe Sentry test endpoint (public, no auth/rate limiting)
// This endpoint safely captures an error without crashing the server
// Remove or restrict this after verifying Sentry is working
// Available at both /api/test-sentry and /test-sentry for flexibility
const handleSentryTest = (req, res) => {
    const testError = new Error("Production Sentry test - safe error (intentional)");
    // Manually capture the error with Sentry
    (0, sentry_1.captureException)(testError, {
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
app.use(rateLimiter_1.ipRateLimiter);
// Better Auth routes - public endpoints for authentication
app.use("/api/auth", rateLimiter_1.authRateLimiter, authRoutes_1.default);
// Onboarding routes (require Cognito session but user may not exist in DB yet)
// Apply public endpoint rate limiting (similar to invitations)
app.use("/onboarding", rateLimiter_1.publicEndpointRateLimiter, onboardingRoutes_1.default);
// Invitation routes - some public (validate), some require auth (handled in route file)
// Public endpoint rate limiting applied to all invitation routes (validates endpoint handles it)
app.use("/invitations", rateLimiter_1.publicEndpointRateLimiter, invitationRoutes_1.default);
// Auth routes that require authentication (like /auth/me)
// Mount before global authenticate middleware so we can handle auth manually
app.use("/auth", authRoutes_1.default);
// All other routes require authentication and user-based rate limiting
app.use(authenticate_1.authenticate);
app.use(requestLogger_1.loggerContextMiddleware); // Add user context to logger after authentication
app.use(rateLimiter_1.userRateLimiter);
app.use("/milestones", milestoneRoutes_1.default);
app.use("/parts", partRoutes_1.default);
app.use("/programs", programRoutes_1.default);
app.use("/search", searchRoutes_1.default);
app.use("/teams", teamRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/workItems", workItemRoutes_1.default);
app.use("/deliverableTypes", deliverableTypeRoutes_1.default);
app.use("/issueTypes", issueTypeRoutes_1.default);
app.use("/feedback", feedbackRoutes_1.default);
app.use("/auditLogs", auditLogRoutes_1.default);
app.use("/organizations", organizationRoutes_1.default);
// Note: /invitations routes are above the authenticate middleware
// Some routes are public (validate), others require auth (create, get, revoke)
/* 404 HANDLER (must come after routes) */
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
/* SENTRY ERROR HANDLER (must come before other error handlers) */
(0, sentry_1.setupSentryErrorHandler)(app);
/* ERROR HANDLING MIDDLEWARE (must come last) */
// Error logging middleware (logs errors with context and Sentry)
app.use(errorLogger_1.errorLogger);
// Error response handler
app.use((err, req, res, next) => {
    // Error is already logged by errorLogger middleware and Sentry
    res.status(500).json({
        message: "Something went wrong!",
        requestId: req.requestId,
    });
});
/* SERVER */
const port = Number(process.env.PORT) || 3000;
// Handle uncaught errors
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Start server
try {
    app.listen(port, "0.0.0.0", () => {
        logger_1.logger.info("Server started successfully", {
            port,
            environment: process.env.NODE_ENV || "development",
        });
    });
}
catch (error) {
    logger_1.logger.error("Failed to start server:", error);
    process.exit(1);
}
