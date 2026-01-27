"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadFeedbackCount = exports.getMyFeedback = exports.updateFeedback = exports.getFeedbackById = exports.getFeedback = exports.createFeedback = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create feedback (any authenticated user can submit)
const createFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let priorityValue = client_1.Priority.Medium;
        if (priority) {
            if (!validPriorities.includes(priority)) {
                res.status(400).json({
                    message: `Invalid priority. Must be one of: ${validPriorities.join(", ")}`
                });
                return;
            }
            priorityValue = priority;
        }
        const feedback = yield prisma.feedback.create({
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
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.status(201).json(feedback);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating feedback: ${error.message}` });
    }
});
exports.createFeedback = createFeedback;
// Get all feedback (admins and managers only)
const getFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const { status, type, priority } = req.query;
        const where = { organizationId };
        if (status) {
            where.status = status;
        }
        if (type) {
            where.type = type;
        }
        if (priority) {
            where.priority = priority;
        }
        const feedback = yield prisma.feedback.findMany({
            where,
            include: {
                submittedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                resolvedBy: {
                    select: {
                        id: true,
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
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving feedback: ${error.message}` });
    }
});
exports.getFeedback = getFeedback;
// Get feedback by ID (admins and managers only)
const getFeedbackById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const feedback = yield prisma.feedback.findFirst({
            where: {
                id: Number(id),
                organizationId: req.auth.organizationId
            },
            include: {
                submittedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                resolvedBy: {
                    select: {
                        id: true,
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
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving feedback: ${error.message}` });
    }
});
exports.getFeedbackById = getFeedbackById;
// Update feedback status (admins and managers only)
const updateFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updateData = {};
        if (status) {
            updateData.status = status;
            // Set resolvedAt and resolvedBy when status changes to resolved or closed
            if (status === "resolved" || status === "closed") {
                updateData.resolvedAt = new Date();
                updateData.resolvedByUserId = req.auth.userId;
            }
            else {
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
            updateData.priority = priority;
        }
        const feedback = yield prisma.feedback.updateMany({
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
        const updatedFeedback = yield prisma.feedback.findFirst({
            where: {
                id: Number(id),
                organizationId: req.auth.organizationId
            },
            include: {
                submittedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                resolvedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.json(updatedFeedback);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error updating feedback: ${error.message}` });
    }
});
exports.updateFeedback = updateFeedback;
// Get user's own feedback (any authenticated user)
const getMyFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedback = yield prisma.feedback.findMany({
            where: {
                organizationId: req.auth.organizationId,
                submittedByUserId: req.auth.userId,
            },
            include: {
                submittedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                resolvedBy: {
                    select: {
                        id: true,
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
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving feedback: ${error.message}` });
    }
});
exports.getMyFeedback = getMyFeedback;
// Get unread feedback count (admins only) - feedback with status "open" or "in_progress"
const getUnreadFeedbackCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const count = yield prisma.feedback.count({
            where: {
                organizationId,
                status: {
                    in: ["open", "in_progress"],
                },
            },
        });
        res.json({ count });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving unread feedback count: ${error.message}` });
    }
});
exports.getUnreadFeedbackCount = getUnreadFeedbackCount;
