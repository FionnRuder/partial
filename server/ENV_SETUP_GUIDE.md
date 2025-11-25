# Environment Variables Setup Guide

## Where to Find/Set Environment Variables

Environment variables are stored in a `.env` file in the **server directory**.

### Location
```
server/
  └── .env  ← Create this file here
```

## Quick Setup

### 1. Create the `.env` file

If you don't have a `.env` file yet, create one:

**Option A: Copy from example**
```bash
cd server
cp .env.example .env
```

**Option B: Create manually**
Create a new file called `.env` in the `server/` directory.

### 2. Add Required Variables

Open `server/.env` and add these variables:

```env
# Server Configuration
NODE_ENV=development
PORT=8000
SESSION_SECRET=your-secret-here
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/partial

# AWS Cognito (your existing values)
COGNITO_ISSUER_URL=your-issuer-url
COGNITO_CLIENT_ID=your-client-id
COGNITO_CLIENT_SECRET=your-client-secret
COGNITO_REDIRECT_URI=http://localhost:8000/auth/callback
COGNITO_LOGOUT_URI=http://localhost:3000/onboarding

# AWS SES (Email Notifications) - ADD THESE:
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
```

### 3. Get Your AWS Credentials

To get your AWS Access Key ID and Secret Access Key:

1. Go to AWS Console → IAM → Users
2. Select your user (or create a new one for SES)
3. Go to "Security credentials" tab
4. Click "Create access key"
5. Choose "Application running outside AWS" (for local development)
6. Copy the Access Key ID and Secret Access Key
7. **Save the Secret Access Key immediately** - you won't be able to see it again!

### 4. IAM Permissions

Ensure your AWS user/role has SES permissions. Here's how to set it up:

#### Option A: Using AWS Console (Recommended for beginners)

1. **Go to AWS Console → IAM**
   - Navigate to: https://console.aws.amazon.com/iam/

2. **Choose your approach:**
   - **If using an IAM User** (for local development):
     - Go to "Users" → Select your user
     - Click "Add permissions" → "Attach policies directly"
     - Search for "AmazonSESFullAccess" or create a custom policy (see below)
   - **If using an IAM Role** (for AWS services like EC2, ECS, Lambda):
     - Go to "Roles" → Select your role
     - Click "Add permissions" → "Attach policies"
     - Search for "AmazonSESFullAccess" or create a custom policy

3. **Quick Option - Use AWS Managed Policy:**
   - Search for: `AmazonSESFullAccess`
   - Click "Add permissions"
   - This gives full SES access (good for development)

4. **Better Option - Create Custom Policy (More Secure):**
   - Click "Create policy" → "JSON" tab
   - Paste this policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ses:SendEmail",
           "ses:SendRawEmail"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
   - Click "Next" → Name it "SESEmailSending" → "Create policy"
   - Go back to your User/Role → "Add permissions" → "Attach policies directly"
   - Search for "SESEmailSending" → Select it → "Add permissions"

#### Option B: Using AWS CLI

```bash
# Attach the managed policy to a user
aws iam attach-user-policy \
  --user-name your-username \
  --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess

# Or create and attach a custom policy
aws iam put-user-policy \
  --user-name your-username \
  --policy-name SESEmailSending \
  --policy-document file://ses-policy.json
```

#### Verification

After adding permissions:
1. Wait a few seconds for changes to propagate
2. Test by creating an invitation with an email
3. Check server logs for any permission errors
4. If errors occur, verify the policy is attached correctly

## File Structure

```
server/
  ├── .env              ← Your actual environment variables (DO NOT COMMIT)
  ├── .env.example      ← Template file (safe to commit)
  ├── ENV_SETUP_GUIDE.md ← This file
  └── src/
      └── index.ts      ← Loads .env using dotenv.config()
```

## Important Notes

1. **`.env` is gitignored** - Your actual credentials should never be committed
2. **`.env.example` is safe to commit** - It's a template without real values
3. **Server loads `.env` automatically** - The server uses `dotenv.config()` in `src/index.ts`
4. **Restart server after changes** - Environment variables are loaded at startup

## Verification

To verify your environment variables are loaded:

1. Check server logs on startup - should show no errors
2. Try creating an invitation with an email - should send email
3. Check AWS CloudWatch logs if emails fail

## Production Setup

For production:

1. Use environment variables in your hosting platform (AWS, Heroku, etc.)
2. Or use AWS Secrets Manager for sensitive values
3. Never hardcode credentials in code
4. Use IAM roles when running on AWS infrastructure

## Troubleshooting

### Variables not loading?
- Make sure `.env` is in the `server/` directory (not root)
- Check file name is exactly `.env` (not `.env.txt`)
- Restart your server after adding variables

### Can't find AWS credentials?
- Check AWS Console → IAM → Users → Your User → Security credentials
- Make sure you have an access key created
- Verify the key hasn't been deleted

### Email not sending?

#### Error: "Email address is not verified"

This error means you're in **SES Sandbox Mode** and trying to send to an unverified email address.

**Solution 1: Verify recipient email addresses (for testing)**
1. Go to AWS Console → SES → Verified identities
2. Click "Create identity"
3. Choose "Email address"
4. Enter the recipient email (e.g., `fionn+4@ruders.org`)
5. Click "Create identity"
6. Check the email inbox and click the verification link
7. Repeat for each test email address

**Solution 2: Request production access (for production)**
1. Go to AWS Console → SES → Account dashboard
2. Click "Request production access"
3. Fill out the form:
   - **Mail Type**: Transactional
   - **Website URL**: Your production URL
   - **Use case description**: "Sending transactional emails for work management notifications (assignments, status changes, comments, invitations)"
   - **Expected sending volume**: Your estimated daily/monthly volume
4. Submit the request (usually approved within 24 hours)
5. Once approved, you can send to any email address

**Other common issues:**
- Verify AWS credentials are correct
- Verify `notifications@partialsystems.com` is verified in SES
- Check server logs for detailed error messages
- Ensure your domain `partialsystems.com` is verified if using domain verification

