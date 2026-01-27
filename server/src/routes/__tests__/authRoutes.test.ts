import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import authRoutes from '../authRoutes';

// Create mock functions using vi.hoisted to ensure they're available in mock factories
const { mockGetAuth, mockGetSession, mockFindUnique, mockGetAuthHandler } = vi.hoisted(() => {
  return {
    mockGetAuth: vi.fn(),
    mockGetSession: vi.fn(),
    mockFindUnique: vi.fn(),
    mockGetAuthHandler: vi.fn(),
  };
});

vi.mock('../../lib/auth', () => ({
  getAuth: () => mockGetAuth(),
  getAuthHandler: () => mockGetAuthHandler(),
}));

vi.mock('@prisma/client', () => {
  // Create a proper class constructor
  class MockPrismaClient {
    user = {
      findUnique: mockFindUnique,
    };
  }

  return {
    PrismaClient: MockPrismaClient,
  };
});

vi.mock('better-auth/node', () => ({
  fromNodeHeaders: (headers: any) => headers,
}));

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetAuth.mockReturnValue({
      api: {
        getSession: mockGetSession,
      },
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user when authenticated', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        organization: { id: 1, name: 'Test Org' },
        disciplineTeam: null,
      };

      mockGetSession.mockResolvedValue(mockSession);
      mockFindUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/auth/me')
        .set('Cookie', 'session=valid-session')
        .expect(200);

      expect(response.body).toEqual(mockUser);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        include: {
          organization: true,
          disciplineTeam: true,
        },
      });
    });

    it('should return 401 when session is invalid', async () => {
      mockGetSession.mockResolvedValue(null);

      const response = await request(app)
        .get('/auth/me')
        .expect(401);

      expect(response.body).toEqual({
        message: 'Session expired or invalid. Please log in again.',
        requiresLogin: true,
      });
    });

    it('should return 404 when user not found', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      };

      mockGetSession.mockResolvedValue(mockSession);
      mockFindUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/auth/me')
        .expect(404);

      expect(response.body).toEqual({
        message: 'User not found',
      });
    });

    it('should handle errors gracefully', async () => {
      mockGetSession.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/auth/me')
        .expect(500);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Error retrieving user');
    });
  });

  describe('Better Auth handler routes', () => {
    it('should delegate to Better Auth handler for other routes', async () => {
      const mockHandler = vi.fn((req, res, next) => {
        res.status(200).json({ message: 'Better Auth handled' });
      });

      mockGetAuthHandler.mockResolvedValue(mockHandler);

      const response = await request(app)
        .post('/auth/sign-in')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(200);

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should handle Better Auth handler errors', async () => {
      // Make getAuthHandler throw an error (which the try-catch will catch)
      mockGetAuthHandler.mockRejectedValue(new Error('Auth handler error'));

      const response = await request(app)
        .post('/auth/sign-in')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Authentication service error');
    });
  });
});
