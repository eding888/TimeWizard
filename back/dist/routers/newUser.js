import express from 'express';
import User from '../models/user.js';
import config from '../utils/config.js';
import 'express-async-errors';
import { genAuthToken } from '../utils/genToken.js';
import { checkSanitizedInput, passwordToHash } from '../utils/routerHelper.js';
import Tokens from 'csrf';
const tokens = new Tokens();
const newUserRouter = express.Router();
newUserRouter.post('/', async (request, response) => {
    const { username, email, password } = request.body;
    if (!username || !email || !password) {
        return response.status(400).json({
            error: 'no username or password or email'
        });
    }
    if (!checkSanitizedInput(username, 'none') || !checkSanitizedInput(email, 'email')) {
        return response.status(400).json({
            error: 'improper formatting of username or email'
        });
    }
    const passwordHashDetails = await passwordToHash(password);
    if (passwordHashDetails.errors) {
        return response.status(400).json({
            errors: passwordHashDetails.errors
        });
    }
    const passwordHash = passwordHashDetails.password;
    if (!passwordHash) {
        return response.status(500).json({
            error: 'error in generating hash'
        });
    }
    const user = new User({
        username,
        email,
        passwordHash
    });
    const savedUser = await user.save();
    const starterAuthToken = await genAuthToken(username, passwordHash);
    const token = tokens.create(config.SECRET);
    response.cookie('token', starterAuthToken, {
        httpOnly: true,
        secure: true
    });
    response.status(201).json({ savedUser, csrf: token });
});
export default newUserRouter;
