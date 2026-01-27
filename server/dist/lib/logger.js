"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogLevel = void 0;
exports.createChildLogger = createChildLogger;
exports.logWithContext = logWithContext;
exports.generateRequestId = generateRequestId;
const winston_1 = __importDefault(require("winston"));
const crypto_1 = require("crypto");
/**
 * Log levels in order of severity
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["HTTP"] = "http";
    LogLevel["VERBOSE"] = "verbose";
    LogLevel["DEBUG"] = "debug";
    LogLevel["SILLY"] = "silly";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Create structured logger with Winston
 */
function createLogger() {
    const isProduction = process.env.NODE_ENV === "production";
    const logLevel = process.env.LOG_LEVEL || (isProduction ? "info" : "debug");
    // Custom format for structured JSON logs
    const jsonFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.metadata({ fillExcept: ["message", "level", "timestamp", "service"] }), winston_1.default.format.json());
    // Human-readable format for development
    const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf(({ timestamp, level, message, requestId, userId, organizationId, metadata, stack }) => {
        let log = `${timestamp} [${level}]`;
        if (requestId)
            log += ` [${requestId}]`;
        if (userId)
            log += ` [user:${userId}]`;
        if (organizationId)
            log += ` [org:${organizationId}]`;
        log += `: ${message}`;
        if (stack) {
            log += `\n${stack}`;
        }
        if (metadata && Object.keys(metadata).length > 0) {
            log += `\n${JSON.stringify(metadata, null, 2)}`;
        }
        return log;
    }));
    // Base transports
    const transports = [
        // Console output (always enabled)
        new winston_1.default.transports.Console({
            format: isProduction ? jsonFormat : consoleFormat,
            level: logLevel,
        }),
    ];
    // File transport for production (optional)
    if (process.env.LOG_FILE_ENABLED === "true") {
        transports.push(new winston_1.default.transports.File({
            filename: process.env.LOG_FILE_PATH || "logs/error.log",
            level: "error",
            format: jsonFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }), new winston_1.default.transports.File({
            filename: process.env.LOG_FILE_PATH || "logs/combined.log",
            format: jsonFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }));
    }
    // TODO: Add logging service transport here if needed (e.g., Datadog, LogRocket, etc.)
    // CloudWatch has been removed - add your preferred logging service here
    // Create logger instance
    const logger = winston_1.default.createLogger({
        level: logLevel,
        format: jsonFormat,
        defaultMeta: {
            service: process.env.SERVICE_NAME || "partial-server",
            environment: process.env.NODE_ENV || "development",
        },
        transports,
        // Don't exit on handled exceptions
        exitOnError: false,
    });
    // Add request ID tracking methods
    logger.setRequestId = (requestId) => {
        logger.requestId = requestId;
        logger.defaultMeta = Object.assign(Object.assign({}, logger.defaultMeta), { requestId });
    };
    // Add user context methods
    logger.setUser = (userId, organizationId) => {
        logger.userId = userId;
        logger.organizationId = organizationId;
        logger.defaultMeta = Object.assign(Object.assign({}, logger.defaultMeta), { userId,
            organizationId });
    };
    // Clear context
    logger.clearContext = () => {
        var _a, _b;
        delete logger.requestId;
        delete logger.userId;
        delete logger.organizationId;
        logger.defaultMeta = {
            service: ((_a = logger.defaultMeta) === null || _a === void 0 ? void 0 : _a.service) || "partial-server",
            environment: ((_b = logger.defaultMeta) === null || _b === void 0 ? void 0 : _b.environment) || "development",
        };
    };
    return logger;
}
// Export singleton logger instance
exports.logger = createLogger();
/**
 * Create a child logger with additional context
 */
function createChildLogger(context) {
    const childLogger = exports.logger.child(context);
    if (context.requestId) {
        childLogger.requestId = context.requestId;
    }
    if (context.userId) {
        childLogger.userId = context.userId;
    }
    if (context.organizationId) {
        childLogger.organizationId = context.organizationId;
    }
    return childLogger;
}
/**
 * Helper to log with request context
 */
function logWithContext(level, message, meta, requestId, userId, organizationId) {
    const context = Object.assign({}, meta);
    if (requestId)
        context.requestId = requestId;
    if (userId)
        context.userId = userId;
    if (organizationId)
        context.organizationId = organizationId;
    exports.logger.log(level, message, context);
}
/**
 * Generate a new request ID using Node.js crypto.randomUUID
 */
function generateRequestId() {
    return (0, crypto_1.randomUUID)();
}
