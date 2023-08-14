import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface Date {
  month: number;
  day: number;
  year: number;
}

interface RecurringOptions {
  debt: number,
  timePerWeek: number
}

interface DeadlineOptions {
  deadline: Date,
  timeRemaining: number
}

type TaskType = 'deadline' | 'recurring';

export interface TaskInterface extends mongoose.Document {
  _id: string,
  type: TaskType,
  deadlineOptions: DeadlineOptions,
  recurringOptions: RecurringOptions,
  totalTimeToday: number,
  timeLeftToday: number,
  overtimeToday: number,
  daysOld: number
}
const taskSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['deadline', 'recurring'],
    required: [true, 'Task type is required']
  },
  recurringOptions: {
    type: {
      debt: Number,
      timePerWeek: Number
    },
    default: null
  },
  deadlineOptions: {
    type: {
      deadline: Date,
      timeRemaining: Number
    },
    default: null
  },
  timeLeftToday: {
    type: Number,
    deafult: 0
  },
  overtimeToday: {
    type: Number,
    deafult: 0
  },
  daysOld: {
    type: Number,
    deafult: 0
  }
});

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  }
});

taskSchema.plugin(uniqueValidator);

taskSchema.pre('save', function (next) {
  if (this.recurringOptions === null && this.deadlineOptions === null) {
    const error = new Error('Options must be provided for Task');
    return next(error);
  }
  if ((this.type === 'deadline' && this.deadlineOptions === null) || (this.type === 'recurring' && this.recurringOptions === null)) {
    const error = new Error('Incorrect options provided');
    return next(error);
  }
  next();
});

const Task = mongoose.model<TaskInterface>('Task', taskSchema);

export default Task;
