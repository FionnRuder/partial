/**
 * Centralized role definitions and authorization helpers
 * 
 * This file provides a single source of truth for:
 * - Valid roles in the system
 * - Role-based permissions
 * - Authorization checks
 */

/**
 * User roles enum
 * 
 * IMPORTANT: These values must match the UserRole enum in Prisma schema
 * Prisma enum values are PascalCase (e.g., ProgramManager)
 * Display names use spaces (e.g., "Program Manager")
 */
export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  ProgramManager = 'Program Manager', // Note: Prisma enum is ProgramManager, display is "Program Manager"
  Engineer = 'Engineer',
  Viewer = 'Viewer',
}

/**
 * Map Prisma enum values to display names
 * Prisma uses PascalCase, but we display with spaces for some roles
 */
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
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
export const VALID_ROLES: string[] = [
  'Admin',
  'Manager',
  'Program Manager', // Display name with space
  'Engineer',
  'Viewer',
];

/**
 * Roles that can create invitations (display names)
 */
export const ROLES_CAN_CREATE_INVITATIONS: string[] = [
  'Admin',
  'Manager',
  'Program Manager',
];

/**
 * Roles that can manage users (display names)
 */
export const ROLES_CAN_MANAGE_USERS: string[] = [
  'Admin',
  'Manager',
  'Program Manager',
];

/**
 * Roles that can manage teams (display names)
 */
export const ROLES_CAN_MANAGE_TEAMS: string[] = [
  'Admin',
  'Manager',
  'Program Manager',
];

/**
 * Roles that can manage programs (display names)
 */
export const ROLES_CAN_MANAGE_PROGRAMS: string[] = [
  'Admin',
  'Manager',
  'Program Manager',
];

/**
 * Roles that can view analytics (display names)
 */
export const ROLES_CAN_VIEW_ANALYTICS: string[] = [
  'Admin',
  'Manager',
  'Program Manager',
];

/**
 * Check if a role string is valid (accepts display names)
 */
export function isValidRole(role: string): boolean {
  return VALID_ROLES.includes(role);
}

/**
 * Check if a user can create invitations
 * Accepts both display names and Prisma enum values
 */
export function canCreateInvitations(role: string): boolean {
  // Normalize role (handle both "Program Manager" and "ProgramManager")
  const normalizedRole = role === 'ProgramManager' ? 'Program Manager' : role;
  return ['Admin', 'Manager', 'Program Manager'].includes(normalizedRole);
}

/**
 * Check if a user can manage users
 * Accepts both display names and Prisma enum values
 */
export function canManageUsers(role: string): boolean {
  const normalizedRole = role === 'ProgramManager' ? 'Program Manager' : role;
  return ROLES_CAN_MANAGE_USERS.includes(normalizedRole);
}

/**
 * Check if a user can manage teams
 * Accepts both display names and Prisma enum values
 */
export function canManageTeams(role: string): boolean {
  const normalizedRole = role === 'ProgramManager' ? 'Program Manager' : role;
  return ROLES_CAN_MANAGE_TEAMS.includes(normalizedRole);
}

/**
 * Check if a user can manage programs
 * Accepts both display names and Prisma enum values
 */
export function canManagePrograms(role: string): boolean {
  const normalizedRole = role === 'ProgramManager' ? 'Program Manager' : role;
  return ROLES_CAN_MANAGE_PROGRAMS.includes(normalizedRole);
}

/**
 * Check if a user can view analytics
 * Accepts both display names and Prisma enum values
 */
export function canViewAnalytics(role: string): boolean {
  const normalizedRole = role === 'ProgramManager' ? 'Program Manager' : role;
  return ROLES_CAN_VIEW_ANALYTICS.includes(normalizedRole);
}

/**
 * Get role display name (for UI)
 */
export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
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
export function roleToPrismaEnum(role: string): 'Admin' | 'Manager' | 'ProgramManager' | 'Engineer' | 'Viewer' {
  if (role === 'Program Manager') {
    return 'ProgramManager'; // Prisma enum value (no space)
  }
  // Validate that the role is a valid enum value
  if (role === 'Admin' || role === 'Manager' || role === 'ProgramManager' || role === 'Engineer' || role === 'Viewer') {
    return role as 'Admin' | 'Manager' | 'ProgramManager' | 'Engineer' | 'Viewer';
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
export function prismaEnumToRole(prismaRole: string): string {
  if (prismaRole === 'ProgramManager') {
    return 'Program Manager'; // Display name (with space)
  }
  return prismaRole; // Other roles match exactly
}

