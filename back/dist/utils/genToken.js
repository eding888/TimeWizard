import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from './config.js';
import User from '../models/user.js';
let expiresInOneWeek = '7d';
let expiresInOneHour = '1h';
if (config.TEST) {
    expiresInOneWeek = '9s';
    expiresInOneHour = '4s';
}
export const genAuthToken = async (username, passwordHash) => {
    const user = await User.findOne({ username });
    if (user !== null) {
        const id = user._id.toString();
        const jwtSubject = {
            _id: id,
            username,
            passwordHash,
            jti: crypto.randomBytes(32).toString('hex')
        };
        return jwt.sign(jwtSubject, config.SECRET, { expiresIn: expiresInOneHour });
    }
    return '';
};
export const genRefreshToken = () => {
    const random = crypto.randomBytes(32).toString('hex');
    const payload = {
        code: random
    };
    return jwt.sign(payload, config.SECRET, { expiresIn: expiresInOneWeek });
};
export const genEmailCode = () => {
    const min = 100000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const digits = randomNumber.toString();
    const payload = {
        code: digits
    };
    const token = jwt.sign(payload, config.SECRET, { expiresIn: expiresInOneWeek });
    return ({
        digits,
        token
    });
};
export const verifyToken = (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, config.SECRET); // eslint-disable-line
        return true;
    }
    catch (error) {
        return false;
    }
};
