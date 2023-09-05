import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './utils/config.js';
import newUserRouter from './routers/newUser.js';
import userRouter from './routers/userRouter.js';
import loginRouter from './routers/loginRouter.js';
import sample from './routers/sample.js';
import taskRouter from './routers/taskRouter.js';
import newSessionRouter from './routers/newSession.js';
import middleware from './utils/middleware.js';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import Task, { TaskInterface } from './models/task.js';
import { countDays } from './utils/dayOfWeekHelper.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Limit for requests for normal requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
});
const maxAccounts = config.TEST ? 1000 : 3;

// Limit for the amount of accounts created
const accountLimiter = rateLimit({
  windowMs: 120 * 60 * 1000,
  max: maxAccounts,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many accounts created, please try again later.'
});

// Limit for the amount of login operations
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many account requests, please try again later.'
});

// Operation for updating tasks every day at midnight.
const updateTasks = async (): Promise<void> => {
  const tasks: TaskInterface[] = await Task.find({});
  const today = new Date();
  tasks.forEach(async (task: TaskInterface) => {
    switch (task.type) {
      case 'deadline':
        // If deadline type, update the time remaining for this task
        task.deadlineOptions.timeRemaining -= task.totalTimeToday;
        if (countDays(task.daysOfWeek, task.deadlineOptions.deadline) <= 0) {
          // Delete task is due date is passed
          await task.deleteOne();
        // If today is a day in which this task is active, set the proper time for this task today
        } else if (task.daysOfWeek.includes(today.getDay())) {
          const time = Math.round((task.deadlineOptions.timeRemaining / (countDays(task.daysOfWeek, task.deadlineOptions.deadline))));
          task.timeLeftToday = time;
          task.originalTimeToday = time;
        } else {
          task.timeLeftToday = 0;
          task.originalTimeToday = 0;
        }
        break;
      case 'recurring':
        // If recurring type, increase the debt if too little time is spent, or decrease it if overtime.
        task.recurringOptions.debt += task.originalTimeToday - task.totalTimeToday;
        if (task.recurringOptions.debt < 0) {
          task.recurringOptions.debt = 0;
        }
        // If today is a day in which this task is active, set the proper time for this task today
        if (task.daysOfWeek.includes(today.getDay())) {
          const time = Math.round(((task.recurringOptions.timePerWeek + (task.recurringOptions.debt / 10)) / task.daysOfWeek.length));
          task.timeLeftToday = time;
          task.originalTimeToday = time;
        } else {
          task.timeLeftToday = 0;
          task.originalTimeToday = 0;
        }
    }
    task.totalTimeToday = 0;
    task.daysOld += 1;
    await task.save();
  });
};

// Schedule updateTasks method everyday at midnight.
cron.schedule('0 0 * * *', updateTasks);

const app: Express = express();

// Set cors to only allow same-site requests
const corsOptions = {
  origin: 'https://taskwizard.fly.dev',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies to be sent cross-origin
};

app.use(cors(corsOptions));

// Create separate server for socket io requests

mongoose.set('strictQuery', false);

mongoose.connect(config.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error: Error) => {
    console.log('Error:', error);
  });

app.use(cookieParser());

app.use(express.json());
app.use(express.static('build'));

app.use('/api/login', loginLimiter, loginRouter);
app.use('/api/newUser', accountLimiter, newUserRouter);

app.use(middleware.parseToken);
app.use('/api/newSession', limiter, newSessionRouter);

app.use('/api/users', middleware.checkCsrf, limiter, userRouter);
app.use('/api/task', middleware.checkCsrf, limiter, taskRouter);
app.use('/api/sample', middleware.checkCsrf, limiter, sample);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.get('/*', function (req, res) {
  res.sendFile(join(__dirname, '../build/index.html'), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.use(middleware.errorHandler);
export default app;
