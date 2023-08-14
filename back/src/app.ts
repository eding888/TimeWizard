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
import cron from 'node-cron';
import Task, { TaskInterface } from 'models/task.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
});
const maxAccounts = config.TEST ? 1000 : 3;
const accountLimiter = rateLimit({
  windowMs: 120 * 60 * 1000,
  max: maxAccounts,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many accounts created, please try again later.'
});

const updateTasks = () => {
  Task.find({}, (err: Error, tasks: TaskInterface[]) => {
    if (err) {
      console.error(err);
      return;
    }
    tasks.forEach(async (task: TaskInterface) => {
      switch (task.type) {
        case 'deadline':
          task.deadlineOptions.timeRemaining -= (task.totalTimeToday - task.timeLeftToday + task.overtimeToday);
          break;
        case 'recurring':
          task.recurringOptions.debt += (task.timeLeftToday - task.overtimeToday);
      }

      await task.save();
    });
  });
};

cron.schedule('0 0 * * *', updateTasks);

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

app.use(cookieParser());

app.use(express.json());
app.use(express.static('build'));

app.use('/api/login', limiter, loginRouter);
app.use('/api/newUser', accountLimiter, newUserRouter);

app.use(middleware.parseToken);
app.use(middleware.checkCsrf);

app.use('/api/users', limiter, userRouter);
app.use('/api/sample', limiter, sample);

app.use(middleware.errorHandler);
export default app;
