import { describe, it, expect } from 'vitest';
import { RouteProtection, hasRequiredRole, rolePermissions } from '../auth-guards';
import { AuthUser } from '../auth';

describe('auth-guards', () => {
  const mockUser: AuthUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'Engineer',
  } as any;

  describe('hasRequiredRole', () => {
    it('should allow access to public routes for unauthenticated users', () => {
      // PUBLIC routes should allow access regardless of authentication status
      expect(hasRequiredRole(null, RouteProtection.PUBLIC)).toBe(true);
    });

    it('should allow access to public routes for authenticated users', () => {
      expect(hasRequiredRole(mockUser, RouteProtection.PUBLIC)).toBe(true);
    });

    it('should require authentication for protected routes', () => {
      expect(hasRequiredRole(null, RouteProtection.AUTHENTICATED)).toBe(false);
      expect(hasRequiredRole(mockUser, RouteProtection.AUTHENTICATED)).toBe(true);
    });

    it('should require engineer role for engineer-only routes', () => {
      expect(hasRequiredRole(null, RouteProtection.ENGINEER_ONLY)).toBe(false);
      expect(hasRequiredRole(mockUser, RouteProtection.ENGINEER_ONLY)).toBe(true);

      const designEngineer = { ...mockUser, role: 'Design Engineer' };
      expect(hasRequiredRole(designEngineer, RouteProtection.ENGINEER_ONLY)).toBe(true);

      const pmUser = { ...mockUser, role: 'Program Manager' };
      expect(hasRequiredRole(pmUser, RouteProtection.ENGINEER_ONLY)).toBe(false);
    });

    it('should require program manager role for PM routes', () => {
      expect(hasRequiredRole(null, RouteProtection.PROGRAM_MANAGER_ONLY)).toBe(false);
      expect(hasRequiredRole(mockUser, RouteProtection.PROGRAM_MANAGER_ONLY)).toBe(false);

      const pmUser = { ...mockUser, role: 'Program Manager' };
      expect(hasRequiredRole(pmUser, RouteProtection.PROGRAM_MANAGER_ONLY)).toBe(true);

      const projectManager = { ...mockUser, role: 'Project Manager' };
      expect(hasRequiredRole(projectManager, RouteProtection.PROGRAM_MANAGER_ONLY)).toBe(true);
    });
  });

  describe('rolePermissions', () => {
    describe('canViewPrograms', () => {
      it('should only allow program managers to view programs', () => {
        // When user is null, the function returns null (falsy), not false
        expect(rolePermissions.canViewPrograms(null)).toBeFalsy();
        expect(rolePermissions.canViewPrograms(mockUser)).toBeFalsy();

        const pmUser = { ...mockUser, role: 'Program Manager' };
        expect(rolePermissions.canViewPrograms(pmUser)).toBe(true);

        const projectManager = { ...mockUser, role: 'Project Manager' };
        expect(rolePermissions.canViewPrograms(projectManager)).toBe(true);
      });
    });

    describe('canManageWorkItems', () => {
      it('should allow engineers and program managers to manage work items', () => {
        // When user is null, the function returns null (falsy), not false
        expect(rolePermissions.canManageWorkItems(null)).toBeFalsy();
        expect(rolePermissions.canManageWorkItems(mockUser)).toBe(true);

        const designEngineer = { ...mockUser, role: 'Design Engineer' };
        expect(rolePermissions.canManageWorkItems(designEngineer)).toBe(true);

        const pmUser = { ...mockUser, role: 'Program Manager' };
        expect(rolePermissions.canManageWorkItems(pmUser)).toBe(true);
      });
    });

    describe('canManageUsers', () => {
      it('should only allow program managers to manage users', () => {
        // When user is null, the function returns null (falsy), not false
        expect(rolePermissions.canManageUsers(null)).toBeFalsy();
        expect(rolePermissions.canManageUsers(mockUser)).toBeFalsy();

        const pmUser = { ...mockUser, role: 'Program Manager' };
        expect(rolePermissions.canManageUsers(pmUser)).toBe(true);

        const projectManager = { ...mockUser, role: 'Project Manager' };
        expect(rolePermissions.canManageUsers(projectManager)).toBe(true);
      });
    });

    describe('canManageTeams', () => {
      it('should allow program managers to manage teams', () => {
        // When user is null, the function returns null (falsy), not false
        expect(rolePermissions.canManageTeams(null)).toBeFalsy();
        expect(rolePermissions.canManageTeams(mockUser)).toBeFalsy();

        const pmUser = { ...mockUser, role: 'Program Manager' };
        expect(rolePermissions.canManageTeams(pmUser)).toBe(true);

        const projectManager = { ...mockUser, role: 'Project Manager' };
        expect(rolePermissions.canManageTeams(projectManager)).toBe(true);
      });
    });

    describe('canViewAnalytics', () => {
      it('should allow program managers to view analytics', () => {
        // When user is null, the function returns null (falsy), not false
        expect(rolePermissions.canViewAnalytics(null)).toBeFalsy();
        expect(rolePermissions.canViewAnalytics(mockUser)).toBeFalsy();

        const pmUser = { ...mockUser, role: 'Program Manager' };
        expect(rolePermissions.canViewAnalytics(pmUser)).toBe(true);

        const projectManager = { ...mockUser, role: 'Project Manager' };
        expect(rolePermissions.canViewAnalytics(projectManager)).toBe(true);
      });
    });
  });
});
