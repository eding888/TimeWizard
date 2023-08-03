import express, { Response, Router } from 'express';
import User from 'models/user';
import { AuthenticatedRequest } from 'utils/middleware';

const loginRouter: Router = express.Router();

loginRouter.post('/', async (request: AuthenticatedRequest, response: Response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
});
