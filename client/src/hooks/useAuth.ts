// Client-side authentication hooks
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { RouteProtection, hasRequiredRole, rolePermissions } from '@/lib/auth-guards';

// Client-side route guard hook
export function useRouteGuard(requiredProtection: RouteProtection) {
  const { user, isAuthenticated, isLoading } = useAuth();

  const canAccess = () => {
    if (isLoading) return false;
    return hasRequiredRole(user, requiredProtection);
  };

  const shouldRedirect = () => {
    if (isLoading) return false;
    
    if (requiredProtection === RouteProtection.PUBLIC) return false;
    if (!isAuthenticated) return true;
    return !hasRequiredRole(user, requiredProtection);
  };

  const getRedirectPath = () => {
    if (!isAuthenticated) return '/onboarding';
    
    // If user doesn't have required role, redirect to home
    if (!hasRequiredRole(user, requiredProtection)) {
      return '/home';
    }
    
    return null;
  };

  return {
    canAccess: canAccess(),
    shouldRedirect: shouldRedirect(),
    redirectPath: getRedirectPath(),
    isLoading,
  };
}

// Client-side permission hooks
export function usePermissions() {
  const { user } = useAuth();

  return {
    canViewPrograms: rolePermissions.canViewPrograms(user),
    canManageWorkItems: rolePermissions.canManageWorkItems(user),
    canManageUsers: rolePermissions.canManageUsers(user),
    canManageTeams: rolePermissions.canManageTeams(user),
    canViewAnalytics: rolePermissions.canViewAnalytics(user),
  };
}
