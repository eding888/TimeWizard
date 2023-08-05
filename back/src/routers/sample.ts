import express, { Response, Router } from 'express';
import { AuthenticatedRequest } from 'utils/middleware';

// THIS ROUTER USED FOR UNIT TESTS

const testRouter: Router = express.Router();

testRouter.get('/', async (request: AuthenticatedRequest, response: Response) => {
  if (!request.user?.isVerified) {
    return response.status(401).json({
      error: 'user is not verified'
    });
  }
  const message = 'hej';
  response.status(200).json(message);
});

export default testRouter;
