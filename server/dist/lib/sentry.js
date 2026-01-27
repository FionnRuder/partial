"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSentry = initSentry;
exports.setupSentryErrorHandler = setupSentryErrorHandler;
exports.setUserContext = setUserContext;
exports.clearUserContext = clearUserContext;
exports.setContext = setContext;
exports.addBreadcrumb = addBreadcrumb;
exports.captureException = captureException;
exports.captureMessage = captureMessage;
exports.setTag = setTag;
const Sentry = __importStar(require("@sentry/node"));
const profiling_node_1 = require("@sentry/profiling-node");
const node_1 = require("@sentry/node");
/**
 * Initialize Sentry for error tracking
 * Call this early in the application lifecycle
 */
function initSentry() {
    const dsn = process.env.SENTRY_DSN;
    const environment = process.env.NODE_ENV || "development";
    const tracesSampleRate = parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1");
    const profilesSampleRate = parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE || "0.1");
    // Only initialize Sentry if DSN is provided
    if (!dsn) {
        console.warn("Sentry DSN not configured. Error tracking disabled.");
        return;
    }
    Sentry.init({
        dsn,
        environment,
        // Performance monitoring
        tracesSampleRate,
        profilesSampleRate,
        // Release tracking
        release: process.env.SENTRY_RELEASE || undefined,
        // Integrations
        integrations: [
            // Profiling integration for performance monitoring
            (0, profiling_node_1.nodeProfilingIntegration)(),
            // HTTP integration for capturing request data
            (0, node_1.httpIntegration)(),
            // Express integration
            (0, node_1.expressIntegration)(),
        ],
        // Error filtering - don't send certain errors
        beforeSend(event, hint) {
            var _a, _b, _c, _d;
            // Filter out 4xx errors (client errors) unless they're critical
            if (((_a = event.request) === null || _a === void 0 ? void 0 : _a.headers) && event.request.headers.status_code) {
                const statusCode = parseInt(event.request.headers.status_code);
                if (statusCode >= 400 && statusCode < 500 && statusCode !== 401 && statusCode !== 403) {
                    return null; // Don't send 4xx errors (except 401/403)
                }
            }
            // Don't send validation errors (too noisy)
            if (((_d = (_c = (_b = event.exception) === null || _b === void 0 ? void 0 : _b.values) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.type) === "ValidationError") {
                return null;
            }
            return event;
        },
        // Group similar errors
        beforeSendTransaction(event, hint) {
            return event;
        },
        // Additional options
        maxBreadcrumbs: 50,
        attachStacktrace: true,
        // Server name
        serverName: process.env.SERVICE_NAME || "partial-server",
    });
    console.log("Sentry initialized successfully");
}
/**
 * Set up Sentry error handler for Express
 * Call this after all routes but before other error handlers
 */
function setupSentryErrorHandler(app) {
    Sentry.setupExpressErrorHandler(app);
}
/**
 * Configure Sentry scope with user context
 */
function setUserContext(userId, organizationId, email) {
    Sentry.setUser({
        id: userId,
        email,
        organizationId: organizationId.toString(),
    });
}
/**
 * Clear user context (e.g., on logout)
 */
function clearUserContext() {
    Sentry.setUser(null);
}
/**
 * Set additional context
 */
function setContext(key, context) {
    Sentry.setContext(key, context);
}
/**
 * Add breadcrumb for debugging
 */
function addBreadcrumb(breadcrumb) {
    Sentry.addBreadcrumb(breadcrumb);
}
/**
 * Capture exception manually
 */
function captureException(error, context) {
    if (context) {
        Sentry.withScope((scope) => {
            Object.entries(context).forEach(([key, value]) => {
                scope.setContext(key, value);
            });
            return Sentry.captureException(error);
        });
    }
    return Sentry.captureException(error);
}
/**
 * Capture message manually
 */
function captureMessage(message, level = "info") {
    return Sentry.captureMessage(message, level);
}
/**
 * Set tag for filtering
 */
function setTag(key, value) {
    Sentry.setTag(key, value);
}
/**
 * Note: With expressIntegration(), Sentry automatically:
 * - Captures request data
 * - Tracks transactions
 * - Captures errors via error middleware
 *
 * No separate middleware handlers are needed.
 * Errors are captured automatically through the error middleware.
 */
