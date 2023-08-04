import express, { Response, Router } from 'express';
import User from '../models/user.js';
import { AuthenticatedRequest } from '../utils/middleware.js';
import bcrypt from 'bcrypt';
import { verifyToken, genRefreshToken, genAuthToken, genEmailCode } from '../utils/genToken.js';
import { sendConfirmationEmail } from '../utils/routerHelper.js';
import jwt from 'jsonwebtoken';

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
          console.error(error);
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
  }
});

loginRouter.post('/confirm', async (request: AuthenticatedRequest, response: Response) => {
  const { code } =  request.body;
  const userCode = request.user?.emailCode;
  if(jwt.verify())
}

export default loginRouter;
