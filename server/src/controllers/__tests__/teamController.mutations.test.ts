import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';

// Create mock functions using vi.hoisted
const {
  mockTeamFindFirst,
  mockTeamCreate,
  mockTeamUpdate,
  mockProgramFindMany,
  mockUserFindFirst,
  mockDisciplineTeamToProgramDeleteMany,
  mockDisciplineTeamToProgramCreateMany,
  mockTransaction,
} = vi.hoisted(() => {
  return {
    mockTeamFindFirst: vi.fn(),
    mockTeamCreate: vi.fn(),
    mockTeamUpdate: vi.fn(),
    mockProgramFindMany: vi.fn(),
    mockUserFindFirst: vi.fn(),
    mockDisciplineTeamToProgramDeleteMany: vi.fn(),
    mockDisciplineTeamToProgramCreateMany: vi.fn(),
    mockTransaction: vi.fn(),
  };
});

// Mock Prisma Client
vi.mock('@prisma/client', () => {
  class MockPrismaClient {
    disciplineTeam = {
      findFirst: mockTeamFindFirst,
      create: mockTeamCreate,
      update: mockTeamUpdate,
      findMany: vi.fn(),
    };
    program = {
      findMany: mockProgramFindMany,
      findFirst: vi.fn(),
    };
    user = {
      findFirst: mockUserFindFirst,
      update: vi.fn(),
    };
    disciplineTeamToProgram = {
      deleteMany: mockDisciplineTeamToProgramDeleteMany,
      createMany: mockDisciplineTeamToProgramCreateMany,
      findFirst: vi.fn(),
    };
    $transaction = mockTransaction;
    $disconnect = vi.fn();
  }

  return {
    PrismaClient: MockPrismaClient,
  };
});

// Mock audit logger
vi.mock('../../lib/auditLogger', () => ({
  logCreate: vi.fn(),
  logUpdate: vi.fn(),
  sanitizeForAudit: vi.fn((data) => data),
  getChangedFields: vi.fn((before, after) => ({})),
}));

// Import after mocks
import { createTeam, editTeam } from '../teamController';

describe('Team Mutations', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRequest = {
      body: {},
      params: {},
      auth: {
        userId: 'user-123',
        organizationId: 1,
      },
    } as any;

    mockResponse = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    } as any;
  });

  describe('createTeam', () => {
    const validTeamData = {
      name: 'Test Team',
      description: 'Test team description',
      teamManagerUserId: 'user-123',
      programIds: [1, 2],
    };

    it('should create a team successfully', async () => {
      const mockCreatedTeam = {
        id: 1,
        name: validTeamData.name,
        description: validTeamData.description,
        teamManagerUserId: validTeamData.teamManagerUserId,
        organizationId: 1,
        programs: [],
      };

      mockUserFindFirst.mockResolvedValue({
        id: 'user-123',
        name: 'Team Manager',
      });

      mockProgramFindMany.mockResolvedValue([
        { id: 1, name: 'Program 1' },
        { id: 2, name: 'Program 2' },
      ]);

      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          disciplineTeam: {
            create: vi.fn().mockResolvedValue(mockCreatedTeam),
          },
          user: {
            update: vi.fn().mockResolvedValue({}),
          },
        };
        return callback(mockTx);
      });

      mockRequest.body = validTeamData;

      await createTeam(mockRequest as Request, mockResponse as Response);

      expect(mockUserFindFirst).toHaveBeenCalled();
      expect(mockProgramFindMany).toHaveBeenCalled();
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should auto-assign current user as team manager if not provided', async () => {
      const teamDataWithoutManager = {
        name: 'Test Team',
        description: 'Test description',
        programIds: [],
      };

      const mockCreatedTeam = {
        id: 1,
        ...teamDataWithoutManager,
        teamManagerUserId: 'user-123', // Should be set to req.auth.userId
        organizationId: 1,
        programs: [],
      };

      mockUserFindFirst.mockResolvedValue({
        id: 'user-123',
        name: 'Current User',
      });

      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          disciplineTeam: {
            create: vi.fn().mockResolvedValue(mockCreatedTeam),
          },
          user: {
            update: vi.fn().mockResolvedValue({}),
          },
        };
        return callback(mockTx);
      });

      mockRequest.body = teamDataWithoutManager;

      await createTeam(mockRequest as Request, mockResponse as Response);

      expect(mockUserFindFirst).toHaveBeenCalled();
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should return 404 when team manager not found', async () => {
      mockUserFindFirst.mockResolvedValue(null);

      mockRequest.body = validTeamData;

      await createTeam(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Team manager not found',
      });
    });

    it('should return 400 when programs not found', async () => {
      mockUserFindFirst.mockResolvedValue({ id: 'user-123' });
      mockProgramFindMany.mockResolvedValue([{ id: 1 }]); // Only 1 program found, but 2 requested

      mockRequest.body = validTeamData;

      await createTeam(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'One or more programs not found or not accessible',
      });
    });
  });

  describe('editTeam', () => {
    const existingTeam = {
      id: 1,
      name: 'Original Team',
      description: 'Original description',
      teamManagerUserId: 'user-123',
      organizationId: 1,
      programs: [],
    };

    it('should update a team successfully', async () => {
      const updates = {
        name: 'Updated Team Name',
        description: 'Updated description',
      };

      const updatedTeam = {
        ...existingTeam,
        ...updates,
        teamManagerUsername: 'manager',
        teamManagerName: 'Manager Name',
        programs: [],
      };

      mockTeamFindFirst.mockResolvedValue(existingTeam);

      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          disciplineTeam: {
            update: vi.fn().mockResolvedValue(updatedTeam),
            findUnique: vi.fn().mockResolvedValue(updatedTeam),
          },
          disciplineTeamToProgram: {
            deleteMany: vi.fn(),
            createMany: vi.fn(),
          },
          user: {
            findFirst: vi.fn().mockResolvedValue({
              username: 'manager',
              name: 'Manager Name',
            }),
          },
        };
        return callback(mockTx);
      });

      mockRequest.params = { teamId: '1' };
      mockRequest.body = updates;

      await editTeam(mockRequest as Request, mockResponse as Response);

      expect(mockTeamFindFirst).toHaveBeenCalled();
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should update team with program assignments', async () => {
      const updates = {
        name: 'Updated Team',
        programIds: [1, 2],
      };

      mockTeamFindFirst.mockResolvedValue(existingTeam);
      mockProgramFindMany.mockResolvedValue([
        { id: 1, name: 'Program 1' },
        { id: 2, name: 'Program 2' },
      ]);

      const mockDeleteMany = vi.fn();
      const mockCreateMany = vi.fn();

      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          disciplineTeam: {
            update: vi.fn().mockResolvedValue(existingTeam),
            findUnique: vi.fn().mockResolvedValue({
              ...existingTeam,
              programs: [],
            }),
          },
          disciplineTeamToProgram: {
            deleteMany: mockDeleteMany,
            createMany: mockCreateMany,
          },
          user: {
            findFirst: vi.fn().mockResolvedValue(null),
          },
        };
        return callback(mockTx);
      });

      mockRequest.params = { teamId: '1' };
      mockRequest.body = updates;

      await editTeam(mockRequest as Request, mockResponse as Response);

      expect(mockDeleteMany).toHaveBeenCalled();
      expect(mockCreateMany).toHaveBeenCalled();
    });

    it('should return 404 when team not found', async () => {
      mockTeamFindFirst.mockResolvedValue(null);

      mockRequest.params = { teamId: '999' };
      mockRequest.body = { name: 'Updated Name' };

      await editTeam(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Team not found',
      });
    });

    it('should handle validation errors', async () => {
      mockTeamFindFirst.mockResolvedValue(existingTeam);

      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          disciplineTeam: {
            update: vi.fn().mockRejectedValue(new Error('Validation error')),
          },
        };
        return callback(mockTx);
      });

      mockRequest.params = { teamId: '1' };
      mockRequest.body = { name: 'Updated Name' };

      await editTeam(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Error updating team'),
        })
      );
    });
  });
});
