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
// Indicates which html template to use for email
export var MailType;
(function (MailType) {
    MailType["verifyUser"] = "verify-user";
    MailType["resetPassword"] = "reset-password";
})(MailType || (MailType = {}));
// Method which returns the text content in html template
const readTemplate = async (templateName) => {
    const templatePath = join(__dirname, '..', '..', 'templ', `${templateName}.html`);
    const template = await readFile(templatePath, 'utf-8');
    return template;
};
// Sends email using nodemailer
export const sendEmail = async (recipientEmail, emailType, subject, digits) => {
    const template = await readTemplate(emailType);
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
        html: template.replace('{{code}}', digits)
    };
    switch (emailType) {
        case MailType.verifyUser:
            mailOptions.html = template.replace('{{code}}', digits);
            break;
        case MailType.resetPassword:
            mailOptions.html = template.replace('{{code}}', digits);
            break;
    }
    let response = true;
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            response = false;
        }
        else {
            response = true;
        }
    });
    return response;
};
// This method is used as another failsafe for XSS attacks; it cleanses a string for any unwanted characters
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
export const checkSanitizedInput = (input, specialCharactersAllowed = 'none') => {
    switch (specialCharactersAllowed) {
        case 'none':
            if (input.match(/[^a-zA-Z0-9]/)) {
                return false;
            }
            else {
                return true;
            }
        case 'email':
            if (input.match(emailRegex)) {
                return true;
            }
            else {
                return false;
            }
    }
    return null;
};
// Method checks for any errors or unwanted patterns in password and returns it as a hash
export const passwordToHash = async (password) => {
    const passwordSchema = new PasswordValidator();
    passwordSchema
        .is().min(6, 'Password must have minimum of 6 characters')
        .is().max(100, 'Password is too long')
        .has().uppercase(1, 'Password must contain an uppercase character')
        .has().digits(1, 'Password must contain a digit')
        .has().not().spaces();
    const passDetails = {
        password: null,
        errors: null
    };
    const passErrors = passwordSchema.validate(password, { details: true });
    if (Array.isArray(passErrors) && passErrors.length >= 1) {
        passDetails.errors = passErrors;
        return passDetails;
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    passDetails.password = passwordHash;
    return passDetails;
};
