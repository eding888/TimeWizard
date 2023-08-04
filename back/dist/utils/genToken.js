import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from './config.js';
import User from '../models/user.js';
const expiresInOneWeek = 7 * 24 * 60 * 60;
const expiresInOneHour = 60 * 60;
export const genAuthToken = async (username) => {
    const user = await User.findOne({ username });
    if (user !== null) {
        const id = user._id.toString();
        const jwtSubject = {
            _id: id,
            username,
            jti: crypto.randomBytes(32).toString('hex')
        };
        return jwt.sign(jwtSubject, config.SECRET, { expiresIn: expiresInOneHour });
    }
    return '';
};
export const genRefreshToken = () => {
    const random = crypto.randomBytes(32).toString('hex');
    return jwt.sign(random, config.SECRET, { expiresIn: expiresInOneWeek });
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
