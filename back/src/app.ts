import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './utils/config.js';
import newUserRouter from './routers/newUser.js';
import userRouter from './routers/userRouter.js';
import loginRouter from './routers/loginRouter.js';
import sample from './routers/sample.js';
import middleware from './utils/middleware.js';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import Tokens from 'csrf';
const tokens = new Tokens();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 750,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
});

const app: Express = express();

app.use(cors({
  origin: `http://localhost:${config.PORT}`
}));

const { MONGO_URI } = config;
mongoose.set('strictQuery', false);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error: Error) => {
    console.log('Error:', error);
  });

app.use(limiter);
app.use(cookieParser());

app.use(express.json());
app.use(express.static('build'));

app.use('/api/login', loginRouter);

app.use(middleware.parseToken);

app.get('/getcsrf', (req, res) => {
  const token = tokens.create(config.SECRET);
  res.status(200).json({ csrf: token });
});

app.use(middleware.checkCsrf);

app.use('/api/newUser', newUserRouter);
app.use('/api/users', userRouter);
app.use('/api/sample', sample);

app.use(middleware.errorHandler);
export default app;
