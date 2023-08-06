import express, { Response, Router } from 'express';
import { AuthenticatedRequest } from '../utils/middleware.js';
import bcrypt from 'bcrypt';
import { genRefreshToken, genAuthToken, genEmailCode, code, verifyToken } from '../utils/genToken.js';
import { sendConfirmationEmail, checkSanitizedInput } from '../utils/routerHelper.js';
import jwt from 'jsonwebtoken';
import config from '../utils/config.js';
import User, { UserInterface } from '../models/user.js';

const loginRouter: Router = express.Router();

const sendEmailWithCode = (email: string, subject: string, message: string) => {
  const code = genEmailCode();
  sendConfirmationEmail(code.digits, email, subject, message)
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.log(error);
      return null;
    });
  return code.token;
};

loginRouter.post('/', async (request: AuthenticatedRequest, response: Response) => {
  const { username, password } = request.body;
  if (username && password) {
    if (!checkSanitizedInput(username, 'none')) {
      return response.status(400).json({
        error: 'improper formatting of username'
      });
    }
    const user: UserInterface = await User.findOne({ username }) as UserInterface;

    if (!user) {
      return response.status(401).json({
        error: 'invalid username'
      });
    }
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash);

    if (!passwordCorrect) {
      return response.status(401).json({
        error: 'invalid password'
      });
    }
    if (!user.isVerified) {
      const codeToken: string = sendEmailWithCode(user.email, 'Confirm your heelsmart account.', 'Confirm your heelsmart account with this code:');
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

    if (!user.refreshToken || !verifyToken(user.refreshToken)) {
      user.refreshToken = genRefreshToken();
      await user.save();
    }

    const authToken = await genAuthToken(user.username, user.passwordHash);

    response.status(200).json({ token: authToken });
  } else {
    return response.status(400).json({
      error: 'no username/password provided'
    });
  }
});

loginRouter.post('/confirm', async (request: AuthenticatedRequest, response: Response) => {
  const { code } = request.body;
  if (!request.user) {
    return response.status(401).json({
      error: 'user or token not found'
    });
  }
  if (!request.user.emailCode) {
    return response.status(400).json({
      error: 'user has no email code'
    });
  }
  const userCode: string = (jwt.verify(request.user.emailCode, config.SECRET) as code).code;
  if (userCode !== code) {
    return response.status(401).json({
      error: 'code does not match'
    });
  }
  request.user.isVerified = true;
  request.user.refreshToken = genRefreshToken();
  const savedUser = await request.user.save();
  response.status(200).json(savedUser);
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
  const resetCodeToken = sendEmailWithCode(email, 'Confirm your heelsmart account.', 'Confirm your heelsmart account with this code:');
});

export default loginRouter;
