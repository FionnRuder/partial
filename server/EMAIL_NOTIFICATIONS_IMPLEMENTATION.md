# Email Notifications Implementation

This document describes the email notification system implementation using Amazon SES.

## Overview

The email notification system sends automated emails to users for important events in the application. All emails are sent from `notifications@partialsystems.com` using Amazon SES.

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# AWS SES Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000  # or https://your-production-domain.com
```

### AWS SES Setup

1. **Domain Verification**: Your domain `partialsystems.com` is already verified
2. **Sender Email**: `notifications@partialsystems.com` is used as the sender
3. **Sandbox Mode**: If in sandbox, you can only send to verified emails. Request production access for production use.

## Email Notifications Implemented

### 1. Invitation Emails
**Trigger**: When an invitation is created with an email address
**Recipients**: The invited user's email
**Content**: 
- Organization name
- Role being invited to
- Inviter's name
- Expiration date
- Invitation link

**Location**: `server/src/controllers/invitationController.ts` - `createInvitation`

### 2. Work Item Assignment Emails
**Trigger**: 
- When a new work item is created and assigned to a user (if different from author)
- When a work item's assignee is changed

**Recipients**: The assigned user
**Content**:
- Work item title
- Priority
- Due date
- Assigned by (author's name)
- Link to work item

**Location**: 
- `server/src/controllers/workItemController.ts` - `createWorkItem`
- `server/src/controllers/workItemController.ts` - `editWorkItem`

### 3. Work Item Comment Emails
**Trigger**: When a comment is added to a work item
**Recipients**: 
- The work item's assignee (if different from commenter)
- The work item's author (if different from commenter and assignee)

**Content**:
- Work item title
- Commenter's name
- Comment text
- Link to work item

**Location**: `server/src/controllers/workItemController.ts` - `createCommentForWorkItem`

### 4. Work Item Status Change Emails
**Trigger**: When a work item's status is updated
**Recipients**:
- The work item's assignee (if different from person making change)
- The work item's author (if different from person making change and assignee)

**Content**:
- Work item title
- Old status → New status
- Changed by (name of person who made the change)
- Link to work item

**Location**: `server/src/controllers/workItemController.ts` - `editWorkItem`

## Email Service

The email service is located in `server/src/lib/emailService.ts` and provides:

- `sendEmail()` - Generic email sending function
- `sendInvitationEmail()` - Invitation email template
- `sendWorkItemAssignmentEmail()` - Assignment email template
- `sendWorkItemCommentEmail()` - Comment email template
- `sendWorkItemStatusChangeEmail()` - Status change email template
- `sendApproachingDeadlineEmail()` - Deadline reminder template (ready for future use)

## Email Templates

All emails use a consistent HTML template with:
- Partial branding header
- Responsive design
- Dark mode compatible colors
- Action buttons linking to relevant pages
- Professional footer

## Error Handling

- Email sending failures are logged but don't break the main application flow
- Errors are caught and logged using the error handler
- Users will still see success messages even if email fails

## Future Enhancements

1. **Approaching Deadline Emails** - Scheduled job to check for upcoming deadlines
2. **User Preferences** - Allow users to opt-in/opt-out of specific notification types
3. **Email Unsubscribe** - Add unsubscribe links to emails
4. **Batch Sending** - Optimize for sending multiple emails
5. **Email Delivery Tracking** - Track email opens and clicks
6. **Custom Templates** - Allow organizations to customize email templates

## Testing

To test email notifications:

1. Ensure environment variables are set
2. Create an invitation with an email address
3. Assign a work item to a user
4. Add a comment to a work item
5. Change a work item's status

Check that emails are sent (check spam folder if not in inbox).

## Troubleshooting

### Error: "Email address is not verified"

**This is the most common error when testing!** It means you're in SES Sandbox Mode.

**What is Sandbox Mode?**
- New SES accounts start in sandbox mode
- You can only send emails to verified email addresses
- You can send from verified email addresses (like `notifications@partialsystems.com`)

**Solution 1: Verify recipient emails (for testing)**
1. Go to AWS Console → SES → Verified identities
2. Click "Create identity"
3. Select "Email address"
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
   - **Use case**: "Sending transactional emails for work management notifications"
   - **Expected volume**: Your estimated daily/monthly volume
4. Submit (usually approved within 24 hours)
5. Once approved, you can send to any email address

### Other issues

**Emails not sending**
- Verify AWS credentials in `.env`
- Verify sender email (`notifications@partialsystems.com`) is verified
- Check server logs for detailed error messages

**Emails going to spam**
- Set up SPF records for your domain
- Configure DKIM signing
- Use a dedicated IP (SES paid feature)
- Review email content for spam triggers

### Emails going to spam
- Set up SPF records for your domain
- Configure DKIM signing
- Use a dedicated IP (SES paid feature)
- Review email content for spam triggers

### Rate Limits
- SES has sending limits (check AWS Console)
- Default: 1 email/second in sandbox
- Production: Higher limits based on account

## Code Structure

```
server/src/
├── lib/
│   ├── emailService.ts          # Email service and templates
│   └── errorHandler.ts           # Error logging utility
└── controllers/
    ├── invitationController.ts  # Invitation emails
    └── workItemController.ts     # Work item emails
```

## Notes

- All emails are sent asynchronously and don't block the main request
- Email failures are logged but don't affect the user experience
- The system is designed to gracefully handle SES service issues
- Email sending can be disabled by not setting AWS credentials (emails will fail silently)

