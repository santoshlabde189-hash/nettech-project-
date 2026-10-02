const nodemailer = require('nodemailer');

/**
 * Send email notification on ticket status change
 * Uses SMTP variables if defined, or graceful log/ethereal fallback
 */
const sendStatusNotification = async ({ to, userName, ticketTitle, ticketId, oldStatus, newStatus }) => {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.log(`[Email Notification Skipped - SMTP not configured]`);
      console.log(`To: ${to} | Ticket: "${ticketTitle}" (${ticketId}) changed from ${oldStatus} to ${newStatus}`);
      return;
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const statusLabels = {
      open: 'Open',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed'
    };

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Nettech Support" <support@nettech.local>',
      to,
      subject: `[Update] Ticket #${ticketId.toString().slice(-6)} Status Changed to ${statusLabels[newStatus] || newStatus}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0d6efd; color: #fff; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Nettech IT Help Desk</h2>
          </div>
          <div style="padding: 24px;">
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Your support ticket has a new status update:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Ticket ID:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">#${ticketId}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Title:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${ticketTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Previous Status:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><span style="text-transform: capitalize;">${oldStatus.replace('_', ' ')}</span></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Current Status:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong style="color: #0d6efd; text-transform: capitalize;">${newStatus.replace('_', ' ')}</strong></td>
              </tr>
            </table>
            <p>You can view full details by logging in to the Nettech Help Desk portal.</p>
          </div>
          <div style="background-color: #f8fafc; padding: 12px; text-align: center; font-size: 12px; color: #64748b;">
            This is an automated notification from Nettech Help Desk.
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Status notification sent to ${to}: ${info.messageId}`);
  } catch (err) {
    console.error('Error sending email notification:', err.message);
  }
};

module.exports = { sendStatusNotification };
