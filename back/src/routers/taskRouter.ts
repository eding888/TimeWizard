import express, { Response, Router } from 'express';
import { countDays, getCurrentEpochInSeconds } from '../utils/dayOfWeekHelper.js';
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

const checkIfTimeSurpassed = async (startTime: number, task: TaskInterface) => {
  const time = getCurrentEpochInSeconds();
  if (startTime !== -1 && task.timeLeftToday !== 0 && ((time - startTime) >= task.timeLeftToday)) {
    task.totalTimeToday += task.timeLeftToday;
    task.timeLeftToday = 0;
    await task.save();
    return true;
  }
  return false;
};

taskRouter.get('/current', async (request: AuthenticatedRequest, response: Response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'User/token not found' });
  }
  const user = request.user;
  const tasks: TaskInterface[] = [];
  for (const userTask of user.tasks) {
    const task = await Task.findById(userTask.id);
    if (!task) {
      return response.status(404).json({ error: 'Invalid task id' });
    }
    await checkIfTimeSurpassed(userTask.startTime, task);
    tasks.push(task);
  }
  response.status(200).json({ tasks });
});
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
  if (user._id !== task.user) {
    return response.status(401).json({ error: 'task does not belong to user' });
  }
  const startTime = getCurrentEpochInSeconds();
  user.tasks.forEach(userTask => {
    if (userTask.id === task._id) {
      if (userTask.startTime !== -1) {
        return response.status(400).json({ error: 'task already started' });
      }
      userTask.active = true;
      userTask.startTime = startTime;
    } else {
      userTask.active = false;
      userTask.startTime = -1;
    }
  });
  response.status(200).json({ startTime });
});

taskRouter.post('/stopTaskTimer/:id', async (request: AuthenticatedRequest, response: Response) => {
  const id = request.params.id;
  if (!request.user) {
    return response.status(401).json({ error: 'User/token not found' });
  }
  const user = request.user;
  const stoppedTask = await Task.findById(id);
  if (!stoppedTask) {
    return response.status(404).json({ error: 'task not found' });
  }
  if (user._id !== stoppedTask.user) {
    return response.status(401).json({ error: 'task does not belong to user' });
  }
  const userTask = user.tasks.find(userTask => userTask.id === stoppedTask._id);
  if (!userTask) {
    return response.status(404).json({ error: 'user task not found' });
  }
  if (!userTask.active) {
    return response.status(400).json({ error: 'task was never started' });
  }
  const time = getCurrentEpochInSeconds();
  const startTime = userTask.startTime;
  if (!(await checkIfTimeSurpassed(startTime, stoppedTask))) {
    stoppedTask.timeLeftToday -= (stoppedTask.timeLeftToday === 0 ? 0 : (time - startTime));
    stoppedTask.totalTimeToday += time - userTask.startTime;
  }
  userTask.active = false;
  userTask.startTime = -1;
  response.status(200).json({ startTime });
});

export default taskRouter;
