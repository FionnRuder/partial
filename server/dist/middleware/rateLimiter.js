"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicEndpointRateLimiter = exports.authRateLimiter = exports.userRateLimiter = exports.ipRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("../lib/logger");
/**
 * Get client IP address from request, handling proxies
 */
function getClientIp(req) {
    // Check for IP in headers (useful when behind proxy/load balancer)
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
        // x-forwarded-for can contain multiple IPs, take the first one
        const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
        return ips.split(",")[0].trim();
    }
    // Check x-real-ip header (used by some proxies)
    const realIp = req.headers["x-real-ip"];
    if (realIp) {
        return Array.isArray(realIp) ? realIp[0] : realIp;
    }
    // Fall back to Express's req.ip
    return req.ip || req.socket.remoteAddress || "unknown";
}
/**
 * Log rate limit violation
 */
function logRateLimitViolation(req, identifier, limit, windowMs) {
    var _a, _b;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const path = req.path;
    const userAgent = req.headers["user-agent"] || "unknown";
    const userId = ((_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId) || "unauthenticated";
    logger_1.logger.warn("Rate limit violation", {
        identifier,
        userId,
        limit,
        windowSeconds: Math.floor(windowMs / 1000),
        method,
        path,
        ip: getClientIp(req),
        userAgent,
        requestId: req.requestId,
        organizationId: (_b = req.auth) === null || _b === void 0 ? void 0 : _b.organizationId,
        securityEvent: true,
    });
}
/**
 * Per-IP rate limiter
 * Applied to all requests to prevent abuse from a single IP
 * Note: This runs before authentication, so it only limits unauthenticated requests
 * Authenticated requests are handled by userRateLimiter
 */
exports.ipRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs (increased for development)
    message: {
        error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) => {
        return `ip:${getClientIp(req)}`;
    },
    skip: (req) => {
        var _a;
        // Skip OPTIONS requests (CORS preflight) - they shouldn't count toward rate limits
        if (req.method === 'OPTIONS') {
            return true;
        }
        // Skip if request will be authenticated (userRateLimiter will handle it)
        // Note: This check happens before auth middleware, so we check session directly
        if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.userInfo) {
            return true;
        }
        return false;
    },
    handler: (req, res) => {
        const ip = getClientIp(req);
        logRateLimitViolation(req, `IP:${ip}`, 1000, 15 * 60 * 1000);
        res.status(429).json({
            error: "Too many requests from this IP, please try again later.",
            retryAfter: Math.ceil(15 * 60), // seconds
        });
    },
    // Custom store can be added here for distributed systems (Redis, etc.)
});
/**
 * Per-user rate limiter
 * Applied to authenticated requests to prevent abuse from authenticated users
 */
exports.userRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000, // Limit each user to 2000 requests per windowMs (increased for development)
    message: {
        error: "Too many requests, please try again later.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) => {
        var _a;
        // Use user ID if authenticated, otherwise fall back to IP
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        if (userId) {
            return `user:${userId}`;
        }
        // Fallback to IP if not authenticated (shouldn't happen if applied after auth)
        return `ip:${getClientIp(req)}`;
    },
    skip: (req) => {
        var _a;
        // Skip OPTIONS requests (CORS preflight) - they shouldn't count toward rate limits
        if (req.method === 'OPTIONS') {
            return true;
        }
        // Skip user rate limiting if not authenticated (let IP limiter handle it)
        return !((_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId);
    },
    handler: (req, res) => {
        var _a;
        const userId = ((_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId) || "unknown";
        logRateLimitViolation(req, `User:${userId}`, 2000, 15 * 60 * 1000);
        res.status(429).json({
            error: "Too many requests, please try again later.",
            retryAfter: Math.ceil(15 * 60), // seconds
        });
    },
});
/**
 * Stricter rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: {
        error: "Too many authentication attempts, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return `auth:${getClientIp(req)}`;
    },
    handler: (req, res) => {
        const ip = getClientIp(req);
        logRateLimitViolation(req, `Auth:${ip}`, 5, 15 * 60 * 1000);
        res.status(429).json({
            error: "Too many authentication attempts, please try again later.",
            retryAfter: Math.ceil(15 * 60), // seconds
        });
    },
    // Skip successful requests (only count failed auth attempts)
    skipSuccessfulRequests: true,
});
/**
 * Rate limiter for public endpoints (invitations, etc.)
 * More lenient than auth but stricter than general IP limit
 */
exports.publicEndpointRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: {
        error: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return `public:${getClientIp(req)}`;
    },
    handler: (req, res) => {
        const ip = getClientIp(req);
        logRateLimitViolation(req, `Public:${ip}`, 50, 15 * 60 * 1000);
        res.status(429).json({
            error: "Too many requests, please try again later.",
            retryAfter: Math.ceil(15 * 60), // seconds
        });
    },
});
