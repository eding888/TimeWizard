import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import config from '../utils/config';

let UNCEmailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]*\.)?unc\.edu$/;
if (config.TEST) {
  UNCEmailRegex = /.*/;
}

const checkEmail = (email: string) => {
  return UNCEmailRegex.test(email);
};

export interface UserInterface extends mongoose.Document {
  _id: string,
  username: string,
  email: string,
  passwordHash: string,
  isVerified: boolean,
  emailCode: string,
  refreshToken: string,
}
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
    validate: [checkEmail, 'Invalid email. Ensure you are using a valid UNC email.'],
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
  emailCode: String,
  refreshToken: String
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  }
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model<UserInterface>('User', userSchema);

export default User;
