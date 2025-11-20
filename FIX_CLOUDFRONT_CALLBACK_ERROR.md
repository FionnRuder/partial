# Fix: CloudFront "Access Denied" Error After Cognito Login

## Problem
After completing Cognito authentication, you're being redirected to CloudFront and getting:
```
<Error>
<Code>AccessDenied</Code>
<Message>Access Denied</Message>
</Error>
```

This happens because Cognito is redirecting to the CloudFront URL instead of your local server.

## Root Cause
Your `COGNITO_REDIRECT_URI` environment variable is still set to the CloudFront URL, so Cognito redirects there after authentication.

## Solution

### Step 1: Update `server/.env` File

Open `server/.env` and make sure you have:
```env
COGNITO_REDIRECT_URI=http://localhost:8000/auth/callback
```

**NOT:**
```env
COGNITO_REDIRECT_URI=https://d84l1y8p4kdic.cloudfront.net/auth/callback
```

### Step 2: Update Cognito App Client Settings

1. Go to **AWS Console** → **Cognito** → **User Pools** → **"wgv9rf"**
2. Click **"App integration"** tab
3. Find your app client: `5429ep5otfjduo6ntjt2foc5of`
4. Click on it to edit
5. In **"Allowed callback URLs"**, make sure you have:
   ```
   http://localhost:8000/auth/callback
   https://d84l1y8p4kdic.cloudfront.net/auth/callback
   ```
   (Both URLs, one per line)
6. Click **"Save changes"**

### Step 3: Restart Your Server

**IMPORTANT**: After updating `.env`, you MUST restart your server:

```bash
# Stop server (Ctrl+C in the terminal running the server)
# Then restart:
cd server
npm run dev
```

### Step 4: Clear Browser Session

Clear your browser's cookies/session for localhost to start fresh:
- Or use an incognito/private window
- Or clear cookies for `localhost:8000`

### Step 5: Test Again

1. Go to `http://localhost:3000/auth/login`
2. Complete Cognito authentication
3. You should now be redirected to `http://localhost:8000/auth/callback` (your server)
4. Then redirected to `http://localhost:3000/home` or `/onboarding`

## Verification

After restarting, check your server logs when you click login. You should see:
```
Cognito Login Configuration:
- Redirect URI: http://localhost:8000/auth/callback
```

If you still see the CloudFront URL, your `.env` file wasn't updated or the server wasn't restarted.

## Why This Happens

The redirect URI in the authorization URL must match:
1. What's in your `.env` file (`COGNITO_REDIRECT_URI`)
2. What's configured in Cognito's allowed callback URLs

If they don't match, Cognito will either:
- Reject the request (if URL isn't in allowed list)
- Redirect to the wrong place (if URL is wrong)

## Still Not Working?

1. **Check server logs** - What redirect URI is shown?
2. **Check `.env` file** - Is `COGNITO_REDIRECT_URI` set correctly?
3. **Check Cognito Console** - Is `http://localhost:8000/auth/callback` in allowed callback URLs?
4. **Restart server** - Environment variables are only loaded on startup

