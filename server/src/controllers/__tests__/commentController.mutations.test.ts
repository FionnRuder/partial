import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';

// Create mock functions using vi.hoisted
const {
  mockWorkItemFindFirst,
  mockUserFindFirst,
  mockCommentCreate,
  mockCommentUpdate,
  mockCommentDeleteMany,
  mockCommentFindFirst,
} = vi.hoisted(() => {
  return {
    mockWorkItemFindFirst: vi.fn(),
    mockUserFindFirst: vi.fn(),
    mockCommentCreate: vi.fn(),
    mockCommentUpdate: vi.fn(),
    mockCommentDeleteMany: vi.fn(),
    mockCommentFindFirst: vi.fn(),
  };
});

// Mock Prisma Client
vi.mock('@prisma/client', () => {
  class MockPrismaClient {
    comment = {
      create: mockCommentCreate,
      update: mockCommentUpdate,
      deleteMany: mockCommentDeleteMany,
      findFirst: mockCommentFindFirst,
    };
    workItem = {
      findFirst: mockWorkItemFindFirst,
    };
    user = {
      findFirst: mockUserFindFirst,
    };
    $disconnect = vi.fn();
  }

  return {
    PrismaClient: MockPrismaClient,
  };
});

// Mock email service
vi.mock('../../lib/emailService', () => ({
  sendWorkItemCommentEmail: vi.fn(),
}));

// Import after mocks
import {
  createCommentForWorkItem,
  updateCommentForWorkItem,
  deleteCommentForWorkItem,
} from '../workItemController';

describe('Comment Mutations', () => {
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

  describe('createCommentForWorkItem', () => {
    const validCommentData = {
      text: 'This is a test comment',
      commenterUserId: 'user-123',
    };

    const mockWorkItem = {
      id: 1,
      title: 'Test Work Item',
      assigneeUser: { id: 'user-456', email: 'assignee@test.com', name: 'Assignee' },
      authorUser: { id: 'user-789', email: 'author@test.com', name: 'Author' },
    };

    it('should create a comment successfully', async () => {
      const mockCreatedComment = {
        id: 1,
        text: validCommentData.text,
        commenterUserId: validCommentData.commenterUserId,
        workItemId: 1,
        organizationId: 1,
        commenterUser: {
          id: 'user-123',
          name: 'Commenter',
        },
      };

      mockWorkItemFindFirst.mockResolvedValue(mockWorkItem);
      mockUserFindFirst.mockResolvedValue({
        id: 'user-123',
        name: 'Commenter',
      });
      mockCommentCreate.mockResolvedValue(mockCreatedComment);

      mockRequest.params = { workItemId: '1' };
      mockRequest.body = validCommentData;

      await createCommentForWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockWorkItemFindFirst).toHaveBeenCalled();
      expect(mockUserFindFirst).toHaveBeenCalled();
      expect(mockCommentCreate).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedComment);
    });

    it('should return 400 when text is missing', async () => {
      mockRequest.params = { workItemId: '1' };
      mockRequest.body = { commenterUserId: 'user-123' };

      await createCommentForWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Comment text is required.',
      });
    });

    it('should return 400 when commenterUserId is missing', async () => {
      mockRequest.params = { workItemId: '1' };
      mockRequest.body = { text: 'Test comment' };

      await createCommentForWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'commenterUserId is required.',
      });
    });

    it('should return 404 when work item not found', async () => {
      mockWorkItemFindFirst.mockResolvedValue(null);

      mockRequest.params = { workItemId: '999' };
      mockRequest.body = validCommentData;

      await createCommentForWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Work item not found',
      });
    });

    it('should return 404 when commenter user not found', async () => {
      mockWorkItemFindFirst.mockResolvedValue(mockWorkItem);
      mockUserFindFirst.mockResolvedValue(null);

      mockRequest.params = { workItemId: '1' };
      mockRequest.body = validCommentData;

      await createCommentForWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User not found',
      });
    });
  });

  describe('updateCommentForWorkItem', () => {
    const existingComment = {
      id: 1,
      text: 'Original comment text',
      commenterUserId: 'user-123',
      workItemId: 1,
      organizationId: 1,
    };

    it('should update a comment successfully', async () => {
      const updatedComment = {
        ...existingComment,
        text: 'Updated comment text',
        commenterUser: {
          id: 'user-123',
          name: 'Commenter',
        },
      };

      mockCommentFindFirst.mockResolvedValue(existingComment);
      mockCommentUpdate.mockResolvedValue(updatedComment);

      mockRequest.params = { workItemId: '1', commentId: '1' };
      mockRequest.body = {
        text: 'Updated comment text',
        requesterUserId: 'user-123',
      };

      await updateCommentForWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockCommentFindFirst).toHaveBeenCalled();
      expect(mockCommentUpdate).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(updatedComment);
    });

    it('should return 403 when user tries to edit another user\'s comment', async () => {
      mockCommentFindFirst.mockResolvedValue(existingComment);

      mockRequest.params = { workItemId: '1', commentId: '1' };
      mockRequest.body = {
        text: 'Updated text',
        requesterUserId: 'user-456', // Different user
      };

      await updateCommentForWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'You can only edit your own comments.',
      });
    });

    it('should return 404 when comment not found', async () => {
      mockCommentFindFirst.mockResolvedValue(null);

      mockRequest.params = { workItemId: '1', commentId: '999' };
      mockRequest.body = {
        text: 'Updated text',
        requesterUserId: 'user-123',
      };

      await updateCommentForWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Comment not found for this work item.',
      });
    });
  });

  describe('deleteCommentForWorkItem', () => {
    const existingComment = {
      id: 1,
      text: 'Comment to delete',
      commenterUserId: 'user-123',
      workItemId: 1,
      organizationId: 1,
    };

    it('should delete a comment successfully', async () => {
      mockCommentFindFirst.mockResolvedValue(existingComment);
      mockCommentDeleteMany.mockResolvedValue({ count: 1 });

      mockRequest.params = { workItemId: '1', commentId: '1' };
      mockRequest.body = { requesterUserId: 'user-123' };

      await deleteCommentForWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockCommentFindFirst).toHaveBeenCalled();
      expect(mockCommentDeleteMany).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 403 when user tries to delete another user\'s comment', async () => {
      mockCommentFindFirst.mockResolvedValue(existingComment);

      mockRequest.params = { workItemId: '1', commentId: '1' };
      mockRequest.body = { requesterUserId: 'user-456' }; // Different user

      await deleteCommentForWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'You can only delete your own comments.',
      });
    });

    it('should return 404 when comment not found', async () => {
      mockCommentFindFirst.mockResolvedValue(null);

      mockRequest.params = { workItemId: '1', commentId: '999' };
      mockRequest.body = { requesterUserId: 'user-123' };

      await deleteCommentForWorkItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Comment not found for this work item.',
      });
    });
  });
});
