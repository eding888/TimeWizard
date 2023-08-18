import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './utils/config.js';
import newUserRouter from './routers/newUser.js';
import userRouter from './routers/userRouter.js';
import loginRouter from './routers/loginRouter.js';
import sample from './routers/sample.js';
import taskRouter from './routers/taskRouter.js';
import middleware from './utils/middleware.js';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import Task, { TaskInterface } from './models/task.js';
import { countDays } from './utils/dayOfWeekHelper.js';
import http from 'http';
import { Server } from 'socket.io';

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
          task.deadlineOptions.timeRemaining -= (task.totalTimeToday - task.timeLeftToday);
          task.timeLeftToday = (task.deadlineOptions.timeRemaining / (countDays(task.daysOfWeek, task.deadlineOptions.deadline)));
          break;
        case 'recurring':
          task.recurringOptions.debt += (task.timeLeftToday - (((task.totalTimeToday - task.timeLeftToday) > 0) ? (task.totalTimeToday - task.timeLeftToday) : 0));
          task.timeLeftToday = ((task.recurringOptions.timePerWeek + (task.recurringOptions.debt / 10)) / task.daysOfWeek.length);
      }
      task.daysOld += 1;
      await task.save();
    });
  });
};

cron.schedule('0 0 * * *', updateTasks);

const app: Express = express();
app.use(cors());
app.options('*', cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('WebSocket connected');

  socket.on('subscribeToTask', async (taskId) => {
    console.log('Subscribing to task:', taskId);

    try {
      const task = await Task.findById(taskId);

      if (!task) {
        console.log('Task not found');
        return;
      }

      socket.emit('initialTaskData', task.toObject()); // Emit initial task data
      const changeStream = Task.collection.watch([{ $match: { _id: task._id } }]);
      // Listen for the 'taskSaved' event from the Mongoose schema's events
      changeStream.on('change', (change) => {
        if (change.operationType === 'update') {
          socket.emit('taskChange', change.fullDocument);
        }
      });

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        changeStream.close();
      });
    } catch (error) {
      console.error('Error:', error);
    }
  });
});

server.listen(8081, () => console.log(`Listening on port ${8081}`));
/*
app.use(cors({
  origin: `http://localhost:${config.PORT}`
}));
*/

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
app.use(middleware.checkCsrf);

app.use('/api/users', limiter, userRouter);
app.use('/api/task', limiter, taskRouter);
app.use('/api/sample', limiter, sample);

app.use(middleware.errorHandler);
export default app;
