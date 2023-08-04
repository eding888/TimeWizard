import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { verifyToken, genRefreshToken, genAuthToken } from '../utils/genToken.js';
const loginRouter = express.Router();
loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body;
    if (username && password) {
        const user = await User.findOne({ username });
        const passwordCorrect = user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);
        if (!(user && passwordCorrect)) {
            return response.status(401).json({
                error: 'invalid username or password'
            });
        }
        if (!user.refreshToken || !verifyToken(user.refreshToken)) {
            user.refreshToken = genRefreshToken();
        }
        const authToken = genAuthToken(user.username);
        response.status(200).json(authToken);
    }
});
export default loginRouter;
