import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from './config.js';
import User from '../models/user.js';

export interface jwtSubject{
  _id: string;
  username: string,
  passwordHash: string,
  jti: string
}

export interface code{
  code: string;
}

let expireLong = '7d';
let expireShort = '1h';
const expireVeryShort = '10m';

if (config.TEST) {
  expireLong = '11s';
  expireShort = '6s';
}

export const genAuthToken = async (username : string, passwordHash: string) => {
  const user = await User.findOne({ username });
  if (user !== null) {
    const id: string = user._id.toString();
    const jwtSubject:jwtSubject = {
      _id: id,
      username,
      passwordHash,
      jti: crypto.randomBytes(32).toString('hex')
    };
    return jwt.sign(jwtSubject, config.SECRET, { expiresIn: expireShort });
  }
  return '';
};

export const genRefreshToken = () => {
  const random = crypto.randomBytes(32).toString('hex');

  const payload = {
    code: random
  };
  return jwt.sign(payload, config.SECRET, { expiresIn: expireLong });
};

export const genEmailCode = () => {
  const min = 100000;
  const max = 999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  const digits = randomNumber.toString();

  const payload: code = {
    code: digits
  };

  const token = jwt.sign(payload, config.SECRET, { expiresIn: expireVeryShort });

  return (
    {
      digits,
      token
    }
  );
};

export const verifyToken = (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, config.SECRET); // eslint-disable-line
    return true;
  } catch (error) {
    return false;
  }
};
