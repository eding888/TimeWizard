import axios from 'axios';
import DOMPurify from 'dompurify';
import { CompletionType, Type } from '../components/NewTask';
import store from '../redux/store';
import { setCsrf } from '../redux/sessionSlice';
const backendUrl = 'http://localhost:8080';

export interface RecurringOptions {
  debt: number,
  timePerWeek: number // seconds
}

export interface DeadlineOptions {
  deadline: Date,
  timeRemaining: number // seconds
}

export const newUser = async (username: string, email: string, password: string) => {
  try {
    const purifyUsername = DOMPurify.sanitize(username);
    const purifyEmail = DOMPurify.sanitize(email);
    const purifyPassword = DOMPurify.sanitize(password);

    await axios.post(`${backendUrl}/api/newUser`, { username: purifyUsername, email: purifyEmail, password: purifyPassword });
    return 'OK';
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    if (errorMsg.includes('email')) {
      return 'Email is already in use.';
    }
    if (errorMsg.includes('username')) {
      return 'Username is already in use.';
    }
    return errorMsg;
  }
};

export interface loginResponse {
  status: string,
  token: string | null
}
export const login = async (email: string, password: string) => {
  try {
    const purifyEmail = DOMPurify.sanitize(email);
    const purifyPassword = DOMPurify.sanitize(password);
    const res = await axios.post(`${backendUrl}/api/login`, { email: purifyEmail, password: purifyPassword }, {
      withCredentials: true
    });
    let output: loginResponse;
    if (!res.data.csrf) {
      output = { status: 'No CSRF response', token: null };
      return output;
    }
    output = { status: 'OK', token: res.data.csrf };
    return output;
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    let status: string = errorMsg;
    if (errorMsg.includes('not verified')) {
      status = 'CONFIRMATION';
    }
    const output = { status, token: null };
    return output;
  }
};

export const confirm = async (code: string, username: string) => {
  try {
    const purifyUsername = DOMPurify.sanitize(username);
    const purifyCode = DOMPurify.sanitize(code);
    await axios.post(`${backendUrl}/api/login/confirm`, { code: purifyCode, username: purifyUsername });
    return 'OK';
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    return errorMsg;
  }
};

export const resetPassword = async (email: string) => {
  try {
    const purifyEmail = DOMPurify.sanitize(email);
    await axios.post(`${backendUrl}/api/login/resetPassword`, { email: purifyEmail });
    return 'OK';
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    return errorMsg;
  }
};

export const confirmResetPassword = async (email: string, code: string, newPassword: string) => {
  try {
    const purifyCode = DOMPurify.sanitize(code);
    const purifyEmail = DOMPurify.sanitize(email);
    const purifyNewPassword = DOMPurify.sanitize(newPassword);
    await axios.post(`${backendUrl}/api/login/resetPassword/confirm`, { email: purifyEmail, code: purifyCode, newPassword: purifyNewPassword });
    return 'OK';
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    return errorMsg;
  }
};

export const newTask = async (type: Type, name: string, completionType: CompletionType, daysOfWeek: number[], deadlineDate: Date | null = null, hours: number, minutes: number) => {
  try {
    const purifyName = DOMPurify.sanitize(name);
    const time = (hours * 60 * 60) + minutes * 60;
    const typeToVal = type === Type.RECURRING ? 0 : 1;
    await axios.post(`${backendUrl}/api/task/newTask`, { type: typeToVal, name: purifyName, discrete: (completionType === CompletionType.COUNT), daysOfWeek, deadlineDate, time }, { headers: { 'x-csrf-token': store.getState().session.csrf }, withCredentials: true });
    return 'OK';
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    return errorMsg;
  }
};

export const newSession = async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/newSession`, { withCredentials: true });
    store.dispatch(setCsrf(res.data.csrf));
    return 'OK';
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    return errorMsg;
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/users/current`, { headers: { 'x-csrf-token': store.getState().session.csrf }, withCredentials: true });
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const getTasks = async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/task/current`, { headers: { 'x-csrf-token': store.getState().session.csrf }, withCredentials: true });
    return res.data.tasks;
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    return errorMsg;
  }
};

export const deleteTask = async (id: string) => {
  try {
    const cleanId = DOMPurify.sanitize(id);
    await axios.delete(`${backendUrl}/api/task/${cleanId}`, { headers: { 'x-csrf-token': store.getState().session.csrf }, withCredentials: true });
    return 'OK';
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    return errorMsg;
  }
};

export const stopTask = async (id: string, countAmount?: number) => {
  try {
    const cleanId = DOMPurify.sanitize(id);
    const res = await axios.post(`${backendUrl}/api/task/stopTask/${cleanId}`, { amount: countAmount }, { headers: { 'x-csrf-token': store.getState().session.csrf }, withCredentials: true });
    return 'OK';
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    return errorMsg;
  }
};

export const startTask = async (id: string) => {
  try {
    const cleanId = DOMPurify.sanitize(id);
    const res = await axios.post(`${backendUrl}/api/task/startTask/${cleanId}`, {}, { headers: { 'x-csrf-token': store.getState().session.csrf }, withCredentials: true });
    return 'OK';
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    return errorMsg;
  }
};

export const sendFriendRequest = async (username: string) => {
  try {
    const cleanUsername = DOMPurify.sanitize(username);
    const res = await axios.post(`${backendUrl}/api/users/sendFriendRequest/${cleanUsername}`, {}, { headers: { 'x-csrf-token': store.getState().session.csrf }, withCredentials: true });
    return 'OK';
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    return errorMsg;
  }
};

export const acceptFriendRequest = async (username: string) => {
  try {
    const cleanUsername = DOMPurify.sanitize(username);
    const res = await axios.post(`${backendUrl}/api/users/acceptFriendRequest/${cleanUsername}`, {}, { headers: { 'x-csrf-token': store.getState().session.csrf }, withCredentials: true });
    return 'OK';
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    return errorMsg;
  }
};

export const removeFriend = async (username: string) => {
  try {
    const cleanUsername = DOMPurify.sanitize(username);
    const res = await axios.post(`${backendUrl}/api/users/removeFriend/${cleanUsername}`, {}, { headers: { 'x-csrf-token': store.getState().session.csrf }, withCredentials: true });
    return 'OK';
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    return errorMsg;
  }
};
