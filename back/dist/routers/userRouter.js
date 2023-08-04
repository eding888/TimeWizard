import express from 'express';
import User from '../models/user.js';
import 'express-async-errors';
import { checkAdmin } from '../utils/routerHelper.js';
const userRouter = express.Router();
userRouter.get('/all', async (request, response) => {
    if (!checkAdmin(request.token)) {
        return response.status(401).json({ error: 'unauthorized access' });
    }
    const users = await User.find({});
    if (users !== null) {
        response.json(users);
    }
    else {
        response.status(400);
    }
});
export default userRouter;
