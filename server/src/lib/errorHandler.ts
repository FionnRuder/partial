/**
 * Simple error logging utility for server-side
 * Integrated with Sentry for error tracking
 */
import * as Sentry from "@sentry/node";

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string | number;
  additionalInfo?: Record<string, any>;
}

/**
 * Logs errors to console and Sentry
 */
export const logError = (
  error: Error | unknown,
  context?: ErrorContext
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  // Log to console
  console.error("Error logged:", {
    message: errorMessage,
    stack: errorStack,
    context,
    timestamp: new Date().toISOString(),
  });

  // Send to Sentry
  if (error instanceof Error) {
    Sentry.withScope((scope) => {
      if (context) {
        if (context.component) scope.setTag("component", context.component);
        if (context.action) scope.setTag("action", context.action);
        if (context.userId) scope.setUser({ id: context.userId.toString() });
        if (context.additionalInfo) scope.setContext("additionalInfo", context.additionalInfo);
      }
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureMessage(String(error), "error");
  }
};

