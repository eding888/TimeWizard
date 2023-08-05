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

// This must be used for basically any user input especially when it used
// as a search parameter to shut down any xss or injection attacks.
// Special characters are simply removed as a last ditch resort. Special character
// checks should most definitely be checked in the frontend as it would be much more
// reponsive and resource efficient to do so
export const sanitizeInput = (input: string, specialCharactersAllowed: string = 'none') => {
  switch (specialCharactersAllowed) {
    case 'none':
      return input.replace(/[^a-zA-Z0-9]/g, '');
    case 'email':
      return input.replace(/[^a-zA-Z0-9@.-_]/g, '');
  }
  return input;
};
