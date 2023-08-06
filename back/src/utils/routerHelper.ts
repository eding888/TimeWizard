import config from './config.js';
import nodemailer from 'nodemailer';

export const sendConfirmationEmail = (digits: string, recipientEmail: string, subject: string, message: string) => {
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
      subject,
      text: `${message} ${digits}`
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
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
export const sanitizeInput = (input: string, specialCharactersAllowed: string = 'none') => {
  switch (specialCharactersAllowed) {
    case 'none':
      if (input.match(/[^a-zA-Z0-9]/)) {
        return null;
      } else {
        return input;
      }
    case 'email':
      if (input.match(emailRegex)) {
        return input;
      } else {
        return null;
      }
  }
  return input;
};
