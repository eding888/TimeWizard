import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minLength: [3, 'Username must be at least 3 characters'],
        unique: [true, 'Username is already taken']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email is already registered']
    },
    passwordHash: {
        type: String,
        minLength: 3,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailCode: {
        type: String,
        default: null
    },
    passResetCode: {
        type: String,
        default: null
    },
    passResetAttempts: {
        type: String,
        default: null
    },
    passResetCooldown: {
        type: Number,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    }
});
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.refreshToken;
        delete returnedObject.emailCode;
        delete returnedObject.passResetCode;
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash;
    }
});
userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);
export default User;
