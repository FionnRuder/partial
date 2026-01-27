import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../authenticate';

// Create mock functions using vi.hoisted to ensure they're available in mock factories
const { mockGetAuth, mockGetSession, mockFindFirst, mockLogAuthEvent, mockSetUserContext, mockGetAuthContext } = vi.hoisted(() => {
  return {
    mockGetAuth: vi.fn(),
    mockGetSession: vi.fn(),
    mockFindFirst: vi.fn(),
    mockLogAuthEvent: vi.fn(),
    mockSetUserContext: vi.fn(),
    mockGetAuthContext: vi.fn(),
  };
});

vi.mock('../../lib/auth', () => ({
  getAuth: () => mockGetAuth(),
}));

vi.mock('../../lib/authLogger', () => ({
  logAuthEvent: mockLogAuthEvent,
  AuthEventType: {
    SESSION_INVALID: 'SESSION_INVALID',
    ONBOARDING_REQUIRED: 'ONBOARDING_REQUIRED',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  },
  getAuthContext: mockGetAuthContext,
}));

vi.mock('../../lib/sentry', () => ({
  setUserContext: mockSetUserContext,
  clearUserContext: vi.fn(),
}));

vi.mock('@prisma/client', () => {
  // Create a proper class constructor
  class MockPrismaClient {
    user = {
      findFirst: mockFindFirst,
    };
  }

  return {
    PrismaClient: MockPrismaClient,
  };
});

vi.mock('better-auth/node', () => ({
  fromNodeHeaders: (headers: any) => headers,
}));

describe('authenticate middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNext = vi.fn();

    mockRequest = {
      headers: {},
      session: {
        destroy: vi.fn((callback) => callback(null)),
      },
    } as any;

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as any;

    mockGetAuthContext.mockReturnValue({
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
    });

    mockGetAuth.mockReturnValue({
      api: {
        getSession: mockGetSession,
      },
    });
  });

  it('should allow authenticated user with valid session', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    const mockUser = {
      id: 'user-123',
      organizationId: 1,
      role: 'ENGINEER',
      email: 'test@example.com',
    };

    mockGetSession.mockResolvedValue(mockSession);
    mockFindFirst.mockResolvedValue(mockUser);

    await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockGetSession).toHaveBeenCalled();
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      select: {
        id: true,
        organizationId: true,
        role: true,
        email: true,
      },
    });
    expect(mockRequest.auth).toEqual({
      userId: 'user-123',
      organizationId: 1,
      role: 'ENGINEER',
    });
    expect(mockSetUserContext).toHaveBeenCalledWith('user-123', 1, 'test@example.com');
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should reject request without valid session', async () => {
    mockGetSession.mockResolvedValue(null);

    await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Session expired or invalid. Please log in again.',
      requiresLogin: true,
    });
    expect(mockLogAuthEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'SESSION_INVALID',
        reason: 'No valid Better Auth session found',
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject request with session but no user', async () => {
    mockGetSession.mockResolvedValue({ user: null });

    await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Session expired or invalid. Please log in again.',
      requiresLogin: true,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle user authenticated but not found in database', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    mockGetSession.mockResolvedValue(mockSession);
    mockFindFirst.mockResolvedValue(null);

    await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User authenticated but not found in database. Please complete onboarding.',
      requiresOnboarding: true,
    });
    expect(mockLogAuthEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'ONBOARDING_REQUIRED',
        email: 'test@example.com',
        reason: 'User authenticated but not found in database',
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should destroy session when authentication fails', async () => {
    const mockDestroy = vi.fn((callback) => callback(null));
    mockRequest.session = {
      destroy: mockDestroy,
    } as any;

    mockGetSession.mockResolvedValue(null);

    await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockDestroy).toHaveBeenCalled();
  });

  it('should handle errors and pass to error handler', async () => {
    const error = new Error('Database error');
    mockGetSession.mockRejectedValue(error);

    await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
