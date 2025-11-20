# Cognito Configuration Checklist

Use this checklist to ensure you've completed all configuration steps.

## ✅ Step 1: Generate Session Secret

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete

**Generated Secret**: `lBGEHtTjgAac2nRPCmd6hwes7bpuK3DQ`

**Action**: Add this to your `server/.env` file as `SESSION_SECRET`

---

## ✅ Step 2: Get Cognito Client Secret

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete

**Where to find it:**
1. AWS Console → Cognito → User Pools → "wgv9rf" (or `us-east-1_zFt1mmhx8`)
2. App integration tab → App clients → Click on `5429ep5otfjduo6ntjt2foc5of`
3. Look for "Client secret" field
4. Click "Show" to reveal it

**Your Client Secret**: `___________________________`

**Action**: Add this to your `server/.env` file as `COGNITO_CLIENT_SECRET`

**⚠️ Important**: If you don't see a client secret, your app client might be configured as "Public". You'll need to either:
- Create a new app client with a secret, OR
- Modify the code to work without a secret (requires code changes)

---

## ✅ Step 3: Get Cognito User Pool Domain

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete

**Where to find it:**
1. AWS Console → Cognito → User Pools → "wgv9rf"
2. App integration tab → Domain section
3. Look for your domain (e.g., `your-app.auth.us-east-1.amazoncognito.com`)

**Your Domain**: `___________________________`

**Action**: Add this to your `server/.env` file as `COGNITO_USER_POOL_DOMAIN` (without `https://`)

**If no domain exists**: Create one by clicking "Create Cognito domain"

---

## ✅ Step 4: Create/Update .env File

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete

**Location**: `server/.env`

**Required Variables:**

```env
# Server
PORT=3001
NODE_ENV=development

# Session (from Step 1)
SESSION_SECRET=lBGEHtTjgAac2nRPCmd6hwes7bpuK3DQ

# Frontend
FRONTEND_URL=http://localhost:3000

# Cognito (fill in from Steps 2 & 3)
COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8
COGNITO_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
COGNITO_CLIENT_SECRET=<from-step-2>
COGNITO_REDIRECT_URI=https://d84l1y8p4kdic.cloudfront.net/auth/callback
COGNITO_USER_POOL_DOMAIN=<from-step-3>
COGNITO_LOGOUT_URI=http://localhost:3000/onboarding
```

**Action**: 
1. Create `server/.env` file if it doesn't exist
2. Add all variables above
3. Replace `<from-step-2>` and `<from-step-3>` with actual values

---

## ✅ Step 5: Configure Cognito App Client

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete

**Where**: AWS Console → Cognito → User Pools → "wgv9rf" → App integration → App client `5429ep5otfjduo6ntjt2foc5of`

### 5a. Allowed Callback URLs
**Status**: [ ] Complete

**Add these URLs:**
- `https://d84l1y8p4kdic.cloudfront.net/auth/callback`
- `http://localhost:3001/auth/callback` (for local testing)

**Action**: Add both URLs to the "Allowed callback URLs" field

### 5b. Allowed Sign-out URLs
**Status**: [ ] Complete

**Add this URL:**
- `http://localhost:3000/onboarding`

**Action**: Add URL to the "Allowed sign-out URLs" field

### 5c. Allowed OAuth Scopes
**Status**: [ ] Complete

**Check these scopes:**
- [ ] `openid`
- [ ] `email`
- [ ] `profile`
- [ ] `phone`

**Action**: Check all four scopes

### 5d. Allowed OAuth Flows
**Status**: [ ] Complete

**Check:**
- [x] `Authorization code grant`

**Uncheck:**
- [ ] `Implicit grant` (not needed)

**Action**: Ensure only "Authorization code grant" is checked

### 5e. Save Changes
**Status**: [ ] Complete

**Action**: Click "Save changes" button

---

## ✅ Step 6: Verify Configuration

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete

### 6a. Check .env file exists
**Status**: [ ] Complete

**Command**: 
```powershell
cd server
Test-Path .env
```
**Expected**: Should return `True`

### 6b. Verify all variables are set
**Status**: [ ] Complete

**Action**: Open `server/.env` and verify:
- [ ] No `<placeholder>` values remain
- [ ] `COGNITO_CLIENT_SECRET` is filled in
- [ ] `COGNITO_USER_POOL_DOMAIN` is filled in
- [ ] `SESSION_SECRET` is set

### 6c. Test server starts
**Status**: [ ] Complete

**Command**:
```powershell
cd server
npm run dev
```

**Expected Output**:
```
Cognito OIDC client initialized successfully
Server running on port 3001
```

**If you see errors**: Check the troubleshooting section in `COGNITO_CONFIGURATION_WALKTHROUGH.md`

---

## ✅ Step 7: Test Authentication Flow

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete

### 7a. Test login endpoint
**Status**: [ ] Complete

**Action**: 
1. Open browser
2. Navigate to: `http://localhost:3001/auth/login`
3. Should redirect to Cognito hosted UI

### 7b. Sign in with test user
**Status**: [ ] Complete

**Action**:
1. Sign in (or create a test user in Cognito if needed)
2. Should redirect back after authentication

### 7c. Check authentication status
**Status**: [ ] Complete

**Action**:
1. Navigate to: `http://localhost:3001/auth/me`
2. Should see user information in JSON format

---

## 🎉 Configuration Complete!

Once all steps are checked off, your Cognito OIDC integration is ready to use!

## Quick Reference

### Your Values:
- **User Pool ID**: `us-east-1_zFt1mmhx8`
- **App Client ID**: `5429ep5otfjduo6ntjt2foc5of`
- **Session Secret**: `lBGEHtTjgAac2nRPCmd6hwes7bpuK3DQ`
- **Client Secret**: `___________________` (fill in from AWS Console)
- **Domain**: `___________________` (fill in from AWS Console)

### Test URLs:
- Login: `http://localhost:3001/auth/login`
- Callback: `http://localhost:3001/auth/callback`
- Logout: `http://localhost:3001/auth/logout`
- Current User: `http://localhost:3001/auth/me`

