import express, { Response, Router } from 'express';
import 'express-async-errors';
import { AuthenticatedRequest } from 'utils/middleware.js';
import User from '../models/user.js';

const userRouter: Router = express.Router();

userRouter.get('/current', async (request: AuthenticatedRequest, response: Response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'User/token not found' });
  }
  const user = request.user;
  await user.populate({
    path: 'tasks.id',
    select: '_id name type deadlineOptions recurringOptions discrete daysOfWeek totalTimeToday timeLeftToday daysOld user'
  });
  response.status(200).json(user);
});

userRouter.get('/friend/:username', async (request: AuthenticatedRequest, response: Response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'User/token not found' });
  }
  const username = request.params.username;
  const user = await User.findOne({ username: { $regex: new RegExp(username, 'i') } });
  if (!user) {
    return response.status(400).json({ error: 'User does not exist.' });
  }
  if (!request.user.friendsData.friends.map(friend => friend.toUpperCase() === username.toUpperCase())) {
    return response.status(401).json({ error: 'You do not have this user added.' });
  }
  await user.populate({
    path: 'tasks.id',
    select: '_id name type deadlineOptions recurringOptions discrete daysOfWeek totalTimeToday timeLeftToday daysOld user'
  });
  response.status(200).json(user);
});

userRouter.post('/sendFriendRequest/:username', async (request: AuthenticatedRequest, response: Response) => {
  const username = request.params.username;
  console.log(username);
  if (!request.user) {
    return response.status(401).json({ error: 'User/token not found' });
  }
  const user = await User.findOne({ username: { $regex: new RegExp(username, 'i') } });
  if (!user) {
    return response.status(400).json({ error: 'User does not exist.' });
  }
  if (user.friendsData.friendRequests.includes(request.user.username)) {
    return response.status(400).json({ error: 'Friend request already sent.' });
  }
  if (user.friendsData.friends.includes(request.user.username)) {
    return response.status(400).json({ error: 'Friend already added.' });
  }
  user.friendsData.friendRequests.push(request.user.username);
  await user.save();
  response.status(200);
});

userRouter.post('/acceptFriendRequest/:username', async (request: AuthenticatedRequest, response: Response) => {
  const username = request.params.username;
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: 'User/token not found' });
  }
  const requestUser = await User.findOne({ username: { $regex: new RegExp(username, 'i') } });
  if (!requestUser) {
    return response.status(400).json({ error: 'User does not exist.' });
  }
  if (!user.friendsData.friendRequests.map(request => request.toUpperCase() === username.toUpperCase())) {
    return response.status(400).json({ error: 'User never recieved friend request form this user.' });
  }
  user.friendsData.friendRequests = user.friendsData.friendRequests.filter(request => request.toUpperCase() !== username.toUpperCase());
  requestUser.friendsData.friendRequests = requestUser.friendsData.friendRequests.filter(request => request.toUpperCase() !== user.username.toUpperCase());
  user.friendsData.friends.push(username);
  requestUser.friendsData.friends.push(user.username);
  await user.save();
  await requestUser.save();

  response.status(200);
});

userRouter.post('/rejectFriendRequest/:username', async (request: AuthenticatedRequest, response: Response) => {
  const username = request.params.username.toUpperCase();
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: 'User/token not found' });
  }
  if (!user.friendsData.friendRequests.map(friend => friend.toUpperCase() === username)) {
    return response.status(400).json({ error: 'User never recieved friend request from this user.' });
  }
  user.friendsData.friendRequests = user.friendsData.friendRequests.filter(request => request.toUpperCase() !== username);
  await user.save();

  response.status(200);
});

userRouter.post('/removeFriend/:username', async (request: AuthenticatedRequest, response: Response) => {
  const username = request.params.username;
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: 'User/token not found' });
  }
  const requestUser = await User.findOne({ username: { $regex: new RegExp(username, 'i') } });
  if (!requestUser) {
    return response.status(400).json({ error: 'User does not exist.' });
  }
  if (!user.friendsData.friends.map(friend => friend.toUpperCase() === username.toUpperCase())) {
    return response.status(400).json({ error: 'This user was never added.' });
  }
  user.friendsData.friends = user.friendsData.friends.filter(request => request.toUpperCase() !== username.toUpperCase());
  requestUser.friendsData.friends = requestUser.friendsData.friends.filter(request => request.toUpperCase() !== user.username.toUpperCase());
  await user.save();
  await requestUser.save();

  response.status(200);
});

export default userRouter;
