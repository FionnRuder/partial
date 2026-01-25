/**
 * Sentry instrumentation file
 * This file MUST be imported before any other imports in index.ts
 * to ensure Express is properly instrumented by Sentry
 */
import dotenv from "dotenv";
import { initSentry } from "./lib/sentry";

// Load environment variables first
dotenv.config();

// Initialize Sentry as early as possible (before Express is imported)
initSentry();
