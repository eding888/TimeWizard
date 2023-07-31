import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import cors from 'cors';
import 'express-async-errors';
import PasswordValidator from 'password-validator';

const userRouter = express.Router();

const passwordSchema = new PasswordValidator();

const noCors = {
  origin: true
};

passwordSchema
  .is().min(6, 'Password must have minimum of 6 characters')
  .is().max(100, 'Password is too long')
  .has().uppercase(1, 'Password must contain an uppercase character')
  .has().digits(1, 'Password must contain a digit')
  .has().not().spaces();

userRouter.post('/', cors(noCors), async (request, response) => {
  const { username, email, password } = request.body;
  const passErrors = passwordSchema.validate(password, { details: true });
  if (passErrors.length >= 1) {
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
