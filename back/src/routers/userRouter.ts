import express, { Response, Router } from 'express';
import User, { UserInterface } from '../models/user.js';
import 'express-async-errors';
import { AuthenticatedRequest } from 'utils/middleware.js';
import { checkAdmin } from '../utils/routerHelper.js';

const userRouter: Router = express.Router();

userRouter.get('/all', async (request: AuthenticatedRequest, response: Response) => {
  if (!checkAdmin(request.token)) {
    return response.status(401).json({ error: 'unauthorized access' });
  }

  const users: UserInterface[] | null = await User.find({})!;
  if (users !== null) {
    response.json(users);
  } else {
    response.status(400);
  }
});

export default userRouter;
