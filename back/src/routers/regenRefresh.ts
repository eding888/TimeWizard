import express, { Response, Router } from 'express';
import { AuthenticatedRequest } from '../utils/middleware.js';
import bcrypt from 'bcrypt';
import { genRefreshToken, genAuthToken } from '../utils/genToken.js';
import { sanitizeInput } from '../utils/routerHelper.js';
import User, { UserInterface } from '../models/user.js';

const regenRefresh: Router = express.Router();

regenRefresh.post('/', async (request: AuthenticatedRequest, response: Response) => {
  let { username, password } = request.body;
  if (username && password) {
    username = sanitizeInput(username, 'none');
    password = sanitizeInput(password, 'allow');
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
      return response.status(401).json({
        error: 'user is not verified'
      });
    }

    user.refreshToken = genRefreshToken();

    const authToken = genAuthToken(user.username);

    response.status(200).json(authToken);
  } else {
    return response.status(400).json({
      error: 'no password provided'
    });
  }
});
