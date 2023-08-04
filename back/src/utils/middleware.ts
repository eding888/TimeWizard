import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from './config.js';
import User, { UserInterface } from '../models/user.js';
import { verifyToken, genAuthToken } from './genToken.js';

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

// Will acquire the token from headers and checks if its valid. If it is, it updates request.token.
// If not, it will decode that token, check the user it came from for a refresh token, and if refresh token
// is valid, a new auth token will simply be provided.
const getTokenFrom = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
  const authorization = request.get('Authorization');
  if (authorization && authorization.startsWith('bearer ')) {
    const token = authorization.replace('bearer ', '');
    if (verifyToken(token) || token === config.ADMIN_KEY) {
      request.token = token;
    } else {
      let expiredToken;
      try {
        expiredToken = jwt.decode(token) as UserInterface;
      } catch (error) {
        return response.status(401).json({ error: 'token invalid' }); // token is nonsense
      }
      const id = expiredToken._id;
      if (!id || !expiredToken.username) {
        return response.status(401).json({ error: 'token invalid' }); // token may be user, but is formatted wrong
      }

      const user: UserInterface = await User.findById(id) as UserInterface;
      if (user.refreshToken !== null && (!verifyToken(user.refreshToken) || !user.username)) {
        return response.status(400).json({ error: 'refresh token expired' });
      }
      const newToken = await genAuthToken(user.username);
      request.token = newToken;
      // NEW AUTH TOKEN GENERATED, BE SURE TO CATCH THIS IN FRONTEND TO STORE IN COOKIE
      response.setHeader('Authorization', newToken);
    }
  } else {
    return response.status(400).json({ error: 'missing token' });
  }
  next();
};

const getUserFromToken = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
  try {
    if (!request.token) {
      return response.status(400).json({ error: 'missing token' });
    }
    if (request.token !== config.ADMIN_KEY) {
      const decodedToken: UserInterface = jwt.verify(request.token, config.SECRET) as UserInterface;
      const id = decodedToken._id;
      if (!id) {
        return response.status(401).json({ error: 'token invalid' });
      }
      request.user = await User.findById(id) as UserInterface;
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

export default { errorHandler, getTokenFrom, getUserFromToken };
