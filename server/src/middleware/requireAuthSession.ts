import { NextFunction, Request, Response } from "express";
import { getAuth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

/**
 * Middleware that requires a Better Auth session but doesn't require user to exist in database
 * Used for onboarding routes where user is authenticated but hasn't completed profile setup
 */
export const requireAuthSession = async (
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
      res.status(401).json({ 
        message: "Authentication required. Please log in.",
        requiresLogin: true
      });
      return;
    }

    // Attach session to request for use in controllers
    (req as any).betterAuthSession = session;
    next();
  } catch (error) {
    next(error);
  }
};



