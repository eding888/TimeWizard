import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from './config.js';
import User, { UserInterface } from '../models/user.js';
import { ObjectId } from 'mongodb';

interface jwtSubject{
  _id: ObjectId;
  username: string,
  email: string,
  passwordHash: string,
  jti: string
}

const expiresInOneWeek = 7 * 24 * 60 * 60;

const genRefreshToken = async ({ username, email, passwordHash } : UserInterface) => {
  const user = await User.findOne({ username });
  if (user !== null) {
    const id: ObjectId = user._id;
    const jwtSubject:jwtSubject = {
      _id: id,
      username,
      email,
      passwordHash,
      jti: crypto.randomBytes(32).toString('hex')
    };
    return jwt.sign(jwtSubject, config.SECRET, { expiresIn: expiresInOneWeek });
  }
};

export default genRefreshToken;
