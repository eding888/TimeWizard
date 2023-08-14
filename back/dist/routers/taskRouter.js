import express from 'express';
import { countDays } from '../utils/dayOfWeekHelper.js';
import 'express-async-errors';
import Task from '../models/task.js';
const taskRouter = express.Router();
taskRouter.post('/newTask', async (request, response) => {
    const { type, name, deadlineOptions, recurringOptions, daysOfWeek } = request.body;
    if (!type || !name || (!deadlineOptions && !recurringOptions) || (deadlineOptions && recurringOptions) || !daysOfWeek) {
        return response.status(400).json({ error: 'Missing arguments' });
    }
    if (!request.user) {
        return response.status(401).json({ error: 'User/token not found' });
    }
    const user = request.user;
    const task = new Task({
        type,
        name,
        deadlineOptions,
        recurringOptions,
        daysOfWeek
    });
    console.log(task);
    if (deadlineOptions) {
        task.timeLeftToday = (deadlineOptions.timeRemaining / (countDays(task.daysOfWeek, task.deadlineOptions.deadline)));
    }
    else {
        task.timeLeftToday = (recurringOptions.timePerWeek / task.daysOfWeek.length);
    }
    task.user = user._id;
    const res = await task.save();
    user.tasks = user.tasks.concat({ id: res._id, active: false, startTime: -1 });
    await user.save();
    response.status(200).json({ task: res });
});
taskRouter.post('/startTask/:id', async (request, response) => {
    const id = request.params.id;
    if (!request.user) {
        return response.status(401).json({ error: 'User/token not found' });
    }
    const user = request.user;
    const task = await Task.findById(id);
    if (!task) {
        return response.status(404).json({ error: 'task not found' });
    }
    console.log(task);
    console.log(task.user, user._id);
    if (user._id !== task.user) {
        return response.status(401).json({ error: 'task does not belong to user' });
    }
    const startTime = Date.now();
    user.tasks.forEach(userTask => {
        if (userTask.id === task._id) {
            userTask.active = true;
            userTask.startTime = startTime;
        }
        else {
            userTask.active = false;
            userTask.startTime = -1;
        }
    });
    response.status(200).json({ startTime });
});
export default taskRouter;
