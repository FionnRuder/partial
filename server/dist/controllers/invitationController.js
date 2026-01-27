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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeInvitation = exports.getInvitations = exports.acceptInvitation = exports.validateInvitation = exports.createInvitation = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const roles_1 = require("../lib/roles");
const emailService_1 = require("../lib/emailService");
const auditLogger_1 = require("../lib/auditLogger");
const prisma = new client_1.PrismaClient();
/**
 * Generate a cryptographically secure random token
 * Uses crypto.randomBytes for security (not Math.random)
 */
function generateSecureToken() {
    // Generate 32 random bytes (256 bits) and convert to base64url
    // Base64url is URL-safe (no +, /, or = padding issues)
    return crypto_1.default.randomBytes(32).toString('base64url');
}
/**
 * Create a new invitation
 * Only authorized users (admins/managers) can create invitations
 */
const createInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invitedEmail, role, expiresInDays } = req.body;
        const organizationId = req.auth.organizationId;
        const createdByUserId = req.auth.userId;
        const creatorRole = req.auth.role;
        // Check if user has permission to create invitations
        if (!(0, roles_1.canCreateInvitations)(creatorRole)) {
            res.status(403).json({
                message: "You do not have permission to create invitations. Only admins and managers can invite users."
            });
            return;
        }
        // Validate required fields
        if (!role) {
            res.status(400).json({
                message: "Missing required field: role is required"
            });
            return;
        }
        // Validate role is valid
        if (!(0, roles_1.isValidRole)(role)) {
            res.status(400).json({
                message: `Invalid role. Must be one of: ${roles_1.VALID_ROLES.join(', ')}`
            });
            return;
        }
        // Validate email format if provided
        if (invitedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invitedEmail)) {
            res.status(400).json({
                message: "Invalid email format"
            });
            return;
        }
        // Check if email is already a user in this organization
        if (invitedEmail) {
            const existingUser = yield prisma.user.findFirst({
                where: {
                    email: invitedEmail,
                    organizationId: organizationId,
                },
            });
            if (existingUser) {
                res.status(409).json({
                    message: "A user with this email already exists in your organization"
                });
                return;
            }
        }
        // Set expiration (default 7 days, max 30 days)
        const days = Math.min(Math.max(1, expiresInDays || 7), 30);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);
        // Generate secure token
        const token = generateSecureToken();
        // Create invitation
        // Convert role display name to Prisma enum value (e.g., "Program Manager" -> "ProgramManager")
        const prismaRole = (0, roles_1.roleToPrismaEnum)(role);
        // Use type assertion to bypass Prisma client type checking
        // The database already uses UserRole enum, but Prisma client needs regeneration
        const invitation = yield prisma.invitation.create({
            data: {
                organizationId,
                token,
                invitedEmail: invitedEmail || null,
                role: prismaRole, // This is already the correct enum value (e.g., "Manager", "ProgramManager")
                expiresAt,
                createdByUserId,
            },
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        // Send invitation email if email is provided
        if (invitation.invitedEmail) {
            try {
                // Try to find user by email to check preferences (if they exist)
                const existingUser = invitation.invitedEmail
                    ? yield prisma.user.findFirst({
                        where: {
                            email: invitation.invitedEmail,
                            organizationId: invitation.organizationId,
                        },
                        select: { id: true },
                    })
                    : null;
                yield (0, emailService_1.sendInvitationEmail)(invitation.invitedEmail, token, invitation.organization.name, role, // Use display role name
                invitation.createdBy.name, days, (existingUser === null || existingUser === void 0 ? void 0 : existingUser.id) || undefined);
            }
            catch (emailError) {
                // Log error but don't fail the invitation creation
                console.error("Failed to send invitation email:", emailError);
            }
        }
        // Log invitation creation
        yield (0, auditLogger_1.logCreate)(req, "Invitation", invitation.id, `Invitation created for ${invitation.invitedEmail || 'user'} with role ${role}`, (0, auditLogger_1.sanitizeForAudit)(invitation));
        res.status(201).json({
            invitation: {
                id: invitation.id,
                token: invitation.token, // Include token so it can be sent to user
                invitedEmail: invitation.invitedEmail,
                role: invitation.role,
                expiresAt: invitation.expiresAt,
                organization: invitation.organization,
                createdBy: invitation.createdBy,
                createdAt: invitation.createdAt,
            },
            // Include invitation URL for convenience (frontend can construct this)
            invitationUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/onboarding?invitation=${token}`,
        });
    }
    catch (error) {
        console.error("Error creating invitation:", error);
        res.status(500).json({
            message: `Error creating invitation: ${error.message}`
        });
    }
});
exports.createInvitation = createInvitation;
/**
 * Validate an invitation token
 * Returns invitation details if valid, error if invalid
 */
const validateInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        if (!token) {
            res.status(400).json({
                message: "Invitation token is required"
            });
            return;
        }
        // Find invitation by token
        const invitation = yield prisma.invitation.findUnique({
            where: { token },
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdBy: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!invitation) {
            res.status(404).json({
                message: "Invitation not found"
            });
            return;
        }
        // Check if already used
        if (invitation.used) {
            res.status(410).json({
                message: "This invitation has already been used",
                usedAt: invitation.usedAt,
            });
            return;
        }
        // Check if expired
        if (new Date() > invitation.expiresAt) {
            res.status(410).json({
                message: "This invitation has expired",
                expiresAt: invitation.expiresAt,
            });
            return;
        }
        // Return invitation details (without sensitive info)
        // Convert Prisma enum to display name for frontend
        res.json({
            invitation: {
                id: invitation.id,
                invitedEmail: invitation.invitedEmail,
                role: (0, roles_1.prismaEnumToRole)(invitation.role), // Convert ProgramManager -> "Program Manager"
                expiresAt: invitation.expiresAt,
                organization: invitation.organization,
                createdBy: invitation.createdBy,
                createdAt: invitation.createdAt,
            },
        });
    }
    catch (error) {
        console.error("Error validating invitation:", error);
        res.status(500).json({
            message: `Error validating invitation: ${error.message}`
        });
    }
});
exports.validateInvitation = validateInvitation;
/**
 * Accept an invitation and join the organization
 * User must be authenticated via Cognito first
 */
const acceptInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // TODO: Update when implementing better-auth.com
        // User must be authenticated
        if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.userInfo)) {
            res.status(401).json({
                message: "Authentication required. Please log in."
            });
            return;
        }
        const { token } = req.body;
        const { username, name, email, phoneNumber } = req.body;
        // Use email from session (more trustworthy)
        const userEmail = req.session.userInfo.email || email;
        const userName = req.session.userInfo.name || name;
        if (!token) {
            res.status(400).json({
                message: "Invitation token is required"
            });
            return;
        }
        // Validate required fields
        if (!username || !userName || !userEmail || !phoneNumber) {
            res.status(400).json({
                message: "Missing required fields: username, name, email, and phoneNumber are required"
            });
            return;
        }
        // Find and validate invitation
        const invitation = yield prisma.invitation.findUnique({
            where: { token },
            include: {
                organization: true,
            },
        });
        if (!invitation) {
            res.status(404).json({
                message: "Invitation not found"
            });
            return;
        }
        // Check if already used
        if (invitation.used) {
            res.status(410).json({
                message: "This invitation has already been used"
            });
            return;
        }
        // Check if expired
        if (new Date() > invitation.expiresAt) {
            res.status(410).json({
                message: "This invitation has expired"
            });
            return;
        }
        // If invitation has an email restriction, verify it matches
        if (invitation.invitedEmail && invitation.invitedEmail.toLowerCase() !== userEmail.toLowerCase()) {
            res.status(403).json({
                message: "This invitation is for a different email address. Please use the email address the invitation was sent to."
            });
            return;
        }
        // Check if user with this email already exists
        const existingUser = yield prisma.user.findFirst({
            where: { email: userEmail },
        });
        if (existingUser) {
            res.status(409).json({
                message: "You already have an account. Please log in instead.",
                user: existingUser
            });
            return;
        }
        // Check if email already exists in this organization
        const existingEmail = yield prisma.user.findFirst({
            where: {
                email: userEmail,
                organizationId: invitation.organizationId,
            },
        });
        if (existingEmail) {
            res.status(409).json({
                message: "A user with this email already exists in this organization"
            });
            return;
        }
        // Check if username already exists in this organization
        const existingUsername = yield prisma.user.findFirst({
            where: {
                username,
                organizationId: invitation.organizationId,
            },
        });
        if (existingUsername) {
            res.status(409).json({
                message: "A user with this username already exists in this organization"
            });
            return;
        }
        // Use transaction to create user and mark invitation as used atomically
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Create user in the organization
            // invitation.role is already in Prisma enum format (e.g., ProgramManager)
            const user = yield tx.user.create({
                data: {
                    username,
                    name: userName,
                    email: userEmail,
                    phoneNumber,
                    role: invitation.role, // Use role from invitation (already in Prisma enum format)
                    organizationId: invitation.organizationId,
                },
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            // Mark invitation as used
            // Note: userId is now optional, so we use the id field instead
            yield tx.invitation.update({
                where: { id: invitation.id },
                data: {
                    used: true,
                    usedAt: new Date(),
                    usedByUserId: user.id,
                },
            });
            return user;
        }));
        res.status(201).json({
            user: result,
            organization: result.organization,
            message: "Successfully joined organization",
        });
    }
    catch (error) {
        console.error("Error accepting invitation:", error);
        res.status(500).json({
            message: `Error accepting invitation: ${error.message}`
        });
    }
});
exports.acceptInvitation = acceptInvitation;
/**
 * Get all invitations for the current organization
 * Only authorized users can view invitations
 */
const getInvitations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const userRole = req.auth.role;
        // Check if user has permission to view invitations
        if (!(0, roles_1.canCreateInvitations)(userRole)) {
            res.status(403).json({
                message: "You do not have permission to view invitations"
            });
            return;
        }
        const invitations = yield prisma.invitation.findMany({
            where: {
                organizationId,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                usedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                organization: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        // Convert Prisma enum values to display names for frontend
        const invitationsWithDisplayRoles = invitations.map((inv) => (Object.assign(Object.assign({}, inv), { role: (0, roles_1.prismaEnumToRole)(inv.role) })));
        res.json(invitationsWithDisplayRoles);
    }
    catch (error) {
        console.error("Error retrieving invitations:", error);
        res.status(500).json({
            message: `Error retrieving invitations: ${error.message}`
        });
    }
});
exports.getInvitations = getInvitations;
/**
 * Revoke (delete) an invitation
 * Only authorized users can revoke invitations
 */
const revokeInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invitationId } = req.params;
        const organizationId = req.auth.organizationId;
        const userRole = req.auth.role;
        // Check if user has permission
        if (!(0, roles_1.canCreateInvitations)(userRole)) {
            res.status(403).json({
                message: "You do not have permission to revoke invitations"
            });
            return;
        }
        const invitationIdNumber = Number(invitationId);
        if (!Number.isInteger(invitationIdNumber)) {
            res.status(400).json({
                message: "invitationId must be a valid integer"
            });
            return;
        }
        // Find invitation and verify it belongs to user's organization
        const invitation = yield prisma.invitation.findFirst({
            where: {
                id: invitationIdNumber,
                organizationId,
            },
            include: {
                organization: true,
                createdBy: true,
            },
        });
        if (!invitation) {
            res.status(404).json({
                message: "Invitation not found"
            });
            return;
        }
        // Check if already used
        if (invitation.used) {
            res.status(400).json({
                message: "Cannot revoke an invitation that has already been used"
            });
            return;
        }
        // Log invitation revocation before deletion
        yield (0, auditLogger_1.logDelete)(req, "Invitation", invitation.id, `Invitation revoked for ${invitation.invitedEmail || 'user'} with role ${invitation.role}`, (0, auditLogger_1.sanitizeForAudit)(invitation));
        // Delete invitation
        yield prisma.invitation.delete({
            where: { id: invitationIdNumber },
        });
        res.json({
            message: "Invitation revoked successfully"
        });
    }
    catch (error) {
        console.error("Error revoking invitation:", error);
        res.status(500).json({
            message: `Error revoking invitation: ${error.message}`
        });
    }
});
exports.revokeInvitation = revokeInvitation;
