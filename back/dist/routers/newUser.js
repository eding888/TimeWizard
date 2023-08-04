import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import 'express-async-errors';
import PasswordValidator from 'password-validator';
import { genAuthToken } from '../utils/genToken.js';
import { checkAdmin } from '../utils/routerHelper.js';
const newUserRouter = express.Router();
const passwordSchema = new PasswordValidator();
passwordSchema
    .is().min(6, 'Password must have minimum of 6 characters')
    .is().max(100, 'Password is too long')
    .has().uppercase(1, 'Password must contain an uppercase character')
    .has().digits(1, 'Password must contain a digit')
    .has().not().spaces();
newUserRouter.post('/', async (request, response) => {
    if (!checkAdmin(request.token)) {
        return response.status(401).json({ error: 'unauthorized access' });
    }
    const { username, email, password } = request.body;
    if (!username || !email || !password) {
        return response.status(400).json({
            error: 'no username or password or email'
        });
    }
    const passErrors = passwordSchema.validate(password, { details: true });
    if (Array.isArray(passErrors) && passErrors.length >= 1) {
        return response.status(400).json(passErrors);
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
        username,
        email,
        passwordHash
    });
    const savedUser = await user.save();
    const starterAuthToken = await genAuthToken(username);
    response.status(201).json({ savedUser, token: starterAuthToken });
});
export default newUserRouter;
