import { Mail, MailtrapClient } from "mailtrap";
import { htmlEmailWrapper } from "../helpers/htmlEmailWrapper";

const mailtrap = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN || "",
  sandbox: process.env.NODE_ENV !== "production",
  testInboxId: parseInt(process.env.MAILTRAP_INBOX_ID || "0", 10),
});

export async function sendVerificationEmail(
  toEmail: string,
  verificationLink: string
) {
  const message: Mail = {
    from: {name: 'ScaleMaestro', email: "info@scalemaestro.app"},
    to: [{email: toEmail}],
    subject: "Verify your Scale Maestro account",
    text: `Please verify your account by clicking the following link: ${verificationLink}`,
    html: htmlEmailWrapper(`<p>Please verify your account by clicking the following link:</p><p><a href="${verificationLink}">Verify Account</a></p>`),
  };

    try {
    await mailtrap.send(message);
    console.log(`Verification email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Failed to send verification email to ${toEmail}:`, error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendResetPasswordEmail(
  toEmail: string,
  resetLink: string
) {
  const message: Mail = {
    from: {name: 'ScaleMaestro', email: "info@scalemaestro.app"},
    to: [{email: toEmail}],
    subject: "Reset your Scale Maestro password",
    text: `You can reset your password by clicking the following link: ${resetLink}`,
    html: htmlEmailWrapper(`<p>You can reset your password by clicking the following link:</p><p><a href="${resetLink}">Reset Password</a></p>`),
  };
    try {
    await mailtrap.send(message);
    console.log(`Password reset email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Failed to send password reset email to ${toEmail}:`, error);
    throw new Error("Failed to send password reset email");
  }
}