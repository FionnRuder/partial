"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = void 0;
/**
 * Simple error logging utility for server-side
 * Integrated with Sentry for error tracking
 */
const Sentry = __importStar(require("@sentry/node"));
/**
 * Logs errors to console and Sentry
 */
const logError = (error, context) => {
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
                if (context.component)
                    scope.setTag("component", context.component);
                if (context.action)
                    scope.setTag("action", context.action);
                if (context.userId)
                    scope.setUser({ id: context.userId.toString() });
                if (context.additionalInfo)
                    scope.setContext("additionalInfo", context.additionalInfo);
            }
            Sentry.captureException(error);
        });
    }
    else {
        Sentry.captureMessage(String(error), "error");
    }
};
exports.logError = logError;
