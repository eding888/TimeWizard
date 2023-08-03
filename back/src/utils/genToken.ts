import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from './config.js';
import User, { UserInterface } from '../models/user.js';
import { ObjectId } from 'mongodb';

interface jwtSubject{
  _id: ObjectId;
  username: string,
  jti: string
}

const expiresInOneWeek = 7 * 24 * 60 * 60;
const expiresInOneHour = 60 * 60;

const genAuthToken = async (username : UserInterface) => {
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
};

const genRefreshToken = async () => {
  const random = crypto.randomBytes(32).toString('hex');
  return jwt.sign(random, config.SECRET, { expiresIn: expiresInOneWeek });
};

export default { genRefreshToken, genAuthToken };
