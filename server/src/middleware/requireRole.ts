import { Request, Response, NextFunction } from "express";

/**
 * Middleware to require specific roles
 * Usage: requireRole(['Admin', 'Manager', 'Program Manager'])
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !req.auth.role) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const userRole = req.auth.role;

    // Check if user's role is in the allowed roles list
    // Handle both enum format (e.g., "ProgramManager") and display format (e.g., "Program Manager")
    const normalizedUserRole = userRole === "ProgramManager" ? "Program Manager" : userRole;
    const isAllowed = allowedRoles.some((role) => {
      const normalizedRole = role === "ProgramManager" ? "Program Manager" : role;
      return normalizedUserRole === normalizedRole;
    });

    if (!isAllowed) {
      res.status(403).json({
        message: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
      });
      return;
    }

    next();
  };
};

