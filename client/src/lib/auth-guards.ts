// Authentication middleware and route guards
import { NextRequest, NextResponse } from 'next/server';
import { AuthUser } from '@/lib/auth';

// Route protection levels
export enum RouteProtection {
  PUBLIC = 'public',
  AUTHENTICATED = 'authenticated',
  ENGINEER_ONLY = 'engineer_only',
  PROGRAM_MANAGER_ONLY = 'program_manager_only',
}

// Route configuration
export const routeConfig: Record<string, RouteProtection> = {
  '/': RouteProtection.PUBLIC,
  '/onboarding': RouteProtection.PUBLIC,
  '/home': RouteProtection.AUTHENTICATED,
  '/parts': RouteProtection.AUTHENTICATED,
  '/programs': RouteProtection.AUTHENTICATED,
  '/work-items': RouteProtection.AUTHENTICATED,
  '/users': RouteProtection.AUTHENTICATED,
  '/teams': RouteProtection.AUTHENTICATED,
  '/settings': RouteProtection.AUTHENTICATED,
  '/search': RouteProtection.AUTHENTICATED,
  '/timeline': RouteProtection.AUTHENTICATED,
};

// Helper function to check if user has required role
export function hasRequiredRole(user: AuthUser | null, protection: RouteProtection): boolean {
  // PUBLIC routes should allow access regardless of authentication status
  if (protection === RouteProtection.PUBLIC) {
    return true;
  }

  // All other routes require a user
  if (!user) return false;

  switch (protection) {
    case RouteProtection.AUTHENTICATED:
      return true;
    case RouteProtection.ENGINEER_ONLY:
      return user.role === 'Engineer' || 
             user.role === 'Design Engineer' || 
             user.role === 'Electrical Eng' || 
             user.role === 'Mechanical Eng' || 
             user.role === 'Test Engineer';
    case RouteProtection.PROGRAM_MANAGER_ONLY:
      return user.role === 'Program Manager' || user.role === 'Project Manager';
    default:
      return false;
  }
}

// Server-side middleware for API routes
export function createAuthMiddleware() {
  return async (req: NextRequest, res: NextResponse, next: () => void) => {
    const pathname = req.nextUrl.pathname;
    const protection = routeConfig[pathname];

    // Skip protection for public routes
    if (protection === RouteProtection.PUBLIC) {
      return next();
    }

    // TODO: Implement token validation for Cognito
    // For now, this is a placeholder
    const token = req.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // TODO: Validate Cognito token and extract user info
    // const user = await validateCognitoToken(token);
    
    next();
  };
}

// API route protection wrapper
export function withAuth(handler: Function, protection: RouteProtection = RouteProtection.AUTHENTICATED) {
  return async (req: NextRequest, res: NextResponse) => {
    // TODO: Implement actual token validation
    const token = req.headers.get('authorization');
    
    if (!token && protection !== RouteProtection.PUBLIC) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // TODO: Validate token and extract user
    // const user = await validateCognitoToken(token);
    
    return handler(req, res);
  };
}

// Role-based access control helpers
export const rolePermissions = {
  canViewPrograms: (user: AuthUser | null) => {
    return user && (user.role === 'Program Manager' || user.role === 'Project Manager');
  },
  
  canManageWorkItems: (user: AuthUser | null) => {
    return user && (
      user.role === 'Engineer' || 
      user.role === 'Design Engineer' || 
      user.role === 'Electrical Eng' || 
      user.role === 'Mechanical Eng' || 
      user.role === 'Test Engineer' ||
      user.role === 'Program Manager' || 
      user.role === 'Project Manager'
    );
  },
  
  canManageUsers: (user: AuthUser | null) => {
    return user && (user.role === 'Program Manager' || user.role === 'Project Manager');
  },
  
  canManageTeams: (user: AuthUser | null) => {
    return user && (user.role === 'Program Manager' || user.role === 'Project Manager');
  },
  
  canViewAnalytics: (user: AuthUser | null) => {
    return user && (user.role === 'Program Manager' || user.role === 'Project Manager');
  },
};
