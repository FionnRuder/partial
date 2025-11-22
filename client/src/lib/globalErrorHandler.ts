"use client";

import { logError } from "./errorHandler";
import { showToast } from "./toast";

/**
 * Sets up global error handlers for unhandled errors and promise rejections
 * Should be called once in the app initialization
 */
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled JavaScript errors
  if (typeof window !== "undefined") {
    const originalErrorHandler = window.onerror;
    window.onerror = (
      message: string | Event,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error
    ) => {
      // Call original handler if it exists
      if (originalErrorHandler) {
        originalErrorHandler(message, source, lineno, colno, error);
      }

      // Log the error
      const errorObj = error || new Error(String(message));
      logError(errorObj, {
        component: "GlobalErrorHandler",
        action: "window.onerror",
        additionalInfo: {
          source,
          lineno,
          colno,
          message: String(message),
        },
      });

      // Show user-friendly error message (only for unexpected errors)
      if (error && !error.message.includes("Script error")) {
        showToast.error(
          "An unexpected error occurred. Please refresh the page if the problem persists."
        );
      }

      // Return false to prevent default browser error handling
      return false;
    };

    // Handle unhandled promise rejections
    const originalUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = (event: PromiseRejectionEvent) => {
      // Call original handler if it exists
      if (originalUnhandledRejection) {
        originalUnhandledRejection(event);
      }

      // Log the error
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));
      logError(error, {
        component: "GlobalErrorHandler",
        action: "unhandledrejection",
        additionalInfo: {
          reason: event.reason,
        },
      });

      // Show user-friendly error message
      showToast.error(
        "An operation failed unexpectedly. Please try again or refresh the page."
      );

      // Prevent default browser error handling
      event.preventDefault();
    };
  }
};

/**
 * Removes global error handlers (useful for cleanup in tests)
 */
export const removeGlobalErrorHandlers = () => {
  if (typeof window !== "undefined") {
    window.onerror = null;
    window.onunhandledrejection = null;
  }
};

