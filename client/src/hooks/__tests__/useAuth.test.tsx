import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRouteGuard, usePermissions } from '../useAuth';
import { RouteProtection } from '@/lib/auth-guards';

// Mock AuthContext
const mockUseAuth = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('useRouteGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow access to public routes', () => {
    // PUBLIC routes should allow access regardless of authentication status
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    const { result } = renderHook(() => useRouteGuard(RouteProtection.PUBLIC));

    // PUBLIC routes allow access even without a user
    expect(result.current.canAccess).toBe(true);
    expect(result.current.shouldRedirect).toBe(false);
    expect(result.current.redirectPath).toBeNull();
  });

  it('should require authentication for protected routes', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    const { result } = renderHook(() => useRouteGuard(RouteProtection.AUTHENTICATED));

    expect(result.current.canAccess).toBe(false);
    expect(result.current.shouldRedirect).toBe(true);
    expect(result.current.redirectPath).toBe('/onboarding');
  });

  it('should allow authenticated users to access protected routes', () => {
    const mockUser = {
      id: 'user-123',
      role: 'ENGINEER',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useRouteGuard(RouteProtection.AUTHENTICATED));

    expect(result.current.canAccess).toBe(true);
    expect(result.current.shouldRedirect).toBe(false);
    expect(result.current.redirectPath).toBeNull();
  });

  it('should require engineer role for engineer-only routes', () => {
    const mockUser = {
      id: 'user-123',
      role: 'Program Manager',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useRouteGuard(RouteProtection.ENGINEER_ONLY));

    expect(result.current.canAccess).toBe(false);
    expect(result.current.shouldRedirect).toBe(true);
    expect(result.current.redirectPath).toBe('/home');
  });

  it('should allow engineers to access engineer-only routes', () => {
    const mockUser = {
      id: 'user-123',
      role: 'Engineer',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useRouteGuard(RouteProtection.ENGINEER_ONLY));

    expect(result.current.canAccess).toBe(true);
    expect(result.current.shouldRedirect).toBe(false);
  });

  it('should require program manager role for PM routes', () => {
    const mockUser = {
      id: 'user-123',
      role: 'Engineer',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useRouteGuard(RouteProtection.PROGRAM_MANAGER_ONLY));

    expect(result.current.canAccess).toBe(false);
    expect(result.current.shouldRedirect).toBe(true);
    expect(result.current.redirectPath).toBe('/home');
  });

  it('should allow program managers to access PM routes', () => {
    const mockUser = {
      id: 'user-123',
      role: 'Program Manager',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useRouteGuard(RouteProtection.PROGRAM_MANAGER_ONLY));

    expect(result.current.canAccess).toBe(true);
    expect(result.current.shouldRedirect).toBe(false);
  });

  it('should not redirect while loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });

    const { result } = renderHook(() => useRouteGuard(RouteProtection.AUTHENTICATED));

    expect(result.current.canAccess).toBe(false);
    expect(result.current.shouldRedirect).toBe(false);
  });
});

describe('usePermissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return correct permissions for engineer', () => {
    const mockUser = {
      id: 'user-123',
      role: 'Engineer',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.canViewPrograms).toBe(false);
    expect(result.current.canManageWorkItems).toBe(true);
    expect(result.current.canManageUsers).toBe(false);
    expect(result.current.canManageTeams).toBe(false);
    expect(result.current.canViewAnalytics).toBe(false);
  });

  it('should return correct permissions for program manager', () => {
    const mockUser = {
      id: 'user-123',
      role: 'Program Manager',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.canViewPrograms).toBe(true);
    expect(result.current.canManageWorkItems).toBe(true);
    expect(result.current.canManageUsers).toBe(true);
    expect(result.current.canManageTeams).toBe(true);
    expect(result.current.canViewAnalytics).toBe(true);
  });

  it('should return falsy values for all permissions when user is null', () => {
    mockUseAuth.mockReturnValue({
      user: null,
    });

    const { result } = renderHook(() => usePermissions());

    // The functions return null (falsy) when user is null, not false
    expect(result.current.canViewPrograms).toBeFalsy();
    expect(result.current.canManageWorkItems).toBeFalsy();
    expect(result.current.canManageUsers).toBeFalsy();
    expect(result.current.canManageTeams).toBeFalsy();
    expect(result.current.canViewAnalytics).toBeFalsy();
  });
});
