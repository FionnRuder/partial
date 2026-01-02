import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logAuthEvent, AuthEventType, getAuthContext } from "../lib/authLogger";
import { setUserContext, clearUserContext } from "../lib/sentry";
import { getAuth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

const prisma = new PrismaClient();

/**
 * Authentication middleware using Better Auth
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get Better Auth session
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      const context = getAuthContext(req);
      
      logAuthEvent({
        eventType: AuthEventType.SESSION_INVALID,
        ...context,
        reason: "No valid Better Auth session found",
      });

      // Clear any old session cookies
      if (req.session) {
        req.session.destroy((err: Error | null) => {
          if (err) {
            logAuthEvent({
              eventType: AuthEventType.SESSION_INVALID,
              ...context,
              error: err.message,
              reason: "Error destroying invalid session",
            });
          }
        });
      }
      
      res.status(401).json({ 
        message: "Session expired or invalid. Please log in again.",
        requiresLogin: true
      });
      return;
    }

    // Find user by Better Auth user ID
    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        organizationId: true,
        role: true,
        email: true,
      },
    });

    if (!user) {
      // User authenticated but not found in database
      // This happens during first login - redirect to onboarding
      const context = getAuthContext(req);
      
      logAuthEvent({
        eventType: AuthEventType.ONBOARDING_REQUIRED,
        ...context,
        email: session.user.email,
        reason: "User authenticated but not found in database",
      });

      res.status(401).json({ 
        message: "User authenticated but not found in database. Please complete onboarding.",
        requiresOnboarding: true
      });
      return;
    }

    // User found - attach to request and continue
    req.auth = {
      userId: user.id, // Keep userId name for backward compatibility in req.auth
      organizationId: user.organizationId,
      role: user.role,
    };

    // Set user context in Sentry for error tracking
    setUserContext(user.id, user.organizationId, user.email);

    // Log successful authentication
    logAuthEvent({
      eventType: AuthEventType.LOGIN_SUCCESS,
      ...getAuthContext(req),
      email: user.email,
    });

    next();
  } catch (error) {
    next(error);
  }
};

