import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from './config.js';
import User from '../models/user.js';
import { ObjectId } from 'mongodb';

interface jwtSubject{
  _id: ObjectId;
  username: string,
  jti: string
}

const expiresInOneWeek = 7 * 24 * 60 * 60;
const expiresInOneHour = 60 * 60;

export const genAuthToken = async (username : string) => {
  const user = await User.findOne({ username });
  if (user !== null) {
    const id: ObjectId = user._id;
    const jwtSubject:jwtSubject = {
      _id: id,
      username,
      jti: crypto.randomBytes(32).toString('hex')
    };
    return jwt.sign(jwtSubject, config.SECRET, { expiresIn: expiresInOneHour });
  }
  return '';
};

export const genRefreshToken = async () => {
  const random = crypto.randomBytes(32).toString('hex');
  return jwt.sign(random, config.SECRET, { expiresIn: expiresInOneWeek });
};

export const verifyToken = (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, config.SECRET); // eslint-disable-line
    return true;
  } catch (error) {
    return false;
  }
};
