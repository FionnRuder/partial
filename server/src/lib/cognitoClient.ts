// Use dynamic import for ES module compatibility
// Since openid-client is an ES module, we use dynamic imports
// The client type will be inferred at runtime
let client: any = null;

export interface CognitoConfig {
  issuerUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

/**
 * Initialize the OpenID Client for Amazon Cognito
 */
export async function initializeCognitoClient(): Promise<any> {
  if (client) {
    return client;
  }

  // Dynamic import for ES module (v5.7.0 is more compatible with CommonJS)
  // TypeScript has issues with ES module imports in CommonJS, so we use type assertion
  // @ts-ignore - ES module dynamic import type checking issue
  const openidClient = await import('openid-client') as any;
  const Issuer = openidClient.Issuer;
  
  if (!Issuer || typeof Issuer.discover !== 'function') {
    throw new Error('Failed to import Issuer from openid-client. Make sure openid-client v5.7.0 is installed.');
  }

  const issuerUrl = process.env.COGNITO_ISSUER_URL || 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8';
  const clientId = process.env.COGNITO_CLIENT_ID || '5429ep5otfjduo6ntjt2foc5of';
  const clientSecret = process.env.COGNITO_CLIENT_SECRET || '';
  // Default to localhost for development, use env var for production
  const redirectUri = process.env.COGNITO_REDIRECT_URI || 'http://localhost:8000/auth/callback';

  if (!clientSecret) {
    throw new Error('COGNITO_CLIENT_SECRET environment variable is required');
  }

  try {
    const issuer = await Issuer.discover(issuerUrl);
    
    // If custom domain DNS is not ready, override endpoints to use Cognito hosted UI domain
    const customDomain = process.env.COGNITO_USER_POOL_DOMAIN;
    const useIssuerUrlForAuth = process.env.COGNITO_USE_ISSUER_URL_FOR_AUTH === 'true' || 
                                 (customDomain && !customDomain.includes('.amazoncognito.com'));
    const cognitoHostedUIDomain = process.env.COGNITO_HOSTED_UI_DOMAIN;
    
    if (useIssuerUrlForAuth && cognitoHostedUIDomain) {
      // Override token and userinfo endpoints to use Cognito hosted UI domain instead of custom domain
      // This is needed when custom domain DNS is not configured
      const hostedUIDomain = cognitoHostedUIDomain.replace(/^https?:\/\//, ''); // Remove protocol if present
      
      // Extract region from issuer URL
      const regionMatch = issuerUrl.match(/cognito-idp\.([^.]+)\.amazonaws\.com/);
      const region = regionMatch ? regionMatch[1] : 'us-east-1';
      
      // Override endpoints to use Cognito hosted UI domain
      // Note: We can't directly modify issuer properties, but we can create a new issuer with overridden endpoints
      // Actually, we need to override the issuer's metadata
      const originalTokenEndpoint = issuer.token_endpoint;
      const originalUserinfoEndpoint = issuer.userinfo_endpoint;
      
      // Check if endpoints are using custom domain
      if (customDomain && (originalTokenEndpoint?.includes(customDomain) || originalUserinfoEndpoint?.includes(customDomain))) {
        // Override to use Cognito hosted UI domain
        const baseUrl = `https://${hostedUIDomain}`;
        
        // Create a new issuer with overridden endpoints
        // We'll need to manually set these on the issuer object
        // Since issuer properties might be read-only, we'll handle this in the callback route instead
        console.log('Custom domain detected in issuer endpoints. Token exchange will use Cognito hosted UI domain.');
        console.log('Token endpoint will be overridden to:', `${baseUrl}/oauth2/token`);
        console.log('Userinfo endpoint will be overridden to:', `${baseUrl}/oauth2/userInfo`);
      }
    }
    
    client = new issuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
      response_types: ['code'],
    });

    console.log('Cognito OIDC client initialized successfully');
    if (customDomain) {
      console.log('Custom domain configured:', customDomain);
      if (useIssuerUrlForAuth) {
        console.log('Using Cognito hosted UI domain for token exchange (custom domain DNS not ready)');
      }
    }
    return client;
  } catch (error) {
    console.error('Failed to initialize Cognito OIDC client:', error);
    throw error;
  }
}

/**
 * Get the initialized Cognito client
 */
export function getCognitoClient(): any {
  if (!client) {
    throw new Error('Cognito client not initialized. Call initializeCognitoClient() first.');
  }
  return client;
}

