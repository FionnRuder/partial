import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '@/lib/auth';

// Create mock functions using vi.hoisted to ensure they're available in mock factories
const { mockGetCurrentUser, mockSignUp, mockSignIn, mockSignOut, mockUpdateProfile, mockRefreshTokens, mockOnAuthStateChange } = vi.hoisted(() => {
  return {
    mockGetCurrentUser: vi.fn(),
    mockSignUp: vi.fn(),
    mockSignIn: vi.fn(),
    mockSignOut: vi.fn(),
    mockUpdateProfile: vi.fn(),
    mockRefreshTokens: vi.fn(),
    mockOnAuthStateChange: vi.fn(),
  };
});

vi.mock('@/lib/auth', () => ({
  authService: {
    getCurrentUser: mockGetCurrentUser,
    signUp: mockSignUp,
    signIn: mockSignIn,
    signOut: mockSignOut,
    updateUserProfile: mockUpdateProfile,
    refreshTokens: mockRefreshTokens,
    onAuthStateChange: mockOnAuthStateChange,
  },
}));

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  setUser: vi.fn(),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure window is defined for client-side checks
    if (typeof window === 'undefined') {
      (global as any).window = {};
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should provide loading state initially', async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    mockOnAuthStateChange.mockReturnValue(() => {});

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    // Initially should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });
  });

  it('should provide authenticated user when available', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
    };

    mockGetCurrentUser.mockResolvedValue(mockUser);
    mockOnAuthStateChange.mockReturnValue(() => {});

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should provide unauthenticated state when no user', async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    mockOnAuthStateChange.mockReturnValue(() => {});

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle sign up', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
    };

    mockGetCurrentUser.mockResolvedValue(null);
    mockSignUp.mockResolvedValue(mockUser);
    mockOnAuthStateChange.mockReturnValue(() => {});

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    await act(async () => {
      await result.current.signUp({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        phoneNumber: '1234567890',
        role: 'ENGINEER',
      });
    });

    expect(mockSignUp).toHaveBeenCalled();
  });

  it('should handle sign in', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
    };

    mockGetCurrentUser.mockResolvedValue(null);
    mockSignIn.mockResolvedValue(mockUser);
    mockOnAuthStateChange.mockReturnValue(() => {});

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    await act(async () => {
      await result.current.signIn({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mockSignIn).toHaveBeenCalled();
  });

  it('should handle sign out', async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    mockSignOut.mockResolvedValue(undefined);
    mockOnAuthStateChange.mockReturnValue(() => {});

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow();

    consoleSpy.mockRestore();
  });
});
