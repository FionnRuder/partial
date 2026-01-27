"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEventType = void 0;
exports.logAuthEvent = logAuthEvent;
exports.getAuthContext = getAuthContext;
const logger_1 = require("./logger");
/**
 * Log authentication events for security and monitoring
 */
var AuthEventType;
(function (AuthEventType) {
    AuthEventType["LOGIN_ATTEMPT"] = "login_attempt";
    AuthEventType["LOGIN_SUCCESS"] = "login_success";
    AuthEventType["LOGIN_FAILURE"] = "login_failure";
    AuthEventType["LOGOUT"] = "logout";
    AuthEventType["SESSION_EXPIRED"] = "session_expired";
    AuthEventType["SESSION_INVALID"] = "session_invalid";
    AuthEventType["AUTHENTICATION_REQUIRED"] = "authentication_required";
    AuthEventType["AUTHORIZATION_FAILED"] = "authorization_failed";
    AuthEventType["USER_NOT_FOUND"] = "user_not_found";
    AuthEventType["ONBOARDING_REQUIRED"] = "onboarding_required";
})(AuthEventType || (exports.AuthEventType = AuthEventType = {}));
/**
 * Log authentication event with structured data
 */
function logAuthEvent(data) {
    const { eventType, requestId, userId, organizationId } = data, rest = __rest(data, ["eventType", "requestId", "userId", "organizationId"]);
    const childLogger = (0, logger_1.createChildLogger)({
        requestId,
        userId,
        organizationId,
        eventType,
        eventCategory: "authentication",
    });
    const logMessage = `Auth event: ${eventType}`;
    // Log with appropriate level based on event type
    switch (eventType) {
        case AuthEventType.LOGIN_FAILURE:
        case AuthEventType.SESSION_EXPIRED:
        case AuthEventType.SESSION_INVALID:
        case AuthEventType.AUTHORIZATION_FAILED:
            childLogger.warn(logMessage, Object.assign(Object.assign({}, rest), { securityEvent: true }));
            break;
        case AuthEventType.LOGIN_SUCCESS:
            childLogger.info(logMessage, Object.assign(Object.assign({}, rest), { securityEvent: true }));
            break;
        default:
            childLogger.info(logMessage, Object.assign(Object.assign({}, rest), { securityEvent: true }));
    }
    // Track auth metrics
    trackAuthMetrics(eventType, data);
}
/**
 * Track authentication metrics for monitoring
 */
function trackAuthMetrics(eventType, data) {
    logger_1.logger.info("auth_metric", {
        metricType: "authentication_event",
        eventType,
        userId: data.userId,
        organizationId: data.organizationId,
        success: eventType === AuthEventType.LOGIN_SUCCESS,
        failure: [
            AuthEventType.LOGIN_FAILURE,
            AuthEventType.SESSION_EXPIRED,
            AuthEventType.SESSION_INVALID,
            AuthEventType.AUTHORIZATION_FAILED,
        ].includes(eventType),
    });
}
/**
 * Helper to extract auth context from request
 */
function getAuthContext(req) {
    var _a, _b, _c, _d, _e, _f;
    return {
        requestId: req.requestId,
        userId: (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId,
        organizationId: (_b = req.auth) === null || _b === void 0 ? void 0 : _b.organizationId,
        email: (_d = (_c = req.session) === null || _c === void 0 ? void 0 : _c.userInfo) === null || _d === void 0 ? void 0 : _d.email,
        cognitoId: (_f = (_e = req.session) === null || _e === void 0 ? void 0 : _e.userInfo) === null || _f === void 0 ? void 0 : _f.sub,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
        path: req.path,
        method: req.method,
    };
}
