import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from './config.js';
import User from '../models/user.js';
let expireLong = '1d';
let expireShort = '1h';
const expireVeryShort = '10m';
if (config.TEST) {
    expireLong = '11s';
    expireShort = '6s';
}
// Generates encrypted auth token
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
        return jwt.sign(jwtSubject, config.SECRET, { expiresIn: expireShort });
    }
    return '';
};
// Generates encrypted refresh token
export const genRefreshToken = () => {
    const random = crypto.randomBytes(32).toString('hex');
    const payload = {
        code: random
    };
    return jwt.sign(payload, config.SECRET, { expiresIn: expireLong });
};
// Generates a 6 digit code for email verification as well as its encrypted equivalent
export const genEmailCode = () => {
    const min = 100000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const digits = randomNumber.toString();
    const payload = {
        code: digits
    };
    const token = jwt.sign(payload, config.SECRET, { expiresIn: expireVeryShort });
    return ({
        digits,
        token
    });
};
// Returns true if token is not expired, but false if it is
export const verifyToken = (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, config.SECRET); // eslint-disable-line
        return true;
    }
    catch (error) {
        return false;
    }
};
