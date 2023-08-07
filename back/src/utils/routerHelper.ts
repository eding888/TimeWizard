import config from './config.js';
import nodemailer from 'nodemailer';
import PasswordValidator from 'password-validator';
import bcrypt from 'bcrypt';
import fs from 'fs';
import util from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const readFile = util.promisify(fs.readFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readTemplate = async () => {
  const templatePath = join(__dirname, '..', '..', 'templ', 'email.html');
  const template = await readFile(templatePath, 'utf-8');
  return template;
};

export const sendConfirmationEmail = async (digits: string, recipientEmail: string, subject: string, message: string) => {
  const template = await readTemplate();

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
    html: template.replace('{{message}}', message).replace('{{code}}', digits)
  };
  let response: boolean = true;
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      response = false;
    } else {
      response = true;
    }
  });
  return response;
};

// This must be used for basically any user input especially when it used
// as a search parameter to shut down any xss or injection attacks.
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
export const checkSanitizedInput = (input: string, specialCharactersAllowed: string = 'none') => {
  switch (specialCharactersAllowed) {
    case 'none':
      if (input.match(/[^a-zA-Z0-9]/)) {
        return false;
      } else {
        return true;
      }
    case 'email':
      if (input.match(emailRegex)) {
        return true;
      } else {
        return false;
      }
  }
  return null;
};

export interface passDetails {
  password: string | null,
  errors: object[] | null
}
export const passwordToHash = async (password: string) => {
  const passwordSchema: PasswordValidator = new PasswordValidator();
  passwordSchema
    .is().min(6, 'Password must have minimum of 6 characters')
    .is().max(100, 'Password is too long')
    .has().uppercase(1, 'Password must contain an uppercase character')
    .has().digits(1, 'Password must contain a digit')
    .has().not().spaces();

  const passDetails: passDetails = {
    password: null,
    errors: null
  };

  const passErrors: boolean | object[] = passwordSchema.validate(password, { details: true });
  if (Array.isArray(passErrors) && passErrors.length >= 1) {
    passDetails.errors = passErrors;
    return passDetails;
  }

  const saltRounds = 10;
  const passwordHash: string = await bcrypt.hash(password, saltRounds);
  passDetails.password = passwordHash;
  return passDetails;
};
