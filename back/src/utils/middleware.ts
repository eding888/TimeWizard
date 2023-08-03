import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from './config';
import User, { UserInterface } from 'models/user';

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

const getTokenFrom = (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('bearer ')) {
    request.token = authorization.replace('bearer ', '');
  } else request.token = null;

  next();
};

const getUserFromToken = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
  try {
    if (request.token) {
      const decodedToken: UserInterface = jwt.verify(request.token, config.SECRET) as UserInterface;
      if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
      }
      request.user = await User.findById(decodedToken.id) as UserInterface;
    } else {
      return response.status(401).json({ error: 'missing token' });
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return response.status(400).json({ error: 'invalid token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      return response.status(401).json({ error: 'token expired' });
    } else {
      return response.status(500).json({ error: 'internal server error' });
    }
  }
  next();
};

/* if (request.token) {
    try {
      const decodedToken = jwt.verify(request.token, config.SECRET);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError && error.message === 'jwt expired') {
        const expiredToken = jwt.decode(request.token) as UserInterface;
        if (!expiredToken.id) {
          return response.status(401).json({ error: 'token invalid' });
        }
        const user: UserInterface = await User.findById(expiredToken.id) as UserInterface;
        const userRefreshToken = user.refreshToken;
      } else {

      }
    }
  } */
export default { errorHandler, getTokenFrom, getUserFromToken };
