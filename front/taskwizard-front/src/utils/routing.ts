import axios, { AxiosError } from 'axios';
const csrf = '';
const backendUrl = 'http://localhost:8080';

const newUser = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${backendUrl}/api/newUser`, { username, email, password });
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

export default newUser;
