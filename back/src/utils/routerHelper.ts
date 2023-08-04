import config from './config.js';
import nodemailer from 'nodemailer';

export const checkAdmin = (token: string | null | undefined) => {
  if (token === config.ADMIN_KEY) {
    return true;
  }
  return false;
};

export const sendConfirmationEmail = (digits: string, recipientEmail: string) => {
  return new Promise((resolve, reject) => {
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
      subject: 'Confirm your HeelsMart account',
      text: `Confirm your account with this code: ${digits}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};
