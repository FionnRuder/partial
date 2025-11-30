import winston, { Logger as WinstonLogger } from "winston";
import WinstonCloudWatch from "winston-cloudwatch";
import { randomUUID } from "crypto";

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  HTTP = "http",
  VERBOSE = "verbose",
  DEBUG = "debug",
  SILLY = "silly",
}

/**
 * Extended Winston logger interface with request context
 * Note: All winston.Logger methods (error, warn, info, debug, etc.) are inherited
 */
export type Logger = WinstonLogger & {
  requestId?: string;
  userId?: number;
  organizationId?: number;
  setRequestId(requestId: string): void;
  setUser(userId: number, organizationId: number): void;
  clearContext(): void;
};

/**
 * Create structured logger with Winston
 */
function createLogger(): Logger {
  const isProduction = process.env.NODE_ENV === "production";
  const logLevel = process.env.LOG_LEVEL || (isProduction ? "info" : "debug");

  // Custom format for structured JSON logs
  const jsonFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    winston.format.errors({ stack: true }),
    winston.format.metadata({ fillExcept: ["message", "level", "timestamp", "service"] }),
    winston.format.json()
  );

  // Human-readable format for development
  const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, requestId, userId, organizationId, metadata, stack }) => {
      let log = `${timestamp} [${level}]`;
      if (requestId) log += ` [${requestId}]`;
      if (userId) log += ` [user:${userId}]`;
      if (organizationId) log += ` [org:${organizationId}]`;
      log += `: ${message}`;
      
      if (stack) {
        log += `\n${stack}`;
      }
      
      if (metadata && Object.keys(metadata).length > 0) {
        log += `\n${JSON.stringify(metadata, null, 2)}`;
      }
      
      return log;
    })
  );

  // Base transports
  const transports: winston.transport[] = [
    // Console output (always enabled)
    new winston.transports.Console({
      format: isProduction ? jsonFormat : consoleFormat,
      level: logLevel,
    }),
  ];

  // File transport for production (optional)
  if (process.env.LOG_FILE_ENABLED === "true") {
    transports.push(
      new winston.transports.File({
        filename: process.env.LOG_FILE_PATH || "logs/error.log",
        level: "error",
        format: jsonFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: process.env.LOG_FILE_PATH || "logs/combined.log",
        format: jsonFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      })
    );
  }

  // CloudWatch transport (production only)
  if (isProduction && process.env.AWS_CLOUDWATCH_LOG_GROUP && process.env.AWS_REGION) {
    try {
      transports.push(
        new WinstonCloudWatch({
          logGroupName: process.env.AWS_CLOUDWATCH_LOG_GROUP,
          logStreamName: `${process.env.AWS_CLOUDWATCH_LOG_STREAM_PREFIX || "server"}-${new Date().toISOString().split("T")[0]}`,
          awsRegion: process.env.AWS_REGION,
          messageFormatter: ({ level, message, ...meta }) => {
            return JSON.stringify({
              level,
              message,
              timestamp: new Date().toISOString(),
              ...meta,
            });
          },
          // CloudWatch has rate limits, so batch logs
          jsonMessage: true,
        })
      );
    } catch (error) {
      console.error("Failed to initialize CloudWatch transport:", error);
    }
  }

  // Create logger instance
  const logger: Logger = winston.createLogger({
    level: logLevel,
    format: jsonFormat,
    defaultMeta: {
      service: process.env.SERVICE_NAME || "partial-server",
      environment: process.env.NODE_ENV || "development",
    },
    transports,
    // Don't exit on handled exceptions
    exitOnError: false,
  }) as Logger;

  // Add request ID tracking methods
  logger.setRequestId = (requestId: string) => {
    logger.requestId = requestId;
    logger.defaultMeta = {
      ...logger.defaultMeta,
      requestId,
    };
  };

  // Add user context methods
  logger.setUser = (userId: number, organizationId: number) => {
    logger.userId = userId;
    logger.organizationId = organizationId;
    logger.defaultMeta = {
      ...logger.defaultMeta,
      userId,
      organizationId,
    };
  };

  // Clear context
  logger.clearContext = () => {
    delete logger.requestId;
    delete logger.userId;
    delete logger.organizationId;
    logger.defaultMeta = {
      service: logger.defaultMeta?.service || "partial-server",
      environment: logger.defaultMeta?.environment || "development",
    };
  };

  return logger;
}

// Export singleton logger instance
export const logger = createLogger();

/**
 * Create a child logger with additional context
 */
export function createChildLogger(context: {
  requestId?: string;
  userId?: number;
  organizationId?: number;
  [key: string]: any;
}): Logger {
  const childLogger = logger.child(context) as Logger;
  
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
export function logWithContext(
  level: LogLevel,
  message: string,
  meta?: any,
  requestId?: string,
  userId?: number,
  organizationId?: number
) {
  const context: any = { ...meta };
  if (requestId) context.requestId = requestId;
  if (userId) context.userId = userId;
  if (organizationId) context.organizationId = organizationId;

  logger.log(level, message, context);
}

/**
 * Generate a new request ID using Node.js crypto.randomUUID
 */
export function generateRequestId(): string {
  return randomUUID();
}

