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
import http from 'http';
import { Server } from 'socket.io';
import { handleSocket } from './utils/socketConnection.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
});
const maxAccounts = config.TEST ? 1000 : 3;
const accountLimiter = rateLimit({
  windowMs: 120 * 60 * 1000,
  // max: maxAccounts,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many accounts created, please try again later.'
});

const updateTasks = async () => {
  console.log('hi');
  const tasks: TaskInterface[] = await Task.find({});
  console.log('hia');
  const today = new Date();
  tasks.forEach(async (task: TaskInterface) => {
    console.log('lol');
    switch (task.type) {
      case 'deadline':
        task.deadlineOptions.timeRemaining -= task.totalTimeToday;
        if (countDays(task.daysOfWeek, task.deadlineOptions.deadline) <= 0) {
          await task.deleteOne();
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
        task.recurringOptions.debt += task.originalTimeToday - task.totalTimeToday;
        if (task.recurringOptions.debt < 0) {
          task.recurringOptions.debt = 0;
        }
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

cron.schedule('0 0 * * *', updateTasks);

const app: Express = express();
/*
app.use(cors({
  origin: `http://localhost:${config.PORT}`
}));
*/
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies to be sent cross-origin
};

app.use(cors(corsOptions));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});
handleSocket(io);

server.listen(8081, () => console.log(`Listening on port ${8081}`));
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

app.use('/api/login', limiter, loginRouter);
app.use('/api/newUser', accountLimiter, newUserRouter);

app.use(middleware.parseToken);
app.use('/api/newSession', limiter, newSessionRouter);
app.use(middleware.checkCsrf);

app.use('/api/users', limiter, userRouter);
app.use('/api/task', limiter, taskRouter);
app.use('/api/sample', limiter, sample);

app.use(middleware.errorHandler);
export default app;
