import express, {Request, Response, Router} from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import cors from 'cors';
import 'express-async-errors';
import PasswordValidator from 'password-validator';

const userRouter: Router = express.Router();

const passwordSchema: PasswordValidator = new PasswordValidator();

const noCors = {
  origin: true
};

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
};

console.log('hi')

userRouter.post('/', cors(noCors), async (request: Request, response: Response) => {
  const { username, email, password } = request.body;
  const passErrors: boolean | any[] = passwordSchema.validate(password, { details: true });
  if (Array.isArray(passErrors)) {
    response.status(400).json(passErrors);
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    email,
    passwordHash
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

export default userRouter;
