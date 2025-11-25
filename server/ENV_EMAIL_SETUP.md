# Email Notification Setup

This document describes the email notification system configuration using Amazon SES.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# AWS SES Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000  # or https://your-production-domain.com
```

## AWS SES Setup

### 1. Verify Your Domain

You've already verified `partialsystems.com`. Make sure:
- Domain verification is complete
- DKIM is set up (recommended)
- SPF records are configured (recommended)

### 2. Verify Sender Email

The system uses `notifications@partialsystems.com` as the sender. Make sure this email is verified in SES:
- Go to AWS SES Console → Verified identities
- Verify `notifications@partialsystems.com` or verify the entire domain

### 3. Move Out of SES Sandbox (Production)

If you're in SES sandbox mode:
- You can only send to verified email addresses
- Request production access in AWS SES Console
- This allows sending to any email address

### 4. IAM Permissions

If using IAM roles (recommended for production), ensure the role has:
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

## Email Notifications

The system sends emails for:

1. **Invitations** - When a user is invited to join an organization
2. **Work Item Assignments** - When a work item is assigned to a user
3. **Work Item Comments** - When someone comments on a work item
4. **Work Item Status Changes** - When a work item's status is updated

## Testing

To test email sending:

1. Set up environment variables
2. Create an invitation with an email address
3. Check that the email is sent (check spam folder)
4. Verify email links work correctly

## Troubleshooting

### Emails not sending
- Check AWS credentials are correct
- Verify sender email is verified in SES
- Check SES sandbox status
- Review server logs for error messages

### Emails going to spam
- Set up SPF records
- Set up DKIM signing
- Use a dedicated IP (SES paid feature)
- Ensure email content follows best practices

### Rate Limits
- SES has sending limits (check AWS Console)
- Default: 1 email/second in sandbox
- Production: Higher limits based on account

## Future Enhancements

- User email preferences (opt-in/opt-out)
- Email templates customization
- Batch email sending
- Email delivery tracking
- Unsubscribe links

