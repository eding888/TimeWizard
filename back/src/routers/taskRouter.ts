import express, { Response, Router } from 'express';
import { countDays } from '../utils/dayOfWeekHelper.js';
import 'express-async-errors';
import { AuthenticatedRequest } from 'utils/middleware.js';
import Task, { TaskType, DeadlineOptions, RecurringOptions, TaskInterface } from '../models/task.js';
import { UserInterface } from '../models/user.js';

const taskRouter: Router = express.Router();

interface NewUserInfo {
  type: TaskType,
  name: string,
  deadlineOptions: DeadlineOptions,
  recurringOptions: RecurringOptions,
  daysOfWeek: number[]
}
taskRouter.post('/newTask', async (request: AuthenticatedRequest, response: Response) => {
  const { type, name, deadlineOptions, recurringOptions, daysOfWeek }: NewUserInfo = request.body;
  if (!type || !name || (!deadlineOptions && !recurringOptions) || (deadlineOptions && recurringOptions) || !daysOfWeek) {
    return response.status(400).json({ error: 'Missing arguments' });
  }
  if (!request.user) {
    return response.status(401).json({ error: 'User/token not found' });
  }
  const user: UserInterface = request.user;
  const task: TaskInterface = new Task({
    type,
    name,
    deadlineOptions,
    recurringOptions,
    daysOfWeek
  });
  console.log(task);
  if (deadlineOptions) {
    task.timeLeftToday = (deadlineOptions.timeRemaining / (countDays(task.daysOfWeek, task.deadlineOptions.deadline)));
  } else {
    task.timeLeftToday = (recurringOptions.timePerWeek / task.daysOfWeek.length);
  }
  task.user = user._id;
  const res = await task.save();
  user.tasks = user.tasks.concat({ id: res._id, active: false, startTime: -1 });
  await user.save();

  response.status(200).json({ task: res });
});

taskRouter.post('/startTask/:id', async (request: AuthenticatedRequest, response: Response) => {
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
    } else {
      userTask.active = false;
      userTask.startTime = -1;
    }
  });
  response.status(200).json({ startTime });
});

export default taskRouter;
