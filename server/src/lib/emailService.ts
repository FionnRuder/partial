import { PrismaClient } from "@prisma/client";
import { logError } from "./errorHandler";

const prisma = new PrismaClient();

// TODO: Replace with your email service provider (e.g., SendGrid, Resend, Nodemailer, etc.)

const FROM_EMAIL = "notifications@partialsystems.com";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email - TODO: Replace with your email service provider implementation
 * This is a placeholder that logs the email instead of sending it
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const recipients = Array.isArray(options.to) ? options.to : [options.to];

    // TODO: Implement email sending with your chosen provider (SendGrid, Resend, Nodemailer, etc.)
    // For now, just log the email to avoid breaking the application
    console.log("Email would be sent:", {
      to: recipients.join(", "),
      subject: options.subject,
      html: options.html.substring(0, 100) + "...", // Log first 100 chars
    });
    
    // Uncomment and implement when you have your email service ready:
    // await emailProvider.send({
    //   to: recipients,
    //   from: FROM_EMAIL,
    //   subject: options.subject,
    //   html: options.html,
    //   text: options.text,
    // });
    
    console.log(`Email logged (not sent) to ${recipients.join(", ")}`);
  } catch (error) {
    logError(error as Error, {
      component: "emailService",
      action: "sendEmail",
      additionalInfo: {
        to: options.to,
        subject: options.subject,
      },
    });
    // Don't throw - we don't want email failures to break the main flow
    console.error("Failed to send email:", error);
  }
};

/**
 * Email template helper - creates a standard email layout
 */
const createEmailTemplate = (
  title: string,
  content: string,
  actionButton?: { text: string; url: string }
): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">Partial</h1>
    <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Hardware Development Work Management</p>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1f2937; margin-top: 0;">${title}</h2>
    <div style="color: #4b5563;">
      ${content}
    </div>
    ${actionButton ? `
    <div style="margin-top: 30px; text-align: center;">
      <a href="${actionButton.url}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">${actionButton.text}</a>
    </div>
    ` : ""}
  </div>
  <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
    <p>This is an automated email from Partial. Please do not reply to this email.</p>
    <p>© ${new Date().getFullYear()} Partial Systems. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();
};

/**
 * Check if a user wants to receive a specific type of email notification
 */
const shouldSendEmail = async (
  userId: string | null,
  notificationType: 'assignment' | 'statusChange' | 'comment' | 'invitation' | 'approachingDeadline'
): Promise<boolean> => {
  if (!userId) {
    // If no userId provided, default to sending (for invitations to new users)
    return true;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        emailNotificationsEnabled: true,
        emailWorkItemAssignment: true,
        emailWorkItemStatusChange: true,
        emailWorkItemComment: true,
        emailInvitation: true,
        emailApproachingDeadline: true,
      },
    });

    if (!user) {
      // If user not found, default to sending
      return true;
    }

    // Check master toggle first
    if (!user.emailNotificationsEnabled) {
      return false;
    }

    // Check specific notification type
    switch (notificationType) {
      case 'assignment':
        return user.emailWorkItemAssignment;
      case 'statusChange':
        return user.emailWorkItemStatusChange;
      case 'comment':
        return user.emailWorkItemComment;
      case 'invitation':
        return user.emailInvitation;
      case 'approachingDeadline':
        return user.emailApproachingDeadline;
      default:
        return true;
    }
  } catch (error) {
    // On error, default to sending (fail open)
    logError(error as Error, {
      component: "emailService",
      action: "shouldSendEmail",
      additionalInfo: { userId, notificationType },
    });
    return true;
  }
};

/**
 * Send invitation email
 */
export const sendInvitationEmail = async (
  email: string,
  invitationToken: string,
  organizationName: string,
  role: string,
  createdByName: string,
  expiresInDays: number,
  recipientUserId?: string | null
): Promise<void> => {
  // Check preferences (for existing users only)
  if (recipientUserId) {
    const shouldSend = await shouldSendEmail(recipientUserId, 'invitation');
    if (!shouldSend) {
      console.log(`Skipping invitation email to user ${recipientUserId} (preferences disabled)`);
      return;
    }
  }
  const invitationUrl = `${FRONTEND_URL}/onboarding?invitation=${invitationToken}`;
  
  const content = `
    <p>You've been invited to join <strong>${organizationName}</strong> on Partial as a <strong>${role}</strong>.</p>
    <p>${createdByName} has sent you this invitation.</p>
    <p>This invitation will expire in ${expiresInDays} day${expiresInDays !== 1 ? "s" : ""}.</p>
    <p>Click the button below to accept the invitation and create your account:</p>
  `;

  const html = createEmailTemplate(
    "You've been invited to join Partial",
    content,
    {
      text: "Accept Invitation",
      url: invitationUrl,
    }
  );

  await sendEmail({
    to: email,
    subject: `Invitation to join ${organizationName} on Partial`,
    html,
    text: `You've been invited to join ${organizationName} on Partial as a ${role}. Accept your invitation at: ${invitationUrl}`,
  });
};

/**
 * Send work item assignment email
 */
export const sendWorkItemAssignmentEmail = async (
  assigneeEmail: string,
  assigneeName: string,
  workItemTitle: string,
  workItemId: number,
  assignedByName: string,
  priority: string,
  dueDate: string,
  assigneeUserId: string
): Promise<void> => {
  // Check user preferences
  const shouldSend = await shouldSendEmail(assigneeUserId, 'assignment');
  if (!shouldSend) {
    console.log(`Skipping assignment email to user ${assigneeUserId} (preferences disabled)`);
    return;
  }
  const workItemUrl = `${FRONTEND_URL}/work-items/${workItemId}`;
  
  const content = `
    <p>You've been assigned to a new work item:</p>
    <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0;"><strong>${workItemTitle}</strong></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Priority:</strong> ${priority}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Assigned by:</strong> ${assignedByName}</p>
    </div>
  `;

  const html = createEmailTemplate(
    "New Work Item Assignment",
    content,
    {
      text: "View Work Item",
      url: workItemUrl,
    }
  );

  await sendEmail({
    to: assigneeEmail,
    subject: `New Work Item Assignment: ${workItemTitle}`,
    html,
    text: `You've been assigned to a new work item: ${workItemTitle}. View it at: ${workItemUrl}`,
  });
};

/**
 * Send work item comment email
 */
export const sendWorkItemCommentEmail = async (
  recipientEmail: string,
  recipientName: string,
  workItemTitle: string,
  workItemId: number,
  commenterName: string,
  commentText: string,
  recipientUserId: string
): Promise<void> => {
  // Check user preferences
  const shouldSend = await shouldSendEmail(recipientUserId, 'comment');
  if (!shouldSend) {
    console.log(`Skipping comment email to user ${recipientUserId} (preferences disabled)`);
    return;
  }
  const workItemUrl = `${FRONTEND_URL}/work-items/${workItemId}`;
  
  const content = `
    <p><strong>${commenterName}</strong> commented on a work item you're involved with:</p>
    <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0;"><strong>${workItemTitle}</strong></p>
      <div style="background-color: white; padding: 10px; border-left: 3px solid #2563eb; margin-top: 10px;">
        <p style="margin: 0; font-style: italic;">"${commentText}"</p>
      </div>
    </div>
  `;

  const html = createEmailTemplate(
    "New Comment on Work Item",
    content,
    {
      text: "View Comment",
      url: workItemUrl,
    }
  );

  await sendEmail({
    to: recipientEmail,
    subject: `New Comment: ${workItemTitle}`,
    html,
    text: `${commenterName} commented on ${workItemTitle}: "${commentText}". View it at: ${workItemUrl}`,
  });
};

/**
 * Format status for display (converts enum values to readable text)
 */
const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    "ToDo": "To Do",
    "WorkInProgress": "Work In Progress",
    "UnderReview": "Under Review",
    "Completed": "Completed",
  };
  return statusMap[status] || status;
};

/**
 * Send work item status change email
 */
export const sendWorkItemStatusChangeEmail = async (
  recipientEmail: string,
  recipientName: string,
  workItemTitle: string,
  workItemId: number,
  oldStatus: string,
  newStatus: string,
  changedByName: string,
  recipientUserId: string
): Promise<void> => {
  // Check user preferences
  const shouldSend = await shouldSendEmail(recipientUserId, 'statusChange');
  if (!shouldSend) {
    console.log(`Skipping status change email to user ${recipientUserId} (preferences disabled)`);
    return;
  }
  const workItemUrl = `${FRONTEND_URL}/work-items/${workItemId}`;
  
  const content = `
    <p>The status of a work item you're involved with has been updated:</p>
    <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0;"><strong>${workItemTitle}</strong></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Status changed:</strong> ${formatStatus(oldStatus)} → ${formatStatus(newStatus)}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Changed by:</strong> ${changedByName}</p>
    </div>
  `;

  const html = createEmailTemplate(
    "Work Item Status Updated",
    content,
    {
      text: "View Work Item",
      url: workItemUrl,
    }
  );

  await sendEmail({
    to: recipientEmail,
    subject: `Status Updated: ${workItemTitle}`,
    html,
    text: `The status of ${workItemTitle} has been changed from ${oldStatus} to ${newStatus} by ${changedByName}. View it at: ${workItemUrl}`,
  });
};

/**
 * Send approaching deadline email
 */
export const sendApproachingDeadlineEmail = async (
  recipientEmail: string,
  recipientName: string,
  workItemTitle: string,
  workItemId: number,
  dueDate: string,
  daysUntilDue: number,
  recipientUserId: string
): Promise<void> => {
  // Check user preferences
  const shouldSend = await shouldSendEmail(recipientUserId, 'approachingDeadline');
  if (!shouldSend) {
    console.log(`Skipping approaching deadline email to user ${recipientUserId} (preferences disabled)`);
    return;
  }
  const workItemUrl = `${FRONTEND_URL}/work-items/${workItemId}`;
  
  const content = `
    <p>You have a work item with an approaching deadline:</p>
    <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0 0 10px 0;"><strong>${workItemTitle}</strong></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Days Remaining:</strong> ${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""}</p>
    </div>
  `;

  const html = createEmailTemplate(
    "Approaching Deadline",
    content,
    {
      text: "View Work Item",
      url: workItemUrl,
    }
  );

  await sendEmail({
    to: recipientEmail,
    subject: `Approaching Deadline: ${workItemTitle}`,
    html,
    text: `You have a work item due soon: ${workItemTitle} (due ${new Date(dueDate).toLocaleDateString()}). View it at: ${workItemUrl}`,
  });
};

