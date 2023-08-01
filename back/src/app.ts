import express, {Express} from 'express';
import cors from 'cors';
import mongoose, { Connection } from 'mongoose';
import config from './utils/config';
import userRouter from './routers/userRouter';

const app: Express = express();
const { MONGO_URL } = config;
mongoose.set('strictQuery', false);

mongoose.connect(MONGO_URL)
  .then((response: typeof import('mongoose')) => {
    console.log('Connected to MongoDB');
  })
  .catch((error: any) => {
    console.log('Error:', error);
  });

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

app.use('/api/users', userRouter);

export default app;
