import "express";

declare global {
  namespace Express {
    interface AuthContext {
      userId: number;
      organizationId: number;
      role: string;
    }

    interface Request {
      auth: AuthContext;
    }
  }
}

export {};

