import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';

// Create mock functions using vi.hoisted
const {
  mockWorkItemFindFirst,
  mockWorkItemCreate,
  mockWorkItemUpdate,
  mockWorkItemDelete,
  mockWorkItemFindUnique,
  mockProgramFindFirst,
  mockMilestoneFindFirst,
  mockUserFindFirst,
  mockPartFindMany,
  mockIssueTypeFindFirst,
  mockDeliverableTypeFindFirst,
  mockTransaction,
  mockCommentDeleteMany,
  mockStatusLogDeleteMany,
  mockAttachmentDeleteMany,
  mockWorkItemToPartDeleteMany,
  mockIssueDetailDeleteMany,
  mockDeliverableDetailDeleteMany,
  mockStatusLogCreate,
  mockAuditLogCreate,
  mockEmailService,
} = vi.hoisted(() => {
  return {
    mockWorkItemFindFirst: vi.fn(),
    mockWorkItemCreate: vi.fn(),
    mockWorkItemUpdate: vi.fn(),
    mockWorkItemDelete: vi.fn(),
    mockWorkItemFindUnique: vi.fn(),
    mockProgramFindFirst: vi.fn(),
    mockMilestoneFindFirst: vi.fn(),
    mockUserFindFirst: vi.fn(),
    mockPartFindMany: vi.fn(),
    mockIssueTypeFindFirst: vi.fn(),
    mockDeliverableTypeFindFirst: vi.fn(),
    mockTransaction: vi.fn(),
    mockCommentDeleteMany: vi.fn(),
    mockStatusLogDeleteMany: vi.fn(),
    mockAttachmentDeleteMany: vi.fn(),
    mockWorkItemToPartDeleteMany: vi.fn(),
    mockIssueDetailDeleteMany: vi.fn(),
    mockDeliverableDetailDeleteMany: vi.fn(),
    mockStatusLogCreate: vi.fn(),
    mockAuditLogCreate: vi.fn(),
    mockEmailService: {
      sendWorkItemAssignmentEmail: vi.fn(),
      sendWorkItemStatusChangeEmail: vi.fn(),
    },
  };
});

// Mock Prisma Client
vi.mock('@prisma/client', () => {
  class MockPrismaClient {
    workItem = {
      findFirst: mockWorkItemFindFirst,
      findUnique: mockWorkItemFindUnique,
      create: mockWorkItemCreate,
      update: mockWorkItemUpdate,
      delete: mockWorkItemDelete,
    };
    program = {
      findFirst: mockProgramFindFirst,
    };
    milestone = {
      findFirst: mockMilestoneFindFirst,
    };
    user = {
      findFirst: mockUserFindFirst,
      findUnique: vi.fn().mockResolvedValue({ id: 'user-123', name: 'Test User' }),
    };
    part = {
      findMany: mockPartFindMany,
    };
    issueType = {
      findFirst: mockIssueTypeFindFirst,
    };
    deliverableType = {
      findFirst: mockDeliverableTypeFindFirst,
    };
    comment = {
      deleteMany: mockCommentDeleteMany,
    };
    statusLog = {
      deleteMany: mockStatusLogDeleteMany,
      create: mockStatusLogCreate,
    };
    attachment = {
      deleteMany: mockAttachmentDeleteMany,
    };
    workItemToPart = {
      deleteMany: mockWorkItemToPartDeleteMany,
    };
    issueDetail = {
      deleteMany: mockIssueDetailDeleteMany,
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    };
    deliverableDetail = {
      deleteMany: mockDeliverableDetailDeleteMany,
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    };
    $transaction = mockTransaction;
    $disconnect = vi.fn();
  }

  return {
    PrismaClient: MockPrismaClient,
  };
});

// Mock email service
vi.mock('../../lib/emailService', () => ({
  sendWorkItemAssignmentEmail: mockEmailService.sendWorkItemAssignmentEmail,
  sendWorkItemStatusChangeEmail: mockEmailService.sendWorkItemStatusChangeEmail,
  sendWorkItemCommentEmail: vi.fn(),
}));


// Mock audit logger
vi.mock('../../lib/auditLogger', () => ({
  logCreate: vi.fn(),
  logUpdate: vi.fn(),
  logDelete: vi.fn(),
  sanitizeForAudit: vi.fn((data) => data),
  getChangedFields: vi.fn((before, after) => ({})),
}));

// Import after mocks
import { createWorkItem, editWorkItem, deleteWorkItem } from '../workItemController';

describe('WorkItem Mutations', () => {
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
      send: vi.fn().mockReturnThis(),
    } as any;
  });

  describe('createWorkItem', () => {
    const validWorkItemData = {
      workItemType: 'Issue',
      title: 'Test Work Item',
      description: 'Test description',
      status: 'Open',
      priority: 'High',
      dueDate: '2024-12-31',
      estimatedCompletionDate: '2024-12-30',
      programId: 1,
      dueByMilestoneId: 1,
      authorUserId: 'user-123',
      assignedUserId: 'user-456',
    };

    it('should create a work item successfully', async () => {
      const mockCreatedWorkItem = {
        id: 1,
        ...validWorkItemData,
        dueDate: new Date(validWorkItemData.dueDate),
        estimatedCompletionDate: new Date(validWorkItemData.estimatedCompletionDate),
        program: { id: 1, name: 'Test Program' },
        dueByMilestone: { id: 1, name: 'Test Milestone' },
        authorUser: { id: 'user-123', name: 'Author' },
        assigneeUser: { id: 'user-456', name: 'Assignee', email: 'assignee@test.com' },
        partNumbers: [],
        comments: [],
        dependencies: [],
        deliverableDetail: null,
        issueDetail: null,
        attachments: [],
      };

      // Setup transaction mock
      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          program: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
          milestone: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
          user: {
            findFirst: vi.fn()
              .mockResolvedValueOnce({ id: 'user-123' }) // author
              .mockResolvedValueOnce({ id: 'user-456' }), // assignee
          },
          part: { findMany: vi.fn().mockResolvedValue([]) },
          issueType: { findFirst: vi.fn() },
          deliverableType: { findFirst: vi.fn() },
          workItem: {
            create: vi.fn().mockResolvedValue(mockCreatedWorkItem),
            findUnique: vi.fn().mockResolvedValue(mockCreatedWorkItem),
          },
          workItemDependency: {
            createMany: vi.fn(),
            findFirst: vi.fn(),
          },
          statusLog: { create: vi.fn() },
        };
        return callback(mockTx);
      });

      mockRequest.body = validWorkItemData;

      await createWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockTransaction).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 404 when program not found', async () => {
      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          program: { findFirst: vi.fn().mockResolvedValue(null) },
        };
        return callback(mockTx);
      });

      mockRequest.body = validWorkItemData;

      await createWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Program not found',
      });
    });

    it('should return 404 when author user not found', async () => {
      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          program: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
          milestone: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
          user: { findFirst: vi.fn().mockResolvedValue(null) },
        };
        return callback(mockTx);
      });

      mockRequest.body = validWorkItemData;

      await createWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Author user not found',
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockTransaction.mockRejectedValue(error);

      mockRequest.body = validWorkItemData;

      await createWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Error creating work item'),
        })
      );
    });
  });

  describe('editWorkItem', () => {
    const existingWorkItem = {
      id: 1,
      title: 'Original Title',
      status: 'Open',
      organizationId: 1,
      program: { id: 1 },
      authorUser: { id: 'user-123' },
      assigneeUser: { id: 'user-456' },
    };

    it('should update a work item successfully', async () => {
      const updates = {
        title: 'Updated Title',
        status: 'In Progress',
      };

      const updatedWorkItem = {
        ...existingWorkItem,
        ...updates,
        partNumbers: [],
        dependencies: [],
        program: existingWorkItem.program,
        dueByMilestone: { id: 1, name: 'Test Milestone' },
        authorUser: existingWorkItem.authorUser,
        assigneeUser: existingWorkItem.assigneeUser,
        deliverableDetail: null,
        issueDetail: null,
        attachments: [],
        comments: [],
      };

      mockWorkItemFindFirst.mockResolvedValueOnce(existingWorkItem);

      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          workItem: {
            findFirst: vi.fn().mockResolvedValue(existingWorkItem),
            findUnique: vi.fn().mockResolvedValue(updatedWorkItem),
            findMany: vi.fn().mockResolvedValue([]),
            update: vi.fn().mockResolvedValue(updatedWorkItem),
          },
          program: { findFirst: vi.fn() },
          milestone: { findFirst: vi.fn() },
          user: { findFirst: vi.fn() },
          part: { findMany: vi.fn() },
          workItemToPart: {
            deleteMany: vi.fn(),
            createMany: vi.fn(),
          },
          workItemDependency: {
            deleteMany: vi.fn(),
            createMany: vi.fn(),
            findMany: vi.fn().mockResolvedValue([]),
            findFirst: vi.fn().mockResolvedValue(null),
          },
          statusLog: { create: vi.fn() },
          issueDetail: {
            findUnique: vi.fn().mockResolvedValue(null),
            update: vi.fn(),
            create: vi.fn(),
          },
          deliverableDetail: {
            findUnique: vi.fn().mockResolvedValue(null),
            update: vi.fn(),
            create: vi.fn(),
          },
        };
        return callback(mockTx);
      });

      mockRequest.params = { workItemId: '1' };
      mockRequest.body = updates;

      await editWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockWorkItemFindFirst).toHaveBeenCalled();
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 404 when work item not found', async () => {
      mockWorkItemFindFirst.mockResolvedValue(null);

      mockRequest.params = { workItemId: '999' };
      mockRequest.body = { title: 'Updated Title' };

      await editWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Work item not found',
      });
    });

    it('should return 400 for invalid workItemId', async () => {
      mockRequest.params = { workItemId: 'invalid' };
      mockRequest.body = { title: 'Updated Title' };

      await editWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'workItemId must be a valid integer',
      });
    });
  });

  describe('deleteWorkItem', () => {
    const workItemToDelete = {
      id: 1,
      title: 'Work Item to Delete',
      workItemType: 'Issue',
      organizationId: 1,
      program: { id: 1 },
      authorUser: { id: 'user-123' },
      assigneeUser: { id: 'user-456' },
    };

    it('should delete a work item successfully', async () => {
      mockWorkItemFindFirst.mockResolvedValue(workItemToDelete);

      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          workItem: {
            findFirst: vi.fn().mockResolvedValue(workItemToDelete),
            delete: vi.fn(),
          },
          comment: { deleteMany: vi.fn() },
          statusLog: { deleteMany: vi.fn() },
          attachment: { deleteMany: vi.fn() },
          workItemToPart: { deleteMany: vi.fn() },
          issueDetail: { deleteMany: vi.fn() },
          deliverableDetail: { deleteMany: vi.fn() },
        };
        return callback(mockTx);
      });

      mockRequest.params = { workItemId: '1' };

      await deleteWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockWorkItemFindFirst).toHaveBeenCalled();
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Work item 1 deleted successfully.',
      });
    });

    it('should return 404 when work item not found', async () => {
      mockWorkItemFindFirst.mockResolvedValue(null);

      mockRequest.params = { workItemId: '999' };

      await deleteWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Work item not found',
      });
    });

    it('should return 400 for invalid workItemId', async () => {
      mockRequest.params = { workItemId: 'invalid' };

      await deleteWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'workItemId must be a valid integer',
      });
    });

    it('should handle transaction errors during deletion', async () => {
      mockWorkItemFindFirst.mockResolvedValue(workItemToDelete);

      const error = new Error('WORK_ITEM_NOT_FOUND');
      mockTransaction.mockRejectedValue(error);

      mockRequest.params = { workItemId: '1' };

      await deleteWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Work item not found',
      });
    });
  });
});
