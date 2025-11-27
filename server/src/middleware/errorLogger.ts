import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { logger } from "../lib/logger";

/**
 * Enhanced error logging middleware
 * Logs errors with full context including request ID, user info, and stack traces
 */
export const errorLogger: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = (req as any).requestId || "unknown";
  const userId = (req as any).auth?.userId;
  const organizationId = (req as any).auth?.organizationId;

  const errorContext: any = {
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
  logger.error("Request error", {
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    ...errorContext,
  });

  // Track error metrics
  trackErrorMetrics(req.method, req.path, err);

  next(err);
};

/**
 * Track error metrics for monitoring
 */
function trackErrorMetrics(method: string, path: string, error: Error): void {
  const endpointPattern = path.replace(/\/\d+/g, "/:id").replace(/\/[a-f0-9-]{36}/gi, "/:id");

  logger.error("error_metric", {
    metricType: "application_error",
    method,
    path: endpointPattern,
    errorType: error.name,
    errorMessage: error.message,
  });
}

