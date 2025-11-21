import { Request, Response } from "express";
import { PrismaClient, Priority } from "@prisma/client";

const prisma = new PrismaClient();

// Create feedback (any authenticated user can submit)
export const createFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, title, description, priority } = req.body;

    // Validate required fields
    if (!type || !title || !description) {
      res.status(400).json({ 
        message: "Missing required fields: type, title, and description are required" 
      });
      return;
    }

    // Validate feedback type
    const validTypes = ["bug", "feature", "improvement"];
    if (!validTypes.includes(type)) {
      res.status(400).json({ 
        message: `Invalid type. Must be one of: ${validTypes.join(", ")}` 
      });
      return;
    }

    // Validate priority if provided
    const validPriorities = ["Urgent", "High", "Medium", "Low", "Backlog"];
    let priorityValue: Priority = Priority.Medium;
    if (priority) {
      if (!validPriorities.includes(priority)) {
        res.status(400).json({ 
          message: `Invalid priority. Must be one of: ${validPriorities.join(", ")}` 
        });
        return;
      }
      priorityValue = priority as Priority;
    }

    const feedback = await prisma.feedback.create({
      data: {
        organizationId: req.auth.organizationId,
        type,
        title,
        description,
        status: "open",
        priority: priorityValue,
        submittedByUserId: req.auth.userId,
      },
      include: {
        submittedBy: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(feedback);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating feedback: ${error.message}` });
  }
};

// Get all feedback (admins and managers only)
export const getFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    const { status, type, priority } = req.query;

    const where: any = { organizationId };
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (priority) {
      where.priority = priority;
    }

    const feedback = await prisma.feedback.findMany({
      where,
      include: {
        submittedBy: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
        resolvedBy: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { priority: "asc" }, // Urgent first, then High, Medium, Low, Backlog
        { createdAt: "desc" },
      ],
    });

    res.json(feedback);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving feedback: ${error.message}` });
  }
};

// Get feedback by ID (admins and managers only)
export const getFeedbackById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    
    const feedback = await prisma.feedback.findFirst({
      where: { 
        id: Number(id), 
        organizationId: req.auth.organizationId 
      },
      include: {
        submittedBy: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
        resolvedBy: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!feedback) {
      res.status(404).json({ message: "Feedback not found" });
      return;
    }

    res.json(feedback);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving feedback: ${error.message}` });
  }
};

// Update feedback status (admins and managers only)
export const updateFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, adminNotes, priority } = req.body;

    const validStatuses = ["open", "in_progress", "resolved", "closed"];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
      });
      return;
    }

    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
      
      // Set resolvedAt and resolvedBy when status changes to resolved or closed
      if (status === "resolved" || status === "closed") {
        updateData.resolvedAt = new Date();
        updateData.resolvedByUserId = req.auth.userId;
      } else {
        // Clear resolved info if status changes back to open or in_progress
        updateData.resolvedAt = null;
        updateData.resolvedByUserId = null;
      }
    }
    
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    
    if (priority) {
      const validPriorities = ["Urgent", "High", "Medium", "Low", "Backlog"];
      if (!validPriorities.includes(priority)) {
        res.status(400).json({ 
          message: `Invalid priority. Must be one of: ${validPriorities.join(", ")}` 
        });
        return;
      }
      updateData.priority = priority as Priority;
    }

    const feedback = await prisma.feedback.updateMany({
      where: { 
        id: Number(id), 
        organizationId: req.auth.organizationId 
      },
      data: updateData,
    });

    if (feedback.count === 0) {
      res.status(404).json({ message: "Feedback not found" });
      return;
    }

    // Fetch updated feedback
    const updatedFeedback = await prisma.feedback.findFirst({
      where: { 
        id: Number(id), 
        organizationId: req.auth.organizationId 
      },
      include: {
        submittedBy: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
        resolvedBy: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(updatedFeedback);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating feedback: ${error.message}` });
  }
};

// Get user's own feedback (any authenticated user)
export const getMyFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const feedback = await prisma.feedback.findMany({
      where: { 
        organizationId: req.auth.organizationId,
        submittedByUserId: req.auth.userId,
      },
      include: {
        submittedBy: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
        resolvedBy: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(feedback);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving feedback: ${error.message}` });
  }
};

// Get unread feedback count (admins only) - feedback with status "open" or "in_progress"
export const getUnreadFeedbackCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    
    const count = await prisma.feedback.count({
      where: {
        organizationId,
        status: {
          in: ["open", "in_progress"],
        },
      },
    });

    res.json({ count });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving unread feedback count: ${error.message}` });
  }
};

