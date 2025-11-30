import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logAuthEvent, AuthEventType, getAuthContext } from "../lib/authLogger";
import { setUserContext, clearUserContext } from "../lib/sentry";

const prisma = new PrismaClient();

/**
 * Authentication middleware - Cognito session-based only
 * Requires user to be authenticated via Cognito OIDC and have a valid session
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for session-based authentication (Cognito OIDC)
    if (!req.session?.userInfo) {
      // Session exists but no userInfo - likely session was lost (server restart with memory store)
      // or user never completed login. Destroy the invalid session and return 401.
      const context = getAuthContext(req);
      
      logAuthEvent({
        eventType: AuthEventType.SESSION_INVALID,
        ...context,
        reason: "Session exists but no userInfo present",
      });

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

    const userInfo = req.session.userInfo;
    
    // Try to find user by email or cognitoId (sub)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userInfo.email },
          { cognitoId: userInfo.sub },
        ],
      },
      select: {
        userId: true,
        organizationId: true,
        role: true,
      },
    });

    if (!user) {
      // User authenticated with Cognito but not found in database
      // This happens during first login - redirect to onboarding
      const context = getAuthContext(req);
      
      logAuthEvent({
        eventType: AuthEventType.ONBOARDING_REQUIRED,
        ...context,
        email: userInfo.email,
        cognitoId: userInfo.sub,
        reason: "User authenticated with Cognito but not found in database",
      });

      res.status(401).json({ 
        message: "User authenticated but not found in database. Please complete onboarding.",
        requiresOnboarding: true
      });
      return;
    }

    // User found - attach to request and continue
    req.auth = {
      userId: user.userId,
      organizationId: user.organizationId,
      role: user.role,
    };

    // Set user context in Sentry for error tracking
    setUserContext(user.userId, user.organizationId, userInfo.email);

    // Log successful authentication
    logAuthEvent({
      eventType: AuthEventType.LOGIN_SUCCESS,
      ...getAuthContext(req),
      email: userInfo.email,
      cognitoId: userInfo.sub,
    });

    next();
  } catch (error) {
    next(error);
  }
};

