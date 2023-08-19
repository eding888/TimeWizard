//@ts-nocheck
import { Server } from 'socket.io';
import User, { UserInterface } from '../models/user.js';
import Task from '../models/task.js';
const getTaskIdsFromUser = (user: UserInterface): string[] => {
  const ids = [];
  user.tasks.forEach(task => ids.push(task.id.toString()));
  return ids;
}
export const handleSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('WebSocket connected');
    socket.on('subscribeToUser', async (userId) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          console.log('User not found');
          return;
        }
        console.log('Subscribing to user:', user.username);
        let ids = getTaskIdsFromUser(user);
        console.log(ids);
        const taskChangeStream = Task.collection.watch();
        const userChangeStream = User.collection.watch();
        taskChangeStream.on('change', (change) => {
          console.log(change);
          if (ids.includes(change.documentKey._id.toString())) {
            console.log('update');
            socket.emit('taskChange', change);
          }
        });
        userChangeStream.on('change', async (change) => {
          console.log(change);
          if (change.documentKey._id.toString() === user._id.toString()) {
            const user = await User.findById(userId);
            ids = getTaskIdsFromUser(user);
            console.log(ids);
            socket.emit('userChange', change);
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
};
