//@ts-nocheck
//TS check disabled beecause change interface does not include documentKey
import { Server } from 'socket.io';
import User, { UserInterface } from '../models/user.js';
import Task from '../models/task.js';

// Helper method which just returns ids from tasks in user document as an array
const getTaskIdsFromUser = (user: UserInterface): string[] => {
  const ids = [];
  user.tasks.forEach(task => ids.push(task.id.toString()));
  return ids;
}

export const handleSocket = (io: Server): void => {
  io.on('connection', (socket) => {
    console.log('WebSocket connected');
    // Socket connection initiated by listening to changes in specific user
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
        // Emit changes in Task document
        taskChangeStream.on('change', (change) => {
          if (ids.includes(change.documentKey._id.toString())) {
            socket.emit('taskChange', change);
          }
        });
        // Emit changes in User document
        userChangeStream.on('change', async (change) => {
          if (change.documentKey._id.toString() === user._id.toString()) {
            const user = await User.findById(userId);
            ids = getTaskIdsFromUser(user);
            socket.emit('userChange', change);
          }
        });
        socket.on('disconnect', () => {
          console.log('WebSocket disconnected');
          taskChangeStream.close();
          userChangeStream.close();
        });
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
};
