"use client";

import * as Sentry from "@sentry/nextjs";

/**
 * Dev-only page to verify client Sentry monitoring.
 * Visit /debug-sentry and click the buttons to trigger test events.
 * Only accessible in development environment.
 */
export default function DebugSentryPage() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-2xl font-bold">Not available in production</h1>
        <p className="text-gray-600 dark:text-gray-400">
          This debug page is only available in development.
        </p>
      </div>
    );
  }
  const triggerUnhandledError = () => {
    throw new Error("Sentry client test – unhandled error (intentional)");
  };

  const triggerCapturedError = () => {
    try {
      throw new Error("Sentry client test – captured error (intentional)");
    } catch (e) {
      Sentry.captureException(e);
    }
    alert("Error sent to Sentry. Check your client project in the dashboard.");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Sentry client test
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        Use these buttons to confirm client-side Sentry is receiving events.
        Check your <strong>client-javascript-nextjs</strong> project in Sentry.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          type="button"
          onClick={triggerUnhandledError}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Trigger unhandled error
        </button>
        <button
          type="button"
          onClick={triggerCapturedError}
          className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition"
        >
          Trigger captured error
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        With <code>debug: true</code> in dev, you should see Sentry logs in the
        browser console when events are sent.
      </p>
    </div>
  );
}
