import { Resend } from 'resend';

export const sendWelcomeEmail = async (
  name: string,
  email: string
): Promise<void> => {
  const apiKey = process.env.RESEND_API_KEY;
  // Fallbacks to Resend's onboarding domain if SMTP_FROM isn't set, or uses your configured sender
  const from = process.env.SMTP_FROM || 'Fruit Store <onboarding@resend.dev>';

  if (!apiKey) {
    throw new Error('RESEND_API_KEY configuration is missing. Set RESEND_API_KEY.');
  }

  const resend = new Resend(apiKey);

  try {
    const data = await resend.emails.send({
      from,
      to: [email],
      subject: 'Welcome to Fruit Store',
      text: `Hi ${name},\n\nWelcome to Fruit Store! Your account has been created successfully.\n\nWe’re glad you’re here.`,
    });
    console.log('Email sent successfully via Resend:', data);
  } catch (error) {
    console.error('Detailed Resend Error:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<void> => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SMTP_FROM || 'Fruit Store <onboarding@resend.dev>';

  if (!apiKey) {
    throw new Error('RESEND_API_KEY configuration is missing. Set RESEND_API_KEY.');
  }

  const resend = new Resend(apiKey);
  const resetLink = `https://fruit-store-api-1.onrender.com/api/auth/reset-password?token=${resetToken}`;

  try {
    const data = await resend.emails.send({
      from,
      to: [email],
      subject: 'Password Reset Request',
      text: `Hi,\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nThis link expires in 15 minutes.\n\nIf you didn't request this, please ignore this email.`,
    });
    console.log('Password reset email sent successfully via Resend:', data);
  } catch (error) {
    console.error('Detailed Resend Error:', error);
    throw error;
  }
};