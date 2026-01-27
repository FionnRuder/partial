"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerContextMiddleware = exports.httpRequestLogger = exports.requestIdMiddleware = void 0;
const logger_1 = require("../lib/logger");
const logger_2 = require("../lib/logger");
/**
 * Middleware to generate and attach request ID to requests
 */
const requestIdMiddleware = (req, res, next) => {
    // Check if request ID already exists (e.g., from upstream proxy)
    const existingRequestId = req.headers["x-request-id"];
    const requestId = existingRequestId || (0, logger_1.generateRequestId)();
    // Attach to request and response
    req.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);
    // Set request ID in logger context
    logger_1.logger.setRequestId(requestId);
    next();
};
exports.requestIdMiddleware = requestIdMiddleware;
/**
 * Middleware to log incoming HTTP requests with timing
 */
const httpRequestLogger = (req, res, next) => {
    var _a, _b;
    const startTime = Date.now();
    const requestId = req.requestId || "unknown";
    const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
    const organizationId = (_b = req.auth) === null || _b === void 0 ? void 0 : _b.organizationId;
    // Create child logger with request context
    const requestLogger = (0, logger_2.createChildLogger)({
        requestId,
        userId,
        organizationId,
        method: req.method,
        path: req.path,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
    });
    // Log request start
    requestLogger.info("Incoming request", {
        method: req.method,
        url: req.url,
        path: req.path,
        query: req.query,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
        contentLength: req.headers["content-length"],
    });
    // Capture response finish
    res.on("finish", () => {
        const duration = Date.now() - startTime;
        const logData = {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            responseTime: duration,
        };
        // Add user context if available
        if (userId) {
            logData.userId = userId;
        }
        if (organizationId) {
            logData.organizationId = organizationId;
        }
        // Log response with appropriate level
        if (res.statusCode >= 500) {
            requestLogger.error("Request completed with server error", logData);
        }
        else if (res.statusCode >= 400) {
            requestLogger.warn("Request completed with client error", logData);
        }
        else {
            requestLogger.info("Request completed successfully", logData);
        }
        // Track metrics (can be extended to send to monitoring service)
        trackRequestMetrics(req.method, req.path, res.statusCode, duration);
    });
    // Capture response close (client disconnected)
    res.on("close", () => {
        if (!res.writableFinished) {
            const duration = Date.now() - startTime;
            requestLogger.warn("Request closed before completion", {
                method: req.method,
                path: req.path,
                duration,
            });
        }
    });
    next();
};
exports.httpRequestLogger = httpRequestLogger;
/**
 * Track request metrics (can be extended to send to CloudWatch, Datadog, etc.)
 */
function trackRequestMetrics(method, path, statusCode, duration) {
    // Group metrics by endpoint pattern (replace IDs with :id)
    const endpointPattern = path.replace(/\/\d+/g, "/:id").replace(/\/[a-f0-9-]{36}/gi, "/:id");
    // Log metrics for aggregation
    logger_1.logger.info("request_metric", {
        metricType: "http_request",
        method,
        path: endpointPattern,
        statusCode,
        duration,
        statusClass: getStatusClass(statusCode),
    });
    // Track error rates
    if (statusCode >= 500) {
        logger_1.logger.error("error_metric", {
            metricType: "server_error",
            method,
            path: endpointPattern,
            statusCode,
        });
    }
}
/**
 * Get HTTP status class (2xx, 3xx, 4xx, 5xx)
 */
function getStatusClass(statusCode) {
    if (statusCode >= 200 && statusCode < 300)
        return "2xx";
    if (statusCode >= 300 && statusCode < 400)
        return "3xx";
    if (statusCode >= 400 && statusCode < 500)
        return "4xx";
    if (statusCode >= 500)
        return "5xx";
    return "unknown";
}
/**
 * Middleware to add user context to logger after authentication
 */
const loggerContextMiddleware = (req, res, next) => {
    var _a, _b;
    const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
    const organizationId = (_b = req.auth) === null || _b === void 0 ? void 0 : _b.organizationId;
    if (userId && organizationId) {
        logger_1.logger.setUser(userId, organizationId);
    }
    next();
};
exports.loggerContextMiddleware = loggerContextMiddleware;
