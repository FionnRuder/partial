/**
 * Global error handling utilities
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string | number;
  additionalInfo?: Record<string, any>;
}

/**
 * Logs errors to console in development
 * In production, this could send errors to an error tracking service (e.g., Sentry)
 */
export const logError = (
  error: Error | unknown,
  context?: ErrorContext
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  // In development, log to console
  if (process.env.NODE_ENV === "development") {
    console.error("Error logged:", {
      message: errorMessage,
      stack: errorStack,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  // In production, send to error tracking service
  // Example: Sentry.captureException(error, { extra: context });
  // Example: logErrorToService(error, context);
};

/**
 * Creates a user-friendly error message from an error
 */
export const getUserFriendlyErrorMessage = (
  error: Error | unknown,
  defaultMessage: string = "An unexpected error occurred"
): string => {
  if (!(error instanceof Error)) {
    return defaultMessage;
  }

  const errorMessage = error.message.toLowerCase();

  // Network errors
  if (
    errorMessage.includes("network") ||
    errorMessage.includes("fetch") ||
    errorMessage.includes("connection")
  ) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }

  // Authentication errors
  if (
    errorMessage.includes("unauthorized") ||
    errorMessage.includes("authentication") ||
    errorMessage.includes("session expired")
  ) {
    return "Your session has expired. Please log in again.";
  }

  // Permission errors
  if (
    errorMessage.includes("forbidden") ||
    errorMessage.includes("permission") ||
    errorMessage.includes("access denied")
  ) {
    return "You don't have permission to perform this action.";
  }

  // Not found errors
  if (
    errorMessage.includes("not found") ||
    errorMessage.includes("404")
  ) {
    return "The requested resource was not found.";
  }

  // Validation errors
  if (
    errorMessage.includes("validation") ||
    errorMessage.includes("invalid") ||
    errorMessage.includes("required")
  ) {
    return "Please check your input and try again.";
  }

  // Server errors
  if (
    errorMessage.includes("500") ||
    errorMessage.includes("internal server error")
  ) {
    return "A server error occurred. Please try again later.";
  }

  // Rate limiting
  if (
    errorMessage.includes("rate limit") ||
    errorMessage.includes("too many requests")
  ) {
    return "Too many requests. Please wait a moment and try again.";
  }

  // Return the original message if it's user-friendly, otherwise return default
  if (error.message && error.message.length < 100) {
    return error.message;
  }

  return defaultMessage;
};

/**
 * Handles API errors and extracts user-friendly messages
 */
export const handleApiError = (
  error: any,
  defaultMessage: string = "An error occurred"
): string => {
  // Check for API error response structure
  if (error?.data?.message) {
    return getUserFriendlyErrorMessage(
      new Error(error.data.message),
      defaultMessage
    );
  }

  if (error?.message) {
    return getUserFriendlyErrorMessage(error, defaultMessage);
  }

  return defaultMessage;
};

/**
 * Wraps an async function with error handling
 */
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, context);
      throw error;
    }
  }) as T;
};

/**
 * Creates a safe error handler for event handlers
 */
export const createErrorHandler = (context?: ErrorContext) => {
  return (error: Error | unknown) => {
    logError(error, context);
    const message = getUserFriendlyErrorMessage(error);
    // You could also show a toast notification here
    // showToast.error(message);
    return message;
  };
};

