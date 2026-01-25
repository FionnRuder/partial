"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Client component to ensure Sentry is initialized
 * This is a fallback in case sentry.client.config.ts doesn't execute properly
 */
export function SentryInit() {
  useEffect(() => {
    // Check if Sentry is already initialized
    const existingClient = Sentry.getClient();
    
    if (existingClient) {
      console.log("[SentryInit] Sentry already initialized");
      return;
    }

    // Get DSN from environment
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    
    if (!dsn) {
      console.error("[SentryInit] DSN not available, cannot initialize Sentry");
      return;
    }

    console.log("[SentryInit] Initializing Sentry manually...");
    console.log("[SentryInit] DSN:", dsn.substring(0, 50) + "...");

    try {
      Sentry.init({
        dsn: dsn,
        tracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || "0.1"),
        replaysOnErrorSampleRate: 1.0,
        replaysSessionSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SAMPLE_RATE || "0.1"),
        debug: process.env.NEXT_PUBLIC_SENTRY_DEBUG === "true",
        environment: process.env.NODE_ENV || "development",
        release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || undefined,
        integrations: [
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        beforeSend(event, hint) {
          // Don't send validation errors
          if (event.exception?.values?.[0]?.type === "ValidationError") {
            return null;
          }
          // Don't send 404 errors
          if (event.tags?.statusCode === "404") {
            return null;
          }
          return event;
        },
        beforeBreadcrumb(breadcrumb) {
          if (breadcrumb.category === "console" && breadcrumb.level === "log") {
            return null;
          }
          return breadcrumb;
        },
      });

      // Verify initialization
      setTimeout(() => {
        const client = Sentry.getClient();
        if (client) {
          console.log("[SentryInit] ✅ Sentry initialized successfully!");
          console.log("[SentryInit] Client DSN:", client.getDsn()?.toString());
        } else {
          console.error("[SentryInit] ❌ Sentry initialization failed!");
        }
      }, 100);
    } catch (error) {
      console.error("[SentryInit] Error initializing Sentry:", error);
    }
  }, []);

  // This component doesn't render anything
  return null;
}
