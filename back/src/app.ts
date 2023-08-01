import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './utils/config';
import userRouter from './routers/userRouter';
import middleware from './utils/middleware';

const app: Express = express();
const { MONGO_URL } = config;
mongoose.set('strictQuery', false);

mongoose.connect(MONGO_URL)
  .then((response: typeof import('mongoose')) => {
    console.log('Connected to MongoDB', response);
  })
  .catch((error: Error) => {
    console.log('Error:', error);
  });

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

app.use('/api/users', userRouter);

app.use(middleware.errorHandler);
export default app;
