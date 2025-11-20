import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getCognitoClient } from '../lib/cognitoClient';

const prisma = new PrismaClient();

const router = Router();

// Extend Express Session to include our custom properties
declare module 'express-session' {
  interface SessionData {
    nonce?: string;
    state?: string;
    invitationToken?: string; // Preserve invitation token through OAuth flow
    userInfo?: {
      sub: string;
      email?: string;
      email_verified?: boolean;
      phone_number?: string;
      phone_number_verified?: boolean;
      username?: string;
      name?: string;
      [key: string]: any;
    };
  }
}

/**
 * Helper function to get the path from a URL
 * Example: "http://localhost/hello" returns "/hello"
 */
function getPathFromURL(urlString: string): string {
  try {
    const url = new URL(urlString);
    return url.pathname;
  } catch (error) {
    console.error('Invalid URL:', error);
    return '/';
  }
}

/**
 * Login route - redirects to Amazon Cognito managed login
 * Note: If custom domain DNS is not configured, this will use the issuer URL for authorization.
 */
router.get('/login', async (req: Request, res: Response) => {
  try {
    // Dynamic import for ES module compatibility
    // TypeScript has issues with ES module imports in CommonJS, so we use type assertion
    // @ts-ignore - ES module dynamic import type checking issue
    const openidClient = await import('openid-client') as any;
    const generators = openidClient.generators;
    
    const client = getCognitoClient();
    const nonce = generators.nonce();
    const state = generators.state();

    // Preserve invitation token if present in query parameters
    const invitationToken = req.query.invitation as string | undefined;
    if (invitationToken) {
      req.session.invitationToken = invitationToken;
    }

    req.session.nonce = nonce;
    req.session.state = state;

    const redirectUri = process.env.COGNITO_REDIRECT_URI || 'http://localhost:8000/auth/callback';
    const issuerUrl = process.env.COGNITO_ISSUER_URL || 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8';
    const customDomain = process.env.COGNITO_USER_POOL_DOMAIN;
    
    // Check if we should bypass custom domain (when DNS is not configured)
    const useIssuerUrlForAuth = process.env.COGNITO_USE_ISSUER_URL_FOR_AUTH === 'true' || 
                                 (customDomain && !customDomain.includes('.amazoncognito.com'));
    
    // Log configuration for debugging
    console.log('Cognito Login Configuration:');
    console.log('- Redirect URI:', redirectUri);
    console.log('- Client ID:', process.env.COGNITO_CLIENT_ID || '5429ep5otfjduo6ntjt2foc5of');
    console.log('- Issuer URL:', issuerUrl);
    console.log('- Custom Domain:', customDomain || 'Not configured');
    console.log('- Use Cognito Domain (bypass custom):', useIssuerUrlForAuth);

    let authUrl: string;
    
    // If we need to bypass custom domain, use the Cognito hosted UI domain
    // We need to discover the issuer to get the actual hosted UI domain
    if (useIssuerUrlForAuth) {
      // Discover issuer to get the authorization endpoint
      // @ts-ignore - ES module dynamic import type checking issue
      const openidClient = await import('openid-client') as any;
      const Issuer = openidClient.Issuer;
      const issuer = await Issuer.discover(issuerUrl);
      
      // The discovered authorization_endpoint might be the custom domain
      // If so, we need to construct the Cognito domain instead
      let authEndpoint = issuer.authorization_endpoint;
      
      // If authorization endpoint uses custom domain, we need to find the Cognito domain
      if (customDomain && authEndpoint && authEndpoint.includes(customDomain)) {
        // Extract region from issuer URL: https://cognito-idp.{region}.amazonaws.com/{userPoolId}
        const regionMatch = issuerUrl.match(/cognito-idp\.([^.]+)\.amazonaws\.com/);
        const region = regionMatch ? regionMatch[1] : 'us-east-1';
        
        // Try to get Cognito domain from environment, or construct from User Pool ID
        // Format: https://{domain-prefix}.auth.{region}.amazoncognito.com
        // We can try to get it from the User Pool's domain configuration
        // For now, we'll use a workaround: use the issuer discovery but with a different approach
        // Actually, we can query the User Pool to get the domain, but that requires AWS SDK
        // For now, let's try to use the Cognito domain format if we can determine it
        
        // Alternative: Use the User Pool's default Cognito domain
        // The domain prefix is usually derived from the User Pool name or can be found in AWS Console
        // Since we don't have it, we'll need to either:
        // 1. Add COGNITO_HOSTED_UI_DOMAIN env var, OR
        // 2. Use the discovered endpoint but handle DNS errors gracefully
        
        // For now, let's check if there's a COGNITO_HOSTED_UI_DOMAIN env var
        const cognitoHostedUIDomain = process.env.COGNITO_HOSTED_UI_DOMAIN;
        if (cognitoHostedUIDomain) {
          authEndpoint = `https://${cognitoHostedUIDomain}/oauth2/authorize`;
          console.log('Using COGNITO_HOSTED_UI_DOMAIN for authorization:', cognitoHostedUIDomain);
        } else {
          // Fallback: Try to use the issuer URL format (though this might not work)
          // Actually, Cognito doesn't support issuer URL for authorization
          // We need the hosted UI domain
          console.warn('Custom domain detected but DNS not ready. You need to either:');
          console.warn('1. Configure DNS for custom domain, OR');
          console.warn('2. Set COGNITO_HOSTED_UI_DOMAIN env var to your Cognito domain (e.g., your-prefix.auth.us-east-1.amazoncognito.com)');
          console.warn('Using discovered endpoint (may fail if DNS not configured):', authEndpoint);
        }
      }
      
      const clientId = process.env.COGNITO_CLIENT_ID || '5429ep5otfjduo6ntjt2foc5of';
      const params = new URLSearchParams({
        client_id: clientId,
        scope: 'phone openid email profile',
        response_type: 'code',
        redirect_uri: redirectUri,
        state: state,
        nonce: nonce,
      });
      
      authUrl = `${authEndpoint}?${params.toString()}`;
      console.log('Using authorization endpoint:', authEndpoint);
    } else {
      // Use the client's authorizationUrl method which uses the discovered endpoint
      // This will use the hosted UI domain (either Cognito domain or custom domain)
      try {
        authUrl = client.authorizationUrl({
          scope: 'phone openid email profile',
          state: state,
          nonce: nonce,
          redirect_uri: redirectUri,
        });
        console.log('Using discovered authorization endpoint from issuer (hosted UI domain)');
      } catch (authError) {
        console.error('Failed to generate authorization URL:', authError);
        throw authError;
      }
    }

    console.log('Generated authorization URL:', authUrl);
    res.redirect(authUrl);
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', error instanceof Error ? error.stack : error);
    res.status(500).json({ 
      message: 'Failed to initiate login', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    });
  }
});

/**
 * Callback route - handles the return from Amazon Cognito after authentication
 */
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const client = getCognitoClient();
    // Use same redirect URI as configured in client initialization
    const redirectUri = process.env.COGNITO_REDIRECT_URI || 'http://localhost:8000/auth/callback';
    
    console.log('Callback received - Redirect URI:', redirectUri);
    console.log('Callback query params:', req.query);

    const params = client.callbackParams(req);
    
    // If custom domain DNS is not ready, we need to override token endpoint
    const customDomain = process.env.COGNITO_USER_POOL_DOMAIN;
    const useIssuerUrlForAuth = process.env.COGNITO_USE_ISSUER_URL_FOR_AUTH === 'true' || 
                                 (customDomain && !customDomain.includes('.amazoncognito.com'));
    const cognitoHostedUIDomain = process.env.COGNITO_HOSTED_UI_DOMAIN;
    
    let tokenSet;
    if (useIssuerUrlForAuth && cognitoHostedUIDomain) {
      // Manually exchange code for tokens using Cognito hosted UI domain
      // This bypasses the custom domain when DNS is not configured
      const hostedUIDomain = cognitoHostedUIDomain.replace(/^https?:\/\//, '');
      const tokenEndpoint = `https://${hostedUIDomain}/oauth2/token`;
      const clientId = process.env.COGNITO_CLIENT_ID || '5429ep5otfjduo6ntjt2foc5of';
      const clientSecret = process.env.COGNITO_CLIENT_SECRET || '';
      
      console.log('Using Cognito hosted UI domain for token exchange:', tokenEndpoint);
      
      // Exchange code for tokens manually
      const tokenResponse = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code: params.code as string,
          redirect_uri: redirectUri,
        }),
      });
      
      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Token exchange failed: ${tokenResponse.status} ${errorText}`);
      }
      
      tokenSet = await tokenResponse.json();
      
      // Validate state and nonce
      if (params.state !== req.session.state) {
        throw new Error('State mismatch');
      }
    } else {
      // Use normal client callback (will use discovered endpoints)
      tokenSet = await client.callback(
        redirectUri,
        params,
        {
          nonce: req.session.nonce,
          state: req.session.state,
        }
      );
    }

    // Get user info - also need to override userinfo endpoint if using custom domain
    let userInfo;
    if (useIssuerUrlForAuth && cognitoHostedUIDomain) {
      const hostedUIDomain = cognitoHostedUIDomain.replace(/^https?:\/\//, '');
      const userinfoEndpoint = `https://${hostedUIDomain}/oauth2/userInfo`;
      
      console.log('Using Cognito hosted UI domain for userinfo:', userinfoEndpoint);
      
      const userinfoResponse = await fetch(userinfoEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenSet.access_token}`,
        },
      });
      
      if (!userinfoResponse.ok) {
        throw new Error(`Userinfo request failed: ${userinfoResponse.status}`);
      }
      
      userInfo = await userinfoResponse.json();
    } else {
      userInfo = await client.userinfo(tokenSet.access_token!);
    }
        req.session.userInfo = userInfo;

        // Clear nonce and state after successful authentication
        req.session.nonce = undefined;
        req.session.state = undefined;

        // Check if user exists in database
        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: userInfo.email },
                { cognitoId: userInfo.sub },
              ],
            },
          });

          // Get frontend URL from environment, with proper defaults for dev/prod
          const frontendUrl = process.env.FRONTEND_URL || 
                             (process.env.NODE_ENV === 'production' 
                               ? 'https://your-production-domain.com' 
                               : 'http://localhost:3000');

          // Preserve invitation token in redirect if present
          const invitationToken = req.session.invitationToken;
          const onboardingUrl = invitationToken 
            ? `${frontendUrl}/onboarding?invitation=${invitationToken}`
            : `${frontendUrl}/onboarding`;

          if (user) {
            // User exists - redirect to home
            res.redirect(`${frontendUrl}/home`);
          } else {
            // User doesn't exist - redirect to onboarding with invitation token if present
            res.redirect(onboardingUrl);
          }
          
          // Clear invitation token from session after redirect
          if (invitationToken) {
            req.session.invitationToken = undefined;
          }
        } catch (dbError) {
          console.error('Database error during callback:', dbError);
          // On error, redirect to onboarding to be safe
          const frontendUrl = process.env.FRONTEND_URL || 
                             (process.env.NODE_ENV === 'production' 
                               ? 'https://your-production-domain.com' 
                               : 'http://localhost:3000');
          // Preserve invitation token in redirect if present
          const invitationToken = req.session.invitationToken;
          const onboardingUrl = invitationToken 
            ? `${frontendUrl}/onboarding?invitation=${invitationToken}`
            : `${frontendUrl}/onboarding`;
          res.redirect(onboardingUrl);
          
          // Clear invitation token from session after redirect
          if (invitationToken) {
            req.session.invitationToken = undefined;
          }
        }
      } catch (error) {
        console.error('Callback error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 
                           (process.env.NODE_ENV === 'production' 
                             ? 'https://your-production-domain.com' 
                             : 'http://localhost:3000');
        // Preserve invitation token even on error
        const invitationToken = req.session.invitationToken;
        const errorUrl = invitationToken 
          ? `${frontendUrl}/onboarding?error=authentication_failed&invitation=${invitationToken}`
          : `${frontendUrl}/onboarding?error=authentication_failed`;
        res.redirect(errorUrl);
        
        // Clear invitation token from session after redirect
        if (invitationToken) {
          req.session.invitationToken = undefined;
        }
      }
});

/**
 * Logout route - erases user session data and redirects to Cognito logout endpoint
 */
router.get('/logout', (req: Request, res: Response) => {
  const userPoolDomain = process.env.COGNITO_USER_POOL_DOMAIN || '';
  const clientId = process.env.COGNITO_CLIENT_ID || '5429ep5otfjduo6ntjt2foc5of';
  const logoutUri = process.env.COGNITO_LOGOUT_URI || process.env.FRONTEND_URL || 'http://localhost:3000/onboarding';
  const cognitoHostedUIDomain = process.env.COGNITO_HOSTED_UI_DOMAIN;
  const useIssuerUrlForAuth = process.env.COGNITO_USE_ISSUER_URL_FOR_AUTH === 'true' || 
                               (userPoolDomain && !userPoolDomain.includes('.amazoncognito.com'));

  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }

    // If custom domain DNS is not ready, use Cognito hosted UI domain for logout
    if (useIssuerUrlForAuth && cognitoHostedUIDomain) {
      try {
        const hostedUIDomain = cognitoHostedUIDomain.replace(/^https?:\/\//, '');
        let logoutUrl = `https://${hostedUIDomain}/logout?client_id=${clientId}`;

        // Only add logout_uri if it's explicitly configured
        if (process.env.COGNITO_LOGOUT_URI) {
          logoutUrl += `&logout_uri=${encodeURIComponent(logoutUri)}`;
        }

        console.log('Using Cognito hosted UI domain for logout (bypassing custom domain):', logoutUrl);
        console.log('Note: If you get "Invalid request", ensure logout_uri is in Cognito App Client "Sign out URL(s)"');
        res.redirect(logoutUrl);
        return;
      } catch (error) {
        console.error('Error constructing Cognito logout URL with hosted UI domain:', error);
        // Fallback to direct frontend redirect
        res.redirect(logoutUri);
        return;
      }
    }

    // Validate that the domain looks like a valid Cognito domain
    // Cognito domains can be:
    // 1. Cognito domain: your-domain.auth.region.amazoncognito.com
    // 2. Custom domain: auth.yourdomain.com (must be configured in Cognito with DNS)
    // They should NOT contain the User Pool ID (like us-east-1_zFt1mmhx8 or us-east-1zft1mmhx8)
    const domainLower = userPoolDomain ? userPoolDomain.trim().toLowerCase() : '';
    
    // Check if domain contains User Pool ID pattern (your specific User Pool ID)
    // Pattern: us-east-1 followed by zft1mmhx8 (with or without underscore/dash)
    const containsUserPoolId = domainLower.includes('zft1mmhx8') && 
                               (domainLower.includes('us-east-1zft1mmhx8') ||
                                domainLower.includes('us-east-1_zft1mmhx8') ||
                                domainLower.includes('us-east-1-zft1mmhx8'));
    
    // Valid formats:
    // - Cognito domain: contains .auth. or .amazoncognito.com
    // - Custom domain: doesn't contain User Pool ID and is not localhost
    const isCognitoDomain = domainLower.includes('.auth.') || domainLower.includes('.amazoncognito.com');
    const isCustomDomain = !containsUserPoolId &&
                          !domainLower.includes('localhost') &&
                          domainLower.includes('.') && // Has at least one dot (basic domain check)
                          !isCognitoDomain; // Not a Cognito domain format

    const isValidCognitoDomain = userPoolDomain &&
      domainLower !== '' &&
      !domainLower.includes('localhost') &&
      !containsUserPoolId && // Reject if it contains User Pool ID pattern
      (isCognitoDomain || isCustomDomain); // Either Cognito domain or custom domain

    if (isValidCognitoDomain) {
      try {
        // Ensure domain doesn't already include https://
        const cleanDomain = userPoolDomain.trim().replace(/^https?:\/\//, '');

        // Build logout URL - MUST use /logout endpoint
        // logout_uri is optional but recommended
        let logoutUrl = `https://${cleanDomain}/logout?client_id=${clientId}`;

        // Only add logout_uri if it's explicitly configured
        // This avoids "Invalid request" errors if the URL isn't in Cognito's allowed list
        if (process.env.COGNITO_LOGOUT_URI) {
          logoutUrl += `&logout_uri=${encodeURIComponent(logoutUri)}`;
        }

        console.log('Redirecting to Cognito logout:', logoutUrl);
        console.log('Note: If you get "Invalid request", ensure logout_uri is in Cognito App Client "Sign out URL(s)"');
        res.redirect(logoutUrl);
      } catch (error) {
        console.error('Error constructing Cognito logout URL:', error);
        console.error('User pool domain value:', userPoolDomain);
        // Fallback to direct frontend redirect
        res.redirect(logoutUri);
      }
    } else {
      // If no domain configured or invalid domain, just redirect to frontend
      // Session is already destroyed, so user is logged out
      if (userPoolDomain) {
        console.warn('Invalid Cognito domain format detected. Domain:', userPoolDomain);
        console.warn('Cognito domain should be a custom prefix like: your-app.auth.us-east-1.amazoncognito.com');
        console.warn('It should NOT be your User Pool ID. Skipping Cognito logout and redirecting to frontend.');
      } else {
        console.log('No Cognito domain configured, redirecting directly to frontend');
      }
      res.redirect(logoutUri);
    }
  });
});

/**
 * Get current user info from session
 * Also checks if user exists in database
 */
router.get('/me', async (req: Request, res: Response) => {
  if (!req.session.userInfo) {
    res.json({
      isAuthenticated: false,
      userInfo: null,
      userExistsInDb: false,
    });
    return;
  }

  const userInfo = req.session.userInfo;
  
  // Check if user exists in database
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userInfo.email },
          { cognitoId: userInfo.sub },
        ],
      },
      select: {
        userId: true,
        organizationId: true,
        role: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePictureUrl: true,
        disciplineTeamId: true,
      },
    });

    if (user) {
      // Fetch organization data
      const organization = await prisma.organization.findFirst({
        where: {
          id: user.organizationId,
        },
        select: {
          id: true,
          name: true,
        },
      });

      res.json({
        isAuthenticated: true,
        userInfo: req.session.userInfo,
        userExistsInDb: true,
        user: user,
        organization: organization,
      });
    } else {
      res.json({
        isAuthenticated: true, // Has Cognito session
        userInfo: req.session.userInfo,
        userExistsInDb: false, // But not in database yet
      });
    }
  } catch (error) {
    console.error('Error checking user in database:', error);
    res.json({
      isAuthenticated: true,
      userInfo: req.session.userInfo,
      userExistsInDb: false,
      error: 'Failed to check user in database',
    });
  }
});

export default router;

