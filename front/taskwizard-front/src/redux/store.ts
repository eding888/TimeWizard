import { configureStore } from '@reduxjs/toolkit';
import csrfReducer from './csrfSlice';

const store = configureStore({
  reducer: {
    csrf: csrfReducer
  }
});

export default store;
