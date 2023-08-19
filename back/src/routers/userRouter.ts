import express, { Response, Router } from 'express';
import 'express-async-errors';
import { AuthenticatedRequest } from 'utils/middleware.js';

const userRouter: Router = express.Router();

userRouter.get('/current', async (request: AuthenticatedRequest, response: Response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'User/token not found' });
  }
  const user = request.user;
  await user.populate({
    path: 'tasks.id',
    select: '_id name type deadlineOptions recurringOptions discrete daysOfWeek totalTimeToday timeLeftToday daysOld user'
  });
  response.status(200).json(user);
});

export default userRouter;
