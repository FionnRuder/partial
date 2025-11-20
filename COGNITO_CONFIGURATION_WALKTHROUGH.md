# Cognito OIDC Configuration Walkthrough

This guide will walk you through each step needed to configure Amazon Cognito OIDC authentication.

## Step 1: Generate a Secure Session Secret

First, let's generate a secure random string for your session secret. This is critical for security.

### On Windows (PowerShell):
```powershell
# Generate a secure random string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### On Windows (Command Prompt with OpenSSL):
If you have OpenSSL installed:
```cmd
openssl rand -base64 32
```

### Alternative (Online):
You can also use an online random string generator, but make sure it's from a trusted source.

**Save this value** - you'll need it in Step 3.

---

## Step 2: Get Your Cognito Client Secret

1. **Log in to AWS Console**
   - Go to https://console.aws.amazon.com/
   - Navigate to Amazon Cognito service

2. **Find Your User Pool**
   - In the left sidebar, click "User pools"
   - Find and click on your user pool: **"wgv9rf"** (or the pool ID: `us-east-1_zFt1mmhx8`)

3. **Navigate to App Integration Tab**
   - Click on the "App integration" tab
   - Scroll down to find "App clients and analytics"
   - You should see your app client: `5429ep5otfjduo6ntjt2foc5of`

4. **Get the Client Secret**
   - Click on your app client ID
   - Look for "Client secret" field
   - **If you don't see a client secret:**
     - Your app client might be configured as a "Public client" (no secret)
     - You'll need to either:
       - Create a new app client with a secret, OR
       - Modify the code to work without a client secret (requires code changes)
   - **If you see a client secret:**
     - Click "Show" to reveal it
     - **Copy this value** - you'll need it in Step 3
     - ⚠️ **Important**: You can only see the secret once when it's first created. If you've lost it, you'll need to create a new app client.

---

## Step 3: Get Your Cognito User Pool Domain

1. **Still in Your User Pool Settings**
   - In the "App integration" tab
   - Scroll to "Domain" section

2. **Check Your Domain**
   - You should see either:
     - A **Cognito domain**: `your-app-name.auth.us-east-1.amazoncognito.com`
     - A **Custom domain**: Your own domain name
   - **Copy the domain name** (without `https://` prefix) - you'll need it in Step 3

3. **If No Domain Exists**
   - Click "Create Cognito domain" or "Create custom domain"
   - Choose a unique domain prefix (e.g., `your-app-name`)
   - Save the domain name

---

## Step 4: Create Your .env File

1. **Navigate to the server directory**
   ```bash
   cd server
   ```

2. **Create a new .env file**
   - Copy the template from `ENV_EXAMPLE.md`
   - Or create a new file named `.env`

3. **Fill in the following values:**

```env
# Server Port (usually already set)
PORT=3001

# Session Secret (from Step 1)
SESSION_SECRET=<paste-your-generated-secret-here>

# Frontend URL (adjust if different)
FRONTEND_URL=http://localhost:3000

# Cognito Configuration
COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8
COGNITO_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
COGNITO_CLIENT_SECRET=<paste-your-client-secret-from-step-2>
COGNITO_REDIRECT_URI=https://d84l1y8p4kdic.cloudfront.net/auth/callback
COGNITO_USER_POOL_DOMAIN=<paste-your-domain-from-step-3>
COGNITO_LOGOUT_URI=http://localhost:3000/onboarding

# Development Settings
NODE_ENV=development
```

**Important Notes:**
- Replace `<paste-your-generated-secret-here>` with the secret from Step 1
- Replace `<paste-your-client-secret-from-step-2>` with the client secret from Step 2
- Replace `<paste-your-domain-from-step-3>` with your domain from Step 3 (just the domain, no `https://`)
- The `COGNITO_REDIRECT_URI` should match what you'll configure in Step 5

---

## Step 5: Configure Cognito App Client Settings

1. **Back in AWS Cognito Console**
   - Still in your User Pool → App integration tab
   - Find your app client: `5429ep5otfjduo6ntjt2foc5of`
   - Click on it to edit

2. **Configure Hosted UI Settings**

   **a. Allowed callback URLs:**
   - Add: `https://d84l1y8p4kdic.cloudfront.net/auth/callback`
   - If testing locally, also add: `http://localhost:3001/auth/callback`
   - ⚠️ **Important**: The path `/auth/callback` must match your server route

   **b. Allowed sign-out URLs:**
   - Add: `http://localhost:3000/onboarding`
   - Add your production logout URL if different

   **c. Allowed OAuth scopes:**
   - Check: `openid`
   - Check: `email`
   - Check: `profile`
   - Check: `phone`

   **d. Allowed OAuth flows:**
   - Check: `Authorization code grant`
   - Uncheck: `Implicit grant` (not needed for server-side flow)

3. **Save Changes**
   - Click "Save changes" at the bottom

---

## Step 6: Verify Your Configuration

Let's verify everything is set up correctly:

1. **Check your .env file exists:**
   ```bash
   cd server
   # On Windows PowerShell:
   Test-Path .env
   # Should return: True
   ```

2. **Verify all required variables are set:**
   - Open `.env` file
   - Make sure there are no `<placeholder>` values remaining
   - All values should be filled in

3. **Test the server starts:**
   ```bash
   cd server
   npm run dev
   ```
   
   You should see:
   - "Cognito OIDC client initialized successfully"
   - "Server running on port 3001"

   If you see an error about the client secret, double-check Step 2 and Step 4.

---

## Step 7: Test the Authentication Flow

1. **Start your server** (if not already running):
   ```bash
   cd server
   npm run dev
   ```

2. **Test the login endpoint:**
   - Open your browser
   - Navigate to: `http://localhost:3001/auth/login`
   - You should be redirected to Cognito's hosted UI

3. **Sign in with a test user:**
   - If you don't have a user, create one in Cognito User Pool
   - After signing in, you should be redirected back to your frontend

4. **Check authentication status:**
   - Navigate to: `http://localhost:3001/auth/me`
   - You should see your user information in JSON format

---

## Troubleshooting

### Error: "COGNITO_CLIENT_SECRET environment variable is required"
- **Solution**: Make sure you've set `COGNITO_CLIENT_SECRET` in your `.env` file
- Check that the file is named exactly `.env` (not `.env.txt` or similar)

### Error: "Failed to initialize Cognito OIDC client"
- **Solution**: 
  - Verify `COGNITO_ISSUER_URL` is correct
  - Check that `COGNITO_CLIENT_ID` matches your app client
  - Verify `COGNITO_CLIENT_SECRET` is correct (no extra spaces)

### Redirect URI mismatch error
- **Solution**: 
  - The callback URL in Cognito must exactly match `COGNITO_REDIRECT_URI` in your `.env`
  - Check for trailing slashes, http vs https, etc.
  - Make sure the path includes `/auth/callback`

### "User authenticated but not found in database"
- **Solution**: This is expected if the user doesn't exist in your database yet
- You'll need to either:
  - Create the user during onboarding
  - Or modify the callback route to auto-create users

### Session not persisting
- **Solution**: 
  - Make sure cookies are enabled in your browser
  - Check that CORS is configured correctly (credentials: true)
  - Verify `SESSION_SECRET` is set

---

## Next Steps

After completing this configuration:

1. **Update your frontend** to use the new authentication endpoints
2. **Handle user creation** in your database when new Cognito users authenticate
3. **Test the full flow** end-to-end
4. **Configure production environment** variables for deployment

---

## Quick Reference

### Your Cognito Values:
- **User Pool ID**: `us-east-1_zFt1mmhx8`
- **Region**: `us-east-1`
- **App Client ID**: `5429ep5otfjduo6ntjt2foc5of`
- **Issuer URL**: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8`

### Your Server Routes:
- Login: `http://localhost:3001/auth/login`
- Callback: `http://localhost:3001/auth/callback`
- Logout: `http://localhost:3001/auth/logout`
- Current User: `http://localhost:3001/auth/me`

---

## Need Help?

If you encounter issues:
1. Check the error messages in your server console
2. Verify all environment variables are set correctly
3. Double-check Cognito App Client settings match your configuration
4. Review the `COGNITO_OIDC_SETUP.md` file for more details

