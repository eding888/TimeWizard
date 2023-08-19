import express, { Response, Router } from 'express';
import { AuthenticatedRequest } from '../utils/middleware.js';
import bcrypt from 'bcrypt';
import { genRefreshToken, genAuthToken, genEmailCode, code } from '../utils/genToken.js';
import { sendEmail, checkSanitizedInput, passDetails, passwordToHash, MailType } from '../utils/routerHelper.js';
import jwt from 'jsonwebtoken';
import config from '../utils/config.js';
import User, { UserInterface } from '../models/user.js';
import Tokens from 'csrf';
const tokens = new Tokens();

const loginRouter: Router = express.Router();

const sendEmailWithCode = async (email: string, mailType: MailType, subject: string) => {
  const code = genEmailCode();
  const response = await sendEmail(email, mailType, subject, code.digits);
  if (response === null) {
    return null;
  } else {
    return code.token;
  }
};

loginRouter.post('/', async (request: AuthenticatedRequest, response: Response) => {
  const { username, password } = request.body;
  if (!username || !password) {
    return response.status(400).json({
      error: 'no username/password provided'
    });
  }
  if (!checkSanitizedInput(username, 'none')) {
    return response.status(400).json({
      error: 'improper formatting of username'
    });
  }
  console.log(username);
  const user: UserInterface = await User.findOne({ username }) as UserInterface;

  if (!user) {
    return response.status(404).json({
      error: 'user not found'
    });
  }
  const passwordCorrect: boolean = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect) {
    return response.status(401).json({
      error: 'invalid password'
    });
  }
  if (!user.isVerified) {
    const codeToken: string | null = await sendEmailWithCode(user.email, MailType.verifyUser, 'Confirm your TaskWizard account.');
    if (codeToken === null) {
      return response.status(500).json({
        error: 'error with sending email'
      });
    }
    user.emailCode = codeToken;
    await user.save();
    return response.status(401).json({
      error: 'user is not verified'
    });
  }

  user.refreshToken = genRefreshToken();
  await user.save();

  const authToken: string = await genAuthToken(user.username, user.passwordHash);

  response.cookie('token', authToken, {
    httpOnly: true,
    secure: true
  });
  const token = tokens.create(config.SECRET);

  response.status(200).json({ csrf: token });
});

loginRouter.post('/confirm', async (request: AuthenticatedRequest, response: Response) => {
  const { code, username } = request.body;
  if (!username || !code) {
    return response.status(400).json({
      error: 'no username or code provided'
    });
  }
  if (!checkSanitizedInput(username, 'none')) {
    return response.status(400).json({
      error: 'improper formatting of username'
    });
  }
  const user: UserInterface = await User.findOne({ username }) as UserInterface;

  if (!user) {
    return response.status(404).json({
      error: 'user not found'
    });
  }
  if (!user.emailCode) {
    return response.status(400).json({
      error: 'user has no email code'
    });
  }
  const userCode: string = (jwt.verify(user.emailCode, config.SECRET) as code).code;
  if (userCode !== code) {
    return response.status(401).json({
      error: 'code does not match'
    });
  }
  user.isVerified = true;
  user.refreshToken = genRefreshToken();
  const savedUser: UserInterface = await user.save();

  const token = tokens.create(config.SECRET);

  response.status(200).json({ savedUser, csrf: token });
});

loginRouter.post('/resetPassword', async (request: AuthenticatedRequest, response: Response) => {
  const { email } = request.body;
  if (!email) {
    return response.status(400).json({
      error: 'email not provided'
    });
  }
  if (!checkSanitizedInput(email, 'email')) {
    return response.status(400).json({
      error: 'email not properly formatted'
    });
  }
  const user: UserInterface = await User.findOne({ email }) as UserInterface;
  if (!user) {
    return response.status(404).json({
      error: 'email not found in system'
    });
  }
  const date = new Date();
  const time = date.getTime();
  if (user.passReset.passResetCooldown && user.passReset.passResetCooldown > time) {
    return response.status(400).json({
      error: 'user still on password reset cooldown'
    });
  }
  const resetCodeToken: string | null = await sendEmailWithCode(email, MailType.resetPassword, 'Confirm your TaskWizard password change.');
  if (resetCodeToken === null) {
    return response.status(500).json({
      error: 'error with sending email'
    });
  }
  user.passReset.passResetCode = resetCodeToken;
  user.passReset.passResetAttempts = 5;
  await user.save();
  response.status(200).end();
});

loginRouter.post('/resetPassword/confirm', async (request: AuthenticatedRequest, response: Response) => {
  const { email, code, newPassword } = request.body;
  if (!email || !code || !newPassword) {
    return response.status(400).json({
      error: 'email not provided'
    });
  }
  if (!checkSanitizedInput(email, 'email')) {
    return response.status(400).json({
      error: 'email not properly formatted'
    });
  }
  const user: UserInterface = await User.findOne({ email }) as UserInterface;
  if (!user) {
    return response.status(404).json({
      error: 'email not found in system'
    });
  }
  const passResetCode = user.passReset.passResetCode;
  if (!passResetCode) {
    return response.status(400).json({
      error: 'user has no password reset code'
    });
  }
  const date = new Date();
  const time = date.getTime();
  if (user.passReset.passResetCooldown && user.passReset.passResetCooldown > time) {
    return response.status(400).json({
      error: 'user still on password reset cooldown'
    });
  }
  const userCode: string = (jwt.verify(passResetCode, config.SECRET) as code).code;
  if (!user.passReset.passResetAttempts) {
    return response.status(400).json({
      error: 'user does not have password reset attempts'
    });
  }
  if (userCode !== code) {
    if (user.passReset.passResetAttempts <= 1) {
      user.passReset.passResetAttempts = null;
      user.passReset.passResetCooldown = time + (60 * 60 * 1000);
      await user.save();
      return response.status(401).json({
        error: 'user has ran out of password reset attempts'
      });
    }
    user.passReset.passResetAttempts = user.passReset.passResetAttempts - 1;
    await user.save();
    return response.status(401).json({
      error: 'code does not match'
    });
  }
  const passwordHashDetails: passDetails = await passwordToHash(newPassword);
  if (passwordHashDetails.errors) {
    return response.status(400).json({
      errors: passwordHashDetails.errors
    });
  }
  const passwordHash: string | null = passwordHashDetails.password;
  if (!passwordHash) {
    return response.status(500).json({
      error: 'error in generating hash'
    });
  }
  user.passwordHash = passwordHash;
  await user.save();

  response.status(200).end();
});

export default loginRouter;
