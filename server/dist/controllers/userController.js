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
exports.updateEmailPreferences = exports.getEmailPreferences = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const roles_1 = require("../lib/roles");
const auditLogger_1 = require("../lib/auditLogger");
const prisma = new client_1.PrismaClient();
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const users = yield prisma.user.findMany({
            where: { organizationId },
            include: {
                disciplineTeam: true,
                authoredWorkItems: {
                    where: { organizationId },
                },
                assignedWorkItems: {
                    where: { organizationId },
                },
                partNumbers: {
                    where: { organizationId },
                },
            },
        });
        res.json(users);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving users: ${error.message}` });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield prisma.user.findFirst({
            where: { id: userId, organizationId: req.auth.organizationId },
            include: {
                organization: true,
                disciplineTeam: true,
                authoredWorkItems: {
                    where: { organizationId: req.auth.organizationId },
                    include: {
                        program: true,
                        dueByMilestone: true,
                        assigneeUser: true,
                    },
                },
                assignedWorkItems: {
                    where: { organizationId: req.auth.organizationId },
                    include: {
                        program: true,
                        dueByMilestone: true,
                        authorUser: true,
                    },
                },
                partNumbers: {
                    where: { organizationId: req.auth.organizationId },
                },
            },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving user: ${error.message}` });
    }
});
exports.getUserById = getUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, name, email, phoneNumber, role, profilePictureUrl, disciplineTeamId } = req.body;
        // Validate required fields
        if (!username || !name || !email || !phoneNumber || !role) {
            res.status(400).json({
                message: "Missing required fields: username, name, email, phoneNumber, and role are required"
            });
            return;
        }
        // Check if user with this email or username already exists
        const existingUser = yield prisma.user.findFirst({
            where: {
                OR: [
                    {
                        AND: [
                            { organizationId: req.auth.organizationId },
                            { email }
                        ]
                    },
                    {
                        AND: [
                            { organizationId: req.auth.organizationId },
                            { username }
                        ]
                    }
                ]
            }
        });
        if (existingUser) {
            res.status(409).json({
                message: "User with this email or username already exists"
            });
            return;
        }
        if (disciplineTeamId) {
            const disciplineTeam = yield prisma.disciplineTeam.findFirst({
                where: {
                    id: Number(disciplineTeamId),
                    organizationId: req.auth.organizationId,
                },
            });
            if (!disciplineTeam) {
                res.status(404).json({ message: "Discipline team not found" });
                return;
            }
        }
        // Convert role to Prisma enum format (e.g., "Program Manager" -> "ProgramManager")
        const prismaRole = (0, roles_1.roleToPrismaEnum)(role);
        const user = yield prisma.user.create({
            data: {
                username,
                name,
                email,
                phoneNumber,
                role: prismaRole, // Use Prisma enum format
                profilePictureUrl: profilePictureUrl || null,
                disciplineTeamId: disciplineTeamId ? Number(disciplineTeamId) : null,
                organizationId: req.auth.organizationId,
            },
            include: {
                disciplineTeam: true,
            },
        });
        // Log user creation
        yield (0, auditLogger_1.logCreate)(req, "User", user.id, `User created: ${user.name} (${user.email}) with role ${role}`, (0, auditLogger_1.sanitizeForAudit)(user));
        res.status(201).json(user);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating user: ${error.message}` });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { name, phoneNumber, role, profilePictureUrl, disciplineTeamId, emailNotificationsEnabled, emailWorkItemAssignment, emailWorkItemStatusChange, emailWorkItemComment, emailInvitation, emailApproachingDeadline, } = req.body;
        if (disciplineTeamId !== undefined && disciplineTeamId !== null) {
            const disciplineTeam = yield prisma.disciplineTeam.findFirst({
                where: {
                    id: Number(disciplineTeamId),
                    organizationId: req.auth.organizationId,
                },
            });
            if (!disciplineTeam) {
                res.status(404).json({ message: "Discipline team not found" });
                return;
            }
        }
        // Get existing user before update for audit logging
        const existingUser = yield prisma.user.findFirst({
            where: { id: userId, organizationId: req.auth.organizationId },
            include: {
                disciplineTeam: true,
            },
        });
        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Convert role to Prisma enum format if provided
        const updateData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name && { name })), (phoneNumber && { phoneNumber })), (profilePictureUrl !== undefined && { profilePictureUrl })), (disciplineTeamId !== undefined && {
            disciplineTeamId: disciplineTeamId ? Number(disciplineTeamId) : null,
        })), (emailNotificationsEnabled !== undefined && { emailNotificationsEnabled: Boolean(emailNotificationsEnabled) })), (emailWorkItemAssignment !== undefined && { emailWorkItemAssignment: Boolean(emailWorkItemAssignment) })), (emailWorkItemStatusChange !== undefined && { emailWorkItemStatusChange: Boolean(emailWorkItemStatusChange) })), (emailWorkItemComment !== undefined && { emailWorkItemComment: Boolean(emailWorkItemComment) })), (emailInvitation !== undefined && { emailInvitation: Boolean(emailInvitation) })), (emailApproachingDeadline !== undefined && { emailApproachingDeadline: Boolean(emailApproachingDeadline) }));
        if (role) {
            // SECURITY: Only Admins, Managers, and Program Managers can update user roles
            const currentUserRole = req.auth.role || "";
            if (!(0, roles_1.canManageUsers)(currentUserRole)) {
                res.status(403).json({
                    message: "You do not have permission to update user roles. Only Admins, Managers, and Program Managers can update roles."
                });
                return;
            }
            // Validate role before updating
            if (!(0, roles_1.isValidRole)(role)) {
                res.status(400).json({
                    message: `Invalid role. Must be one of: Admin, Manager, Program Manager, Engineer, Viewer`
                });
                return;
            }
            updateData.role = (0, roles_1.roleToPrismaEnum)(role); // Convert to Prisma enum format
        }
        const updateResult = yield prisma.user.updateMany({
            where: { id: userId, organizationId: req.auth.organizationId },
            data: updateData,
        });
        if (updateResult.count === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const user = yield prisma.user.findFirst({
            where: { id: userId, organizationId: req.auth.organizationId },
            include: {
                organization: true,
                disciplineTeam: true,
            },
        });
        // Log user update
        if (user) {
            const changedFields = (0, auditLogger_1.getChangedFields)(existingUser, user);
            yield (0, auditLogger_1.logUpdate)(req, "User", user.id, `User updated: ${user.name} (${user.email})`, (0, auditLogger_1.sanitizeForAudit)(existingUser), (0, auditLogger_1.sanitizeForAudit)(user), changedFields);
        }
        res.json(user);
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res
            .status(500)
            .json({ message: `Error updating user: ${error.message}` });
    }
});
exports.updateUser = updateUser;
const getEmailPreferences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Users can only view their own preferences, or admins can view any
        const requestingUserId = req.auth.userId;
        const requestingUser = yield prisma.user.findUnique({
            where: { id: requestingUserId },
            select: { role: true },
        });
        if (userId !== requestingUserId && (requestingUser === null || requestingUser === void 0 ? void 0 : requestingUser.role) !== 'Admin') {
            res.status(403).json({ message: "You can only view your own email preferences" });
            return;
        }
        const user = yield prisma.user.findFirst({
            where: { id: userId, organizationId: req.auth.organizationId },
            select: {
                id: true,
                emailNotificationsEnabled: true,
                emailWorkItemAssignment: true,
                emailWorkItemStatusChange: true,
                emailWorkItemComment: true,
                emailInvitation: true,
                emailApproachingDeadline: true,
            },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving email preferences: ${error.message}` });
    }
});
exports.getEmailPreferences = getEmailPreferences;
const updateEmailPreferences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { emailNotificationsEnabled, emailWorkItemAssignment, emailWorkItemStatusChange, emailWorkItemComment, emailInvitation, emailApproachingDeadline, } = req.body;
        // Users can only update their own preferences, or admins can update any
        const requestingUserId = req.auth.userId;
        const requestingUser = yield prisma.user.findUnique({
            where: { id: requestingUserId },
            select: { role: true },
        });
        if (userId !== requestingUserId && (requestingUser === null || requestingUser === void 0 ? void 0 : requestingUser.role) !== 'Admin') {
            res.status(403).json({ message: "You can only update your own email preferences" });
            return;
        }
        const updateData = {};
        if (emailNotificationsEnabled !== undefined) {
            updateData.emailNotificationsEnabled = Boolean(emailNotificationsEnabled);
        }
        if (emailWorkItemAssignment !== undefined) {
            updateData.emailWorkItemAssignment = Boolean(emailWorkItemAssignment);
        }
        if (emailWorkItemStatusChange !== undefined) {
            updateData.emailWorkItemStatusChange = Boolean(emailWorkItemStatusChange);
        }
        if (emailWorkItemComment !== undefined) {
            updateData.emailWorkItemComment = Boolean(emailWorkItemComment);
        }
        if (emailInvitation !== undefined) {
            updateData.emailInvitation = Boolean(emailInvitation);
        }
        if (emailApproachingDeadline !== undefined) {
            updateData.emailApproachingDeadline = Boolean(emailApproachingDeadline);
        }
        const updateResult = yield prisma.user.updateMany({
            where: { id: userId, organizationId: req.auth.organizationId },
            data: updateData,
        });
        if (updateResult.count === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const user = yield prisma.user.findFirst({
            where: { id: userId, organizationId: req.auth.organizationId },
            select: {
                id: true,
                emailNotificationsEnabled: true,
                emailWorkItemAssignment: true,
                emailWorkItemStatusChange: true,
                emailWorkItemComment: true,
                emailInvitation: true,
                emailApproachingDeadline: true,
            },
        });
        res.json(user);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error updating email preferences: ${error.message}` });
    }
});
exports.updateEmailPreferences = updateEmailPreferences;
