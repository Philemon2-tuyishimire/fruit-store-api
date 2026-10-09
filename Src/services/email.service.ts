import nodemailer from 'nodemailer';

export const sendWelcomeEmail = async (
  name: string,
  email: string
): Promise<void> => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const secureValue = process.env.SMTP_SECURE?.toLowerCase();
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (
    !host ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    (secureValue !== 'true' && secureValue !== 'false') ||
    !user ||
    !pass ||
    !from
  ) {
    throw new Error(
      'SMTP configuration is missing or invalid. Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, and SMTP_FROM.'
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: secureValue === 'true',
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: 'Welcome to Fruit Store',
    text: `Hi ${name},\n\nWelcome to Fruit Store! Your account has been created successfully.\n\nWe’re glad you’re here.`,
  });
};
