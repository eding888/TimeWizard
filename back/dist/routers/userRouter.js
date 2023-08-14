import express from 'express';
import 'express-async-errors';
const userRouter = express.Router();
userRouter.get('/current', async (request, response) => {
    if (!request.user) {
        return response.status(401).json({ error: 'User/token not found' });
    }
    const user = request.user;
    await user.populate({
        path: 'tasks.id',
        select: '_id name type deadlineOptions recurringOptions daysOfWeek totalTimeToday timeLeftToday overtimeToday daysOld user'
    });
    response.status(200).json(user);
});
export default userRouter;
