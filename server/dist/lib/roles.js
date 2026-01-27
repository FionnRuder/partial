"use strict";
/**
 * Centralized role definitions and authorization helpers
 *
 * This file provides a single source of truth for:
 * - Valid roles in the system
 * - Role-based permissions
 * - Authorization checks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLES_CAN_VIEW_ANALYTICS = exports.ROLES_CAN_MANAGE_PROGRAMS = exports.ROLES_CAN_MANAGE_TEAMS = exports.ROLES_CAN_MANAGE_USERS = exports.ROLES_CAN_CREATE_INVITATIONS = exports.VALID_ROLES = exports.ROLE_DISPLAY_NAMES = exports.UserRole = void 0;
exports.isValidRole = isValidRole;
exports.canCreateInvitations = canCreateInvitations;
exports.canManageUsers = canManageUsers;
exports.canManageTeams = canManageTeams;
exports.canManagePrograms = canManagePrograms;
exports.canViewAnalytics = canViewAnalytics;
exports.getRoleDisplayName = getRoleDisplayName;
exports.roleToPrismaEnum = roleToPrismaEnum;
exports.prismaEnumToRole = prismaEnumToRole;
/**
 * User roles enum
 *
 * IMPORTANT: These values must match the UserRole enum in Prisma schema
 * Prisma enum values are PascalCase (e.g., ProgramManager)
 * Display names use spaces (e.g., "Program Manager")
 */
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "Admin";
    UserRole["Manager"] = "Manager";
    UserRole["ProgramManager"] = "Program Manager";
    UserRole["Engineer"] = "Engineer";
    UserRole["Viewer"] = "Viewer";
})(UserRole || (exports.UserRole = UserRole = {}));
/**
 * Map Prisma enum values to display names
 * Prisma uses PascalCase, but we display with spaces for some roles
 */
exports.ROLE_DISPLAY_NAMES = {
    Admin: 'Admin',
    Manager: 'Manager',
    ProgramManager: 'Program Manager', // Prisma enum value -> display name
    Engineer: 'Engineer',
    Viewer: 'Viewer',
};
/**
 * All valid roles that can be assigned to users
 * These are the string values (display names) that can be used in API requests
 */
exports.VALID_ROLES = [
    'Admin',
    'Manager',
    'Program Manager', // Display name with space
    'Engineer',
    'Viewer',
];
/**
 * Roles that can create invitations (display names)
 */
exports.ROLES_CAN_CREATE_INVITATIONS = [
    'Admin',
    'Manager',
    'Program Manager',
];
/**
 * Roles that can manage users (display names)
 */
exports.ROLES_CAN_MANAGE_USERS = [
    'Admin',
    'Manager',
    'Program Manager',
];
/**
 * Roles that can manage teams (display names)
 */
exports.ROLES_CAN_MANAGE_TEAMS = [
    'Admin',
    'Manager',
    'Program Manager',
];
/**
 * Roles that can manage programs (display names)
 */
exports.ROLES_CAN_MANAGE_PROGRAMS = [
    'Admin',
    'Manager',
    'Program Manager',
];
/**
 * Roles that can view analytics (display names)
 */
exports.ROLES_CAN_VIEW_ANALYTICS = [
    'Admin',
    'Manager',
    'Program Manager',
];
/**
 * Check if a role string is valid (accepts display names)
 */
function isValidRole(role) {
    return exports.VALID_ROLES.includes(role);
}
/**
 * Check if a user can create invitations
 * Accepts both display names and Prisma enum values
 */
function canCreateInvitations(role) {
    // Normalize role (handle both "Program Manager" and "ProgramManager")
    const normalizedRole = role === 'ProgramManager' ? 'Program Manager' : role;
    return ['Admin', 'Manager', 'Program Manager'].includes(normalizedRole);
}
/**
 * Check if a user can manage users
 * Accepts both display names and Prisma enum values
 */
function canManageUsers(role) {
    const normalizedRole = role === 'ProgramManager' ? 'Program Manager' : role;
    return exports.ROLES_CAN_MANAGE_USERS.includes(normalizedRole);
}
/**
 * Check if a user can manage teams
 * Accepts both display names and Prisma enum values
 */
function canManageTeams(role) {
    const normalizedRole = role === 'ProgramManager' ? 'Program Manager' : role;
    return exports.ROLES_CAN_MANAGE_TEAMS.includes(normalizedRole);
}
/**
 * Check if a user can manage programs
 * Accepts both display names and Prisma enum values
 */
function canManagePrograms(role) {
    const normalizedRole = role === 'ProgramManager' ? 'Program Manager' : role;
    return exports.ROLES_CAN_MANAGE_PROGRAMS.includes(normalizedRole);
}
/**
 * Check if a user can view analytics
 * Accepts both display names and Prisma enum values
 */
function canViewAnalytics(role) {
    const normalizedRole = role === 'ProgramManager' ? 'Program Manager' : role;
    return exports.ROLES_CAN_VIEW_ANALYTICS.includes(normalizedRole);
}
/**
 * Get role display name (for UI)
 */
function getRoleDisplayName(role) {
    const roleMap = {
        [UserRole.Admin]: 'Admin',
        [UserRole.Manager]: 'Manager',
        [UserRole.ProgramManager]: 'Program Manager',
        [UserRole.Engineer]: 'Engineer',
        [UserRole.Viewer]: 'Viewer',
    };
    return roleMap[role] || role;
}
/**
 * Convert display role name to Prisma enum value
 * Prisma enum uses PascalCase (no spaces), but API accepts display names with spaces
 *
 * @param role - Display role name (e.g., "Program Manager")
 * @returns Prisma enum value (e.g., "ProgramManager")
 */
function roleToPrismaEnum(role) {
    if (role === 'Program Manager') {
        return 'ProgramManager'; // Prisma enum value (no space)
    }
    // Validate that the role is a valid enum value
    if (role === 'Admin' || role === 'Manager' || role === 'ProgramManager' || role === 'Engineer' || role === 'Viewer') {
        return role;
    }
    // Default to Engineer if invalid (shouldn't happen if isValidRole was called first)
    return 'Engineer';
}
/**
 * Convert Prisma enum value to display name
 *
 * @param prismaRole - Prisma enum value (e.g., "ProgramManager")
 * @returns Display role name (e.g., "Program Manager")
 */
function prismaEnumToRole(prismaRole) {
    if (prismaRole === 'ProgramManager') {
        return 'Program Manager'; // Display name (with space)
    }
    return prismaRole; // Other roles match exactly
}
