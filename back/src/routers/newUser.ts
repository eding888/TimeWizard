import express, { Response, Router } from 'express';
import User, { UserInterface } from '../models/user.js';
import bcrypt from 'bcrypt';
import 'express-async-errors';
import PasswordValidator from 'password-validator';
import { AuthenticatedRequest } from 'utils/middleware.js';
import { genAuthToken } from '../utils/genToken.js';
import { sanitizeInput } from '../utils/routerHelper.js';

const newUserRouter: Router = express.Router();

const passwordSchema: PasswordValidator = new PasswordValidator();

passwordSchema
  .is().min(6, 'Password must have minimum of 6 characters')
  .is().max(100, 'Password is too long')
  .has().uppercase(1, 'Password must contain an uppercase character')
  .has().digits(1, 'Password must contain a digit')
  .has().not().spaces();

newUserRouter.post('/', async (request: AuthenticatedRequest, response: Response) => {
  let { username, email, password } = request.body;

  if (!username || !email || !password) {
    return response.status(400).json({
      error: 'no username or password or email'
    });
  }

  username = sanitizeInput(username, 'none');
  email = sanitizeInput(email, 'email');
  password = sanitizeInput(password, 'allow');

  const passErrors: boolean | object[] = passwordSchema.validate(password, { details: true });
  if (Array.isArray(passErrors) && passErrors.length >= 1) {
    return response.status(400).json(passErrors);
  }

  const saltRounds = 10;
  const passwordHash: string = await bcrypt.hash(password, saltRounds);

  const user: UserInterface = new User({
    username,
    email,
    passwordHash
  });

  const savedUser = await user.save();

  const starterAuthToken = await genAuthToken(username, passwordHash);

  response.status(201).json({ savedUser, token: starterAuthToken });
});

export default newUserRouter;
