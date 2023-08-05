import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './utils/config.js';
import newUserRouter from './routers/newUser.js';
import userRouter from './routers/userRouter.js';
import loginRouter from './routers/loginRouter.js';
import sample from './routers/sample.js';
import middleware from './utils/middleware.js';
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1500,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.'
});
const app = express();
app.use(cors({
    origin: `localhost:/${config.PORT}`
}));
const { MONGO_URI } = config;
mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.log('Error:', error);
});
app.use(limiter);
app.use(express.json());
app.use(cors());
app.use(express.static('build'));
app.use(middleware.getTokenFrom);
app.use(middleware.getUserFromToken);
app.use('/api/login', loginRouter);
app.use('/api/newUser', newUserRouter);
app.use('/api/users', userRouter);
app.use('/api/sample', sample);
app.use(middleware.errorHandler);
export default app;
