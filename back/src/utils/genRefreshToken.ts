import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from './config';
import { UserInterface } from '../models/user';

interface jwtSubject{
  username: string,
  email: string,
  passwordHash: string,
  jti: string
}

const expiresInOneWeek = 7 * 24 * 60 * 60;

const genRefreshToken = ({ username, email, passwordHash } : UserInterface) => {
  const jwtSubject:jwtSubject = {
    username,
    email,
    passwordHash,
    jti: crypto.randomBytes(32).toString('hex')
  };
  return jwt.sign(jwtSubject, config.SECRET, { expiresIn: expiresInOneWeek });
};

export default genRefreshToken;
