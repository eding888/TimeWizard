import express, { Response, Router } from 'express';
import User from '../models/user.js';
import { AuthenticatedRequest } from '../utils/middleware.js';
import bcrypt from 'bcrypt';
import { verifyToken, genRefreshToken, genAuthToken, genEmailCode, code } from '../utils/genToken.js';
import { sendConfirmationEmail } from '../utils/routerHelper.js';
import jwt from 'jsonwebtoken';
import config from '../utils/config.js';

const loginRouter: Router = express.Router();

loginRouter.post('/', async (request: AuthenticatedRequest, response: Response) => {
  const { username, password } = request.body;
  if (username && password) {
    const user = await User.findOne({ username });
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password'
      });
    }

    if (!user.isVerified) {
      const code = genEmailCode();
      sendConfirmationEmail(code.digits, user.email)
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          console.log(error);
          return response.status(400).json({
            error: 'invalid email'
          });
        });
      user.emailCode = code.token;
      await user.save();
      return response.status(401).json({
        error: 'user is not verified'
      });
    }

    if (!user.refreshToken || !verifyToken(user.refreshToken)) {
      user.refreshToken = genRefreshToken();
    }

    const authToken = genAuthToken(user.username);

    response.status(200).json(authToken);
  } else {
    return response.status(400).json({
      error: 'no username or password'
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

export default loginRouter;
