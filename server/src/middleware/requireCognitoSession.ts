import { NextFunction, Request, Response } from "express";

/**
 * Middleware that requires a Cognito session but doesn't require user to exist in database
 * Used for onboarding routes where user is authenticated but not yet in database
 */
export const requireCognitoSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.userInfo) {
    res.status(401).json({ 
      message: "Authentication required. Please log in via Cognito.",
      redirectTo: "/auth/login"
    });
    return;
  }

  // Attach userInfo to request for easy access
  req.cognitoUserInfo = req.session.userInfo;
  next();
};

// Extend Express Request to include cognitoUserInfo
declare global {
  namespace Express {
    interface Request {
      cognitoUserInfo?: {
        sub: string;
        email?: string;
        email_verified?: boolean;
        phone_number?: string;
        phone_number_verified?: boolean;
        username?: string;
        name?: string;
        [key: string]: any;
      };
    }
  }
}

