import express, { Response, Router } from 'express';
import 'express-async-errors';
import { AuthenticatedRequest } from 'utils/middleware.js';
import config from '../utils/config.js';
import Tokens from 'csrf';
const tokens = new Tokens();

const newSessionRouter: Router = express.Router();
newSessionRouter.get('/', async (request: AuthenticatedRequest, response: Response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'User/token not found' });
  }
  const token = tokens.create(config.SECRET);
  response.status(200).json({ csrf: token });
});

export default newSessionRouter;
