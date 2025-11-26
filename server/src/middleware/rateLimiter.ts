import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

/**
 * Get client IP address from request, handling proxies
 */
function getClientIp(req: Request): string {
  // Check for IP in headers (useful when behind proxy/load balancer)
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return ips.split(",")[0].trim();
  }
  
  // Check x-real-ip header (used by some proxies)
  const realIp = req.headers["x-real-ip"];
  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }
  
  // Fall back to Express's req.ip
  return req.ip || req.socket.remoteAddress || "unknown";
}

/**
 * Log rate limit violation
 */
function logRateLimitViolation(
  req: Request,
  identifier: string,
  limit: number,
  windowMs: number
): void {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const userAgent = req.headers["user-agent"] || "unknown";
  const userId = (req as any).auth?.userId || "unauthenticated";
  
  console.warn(
    `[RATE LIMIT VIOLATION] ${timestamp} - ` +
    `Identifier: ${identifier}, ` +
    `User ID: ${userId}, ` +
    `Limit: ${limit} requests per ${Math.floor(windowMs / 1000)}s, ` +
    `Method: ${method}, ` +
    `Path: ${path}, ` +
    `IP: ${getClientIp(req)}, ` +
    `User-Agent: ${userAgent}`
  );
}

/**
 * Per-IP rate limiter
 * Applied to all requests to prevent abuse from a single IP
 * Note: This runs before authentication, so it only limits unauthenticated requests
 * Authenticated requests are handled by userRateLimiter
 */
export const ipRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs (increased for development)
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: Request) => {
    return `ip:${getClientIp(req)}`;
  },
  skip: (req: Request) => {
    // Skip OPTIONS requests (CORS preflight) - they shouldn't count toward rate limits
    if (req.method === 'OPTIONS') {
      return true;
    }
    // Skip if request will be authenticated (userRateLimiter will handle it)
    // Note: This check happens before auth middleware, so we check session directly
    if (req.session?.userInfo) {
      return true;
    }
    return false;
  },
  handler: (req: Request, res: Response) => {
    const ip = getClientIp(req);
    logRateLimitViolation(
      req,
      `IP:${ip}`,
      1000,
      15 * 60 * 1000
    );
    res.status(429).json({
      error: "Too many requests from this IP, please try again later.",
      retryAfter: Math.ceil(15 * 60), // seconds
    });
  },
  // Custom store can be added here for distributed systems (Redis, etc.)
});

/**
 * Per-user rate limiter
 * Applied to authenticated requests to prevent abuse from authenticated users
 */
export const userRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Limit each user to 2000 requests per windowMs (increased for development)
  message: {
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: Request) => {
    // Use user ID if authenticated, otherwise fall back to IP
    const userId = (req as any).auth?.userId;
    if (userId) {
      return `user:${userId}`;
    }
    // Fallback to IP if not authenticated (shouldn't happen if applied after auth)
    return `ip:${getClientIp(req)}`;
  },
  skip: (req: Request) => {
    // Skip OPTIONS requests (CORS preflight) - they shouldn't count toward rate limits
    if (req.method === 'OPTIONS') {
      return true;
    }
    // Skip user rate limiting if not authenticated (let IP limiter handle it)
    return !(req as any).auth?.userId;
  },
  handler: (req: Request, res: Response) => {
    const userId = (req as any).auth?.userId || "unknown";
    logRateLimitViolation(
      req,
      `User:${userId}`,
      2000,
      15 * 60 * 1000
    );
    res.status(429).json({
      error: "Too many requests, please try again later.",
      retryAfter: Math.ceil(15 * 60), // seconds
    });
  },
});

/**
 * Stricter rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return `auth:${getClientIp(req)}`;
  },
  handler: (req: Request, res: Response) => {
    const ip = getClientIp(req);
    logRateLimitViolation(
      req,
      `Auth:${ip}`,
      5,
      15 * 60 * 1000
    );
    res.status(429).json({
      error: "Too many authentication attempts, please try again later.",
      retryAfter: Math.ceil(15 * 60), // seconds
    });
  },
  // Skip successful requests (only count failed auth attempts)
  skipSuccessfulRequests: true,
});

/**
 * Rate limiter for public endpoints (invitations, etc.)
 * More lenient than auth but stricter than general IP limit
 */
export const publicEndpointRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: {
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return `public:${getClientIp(req)}`;
  },
  handler: (req: Request, res: Response) => {
    const ip = getClientIp(req);
    logRateLimitViolation(
      req,
      `Public:${ip}`,
      50,
      15 * 60 * 1000
    );
    res.status(429).json({
      error: "Too many requests, please try again later.",
      retryAfter: Math.ceil(15 * 60), // seconds
    });
  },
});

