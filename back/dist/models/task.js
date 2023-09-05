import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { validateDays } from '../utils/dayOfWeekHelper.js';
const taskSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['deadline', 'recurring'],
        required: [true, 'Task type is required']
    },
    name: {
        type: String,
        required: [true, 'Task name is required']
    },
    deadlineOptions: {
        type: {
            deadline: {
                month: Number,
                day: Number,
                year: Number
            },
            timeRemaining: Number
        },
        default: null
    },
    recurringOptions: {
        type: {
            debt: Number,
            timePerWeek: Number
        },
        default: null
    },
    discrete: {
        type: Boolean,
        default: false
    },
    daysOfWeek: {
        type: [Number],
        required: [true, 'Days of week are required']
    },
    totalTimeToday: {
        type: Number,
        default: 0
    },
    timeLeftToday: {
        type: Number,
        default: 0
    },
    originalTimeToday: {
        type: Number,
        default: 0
    },
    daysOld: {
        type: Number,
        default: 0
    },
    user: {
        type: String,
        ref: 'User'
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
    if (!validateDays(this.daysOfWeek)) {
        const error = new Error('Days of week not formatted correctly');
        return next(error);
    }
    next();
});
const Task = mongoose.model('Task', taskSchema);
export default Task;
