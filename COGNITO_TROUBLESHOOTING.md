# Cognito Login Error Troubleshooting

## Error: "Something went wrong" on Cognito Login Page

This error typically occurs when there's a mismatch between your application configuration and Cognito settings.

## Common Causes & Solutions

### 1. Redirect URI Mismatch

**Problem**: The redirect URI in your authorization request doesn't match what's configured in Cognito.

**Solution**:
1. Check your server logs - you should see:
   ```
   Cognito Login Configuration:
   - Redirect URI: http://localhost:8000/auth/callback
   ```
2. Go to AWS Console → Cognito → Your User Pool → App integration → App client
3. In "Allowed callback URLs", make sure you have:
   - `http://localhost:8000/auth/callback` (for local development)
   - `https://d84l1y8p4kdic.cloudfront.net/auth/callback` (for production)
4. The redirect URI must **exactly match** (including protocol, port, and path)

### 2. Client Secret Issues

**Problem**: Your app client might be configured as a "Public client" (no secret), but your code expects a secret.

**Check**:
1. Go to AWS Console → Cognito → Your User Pool → App integration → App client
2. Check if "Client secret" field exists
3. If it says "Public client" or no secret field:
   - Option A: Create a new app client WITH a secret
   - Option B: Modify code to work without a secret (requires code changes)

**Solution A - Create New App Client with Secret**:
1. Create a new app client
2. Make sure "Generate client secret" is checked
3. Update your `.env` with the new client ID and secret
4. Update callback URLs in the new app client

**Solution B - Use Public Client** (if you prefer):
- Requires modifying the code to not use client_secret
- Not recommended for server-side flows

### 3. OAuth Scopes Not Enabled

**Problem**: Required OAuth scopes are not enabled in Cognito.

**Solution**:
1. Go to AWS Console → Cognito → Your User Pool → App integration → App client
2. In "Allowed OAuth scopes", make sure these are checked:
   - ✅ `openid`
   - ✅ `email`
   - ✅ `profile`
   - ✅ `phone`

### 4. OAuth Flow Not Enabled

**Problem**: Authorization code grant flow is not enabled.

**Solution**:
1. Go to AWS Console → Cognito → Your User Pool → App integration → App client
2. In "Allowed OAuth flows", make sure:
   - ✅ `Authorization code grant` is checked
   - ❌ `Implicit grant` can be unchecked (not needed)

### 5. User Pool Domain Not Configured

**Problem**: No domain is configured for your User Pool.

**Solution**:
1. Go to AWS Console → Cognito → Your User Pool → App integration → Domain
2. If no domain exists, click "Create Cognito domain"
3. Choose a unique domain prefix (e.g., `your-app-name`)
4. Save the domain name and update `COGNITO_USER_POOL_DOMAIN` in your `.env`

### 6. Environment Variables Not Set

**Problem**: Required environment variables are missing or incorrect.

**Check your `server/.env` file**:
```env
COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8
COGNITO_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
COGNITO_CLIENT_SECRET=<your-actual-secret-here>
COGNITO_REDIRECT_URI=http://localhost:8000/auth/callback
```

**Verify**:
- All values are filled in (no `<placeholder>` text)
- `COGNITO_CLIENT_SECRET` matches what's in Cognito Console
- `COGNITO_REDIRECT_URI` matches what's in Cognito App Client settings

## Debugging Steps

### Step 1: Check Server Logs

When you click login, check your server console. You should see:
```
Cognito Login Configuration:
- Redirect URI: http://localhost:8000/auth/callback
- Client ID: 5429ep5otfjduo6ntjt2foc5of
- Issuer URL: https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8
Generated authorization URL: https://...
```

If you see errors here, that's the issue.

### Step 2: Check the Generated Authorization URL

The server logs will show the full authorization URL. Copy it and check:
- Does it include the correct `redirect_uri` parameter?
- Does it include the correct `client_id`?
- Does it include the required scopes?

### Step 3: Test the Authorization URL Directly

1. Copy the authorization URL from server logs
2. Paste it in your browser
3. If it works, the issue is with the redirect
4. If it fails, the issue is with Cognito configuration

### Step 4: Verify Cognito App Client Settings

In AWS Console, verify:
- ✅ Client ID matches your `.env`
- ✅ Client secret matches your `.env` (if using secret)
- ✅ Callback URLs include: `http://localhost:8000/auth/callback`
- ✅ OAuth scopes include: `openid`, `email`, `profile`, `phone`
- ✅ OAuth flow: `Authorization code grant` is enabled

## Quick Checklist

- [ ] Server logs show correct configuration
- [ ] `COGNITO_REDIRECT_URI` in `.env` matches Cognito callback URLs exactly
- [ ] `COGNITO_CLIENT_SECRET` is set and matches Cognito
- [ ] All required OAuth scopes are enabled in Cognito
- [ ] Authorization code grant flow is enabled
- [ ] User Pool domain is configured
- [ ] No typos in environment variables

## Still Not Working?

1. **Check browser console** for any JavaScript errors
2. **Check network tab** to see the exact request/response
3. **Try the authorization URL directly** in a new incognito window
4. **Verify your Cognito User Pool is in the correct region** (us-east-1)
5. **Check if there are any Cognito service issues** in AWS status page

## Common Error Messages

### "invalid_client"
- Client ID or secret is wrong
- Client doesn't exist
- Client is disabled

### "invalid_redirect_uri"
- Redirect URI doesn't match what's configured
- Check exact match including protocol (http vs https)

### "invalid_scope"
- One of the requested scopes is not enabled
- Check OAuth scopes in Cognito settings

### "unauthorized_client"
- OAuth flow is not enabled
- Check "Allowed OAuth flows" in Cognito

