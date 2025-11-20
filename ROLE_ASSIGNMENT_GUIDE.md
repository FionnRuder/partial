# Role Assignment Guide

## Overview

This document explains how user roles are assigned in the application and the security restrictions in place.

## Available Roles

The system supports five roles:

1. **Admin** - Full system access, can manage users, teams, programs, and create invitations
2. **Manager** - Can manage teams, programs, and create invitations
3. **Program Manager** - Can manage programs and create invitations
4. **Engineer** - Standard user role for tracking work items and managing parts
5. **Viewer** - Read-only access

## Role Assignment Methods

### 1. Self-Signup (New Organization Creation)

When a new user creates their own organization during onboarding:

- **Automatic Role Assignment**: The first user is **automatically assigned `Admin` role**
- **Why Admin?**: As the organization creator, they need full access to:
  - Manage the organization
  - Invite new users
  - Create teams and programs
  - Assign roles to other users
- **UI**: Users see a special screen explaining they'll be the Admin, then proceed directly to profile setup
- **Backend**: The backend automatically assigns `Admin` role regardless of any role value passed in the request

**Note**: This is the only exception to the rule that Admin cannot be self-assigned. It only applies to the first user of a brand new organization.

### 2. Invitation-Based Assignment

When a user joins an existing organization via invitation:

- **All Roles Available**: Admins/Managers can assign any role via invitation
- **Invitation Process**: 
  1. Admin/Manager creates invitation with specific role
  2. User receives invitation link
  3. User signs up/logs in via Cognito
  4. Role is pre-assigned from invitation
  5. User cannot change the role during onboarding

**Who can create invitations?**
- Admins
- Managers  
- Program Managers

## Implementation Details

### Frontend (Onboarding Flow)

**Location**: `client/src/app/onboarding/page.tsx`

1. **Role Selection Screen**:
   - Shows only `Engineer` and `Program Manager` options for self-signup
   - If invitation exists, shows pre-selected role (cannot be changed)
   - Maps role IDs to display names:
     - `"engineer"` → `"Engineer"`
     - `"program-manager"` → `"Program Manager"`

2. **Role Validation**:
   - Frontend only shows allowed roles for self-signup
   - Backend provides additional security layer

### Backend (Onboarding Controller)

**Location**: `server/src/controllers/onboardingController.ts`

**Security Checks**:

1. **Role Validation**:
   ```typescript
   if (!isValidRole(role)) {
     res.status(400).json({ 
       message: `Invalid role. Must be one of: Admin, Manager, Program Manager, Engineer, Viewer` 
     });
     return;
   }
   ```

2. **Self-Assignment Restriction**:
   ```typescript
   const RESTRICTED_ROLES = ['Admin', 'Manager', 'Viewer'];
   if (!invitationToken && RESTRICTED_ROLES.includes(role)) {
     // Note: This check is bypassed for new organization creation
     // where Admin is automatically assigned
     res.status(403).json({ 
       message: `Role "${role}" cannot be self-assigned...` 
     });
     return;
   }
   ```

3. **Automatic Admin Assignment for New Organizations**:
   ```typescript
   // No invitation token - create new organization
   // First user is automatically Admin - ignore any role passed in
   const prismaRole: UserRole = 'Admin';
   ```
   - When creating a new organization (no invitation token), the backend automatically assigns `Admin` role
   - This ensures the organization creator has full management capabilities
   - The role value passed in the request is ignored for new organization creation

## Role Conversion

The system uses two formats for roles:

1. **Display Names** (used in API requests):
   - `"Engineer"`
   - `"Program Manager"` (with space)
   - `"Admin"`, `"Manager"`, `"Viewer"`

2. **Prisma Enum Values** (stored in database):
   - `"Engineer"`
   - `"ProgramManager"` (no space)
   - `"Admin"`, `"Manager"`, `"Viewer"`

**Conversion Functions** (in `server/src/lib/roles.ts`):
- `roleToPrismaEnum()` - Converts display name to enum value
- `prismaEnumToRole()` - Converts enum value to display name

## Security Considerations

1. **Backend Validation is Primary**:
   - Frontend restrictions are for UX only
   - Backend always validates and enforces restrictions
   - Cannot bypass by manipulating frontend code

2. **Invitation Tokens**:
   - Cryptographically secure tokens
   - Time-limited (expires after set number of days)
   - Single-use (marked as used after signup)
   - Optional email restriction

3. **Organization Isolation**:
   - All role assignments are scoped to the user's organization
   - Users cannot assign roles outside their organization

## Changing Roles After Signup

After a user is created, role changes can be made by:

1. **Admins/Managers** via the Users management page
2. **API endpoints** (with proper authorization checks)

**Note**: Role changes after signup are not restricted to the same rules as initial assignment. However, proper authorization checks ensure only authorized users can change roles.

## Testing Role Restrictions

To test that privileged roles cannot be self-assigned:

1. **Attempt self-signup with Admin role**:
   ```bash
   curl -X POST http://localhost:8000/onboarding/signup \
     -H "Content-Type: application/json" \
     -H "Cookie: connect.sid=..." \
     -d '{
       "username": "testuser",
       "name": "Test User",
       "email": "test@example.com",
       "phoneNumber": "1234567890",
       "role": "Admin"
     }'
   ```
   **Expected**: 403 Forbidden with error message

2. **Attempt self-signup with Engineer role**:
   ```bash
   # Same request but with "role": "Engineer"
   ```
   **Expected**: 201 Created with user object

3. **Join via invitation with Admin role**:
   - Create invitation with Admin role
   - Use invitation token in signup request
   **Expected**: 201 Created with Admin role assigned

## Summary

- **New Organization Creation**: First user is **automatically assigned `Admin` role**
- **Invitation**: Any role can be assigned by Admins/Managers
- **Security**: Backend validation prevents privilege escalation (except for first user of new org)
- **Flexibility**: Admins can change roles after signup via user management

## Special Case: First User of New Organization

The first user who creates a new organization is automatically assigned the `Admin` role. This is necessary because:

1. **No existing Admin exists** to assign roles
2. **Organization management** requires Admin privileges
3. **User invitation** requires Admin privileges
4. **Team and program creation** may require elevated permissions

The UI shows a special screen explaining this automatic assignment, and the backend enforces it regardless of any role value passed in the request.

