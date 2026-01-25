// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Log Sentry initialization (for debugging) - ALWAYS log, even in production
console.log("[Sentry Config] File loaded");
console.log("[Sentry Config] NODE_ENV:", process.env.NODE_ENV);
console.log("[Sentry Config] Window available:", typeof window !== "undefined");

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
console.log("[Sentry Config] DSN check:", dsn ? "Found" : "MISSING");
if (dsn) {
  console.log("[Sentry Config] DSN value:", dsn.substring(0, 50) + "...");
}

if (typeof window !== "undefined") {
  console.log("[Sentry] Initializing client SDK in browser...");
  console.log("[Sentry] DSN:", dsn ? "Configured" : "MISSING");
  console.log("[Sentry] DSN value:", dsn ? `${dsn.substring(0, 30)}...` : "undefined");
  console.log("[Sentry] Environment:", process.env.NODE_ENV);
  
  if (!dsn) {
    console.error("[Sentry] ERROR: NEXT_PUBLIC_SENTRY_DSN is not set! Sentry will not work.");
    console.error("[Sentry] Make sure NEXT_PUBLIC_SENTRY_DSN is set in Railway environment variables.");
  }
}

// Only initialize if DSN is provided
if (!dsn) {
  console.warn("[Sentry] Skipping initialization - DSN not provided");
  if (typeof window !== "undefined") {
    console.error("[Sentry] CRITICAL: DSN is missing at initialization time!");
  }
} else {
  console.log("[Sentry] Starting Sentry.init() with DSN");
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

  console.log("[Sentry] Sentry.init() called");
  
  // Log after initialization - use multiple timeouts to catch it
  if (typeof window !== "undefined") {
    // Immediate check
    setTimeout(() => {
      const client = Sentry.getClient();
      console.log("[Sentry] Immediate check - Client:", client ? "Found" : "NOT FOUND");
      if (client) {
        console.log("[Sentry] Client initialized successfully");
        const clientDsn = client.getDsn();
        console.log("[Sentry] Client DSN:", clientDsn ? clientDsn.toString() : "Not available");
        console.log("[Sentry] Client options:", {
          environment: client.getOptions()?.environment,
          release: client.getOptions()?.release,
        });
      } else {
        console.error("[Sentry] Client NOT initialized after init() call!");
        console.error("[Sentry] This usually means the DSN is invalid or Sentry.init() failed silently");
      }
    }, 100);
    
    // Delayed check (in case initialization is async)
    setTimeout(() => {
      const client = Sentry.getClient();
      if (client) {
        console.log("[Sentry] Delayed check - Client initialized");
      } else {
        console.error("[Sentry] Delayed check - Client STILL not initialized!");
      }
    }, 1000);
  }
}




