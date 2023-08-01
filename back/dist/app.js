import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './utils/config.js';
import userRouter from './routers/userRouter.js';
import middleware from './utils/middleware.js';
const app = express();
const { MONGO_URL } = config;
mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL)
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.log('Error:', error);
});
app.use(express.json());
app.use(cors());
app.use(express.static('build'));
app.use('/api/users', userRouter);
app.use(middleware.errorHandler);
export default app;
