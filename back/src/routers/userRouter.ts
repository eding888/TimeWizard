import express, { Response, Router } from 'express';
import User, { UserInterface } from '../models/user.js';
import bcrypt from 'bcrypt';
import 'express-async-errors';
import PasswordValidator from 'password-validator';
import { AuthenticatedRequest } from 'utils/middleware.js';
import { genAuthToken } from '../utils/genToken.js';

const userRouter: Router = express.Router();

const passwordSchema: PasswordValidator = new PasswordValidator();

passwordSchema
  .is().min(6, 'Password must have minimum of 6 characters')
  .is().max(100, 'Password is too long')
  .has().uppercase(1, 'Password must contain an uppercase character')
  .has().digits(1, 'Password must contain a digit')
  .has().not().spaces();

interface requestDetails {
  username: string,
  email: string,
  password: string
}
userRouter.get('/all', async (request: AuthenticatedRequest, response: Response) => {
  const users: UserInterface[] | null = await User.find({})!;
  if (users !== null) {
    response.json(users);
  } else {
    response.status(400);
  }
});
userRouter.post('/', async (request: AuthenticatedRequest, response: Response) => {
  const { username, email, password }: requestDetails = request.body;
  const passErrors: boolean | object[] = passwordSchema.validate(password, { details: true });
  console.log(passErrors);
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

  const starterAuthToken = genAuthToken(username);

  response.status(201).json({ savedUser, starterAuthToken });
});

export default userRouter;
