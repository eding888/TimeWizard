import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from './config.js';
import User, { UserInterface } from '../models/user.js';
import { verifyToken, genAuthToken, tokenPayload } from './genToken.js';
import Tokens from 'csrf';
const tokens = new Tokens();

// Token is tacked onto the request, made possible with this interface
export interface AuthenticatedRequest extends Request {
  token?: string | null;
  user?: UserInterface;
}

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const parseToken = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
  let token = request.cookies.token;
  if (token !== 'undefined' && token) {
    if (!verifyToken(token)) {
      let expiredToken;
      try {
        expiredToken = jwt.decode(token) as tokenPayload;
      } catch (error) {
        return response.status(401).json({ error: 'token invalid' }); // token is nonsense
      }
      const id = expiredToken._id;
      if (!id || !expiredToken.username || !expiredToken.passwordHash) {
        return response.status(401).json({ error: 'token invalid' }); // token may be user, but is formatted wrong
      }
      const user: UserInterface = await User.findById(id) as UserInterface;
      if (user.passwordHash !== expiredToken.passwordHash) {
        return response.status(401).json({ error: 'token password does not match' }); // due to password reset by user, esssentially logs all current users out
      }
      if (user.refreshToken !== null && (!verifyToken(user.refreshToken) || !user.username)) {
        return response.status(400).json({ error: 'Your session has expired. Please refresh and log back in.' });
      }
      token = await genAuthToken(user.username, user.passwordHash);
      response.cookie('token', token, {
        httpOnly: true,
        secure: true
      });
    }
    try {
      const decodedToken: tokenPayload = jwt.verify(token, config.SECRET) as tokenPayload;
      const id = decodedToken._id;
      if (!id || !decodedToken.username || !decodedToken.passwordHash) {
        return response.status(401).json({ error: 'token invalid' });
      }
      const user: UserInterface = await User.findById(id) as UserInterface;
      if (user.passwordHash !== decodedToken.passwordHash) {
        return response.status(401).json({ error: 'token password does not match' }); // due to password reset by user, esssentially logs all current users out
      }
      request.user = user;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return response.status(400).json({ error: 'invalid token' });
      } else if (error instanceof jwt.TokenExpiredError) {
        return response.status(401).json({ error: 'token expired' });
      } else {
        return response.status(500).json({ error: 'internal server error' });
      }
    }
  }
  next();
};

const checkCsrf = (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
  console.log(request.headers);
  const csrf = request.headers['x-csrf-token'];
  if (!csrf || Array.isArray(csrf)) {
    return response.status(403).json({ error: 'no csrf provided' });
  }
  if (!tokens.verify(config.SECRET, csrf)) {
    return response.status(403).json({ error: 'invalid csrf' });
  }
  next();
};

export default { errorHandler, parseToken, checkCsrf };
