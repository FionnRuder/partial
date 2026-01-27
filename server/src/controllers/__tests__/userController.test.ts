import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';

// Create mock Prisma methods using vi.hoisted to ensure they're available in the mock factory
const { mockUserFindFirst, mockAuditLogCreate } = vi.hoisted(() => {
  return {
    mockUserFindFirst: vi.fn(),
    mockAuditLogCreate: vi.fn(),
  };
});

// Mock Prisma Client - must be hoisted before any imports that use it
vi.mock('@prisma/client', () => {
  // Create a proper class constructor
  class MockPrismaClient {
    user = {
      findFirst: mockUserFindFirst,
      findMany: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
      findUnique: vi.fn(),
    };
    auditLog = {
      create: mockAuditLogCreate,
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    };
    $queryRaw = vi.fn();
    $disconnect = vi.fn();
  }

  return {
    PrismaClient: MockPrismaClient,
    UserRole: {},
    AuditAction: {},
  };
});

// Import after mock is set up
import { getUserById } from '../userController';

describe('getUserById', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockUserFindFirst.mockClear();
    mockAuditLogCreate.mockClear();

    // Setup mock request
    mockRequest = {
      params: { userId: 'user-123' },
      auth: { organizationId: 'org-123' },
    } as any;

    // Setup mock response
    mockResponse = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    } as any;
  });

  it('should return user when found', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      organizationId: 'org-123',
    };

    mockUserFindFirst.mockResolvedValue(mockUser);
    mockAuditLogCreate.mockResolvedValue({});

    await getUserById(mockRequest as Request, mockResponse as Response);

    expect(mockUserFindFirst).toHaveBeenCalledWith({
      where: {
        id: 'user-123',
        organizationId: 'org-123',
      },
      include: expect.any(Object),
    });
    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
  });

  it('should return 404 when user not found', async () => {
    mockUserFindFirst.mockResolvedValue(null);

    await getUserById(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User not found',
    });
  });

  it('should return 500 on database error', async () => {
    const error = new Error('Database connection failed');
    mockUserFindFirst.mockRejectedValue(error);

    await getUserById(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: expect.stringContaining('Error retrieving user'),
    });
  });
});
