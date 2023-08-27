import axios from 'axios';
import DOMPurify from 'dompurify';
const backendUrl = 'http://localhost:8080';

export const newUser = async (username: string, email: string, password: string) => {
  console.log(username, email);
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
    await axios.post(`${backendUrl}/api/login/resetPassword/confirm`, { email: purifyEmail, code: purifyCode, password: purifyNewPassword });
    return 'OK';
  } catch (error: any) {
    const errorMsg: string = error.response.data.error;
    return errorMsg;
  }
};
