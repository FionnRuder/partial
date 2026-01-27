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
exports.joinOrganization = exports.createOrganizationAndUser = void 0;
const client_1 = require("@prisma/client");
const roles_1 = require("../lib/roles");
const deliverableTypeController_1 = require("./deliverableTypeController");
const issueTypeController_1 = require("./issueTypeController");
const prisma = new client_1.PrismaClient();
const createOrganizationAndUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get Better Auth session from middleware
        const session = req.betterAuthSession;
        if (!session || !session.user) {
            res.status(401).json({
                message: "Authentication required. Please log in."
            });
            return;
        }
        const { username, name, email, phoneNumber, role, organizationName, invitationToken } = req.body;
        // Use email and name from Better Auth session if not provided in body (more trustworthy)
        const userEmail = session.user.email || email;
        const userName = session.user.name || name;
        // Validate required fields
        // Note: phoneNumber is optional (user can update it later)
        if (!username || !userName || !userEmail || !role) {
            res.status(400).json({
                message: "Missing required fields: username, name, email, and role are required",
                details: {
                    username: !username,
                    name: !userName,
                    email: !userEmail,
                    role: !role
                }
            });
            return;
        }
        // Normalize phoneNumber to empty string if not provided (phoneNumber is optional)
        const normalizedPhoneNumber = phoneNumber || '';
        // Validate role is valid
        if (!(0, roles_1.isValidRole)(role)) {
            res.status(400).json({
                message: `Invalid role. Must be one of: Admin, Manager, Program Manager, Engineer, Viewer`
            });
            return;
        }
        let organization = null;
        let userRole = role;
        // If invitation token provided, join existing organization
        // IMPORTANT: Check invitation token FIRST before checking for existing user
        // This ensures invitation flow takes precedence even if Better Auth created a user
        if (invitationToken) {
            // SECURITY: For invitation-based signup, validate the role from invitation
            // The role passed in the request should match the invitation role
            const invitation = yield prisma.invitation.findUnique({
                where: { token: invitationToken },
                include: {
                    organization: true,
                },
            });
            if (!invitation) {
                res.status(404).json({
                    message: "Invalid invitation token"
                });
                return;
            }
            if (invitation.used) {
                res.status(410).json({
                    message: "This invitation has already been used"
                });
                return;
            }
            if (new Date() > invitation.expiresAt) {
                res.status(410).json({
                    message: "This invitation has expired"
                });
                return;
            }
            // Verify email matches if invitation has email restriction
            if (invitation.invitedEmail && invitation.invitedEmail.toLowerCase() !== userEmail.toLowerCase()) {
                res.status(403).json({
                    message: "This invitation is for a different email address"
                });
                return;
            }
            const invitationOrg = invitation.organization;
            // invitation.role is in Prisma enum format (e.g., ProgramManager)
            // Convert to display format for use in signup (will be converted back to enum when saving)
            userRole = invitation.role === 'ProgramManager' ? 'Program Manager' : invitation.role;
            if (!invitationOrg) {
                res.status(500).json({
                    message: "Organization not found for invitation"
                });
                return;
            }
            organization = invitationOrg;
            // Check if user with this email already exists (created by Better Auth)
            const existingUser = yield prisma.user.findFirst({
                where: { email: userEmail },
                include: {
                    organization: true,
                },
            });
            // Check if email or username already exists in THIS organization
            const existingEmailInOrg = yield prisma.user.findFirst({
                where: {
                    email: userEmail,
                    organizationId: invitationOrg.id,
                },
            });
            if (existingEmailInOrg) {
                res.status(409).json({
                    message: "User with this email already exists in this organization"
                });
                return;
            }
            const existingUsernameInOrg = yield prisma.user.findFirst({
                where: {
                    username,
                    organizationId: invitationOrg.id,
                },
            });
            if (existingUsernameInOrg) {
                res.status(409).json({
                    message: "User with this username already exists in this organization"
                });
                return;
            }
            // Create or update user and mark invitation as used in transaction
            const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                // Convert role to Prisma enum format (e.g., "Program Manager" -> "ProgramManager")
                const prismaRole = (0, roles_1.roleToPrismaEnum)(userRole);
                let user;
                if (existingUser) {
                    // User exists (created by Better Auth with default org) - update them to join the invitation organization
                    user = yield tx.user.update({
                        where: { id: existingUser.id },
                        data: {
                            username,
                            name: userName,
                            phoneNumber: normalizedPhoneNumber,
                            role: prismaRole, // Use role from invitation
                            organizationId: invitationOrg.id, // Join the invitation organization
                        },
                        include: {
                            disciplineTeam: true,
                            organization: true,
                        },
                    });
                }
                else {
                    // User doesn't exist - create new user
                    // Double-check that user doesn't exist (race condition protection)
                    const doubleCheckUser = yield tx.user.findFirst({
                        where: { email: userEmail },
                    });
                    if (doubleCheckUser) {
                        // User was created between our check and now - update them instead
                        user = yield tx.user.update({
                            where: { id: doubleCheckUser.id },
                            data: {
                                username,
                                name: userName,
                                phoneNumber,
                                role: prismaRole, // Use role from invitation
                                organizationId: invitationOrg.id, // Join the invitation organization
                            },
                            include: {
                                disciplineTeam: true,
                                organization: true,
                            },
                        });
                    }
                    else {
                        // User truly doesn't exist - create new user
                        user = yield tx.user.create({
                            data: {
                                username,
                                name: userName,
                                email: userEmail,
                                phoneNumber: normalizedPhoneNumber,
                                role: prismaRole, // Use Prisma enum format
                                organizationId: invitationOrg.id,
                            },
                            include: {
                                disciplineTeam: true,
                            },
                        });
                    }
                }
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
                organization,
            });
            return;
        }
        // No invitation token - create new organization (original flow)
        // The first user of a new organization is automatically assigned Admin role
        // This ensures they can manage the organization, invite users, etc.
        // SECURITY: Ignore any role passed in - first user is always Admin
        // This prevents privilege escalation attempts
        userRole = 'Admin'; // Override any role value passed in
        // Check if user with this email already exists (created by Better Auth)
        const existingUser = yield prisma.user.findFirst({
            where: { email: userEmail },
            include: {
                organization: true,
            },
        });
        // If user already exists (created by Better Auth), update them
        if (existingUser) {
            const orgName = organizationName || `${userName}'s Organization`;
            // Create new organization
            organization = yield prisma.organization.create({
                data: {
                    name: orgName,
                },
            });
            // Update existing user with new organization and details
            const prismaRole = 'Admin';
            const updatedUser = yield prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    username,
                    name: userName,
                    phoneNumber: normalizedPhoneNumber,
                    role: prismaRole,
                    organizationId: organization.id,
                },
                include: {
                    disciplineTeam: true,
                    organization: true,
                },
            });
            // Initialize system deliverable types and issue types for the new organization
            try {
                yield (0, deliverableTypeController_1.initializeSystemDeliverableTypes)(organization.id);
                yield (0, issueTypeController_1.initializeSystemIssueTypes)(organization.id);
                console.log(`Successfully initialized system types for organization ${organization.id}`);
            }
            catch (error) {
                console.error(`Error initializing system types for organization ${organization.id}:`, error);
                console.error("Error stack:", error === null || error === void 0 ? void 0 : error.stack);
                // Don't fail user creation if type initialization fails
                // Types can be initialized later if needed
            }
            res.status(200).json({
                user: updatedUser,
                organization,
            });
            return;
        }
        // User doesn't exist - create new organization and user
        const orgName = organizationName || `${userName}'s Organization`;
        organization = yield prisma.organization.create({
            data: {
                name: orgName,
            },
        });
        // Check if username already exists in any organization
        const existingUsername = yield prisma.user.findFirst({
            where: { username },
        });
        if (existingUsername) {
            // Roll back organization creation
            yield prisma.organization.delete({
                where: { id: organization.id },
            });
            res.status(409).json({
                message: "User with this username already exists in another organization"
            });
            return;
        }
        // Create user with the new organization
        // First user is automatically Admin - ignore any role passed in
        const prismaRole = 'Admin';
        const user = yield prisma.user.create({
            data: {
                username,
                name: userName,
                email: userEmail,
                phoneNumber: normalizedPhoneNumber,
                role: prismaRole, // Use Prisma enum format
                organizationId: organization.id,
            },
            include: {
                disciplineTeam: true,
            },
        });
        // Initialize system deliverable types and issue types for the new organization
        try {
            yield (0, deliverableTypeController_1.initializeSystemDeliverableTypes)(organization.id);
            yield (0, issueTypeController_1.initializeSystemIssueTypes)(organization.id);
            console.log(`Successfully initialized system types for organization ${organization.id}`);
        }
        catch (error) {
            console.error(`Error initializing system types for organization ${organization.id}:`, error);
            console.error("Error stack:", error === null || error === void 0 ? void 0 : error.stack);
            // Don't fail user creation if type initialization fails
            // Types can be initialized later if needed
        }
        res.status(201).json({
            user,
            organization,
        });
    }
    catch (error) {
        console.error("Error in createOrganizationAndUser:", error);
        res
            .status(500)
            .json({ message: `Error creating organization and user: ${error.message}` });
    }
});
exports.createOrganizationAndUser = createOrganizationAndUser;
const joinOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // TODO: Update when implementing better-auth.com
        // Get auth ID from session (userInfo)
        if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.userInfo)) {
            res.status(401).json({
                message: "Authentication required. Please log in."
            });
            return;
        }
        const { invitationToken } = req.body;
        // SECURITY: Require invitation token - no direct organizationId allowed
        // This prevents malicious users from joining organizations without invitation
        if (!invitationToken) {
            res.status(400).json({
                message: "Invitation token is required to join an organization. Please use a valid invitation link."
            });
            return;
        }
        // Validate invitation token
        const invitation = yield prisma.invitation.findUnique({
            where: { token: invitationToken },
            include: {
                organization: true,
            },
        });
        if (!invitation) {
            res.status(404).json({
                message: "Invalid invitation token"
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
        // Verify email matches if invitation has email restriction
        // Get Better Auth session from middleware
        const session = req.betterAuthSession;
        if (!session || !session.user) {
            res.status(401).json({
                message: "Authentication required. Please log in."
            });
            return;
        }
        const userEmail = session.user.email;
        if (invitation.invitedEmail && invitation.invitedEmail.toLowerCase() !== (userEmail === null || userEmail === void 0 ? void 0 : userEmail.toLowerCase())) {
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
        if (userEmail) {
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
        }
        // Return invitation details - user must complete profile with role selection
        // The actual user creation will happen in the signup endpoint after role selection
        // Convert Prisma enum to display name for frontend
        const displayRole = invitation.role === 'ProgramManager' ? 'Program Manager' : invitation.role;
        res.json({
            invitation: {
                id: invitation.id,
                organization: invitation.organization,
                role: displayRole, // Convert to display name
                invitedEmail: invitation.invitedEmail,
            },
            message: "Invitation validated. Please complete your profile to join the organization.",
        });
    }
    catch (error) {
        console.error("Error in joinOrganization:", error);
        res
            .status(500)
            .json({ message: `Error joining organization: ${error.message}` });
    }
});
exports.joinOrganization = joinOrganization;
