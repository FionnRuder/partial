"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, authService } from '@/lib/auth';

// Authentication context
interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (data: { email: string; password: string; name: string; phoneNumber: string; role: string }) => Promise<AuthUser>;
  signIn: (data: { email: string; password: string }) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<AuthUser>;
  refreshTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (data: { email: string; password: string; name: string; phoneNumber: string; role: string }) => {
    setIsLoading(true);
    try {
      const newUser = await authService.signUp(data);
      setUser(newUser);
      return newUser;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const user = await authService.signIn(data);
      setUser(user);
      return user;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      const updatedUser = await authService.updateUserProfile(updates);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const refreshTokens = async () => {
    try {
      await authService.refreshTokens();
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, sign out the user
      await signOut();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshTokens,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use authentication context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for authentication state
export function useAuthState() {
  const { user, isLoading, isAuthenticated } = useAuth();
  return { user, isLoading, isAuthenticated };
}

// Hook for authentication actions
export function useAuthActions() {
  const { signUp, signIn, signOut, updateProfile, refreshTokens } = useAuth();
  return { signUp, signIn, signOut, updateProfile, refreshTokens };
}

// Higher-order component for protected routes
interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireRole?: string;
}

export function ProtectedRoute({ children, fallback, requireRole }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (requireRole && user?.role !== requireRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook for role-based access control
export function useRoleAccess() {
  const { user } = useAuth();

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const isEngineer = () => {
    return user?.role === 'Engineer' || user?.role === 'Design Engineer' || user?.role === 'Electrical Eng' || user?.role === 'Mechanical Eng' || user?.role === 'Test Engineer';
  };

  const isProgramManager = () => {
    return user?.role === 'Program Manager' || user?.role === 'Project Manager';
  };

  const canAccessProgramManagement = () => {
    return isProgramManager();
  };

  const canManageWorkItems = () => {
    return isEngineer() || isProgramManager();
  };

  return {
    hasRole,
    isEngineer,
    isProgramManager,
    canAccessProgramManagement,
    canManageWorkItems,
  };
}
