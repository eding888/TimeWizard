import express from 'express';
import bcrypt from 'bcrypt';
import { genRefreshToken, genAuthToken } from '../utils/genToken.js';
import { sanitizeInput } from '../utils/routerHelper.js';
import User from '../models/user.js';
const regenRefresh = express.Router();
// When a user's refresh token expires, there is a good cchance their auth token expired as well. This route allows
// for a
regenRefresh.post('/', async (request, response) => {
    let { username, password } = request.body;
    if (username && password) {
        username = sanitizeInput(username, 'none');
        password = sanitizeInput(password, 'allow');
        const user = await User.findOne({ username });
        if (!user) {
            return response.status(401).json({
                error: 'invalid username'
            });
        }
        const passwordCorrect = user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);
        if (!passwordCorrect) {
            return response.status(401).json({
                error: 'invalid password'
            });
        }
        if (!user.isVerified) {
            return response.status(401).json({
                error: 'user is not verified'
            });
        }
        user.refreshToken = genRefreshToken();
        const authToken = genAuthToken(user.username);
        response.status(200).json(authToken);
    }
    else {
        return response.status(400).json({
            error: 'no password provided'
        });
    }
});
