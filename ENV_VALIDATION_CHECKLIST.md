# .env File Validation Checklist

Use this checklist to verify your `server/.env` file is correctly configured for local development.

## Required Variables (Must Have)

### ✅ Basic Server Configuration
- [ ] `NODE_ENV=development` (or `production` for prod)
- [ ] `PORT=8000` (or your server port)
- [ ] `SESSION_SECRET=<some-secret-string>` (use a secure random string in production)

### ✅ Frontend Configuration
- [ ] `FRONTEND_URL=http://localhost:3000` (for local dev)
  - For production: `https://your-production-domain.com`

### ✅ Cognito Configuration (Required)
- [ ] `COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8`
- [ ] `COGNITO_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of`
- [ ] `COGNITO_CLIENT_SECRET=<your-actual-client-secret>` ⚠️ **MUST be your real secret, not placeholder**
- [ ] `COGNITO_REDIRECT_URI=http://localhost:8000/auth/callback` (for local dev)
  - For production: `https://your-api-domain.com/auth/callback`

### ✅ Optional Cognito Configuration
- [ ] `COGNITO_USER_POOL_DOMAIN=auth.partialsystems.com` (if using custom domain)
- [ ] `COGNITO_USE_ISSUER_URL_FOR_AUTH=true` (set to `true` if custom domain DNS not ready)
- [ ] `COGNITO_LOGOUT_URI=http://localhost:3000/onboarding` (for local dev)
  - For production: `https://your-production-domain.com/onboarding`

## Common Issues to Check

### ❌ Issue 1: Missing COGNITO_CLIENT_SECRET
**Error**: `COGNITO_CLIENT_SECRET environment variable is required`
**Fix**: Make sure you have `COGNITO_CLIENT_SECRET=<your-actual-secret>` (not a placeholder)

### ❌ Issue 2: Wrong Redirect URI Format
**Error**: `Invalid redirect_uri` from Cognito
**Fix**: 
- Must be: `http://localhost:8000/auth/callback` (for local)
- Must match exactly what's configured in Cognito App Client settings
- Must point to SERVER, not client

### ❌ Issue 3: Custom Domain DNS Not Ready
**Error**: `DNS_PROBE_FINISHED_NXDOMAIN` when clicking login
**Fix**: Set `COGNITO_USE_ISSUER_URL_FOR_AUTH=true` until DNS is configured

### ❌ Issue 4: Redirect URI Not in Cognito
**Error**: `BadRequest` or `Invalid redirect_uri` from Cognito
**Fix**: Add `http://localhost:8000/auth/callback` to Cognito App Client "Allowed callback URLs"

## Example Correct .env File (Local Development)

```env
# Server Configuration
NODE_ENV=development
PORT=8000
SESSION_SECRET=your-secret-here-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Cognito Configuration
COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8
COGNITO_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
COGNITO_CLIENT_SECRET=your-actual-client-secret-from-aws
COGNITO_REDIRECT_URI=http://localhost:8000/auth/callback

# Custom Domain (Optional)
COGNITO_USER_POOL_DOMAIN=auth.partialsystems.com
COGNITO_USE_ISSUER_URL_FOR_AUTH=true

# Logout Configuration
COGNITO_LOGOUT_URI=http://localhost:3000/onboarding
```

## How to Get Your COGNITO_CLIENT_SECRET

1. Go to AWS Console → Cognito → Your User Pool → App integration → App clients
2. Click on your app client (ID: `5429ep5otfjduo6ntjt2foc5of`)
3. If you see "Client secret" field, copy it
4. If you don't see it, you may need to:
   - Create a new app client with a secret, OR
   - Check if your app client was created without a secret (some configurations don't require it)

**Note**: If your app client doesn't have a secret, you may need to modify the code to handle that case, or create a new app client with a secret enabled.

## Verification Steps

1. ✅ All required variables are present
2. ✅ `COGNITO_CLIENT_SECRET` is your actual secret (not placeholder)
3. ✅ `COGNITO_REDIRECT_URI` matches Cognito App Client settings
4. ✅ `COGNITO_USE_ISSUER_URL_FOR_AUTH=true` if custom domain DNS not ready
5. ✅ No typos in URLs (check for `http://` vs `https://`, trailing slashes, etc.)

## Quick Test

After updating your `.env` file:
1. Restart your server
2. Check server logs for: `Cognito OIDC client initialized successfully`
3. If you see an error about `COGNITO_CLIENT_SECRET`, you need to add/update it
4. Try clicking "Get Started" - should redirect to Cognito login

