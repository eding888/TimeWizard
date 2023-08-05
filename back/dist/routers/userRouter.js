import express from 'express';
import User from '../models/user.js';
import 'express-async-errors';
const userRouter = express.Router();
userRouter.get('/all', async (request, response) => {
    const users = await User.find({});
    if (users !== null) {
        response.json(users);
    }
    else {
        response.status(400);
    }
});
export default userRouter;
