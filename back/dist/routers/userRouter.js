var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import cors from 'cors';
import 'express-async-errors';
import PasswordValidator from 'password-validator';
const userRouter = express.Router();
const passwordSchema = new PasswordValidator();
const noCors = {
    origin: true
};
passwordSchema
    .is().min(6, 'Password must have minimum of 6 characters')
    .is().max(100, 'Password is too long')
    .has().uppercase(1, 'Password must contain an uppercase character')
    .has().digits(1, 'Password must contain a digit')
    .has().not().spaces();
userRouter.get('/all', cors(noCors), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.find({});
    if (users !== null) {
        response.json(users);
    }
    else {
        response.status(400);
    }
}));
userRouter.post('/', cors(noCors), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = request.body;
    const passErrors = passwordSchema.validate(password, { details: true });
    console.log(passErrors);
    if (Array.isArray(passErrors) && passErrors.length >= 1) {
        return response.status(400).json(passErrors);
    }
    const saltRounds = 10;
    const passwordHash = yield bcrypt.hash(password, saltRounds);
    const user = new User({
        username,
        email,
        passwordHash
    });
    const savedUser = yield user.save();
    response.status(201).json(savedUser);
}));
export default userRouter;
