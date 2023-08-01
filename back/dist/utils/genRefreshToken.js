var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from './config.js';
import User from '../models/user.js';
const expiresInOneWeek = 7 * 24 * 60 * 60;
const genRefreshToken = ({ username, email, passwordHash }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ username });
    if (user !== null) {
        const id = user._id;
        const jwtSubject = {
            _id: id,
            username,
            email,
            passwordHash,
            jti: crypto.randomBytes(32).toString('hex')
        };
        return jwt.sign(jwtSubject, config.SECRET, { expiresIn: expiresInOneWeek });
    }
});
export default genRefreshToken;
