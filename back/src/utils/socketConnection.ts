//@ts-nocheck
import { Server } from 'socket.io';
import Task from '../models/task.js';
export const handleSocket = (io: Server) => {
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
        const changeStream = Task.collection.watch();
        // Listen for the 'taskSaved' event from the Mongoose schema's events
        changeStream.on('change', (change) => {
          console.log(change);
          if (change.documentKey._id.toString() === task._id.toString() && change.operationType === 'update') {
            console.log('update');
            socket.emit('taskChange', change);
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
