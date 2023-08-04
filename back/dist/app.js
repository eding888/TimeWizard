import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './utils/config.js';
import userRouter from './routers/userRouter.js';
import loginRouter from './routers/loginRouter.js';
import sample from './routers/sample.js';
import middleware from './utils/middleware.js';
const app = express();
const { MONGO_URI } = config;
mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.log('Error:', error);
});
app.use(express.json());
app.use(cors());
app.use(express.static('build'));
app.use('/api/login', loginRouter);
app.use(middleware.getTokenFrom);
app.use(middleware.getUserFromToken);
app.use('/api/users', userRouter);
app.use('/api/test', sample);
app.use(middleware.errorHandler);
export default app;
