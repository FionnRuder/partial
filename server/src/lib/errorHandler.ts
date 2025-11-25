/**
 * Simple error logging utility for server-side
 * In production, this could be integrated with a logging service
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string | number;
  additionalInfo?: Record<string, any>;
}

/**
 * Logs errors to console
 * In production, this could send errors to an error tracking service
 */
export const logError = (
  error: Error | unknown,
  context?: ErrorContext
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error("Error logged:", {
    message: errorMessage,
    stack: errorStack,
    context,
    timestamp: new Date().toISOString(),
  });
};

