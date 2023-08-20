import Cookies from 'js-cookie';
export const checkToken = ():boolean => {
  const token = Cookies.get();
  console.log('hi', token);
  return false;
  /*
  if (token && token !== 'INVALID') {
    return true;
  }
  return false;
  */
};
