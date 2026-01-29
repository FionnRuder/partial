// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize if DSN is provided
if (!dsn) {
  if (process.env.NODE_ENV === "development") {
    console.warn("[Sentry] Skipping initialization - DSN not provided");
  }
} else {
  Sentry.init({
    dsn: dsn,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || "0.1"),

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  // Enable debug in production temporarily to troubleshoot
  debug: process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_SENTRY_DEBUG === "true",
  
  // Enable automatic session tracking
  autoSessionTracking: true,
  
  // Send default PII (Personally Identifiable Information) - be careful with this
  sendDefaultPii: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SAMPLE_RATE || "0.1"),

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out certain errors
  beforeSend(event, hint) {
    // Log when beforeSend is called (for debugging)
    if (process.env.NEXT_PUBLIC_SENTRY_DEBUG === "true") {
      console.log("[Sentry] beforeSend called", { event, hint });
    }

    // Don't send client-side validation errors
    if (event.exception?.values?.[0]?.type === "ValidationError") {
      return null;
    }

    // Don't send 404 errors
    if (event.tags?.statusCode === "404") {
      return null;
    }

    // Filter out chunk loading errors - these are harmless and occur during navigation/logout
    const errorMessage = event.exception?.values?.[0]?.value || event.message || "";
    const errorType = event.exception?.values?.[0]?.type || "";
    
    // Check for chunk loading errors
    if (
      errorMessage.includes("Failed to load chunk") ||
      errorMessage.includes("Loading chunk") ||
      errorMessage.includes("ChunkLoadError") ||
      errorMessage.includes("/_next/static/chunks/") ||
      errorType === "ChunkLoadError" ||
      (errorMessage.includes("chunk") && errorMessage.includes("module"))
    ) {
      // These errors are harmless - they occur when navigating away during chunk loading
      // (e.g., during logout) or when chunks are updated after deployment
      return null;
    }

    return event;
  },

  // Set user context when available
  beforeBreadcrumb(breadcrumb, hint) {
    // Filter out noisy breadcrumbs if needed
    if (breadcrumb.category === "console" && breadcrumb.level === "log") {
      return null;
    }
    return breadcrumb;
  },

  environment: process.env.NODE_ENV || "development",
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || undefined,
  
    // Transport options - ensure events are sent
    transportOptions: {
      // Increase timeout for sending events
      timeout: 10000,
    },
  });

}




