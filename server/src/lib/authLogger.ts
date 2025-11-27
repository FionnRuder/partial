import { Request } from "express";
import { logger, createChildLogger } from "./logger";

/**
 * Log authentication events for security and monitoring
 */

export enum AuthEventType {
  LOGIN_ATTEMPT = "login_attempt",
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILURE = "login_failure",
  LOGOUT = "logout",
  SESSION_EXPIRED = "session_expired",
  SESSION_INVALID = "session_invalid",
  AUTHENTICATION_REQUIRED = "authentication_required",
  AUTHORIZATION_FAILED = "authorization_failed",
  USER_NOT_FOUND = "user_not_found",
  ONBOARDING_REQUIRED = "onboarding_required",
}

interface AuthEventData {
  eventType: AuthEventType;
  requestId?: string;
  userId?: number;
  organizationId?: number;
  email?: string;
  cognitoId?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
  method?: string;
  reason?: string;
  error?: string;
  metadata?: any;
}

/**
 * Log authentication event with structured data
 */
export function logAuthEvent(data: AuthEventData): void {
  const { eventType, requestId, userId, organizationId, ...rest } = data;

  const childLogger = createChildLogger({
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
      childLogger.warn(logMessage, {
        ...rest,
        securityEvent: true,
      });
      break;

    case AuthEventType.LOGIN_SUCCESS:
      childLogger.info(logMessage, {
        ...rest,
        securityEvent: true,
      });
      break;

    default:
      childLogger.info(logMessage, {
        ...rest,
        securityEvent: true,
      });
  }

  // Track auth metrics
  trackAuthMetrics(eventType, data);
}

/**
 * Track authentication metrics for monitoring
 */
function trackAuthMetrics(eventType: AuthEventType, data: AuthEventData): void {
  logger.info("auth_metric", {
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
export function getAuthContext(req: Request): {
  requestId?: string;
  userId?: number;
  organizationId?: number;
  email?: string;
  cognitoId?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
  method?: string;
} {
  return {
    requestId: (req as any).requestId,
    userId: (req as any).auth?.userId,
    organizationId: (req as any).auth?.organizationId,
    email: (req as any).session?.userInfo?.email,
    cognitoId: (req as any).session?.userInfo?.sub,
    ip: req.ip || (req.socket.remoteAddress as string),
    userAgent: req.headers["user-agent"],
    path: req.path,
    method: req.method,
  };
}

