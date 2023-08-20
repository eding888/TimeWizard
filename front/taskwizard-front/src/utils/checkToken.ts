export const checkToken = ():boolean => {
  const token = window.localStorage.getItem('token');
  if (token && token !== 'INVALID') {
    return true;
  }
  return false;
};
