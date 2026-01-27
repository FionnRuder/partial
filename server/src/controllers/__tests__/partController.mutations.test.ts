import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';

// Create mock functions using vi.hoisted
const {
  mockPartFindFirst,
  mockPartCreate,
  mockPartUpdate,
  mockPartDelete,
  mockProgramFindFirst,
  mockUserFindFirst,
  mockDisciplineTeamToProgramFindFirst,
  mockDisciplineTeamToProgramCreate,
  mockTransaction,
  mockAuditLogCreate,
} = vi.hoisted(() => {
  return {
    mockPartFindFirst: vi.fn(),
    mockPartCreate: vi.fn(),
    mockPartUpdate: vi.fn(),
    mockPartDelete: vi.fn(),
    mockProgramFindFirst: vi.fn(),
    mockUserFindFirst: vi.fn(),
    mockDisciplineTeamToProgramFindFirst: vi.fn(),
    mockDisciplineTeamToProgramCreate: vi.fn(),
    mockTransaction: vi.fn(),
    mockAuditLogCreate: vi.fn(),
  };
});

// Mock Prisma Client
vi.mock('@prisma/client', () => {
  class MockPrismaClient {
    part = {
      findFirst: mockPartFindFirst,
      create: mockPartCreate,
      update: mockPartUpdate,
      delete: mockPartDelete,
    };
    program = {
      findFirst: mockProgramFindFirst,
    };
    user = {
      findFirst: mockUserFindFirst,
    };
    disciplineTeamToProgram = {
      findFirst: mockDisciplineTeamToProgramFindFirst,
      create: mockDisciplineTeamToProgramCreate,
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
  logDelete: vi.fn(),
  sanitizeForAudit: vi.fn((data) => data),
  getChangedFields: vi.fn((before, after) => ({})),
}));

// Import after mocks
import { createPart, editPart } from '../partController';

describe('Part Mutations', () => {
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

  describe('createPart', () => {
    const validPartData = {
      code: 'PART-001',
      partName: 'Test Part',
      level: 1,
      state: 'Design',
      revisionLevel: 'A',
      assignedUserId: 'user-123',
      programId: 1,
    };

    it('should create a part successfully', async () => {
      const mockCreatedPart = {
        id: 1,
        ...validPartData,
        organizationId: 1,
      };

      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          program: {
            findFirst: vi.fn().mockResolvedValue({ id: 1, name: 'Test Program' }),
          },
          user: {
            findFirst: vi.fn()
              .mockResolvedValueOnce({ id: 'user-123', disciplineTeamId: 1 })
              .mockResolvedValueOnce({ id: 'user-123', disciplineTeamId: 1 }),
          },
          part: {
            create: vi.fn().mockResolvedValue(mockCreatedPart),
          },
          disciplineTeamToProgram: {
            findFirst: vi.fn().mockResolvedValue(null),
            create: vi.fn(),
          },
        };
        return callback(mockTx);
      });

      mockRequest.body = validPartData;

      await createPart(mockRequest as Request, mockResponse as Response);

      expect(mockTransaction).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedPart);
    });

    it('should return error when programId is invalid', async () => {
      mockRequest.body = {
        ...validPartData,
        programId: 'invalid',
      };

      await createPart(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Valid programId is required'),
        })
      );
    });

    it('should return error when program not found', async () => {
      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          program: {
            findFirst: vi.fn().mockResolvedValue(null),
          },
        };
        return callback(mockTx);
      });

      mockRequest.body = validPartData;

      await createPart(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Program not found'),
        })
      );
    });

    it('should return error when assigned user not found', async () => {
      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          program: {
            findFirst: vi.fn().mockResolvedValue({ id: 1 }),
          },
          user: {
            findFirst: vi.fn().mockResolvedValue(null),
          },
        };
        return callback(mockTx);
      });

      mockRequest.body = validPartData;

      await createPart(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Assigned user not found'),
        })
      );
    });

    it('should handle parent part validation', async () => {
      const partDataWithParent = {
        ...validPartData,
        parentId: 999,
      };

      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          program: {
            findFirst: vi.fn().mockResolvedValue({ id: 1 }),
          },
          user: {
            findFirst: vi.fn().mockResolvedValue({ id: 'user-123' }),
          },
          part: {
            findFirst: vi.fn().mockResolvedValue(null), // Parent not found
          },
        };
        return callback(mockTx);
      });

      mockRequest.body = partDataWithParent;

      await createPart(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Parent part not found'),
        })
      );
    });
  });

  describe('editPart', () => {
    const existingPart = {
      id: 1,
      code: 'PART-001',
      partName: 'Original Part Name',
      organizationId: 1,
      assignedUser: { id: 'user-123' },
      program: { id: 1 },
      parent: null,
    };

    it('should update a part successfully', async () => {
      const updates = {
        partName: 'Updated Part Name',
        state: 'Production',
      };

      const updatedPart = {
        ...existingPart,
        ...updates,
      };

      // Set up mock to return existingPart for the initial findFirst call
      mockPartFindFirst.mockResolvedValueOnce(existingPart);

      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          part: {
            findFirst: vi.fn().mockResolvedValue(existingPart),
            update: vi.fn().mockResolvedValue(updatedPart),
          },
          user: {
            findFirst: vi.fn(),
          },
          program: {
            findFirst: vi.fn(),
          },
        };
        return callback(mockTx);
      });

      mockRequest.params = { partId: '1' };
      mockRequest.body = updates;

      await editPart(mockRequest as Request, mockResponse as Response);

      expect(mockPartFindFirst).toHaveBeenCalled();
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 404 when part not found', async () => {
      // Mock findFirst to return null (part doesn't exist)
      // Use mockResolvedValueOnce since the function only calls findFirst once before transaction
      mockPartFindFirst.mockResolvedValueOnce(null);

      mockRequest.params = { partId: '999' };
      mockRequest.body = { partName: 'Updated Name' };

      await editPart(mockRequest as Request, mockResponse as Response);

      // Verify the mock was called
      expect(mockPartFindFirst).toHaveBeenCalled();
      
      // Verify 404 response was sent
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Part not found',
      });
      
      // Verify transaction was NOT called since part doesn't exist
      expect(mockTransaction).not.toHaveBeenCalled();
    });

    it('should handle validation errors for assignedUserId', async () => {
      // Ensure the part exists before transaction (first call)
      mockPartFindFirst.mockResolvedValueOnce(existingPart);

      // The transaction will throw "Assigned user not found" error
      // when user.findFirst returns null for the assignedUserId check
      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          part: {
            findFirst: vi.fn().mockResolvedValue(existingPart), // Part exists in transaction - MUST return existingPart
            update: vi.fn(),
          },
          user: {
            findFirst: vi.fn().mockResolvedValue(null), // Assigned user not found - this will cause error
          },
          program: {
            findFirst: vi.fn(),
          },
          disciplineTeamToProgram: {
            findFirst: vi.fn(),
            create: vi.fn(),
          },
        };
        
        // The callback will throw "Assigned user not found" when user.findFirst returns null
        // This error will be caught by the controller's try-catch and return 500
        try {
          return await callback(mockTx);
        } catch (error) {
          // Re-throw the error so it's caught by the controller's try-catch
          throw error;
        }
      });

      mockRequest.params = { partId: '1' };
      mockRequest.body = { assignedUserId: 'invalid-user' };

      await editPart(mockRequest as Request, mockResponse as Response);

      // The error thrown in transaction should be caught and return 500
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Error updating part'),
        })
      );
    });
  });
});
