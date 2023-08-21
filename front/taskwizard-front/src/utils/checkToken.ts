import Cookies from 'js-cookie';
export const checkToken = ():boolean => {
  const token = window.localStorage.getItem('logged');
  if (token && token !== 'false') {
    return true;
  }
  return false;
};
