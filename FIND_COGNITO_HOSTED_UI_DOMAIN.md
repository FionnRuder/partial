# How to Find Your Cognito Hosted UI Domain

## Problem
When clicking "Get Started" or "Login", you get a BadRequest error because Cognito doesn't accept authorization requests to the issuer URL directly. You need to use the **Cognito Hosted UI domain** instead.

## Solution: Find Your Cognito Hosted UI Domain

### Option 1: AWS Console (Easiest)

1. Go to **AWS Console → Cognito → User pools**
2. Click on your User Pool (e.g., "wgv9rf" or "User Pool - wgv9rf")
3. In the left sidebar, click **"App integration"**
4. Scroll down to the **"Domain"** section
5. You should see:
   - **Cognito domain**: `your-prefix.auth.us-east-1.amazoncognito.com` ← **This is what you need!**
   - **Custom domain**: `auth.partialsystems.com` (if configured)

**Copy the Cognito domain** (the one ending in `.amazoncognito.com`)

### Option 2: Check Domain Configuration

1. In the same "App integration" page
2. Look for the **"Domain"** section
3. The Cognito domain format is: `{prefix}.auth.{region}.amazoncognito.com`
4. Example: `wgv9rf.auth.us-east-1.amazoncognito.com`

## Update Your .env File

Add this to your `server/.env` file:

```env
# Cognito Hosted UI Domain (use this when custom domain DNS is not ready)
COGNITO_HOSTED_UI_DOMAIN=your-prefix.auth.us-east-1.amazoncognito.com
```

**Replace `your-prefix` with your actual domain prefix** (e.g., `wgv9rf`)

## Example .env Configuration

```env
# ... other variables ...

# Cognito Configuration
COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8
COGNITO_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
COGNITO_CLIENT_SECRET=your-client-secret
COGNITO_REDIRECT_URI=http://localhost:8000/auth/callback

# Custom Domain (optional, for when DNS is configured)
COGNITO_USER_POOL_DOMAIN=auth.partialsystems.com

# Use Cognito domain instead of custom domain (when DNS not ready)
COGNITO_USE_ISSUER_URL_FOR_AUTH=true

# Cognito Hosted UI Domain (REQUIRED when bypassing custom domain)
COGNITO_HOSTED_UI_DOMAIN=wgv9rf.auth.us-east-1.amazoncognito.com

# ... other variables ...
```

## After Adding COGNITO_HOSTED_UI_DOMAIN

1. **Restart your server**
2. **Click "Get Started" or "Login"**
3. You should be redirected to: `https://your-prefix.auth.us-east-1.amazoncognito.com/oauth2/authorize?...`
4. This should work even if your custom domain DNS is not configured

## Why This Is Needed

- **Issuer URL** (`https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8`) is for OIDC discovery, not for authorization
- **Custom Domain** (`auth.partialsystems.com`) requires DNS configuration
- **Cognito Hosted UI Domain** (`your-prefix.auth.us-east-1.amazoncognito.com`) works immediately without DNS setup

## Once DNS Is Configured

After you configure DNS for `auth.partialsystems.com`:

1. Set `COGNITO_USE_ISSUER_URL_FOR_AUTH=false` (or remove it)
2. The code will automatically use the custom domain
3. You can remove `COGNITO_HOSTED_UI_DOMAIN` if you want

