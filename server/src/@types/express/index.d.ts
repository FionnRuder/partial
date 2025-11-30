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
      userId: number;
      organizationId: number;
      role: string;
    }

    interface Request {
      auth: AuthContext;
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

export {};

