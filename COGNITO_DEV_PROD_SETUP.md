# Cognito Integration: Development & Production Setup Guide

This guide explains how to configure your Cognito integration to work seamlessly in both **local development** and **production** environments.

## Overview

The Cognito integration automatically detects the environment and configures itself accordingly:
- **Development**: Uses `http://localhost` URLs, non-secure cookies
- **Production**: Uses HTTPS URLs, secure cookies, proper CORS settings

## Key Configuration Points

### 1. Cognito App Client Settings (CRITICAL)

In your AWS Cognito Console, you **MUST** configure your App Client to accept **BOTH** local and production URLs:

**AWS Console → Cognito → Your User Pool → App integration → App clients → Your App Client**

#### Allowed Callback URLs:
Add **both** URLs (comma-separated or one per line):
```
http://localhost:8000/auth/callback
https://your-production-api-domain.com/auth/callback
```

#### Allowed Sign-out URLs:
Add **both** URLs:
```
http://localhost:3000/onboarding
https://your-production-domain.com/onboarding
```

#### OAuth Settings:
- **Allowed OAuth flows**: ✅ Authorization code grant
- **Allowed OAuth scopes**: ✅ openid, ✅ email, ✅ profile, ✅ phone

### 2. Environment Variables

#### Development (`.env` in `server/` directory):
```env
NODE_ENV=development
PORT=8000
SESSION_SECRET=your-dev-secret
FRONTEND_URL=http://localhost:3000
COGNITO_REDIRECT_URI=http://localhost:8000/auth/callback
COGNITO_LOGOUT_URI=http://localhost:3000/onboarding
COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8
COGNITO_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
COGNITO_CLIENT_SECRET=your-client-secret
COGNITO_USER_POOL_DOMAIN=  # Optional, leave empty for local dev
COGNITO_USE_ISSUER_URL_FOR_AUTH=true  # Use issuer URL if custom domain DNS not ready
```

#### Production (`.env` in `server/` directory):
```env
NODE_ENV=production
PORT=8000  # Or your production port
SESSION_SECRET=<generate-secure-random-string>  # Use: openssl rand -base64 32
FRONTEND_URL=https://your-production-domain.com
COGNITO_REDIRECT_URI=https://your-api-domain.com/auth/callback
COGNITO_LOGOUT_URI=https://your-production-domain.com/onboarding
COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8
COGNITO_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
COGNITO_CLIENT_SECRET=your-client-secret  # Same as dev
COGNITO_USER_POOL_DOMAIN=auth.yourdomain.com  # If using custom domain
COGNITO_USE_ISSUER_URL_FOR_AUTH=false  # Set to false once DNS is configured
```

#### Client Development (`.env.local` in `client/` directory):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

#### Client Production (`.env.local` in `client/` directory):
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

## Automatic Environment Detection

The code automatically detects the environment:

1. **Session Cookies**:
   - Development: `secure: false`, `sameSite: 'lax'`
   - Production: `secure: true`, `sameSite: 'none'` (when HTTPS detected)

2. **CORS**:
   - Automatically configured based on `FRONTEND_URL`

3. **Redirects**:
   - All redirects use `FRONTEND_URL` environment variable
   - Falls back to appropriate defaults if not set

## Testing the Setup

### Local Development:
1. Start server: `cd server && npm run dev`
2. Start client: `cd client && npm run dev`
3. Visit: `http://localhost:3000/onboarding`
4. Click "Get Started" or "Login"
5. Should redirect to Cognito login
6. After login, should redirect back to `http://localhost:3000/home` or `/onboarding`

### Production:
1. Deploy with production `.env` file
2. Visit: `https://your-production-domain.com/onboarding`
3. Click "Get Started" or "Login"
4. Should redirect to Cognito login
5. After login, should redirect back to `https://your-production-domain.com/home` or `/onboarding`

## Troubleshooting

### Issue: "Invalid redirect_uri" error
**Solution**: Ensure both local and production callback URLs are added to Cognito App Client settings.

### Issue: Session not persisting in production
**Solution**: 
- Ensure `FRONTEND_URL` uses `https://`
- Check that `SESSION_SECRET` is set and secure
- Verify cookies are being sent (check browser DevTools → Network → Cookies)

### Issue: CORS errors in production
**Solution**: Ensure `FRONTEND_URL` in server `.env` matches your actual frontend domain.

### Issue: Custom domain DNS not resolving
**Solution**: Set `COGNITO_USE_ISSUER_URL_FOR_AUTH=true` to use issuer URL for login until DNS is configured.

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different `SESSION_SECRET`** for development and production
3. **Generate secure secrets**: `openssl rand -base64 32`
4. **Use HTTPS in production** (required for secure cookies)
5. **Regularly rotate secrets** in production

## Migration Checklist

When deploying to production:

- [ ] Create production `.env` file with production URLs
- [ ] Generate secure `SESSION_SECRET` for production
- [ ] Add production callback URL to Cognito App Client
- [ ] Add production sign-out URL to Cognito App Client
- [ ] Update client `.env.local` with production API URL
- [ ] Test login flow in production
- [ ] Test logout flow in production
- [ ] Verify session persistence
- [ ] Verify CORS is working correctly
- [ ] Test with custom domain (if applicable)

