import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Lazy load better-auth to handle ESM module in CommonJS context
// Note: Clear these caches if you need to reload the auth configuration
let _auth: any = null;
let _authHandler: any = null;

// Function to clear auth cache (useful for development/testing)
export function clearAuthCache() {
  _auth = null;
  _authHandler = null;
}

export async function getAuth() {
  if (!_auth) {
    const { betterAuth } = await import("better-auth");
    const { prismaAdapter } = await import("better-auth/adapters/prisma");
    
    _auth = betterAuth({
      database: prismaAdapter(prisma, {
        provider: "postgresql",
      }),
      emailAndPassword: {
        enabled: true,
      },
      baseURL: process.env.BETTER_AUTH_URL || process.env.FRONTEND_URL || "http://localhost:3000",
      basePath: "/api/auth",
      secret: process.env.BETTER_AUTH_SECRET || process.env.SESSION_SECRET || "change-this-secret-in-production",
      trustedOrigins: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ["http://localhost:3000"],
      advanced: {
        defaultCookieAttributes: {
          // In development (HTTP), use "lax" and secure: false
          // In production (HTTPS), use "none" and secure: true
          sameSite: process.env.NODE_ENV === 'production' || (process.env.FRONTEND_URL && process.env.FRONTEND_URL.startsWith('https://')) ? "none" : "lax",
          secure: process.env.NODE_ENV === 'production' || (process.env.FRONTEND_URL && process.env.FRONTEND_URL.startsWith('https://')) ? true : false,
          partitioned: false, // Only needed for cross-domain cookies in production
        },
      },
      user: {
        additionalFields: {
          username: {
            type: "string",
            required: false, // Not required in input, will be set by hook
            input: false, // Don't allow user to set username during signup
          },
          organizationId: {
            type: "number",
            required: false, // Not required in input, will be set by hook
            input: false, // Don't allow user to set organizationId during signup
          },
          phoneNumber: {
            type: "string",
            required: false, // Optional in input, but required in database (set by hook if missing)
            input: true, // Allow phone number to be passed during signup
          },
          role: {
            type: "string",
            required: false, // Not required in input, will be set by hook
            input: false, // Don't allow user to set role during signup
          },
        },
      },
      databaseHooks: {
        user: {
          create: {
            before: async (userData: any, ctx: any) => {
              console.log("[Better Auth Hook] User create before hook called with data:", JSON.stringify(userData, null, 2));
              try {
                // Get or create a default organization for new users
                // This will be updated by the onboarding endpoint
                let defaultOrg = await prisma.organization.findFirst({
                  orderBy: { id: 'asc' },
                });
                
                if (!defaultOrg) {
                  console.log("[Better Auth Hook] Creating default organization");
                  // Create a temporary default organization if none exists
                  defaultOrg = await prisma.organization.create({
                    data: {
                      name: "Default Organization",
                    },
                  });
                }
                
                console.log("[Better Auth Hook] Using organization ID:", defaultOrg.id);
                
                // Generate unique username from email if not provided
                const email = userData.email || "";
                let baseUsername = email.split('@')[0] || `user_${Date.now()}`;
                
                // Check if username already exists in this organization and make it unique
                let username = baseUsername;
                let counter = 1;
                let existingUser = await prisma.user.findFirst({
                  where: {
                    AND: [
                      { organizationId: defaultOrg.id },
                      { username: username },
                    ],
                  },
                });
                
                while (existingUser) {
                  username = `${baseUsername}${counter}`;
                  counter++;
                  existingUser = await prisma.user.findFirst({
                    where: {
                      AND: [
                        { organizationId: defaultOrg.id },
                        { username: username },
                      ],
                    },
                  });
                }
                
                console.log("[Better Auth Hook] Generated unique username:", username);
                
                // Return user data with required custom fields
                // Note: These are Prisma schema field names, not Better Auth field names
                // role must be a valid UserRole enum value
                // phoneNumber should come from the signup request if provided
                const result = {
                  data: {
                    ...userData,
                    username: username,
                    organizationId: defaultOrg.id,
                    phoneNumber: userData.phoneNumber || "", // Use phoneNumber from request if provided
                    role: (userData.role || "Engineer") as string, // UserRole enum value
                  },
                };
                
                console.log("[Better Auth Hook] Returning data:", JSON.stringify(result, null, 2));
                return result;
              } catch (error: any) {
                console.error("[Better Auth Hook] Error in user create hook:", error);
                console.error("[Better Auth Hook] Error stack:", error.stack);
                // Don't abort - let Better Auth handle the error
                return { data: userData };
              }
            },
          },
        },
      },
    });
  }
  return _auth;
}

export async function getAuthHandler() {
  if (!_authHandler) {
    const { toNodeHandler } = await import("better-auth/node");
    const auth = await getAuth();
    _authHandler = toNodeHandler(auth);
  }
  return _authHandler;
}

// Export auth for direct use (returns promise)
export const auth = {
  get api() {
    return {
      getSession: async (args: any) => {
        const authInstance = await getAuth();
        return authInstance.api.getSession(args);
      },
      // Add other API methods as needed
    };
  },
};
