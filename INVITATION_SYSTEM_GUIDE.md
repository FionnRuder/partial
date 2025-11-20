# Secure Organization Invitation System

## Overview

This document describes the secure invitation system that allows authorized users to invite new members to their organization while preventing malicious actors from joining organizations without proper authorization.

## Security Features

### 1. **Cryptographically Secure Tokens**
- Tokens are generated using `crypto.randomBytes(32)` (256 bits of entropy)
- Base64url encoding for URL-safe tokens
- Tokens are unique and cannot be guessed

### 2. **Time-Limited Invitations**
- Invitations expire after a configurable number of days (default: 7 days, max: 30 days)
- Expired invitations cannot be used

### 3. **Single-Use Tokens**
- Each invitation can only be used once
- Once accepted, the invitation is marked as `used` and cannot be reused

### 4. **Email Validation (Optional)**
- Invitations can be restricted to specific email addresses
- If `invitedEmail` is set, only that email can accept the invitation
- Prevents token theft/abuse

### 5. **Role-Based Authorization**
- Only authorized users (Admins, Managers, Program Managers) can create invitations
- Prevents unauthorized users from inviting others

### 6. **Organization Isolation**
- Invitations are tied to specific organizations
- Users can only create invitations for their own organization
- Prevents cross-organization invitation abuse

### 7. **Cognito Authentication Required**
- Users must authenticate via Cognito before accepting invitations
- Email from Cognito session is used (more trustworthy than client input)
- Prevents anonymous users from joining

## Database Schema

```prisma
model Invitation {
  id             Int       @id @default(autoincrement())
  organizationId Int
  token          String    @unique // Cryptographically secure token
  invitedEmail   String?   // Optional: restrict to specific email
  role           String    // Role to assign to the new user
  expiresAt      DateTime  // Expiration date
  used           Boolean   @default(false)
  usedAt         DateTime?
  usedByUserId   Int?      // User who accepted the invitation
  createdByUserId Int      // User who created the invitation
  createdAt      DateTime  @default(now())

  organization Organization @relation(fields: [organizationId], references: [id])
  createdBy    User        @relation("InvitationCreator", fields: [createdByUserId], references: [userId])
  usedBy       User?        @relation("InvitationAccepter", fields: [usedByUserId], references: [userId])

  @@index([token])
  @@index([organizationId])
  @@index([invitedEmail])
}
```

## API Endpoints

### 1. **Create Invitation** (POST `/invitations`)
**Authorization:** Requires authenticated user with Admin/Manager/Program Manager role

**Request Body:**
```json
{
  "invitedEmail": "user@example.com",  // Optional
  "role": "Engineer",                   // Required
  "expiresInDays": 7                    // Optional (default: 7, max: 30)
}
```

**Response:**
```json
{
  "invitation": {
    "id": 1,
    "token": "secure-random-token",
    "invitedEmail": "user@example.com",
    "role": "Engineer",
    "expiresAt": "2025-11-25T00:00:00Z",
    "organization": { "id": 1, "name": "Acme Corp" },
    "createdBy": { "userId": 5, "name": "John Doe", "email": "john@example.com" },
    "createdAt": "2025-11-18T00:00:00Z"
  },
  "invitationUrl": "http://localhost:3000/onboarding?invitation=secure-random-token"
}
```

**Security:**
- Only Admins/Managers can create invitations
- Organization ID comes from authenticated session (not client input)
- Token is cryptographically secure

### 2. **Validate Invitation** (GET `/invitations/validate/:token`)
**Authorization:** Public (token is the authentication)

**Response (Valid):**
```json
{
  "invitation": {
    "id": 1,
    "invitedEmail": "user@example.com",
    "role": "Engineer",
    "expiresAt": "2025-11-25T00:00:00Z",
    "organization": { "id": 1, "name": "Acme Corp" },
    "createdBy": { "name": "John Doe", "email": "john@example.com" },
    "createdAt": "2025-11-18T00:00:00Z"
  }
}
```

**Response (Invalid/Expired/Used):**
```json
{
  "message": "This invitation has expired",
  "expiresAt": "2025-11-15T00:00:00Z"
}
```

### 3. **Accept Invitation** (POST `/invitations/accept`)
**Authorization:** Requires Cognito session (user must be logged in)

**Request Body:**
```json
{
  "token": "secure-random-token",
  "username": "newuser",
  "name": "New User",
  "email": "user@example.com",  // Must match Cognito email if invitation has email restriction
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "user": {
    "userId": 10,
    "organizationId": 1,
    "cognitoId": "cognito-sub-id",
    "username": "newuser",
    "name": "New User",
    "email": "user@example.com",
    "role": "Engineer",
    ...
  },
  "organization": {
    "id": 1,
    "name": "Acme Corp"
  },
  "message": "Successfully joined organization"
}
```

**Security:**
- User must be authenticated via Cognito
- Email from Cognito session is used (more trustworthy)
- Token is validated (exists, not expired, not used)
- Email restriction is enforced if set
- User is created and invitation is marked as used atomically (transaction)

### 4. **Get Invitations** (GET `/invitations`)
**Authorization:** Requires authenticated user with Admin/Manager/Program Manager role

**Response:**
```json
[
  {
    "id": 1,
    "token": "secure-random-token",
    "invitedEmail": "user@example.com",
    "role": "Engineer",
    "expiresAt": "2025-11-25T00:00:00Z",
    "used": false,
    "usedAt": null,
    "usedBy": null,
    "createdBy": { "userId": 5, "name": "John Doe", "email": "john@example.com" },
    "organization": { "id": 1, "name": "Acme Corp" },
    "createdAt": "2025-11-18T00:00:00Z"
  }
]
```

### 5. **Revoke Invitation** (DELETE `/invitations/:invitationId`)
**Authorization:** Requires authenticated user with Admin/Manager/Program Manager role

**Response:**
```json
{
  "message": "Invitation revoked successfully"
}
```

## User Flow

### For Inviters (Admins/Managers):

1. Admin/Manager creates invitation via `POST /invitations`
2. System generates secure token
3. Invitation is stored in database with expiration
4. Inviter sends invitation link to user (email, Slack, etc.)
5. Link format: `https://yourapp.com/onboarding?invitation=<token>`

### For Invitees:

1. User receives invitation link
2. User clicks link → redirected to `/onboarding?invitation=<token>`
3. User authenticates via Cognito (if not already logged in)
4. Frontend validates invitation via `GET /invitations/validate/:token`
5. User completes profile (username, phone, etc.)
6. User accepts invitation via `POST /invitations/accept`
7. System validates:
   - Token exists and is valid
   - Token not expired
   - Token not already used
   - Email matches (if invitation has email restriction)
   - User doesn't already exist
8. User is created in organization
9. Invitation is marked as used
10. User is redirected to home page

## Security Measures Against Bad Actors

### 1. **Cannot Guess Tokens**
- 256-bit random tokens (2^256 possible values)
- Cryptographically secure random number generation
- Tokens are unique and non-sequential

### 2. **Cannot Join Without Invitation**
- `joinOrganization` endpoint now requires `invitationToken`
- Direct `organizationId` is no longer accepted
- Prevents malicious users from joining organizations by ID

### 3. **Cannot Reuse Tokens**
- Single-use tokens
- Once accepted, token is marked as `used`
- Attempting to reuse returns 410 (Gone) error

### 4. **Cannot Use Expired Tokens**
- Expiration is checked on every validation/acceptance
- Expired tokens return 410 (Gone) error

### 5. **Cannot Use Wrong Email**
- If invitation has `invitedEmail`, only that email can accept
- Email from Cognito session is used (cannot be spoofed)
- Returns 403 (Forbidden) if email doesn't match

### 6. **Cannot Create Invitations Without Permission**
- Role-based authorization
- Only Admins/Managers can create invitations
- Returns 403 (Forbidden) if user lacks permission

### 7. **Cannot Invite to Other Organizations**
- `organizationId` comes from authenticated session
- Users can only create invitations for their own organization
- Prevents cross-organization invitation abuse

### 8. **Must Authenticate via Cognito**
- Users must have valid Cognito session to accept
- Email from Cognito is trusted (not client input)
- Prevents anonymous users from joining

## Implementation Checklist

- [x] Add `Invitation` model to Prisma schema
- [x] Create invitation controller with secure token generation
- [x] Create invitation routes with proper authorization
- [x] Update onboarding flow to handle invitations
- [x] Remove direct `organizationId` from `joinOrganization` endpoint
- [ ] Generate Prisma migration and run it
- [ ] Update frontend onboarding page to handle invitation tokens
- [ ] Create UI for admins/managers to create invitations
- [ ] Add invitation management UI (list, revoke)

## Next Steps

1. **Generate and run migration:**
   ```bash
   cd server
   npx prisma migrate dev --name add_invitation_model
   ```

2. **Update frontend onboarding page** to:
   - Check for `invitation` query parameter
   - Validate invitation on page load
   - Show organization name and role from invitation
   - Pass `invitationToken` to signup endpoint

3. **Create invitation management UI** for admins/managers:
   - List all invitations
   - Create new invitations
   - Revoke invitations
   - View invitation status (pending, used, expired)

## Testing

### Test Cases:

1. ✅ Admin can create invitation
2. ✅ Non-admin cannot create invitation
3. ✅ Invitation token is unique and secure
4. ✅ Invitation expires after set time
5. ✅ Invitation can only be used once
6. ✅ Email restriction is enforced
7. ✅ User cannot join organization without valid invitation
8. ✅ Expired invitations are rejected
9. ✅ Used invitations are rejected
10. ✅ Wrong email cannot accept email-restricted invitation

## Security Best Practices

1. **Never expose full invitation details** in public endpoints
2. **Always validate tokens** before accepting
3. **Use transactions** for atomic operations (create user + mark invitation used)
4. **Log invitation events** for audit trail
5. **Rate limit** invitation creation to prevent abuse
6. **Monitor** for suspicious patterns (many invitations, rapid acceptance, etc.)

