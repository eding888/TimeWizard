import jwt from 'jsonwebtoken';
import config from './config.js';
import User from '../models/user.js';
import { verifyToken, genAuthToken } from './genToken.js';
import Tokens from 'csrf';
const tokens = new Tokens();
const errorHandler = (error, request, response, next) => {
    console.log(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }
    else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: error.message });
    }
    next(error);
};
const parseToken = async (request, response, next) => {
    let token = request.cookies.token;
    if (token !== 'undefined' && token) {
        if (!verifyToken(token)) {
            let expiredToken;
            try {
                expiredToken = jwt.decode(token);
            }
            catch (error) {
                return response.status(401).json({ error: 'token invalid' }); // token is nonsense
            }
            const id = expiredToken._id;
            if (!id || !expiredToken.username || !expiredToken.passwordHash) {
                return response.status(401).json({ error: 'token invalid' }); // token may be user, but is formatted wrong
            }
            const user = await User.findById(id);
            if (user.passwordHash !== expiredToken.passwordHash) {
                return response.status(401).json({ error: 'token password does not match' }); // due to password reset by user, esssentially logs all current users out
            }
            if (user.refreshToken !== null && (!verifyToken(user.refreshToken) || !user.username)) {
                return response.status(400).json({ error: 'refresh token expired' });
            }
            token = await genAuthToken(user.username, user.passwordHash);
            response.cookie('token', token, {
                httpOnly: true,
                secure: true
            });
        }
        try {
            const decodedToken = jwt.verify(token, config.SECRET);
            const id = decodedToken._id;
            if (!id || !decodedToken.username || !decodedToken.passwordHash) {
                return response.status(401).json({ error: 'token invalid' });
            }
            const user = await User.findById(id);
            if (user.passwordHash !== decodedToken.passwordHash) {
                return response.status(401).json({ error: 'token password does not match' }); // due to password reset by user, esssentially logs all current users out
            }
            request.user = user;
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return response.status(400).json({ error: 'invalid token' });
            }
            else if (error instanceof jwt.TokenExpiredError) {
                return response.status(401).json({ error: 'token expired' });
            }
            else {
                return response.status(500).json({ error: 'internal server error' });
            }
        }
    }
    next();
};
const checkCsrf = (request, response, next) => {
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
