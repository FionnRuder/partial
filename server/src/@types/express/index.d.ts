import "express";
import "express-session";

declare module "express-session" {
  interface SessionData {
    nonce?: string;
    state?: string;
    invitationToken?: string; // Preserve invitation token through OAuth flow
    userInfo?: {
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

declare global {
  namespace Express {
    interface AuthContext {
      userId: string; // Changed from number to string (Better Auth uses cuid)
      organizationId: number;
      role: string;
    }

    interface Request {
      auth: AuthContext;
      // TODO: Update userInfo type when implementing better-auth.com
      userInfo?: {
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

export {};

