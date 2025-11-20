# Fixing Cognito BadRequest Error

## Problem
When clicking "Get Started" or "Login", you get redirected to:
```
https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8/oauth2/authorize?...
```

And Cognito returns:
```json
{"code":"BadRequest","message":"The server did not understand the operation that was requested.","type":"client"}
```

## Root Cause
The code was manually constructing the authorization URL using the issuer URL directly. Cognito doesn't accept authorization requests to the issuer URL - it requires the **hosted UI domain**.

## Solution
The code has been updated to:
1. Use the discovered authorization endpoint from the issuer (which is the hosted UI domain)
2. Fall back gracefully if needed

## Additional Checks Required

### 1. Verify Redirect URI in Cognito
The redirect URI `http://localhost:8000/auth/callback` **MUST** be configured in your Cognito App Client settings.

**Steps:**
1. Go to AWS Console → Cognito → Your User Pool → App integration → App clients
2. Click on your app client (ID: `5429ep5otfjduo6ntjt2foc5of`)
3. Scroll to "Hosted UI" section
4. Under "Allowed callback URLs", ensure you have:
   ```
   http://localhost:8000/auth/callback
   ```
5. Under "Allowed sign-out URLs", ensure you have:
   ```
   http://localhost:3000/onboarding
   ```
6. Click "Save changes"

### 2. Verify OAuth Scopes
In the same App Client settings:
- **Allowed OAuth scopes**: Must include `openid`, `email`, `profile`, `phone`
- **Allowed OAuth flows**: Must include `Authorization code grant`

### 3. Check Server Logs
After restarting your server, check the logs when clicking "Get Started". You should see:
```
Using discovered authorization endpoint from issuer
Generated authorization URL: https://your-prefix.auth.us-east-1.amazoncognito.com/oauth2/authorize?...
```

The URL should now use the hosted UI domain (`.auth.us-east-1.amazoncognito.com`), not the issuer URL.

## Testing
1. Restart your server
2. Click "Get Started" or "Login" on `/onboarding`
3. You should be redirected to the Cognito hosted UI login page (not get a BadRequest error)
4. After logging in, you should be redirected back to your app

## If Still Getting BadRequest

If you still get the error after the fix, check:

1. **Redirect URI mismatch**: The `redirect_uri` in the authorization URL must exactly match what's configured in Cognito
2. **Client ID mismatch**: Verify the client ID in your `.env` matches the App Client ID in Cognito
3. **OAuth scopes**: Ensure all requested scopes are allowed in Cognito
4. **App Client secret**: If using a client secret, ensure it's correctly set in your `.env`

