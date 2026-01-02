import * as Sentry from "@sentry/node";
import type { ErrorEvent, EventHint, Scope } from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { expressIntegration, httpIntegration } from "@sentry/node";

/**
 * Initialize Sentry for error tracking
 * Call this early in the application lifecycle
 */
export function initSentry(): void {
  const dsn = process.env.SENTRY_DSN;
  const environment = process.env.NODE_ENV || "development";
  const tracesSampleRate = parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1");
  const profilesSampleRate = parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE || "0.1");

  // Only initialize Sentry if DSN is provided
  if (!dsn) {
    console.warn("Sentry DSN not configured. Error tracking disabled.");
    return;
  }

  Sentry.init({
    dsn,
    environment,
    
    // Performance monitoring
    tracesSampleRate,
    profilesSampleRate,
    
    // Release tracking
    release: process.env.SENTRY_RELEASE || undefined,
    
    // Integrations
    integrations: [
      // Profiling integration for performance monitoring
      nodeProfilingIntegration(),
      
      // HTTP integration for capturing request data
      httpIntegration(),
      
      // Express integration
      expressIntegration(),
    ],

    // Error filtering - don't send certain errors
    beforeSend(event: ErrorEvent, hint: EventHint) {
      // Filter out 4xx errors (client errors) unless they're critical
      if (event.request?.headers && event.request.headers.status_code) {
        const statusCode = parseInt(event.request.headers.status_code as string);
        if (statusCode >= 400 && statusCode < 500 && statusCode !== 401 && statusCode !== 403) {
          return null; // Don't send 4xx errors (except 401/403)
        }
      }

      // Don't send validation errors (too noisy)
      if (event.exception?.values?.[0]?.type === "ValidationError") {
        return null;
      }

      return event;
    },

    // Group similar errors
    beforeSendTransaction(event, hint) {
      return event;
    },

    // Additional options
    maxBreadcrumbs: 50,
    attachStacktrace: true,
    
    // Server name
    serverName: process.env.SERVICE_NAME || "partial-server",
  });

  console.log("Sentry initialized successfully");
}

/**
 * Configure Sentry scope with user context
 */
export function setUserContext(userId: string, organizationId: number, email?: string): void {
  Sentry.setUser({
    id: userId,
    email,
    organizationId: organizationId.toString(),
  });
}

/**
 * Clear user context (e.g., on logout)
 */
export function clearUserContext(): void {
  Sentry.setUser(null);
}

/**
 * Set additional context
 */
export function setContext(key: string, context: Record<string, any>): void {
  Sentry.setContext(key, context);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Capture exception manually
 */
export function captureException(error: Error, context?: Record<string, any>): string {
  if (context) {
    Sentry.withScope((scope: Scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
      return Sentry.captureException(error);
    });
  }
  return Sentry.captureException(error);
}

/**
 * Capture message manually
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = "info"): string {
  return Sentry.captureMessage(message, level);
}

/**
 * Set tag for filtering
 */
export function setTag(key: string, value: string): void {
  Sentry.setTag(key, value);
}

/**
 * Note: With expressIntegration(), Sentry automatically:
 * - Captures request data
 * - Tracks transactions
 * - Captures errors via error middleware
 * 
 * No separate middleware handlers are needed.
 * Errors are captured automatically through the error middleware.
 */

