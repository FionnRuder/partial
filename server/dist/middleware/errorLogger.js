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
exports.errorLogger = void 0;
const logger_1 = require("../lib/logger");
const Sentry = __importStar(require("@sentry/node"));
/**
 * Enhanced error logging middleware
 * Logs errors with full context including request ID, user info, and stack traces
 */
const errorLogger = (err, req, res, next) => {
    var _a, _b;
    const requestId = req.requestId || "unknown";
    const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
    const organizationId = (_b = req.auth) === null || _b === void 0 ? void 0 : _b.organizationId;
    const errorContext = {
        requestId,
        method: req.method,
        path: req.path,
        url: req.url,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
        body: req.body,
        query: req.query,
        params: req.params,
        stack: err.stack,
    };
    if (userId) {
        errorContext.userId = userId;
    }
    if (organizationId) {
        errorContext.organizationId = organizationId;
    }
    // Log error with full context
    logger_1.logger.error("Request error", Object.assign({ error: {
            name: err.name,
            message: err.message,
            stack: err.stack,
        } }, errorContext));
    // Track error metrics
    trackErrorMetrics(req.method, req.path, err);
    // Send to Sentry with full context
    Sentry.withScope((scope) => {
        var _a;
        // Set request context
        scope.setContext("request", {
            method: req.method,
            path: req.path,
            url: req.url,
            query: req.query,
            params: req.params,
            headers: {
                userAgent: req.headers["user-agent"],
                referer: req.headers["referer"],
            },
            ip: req.ip || req.socket.remoteAddress,
        });
        // Set user context if available
        if (userId) {
            scope.setUser({
                id: userId.toString(),
                organizationId: organizationId === null || organizationId === void 0 ? void 0 : organizationId.toString(),
            });
        }
        // Set tags for filtering
        scope.setTag("requestId", requestId);
        scope.setTag("method", req.method);
        scope.setTag("path", req.path.replace(/\/\d+/g, "/:id")); // Normalize path
        scope.setTag("statusCode", ((_a = res.statusCode) === null || _a === void 0 ? void 0 : _a.toString()) || "unknown");
        // Set severity based on status code
        let severity = "error";
        if (res.statusCode >= 500) {
            severity = "error";
        }
        else if (res.statusCode >= 400) {
            severity = "warning";
        }
        // Capture exception
        Sentry.captureException(err, {
            level: severity,
            contexts: {
                request: errorContext,
            },
        });
    });
    next(err);
};
exports.errorLogger = errorLogger;
/**
 * Track error metrics for monitoring
 */
function trackErrorMetrics(method, path, error) {
    const endpointPattern = path.replace(/\/\d+/g, "/:id").replace(/\/[a-f0-9-]{36}/gi, "/:id");
    logger_1.logger.error("error_metric", {
        metricType: "application_error",
        method,
        path: endpointPattern,
        errorType: error.name,
        errorMessage: error.message,
    });
}
