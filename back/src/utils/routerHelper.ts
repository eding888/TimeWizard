import config from './config.js';
import nodemailer from 'nodemailer';


export const checkAdmin = (token: string | null | undefined) => {
  if (token === config.ADMIN_KEY) {
    return true;
  }
  return false;
};

export const sendConfirmationEmail = (digits: string, recipientEmail: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.EMAIL,
      pass: config.EMAIL_PASS
    }
  });
  const mailOptions = {
    from: config.EMAIL,
    to: recipientEmail,
    subject: 'Test Email',
    text: 'This is a test email sent from your domain.'
  };
}
