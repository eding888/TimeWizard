import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  csrf: ''
};

const csrfSlice = createSlice({
  name: 'csrf',
  initialState,
  reducers: {
    setCsrf: (state, action) => {
      state.csrf = action.payload;
    }
  }
});

export const { setCsrf } = csrfSlice.actions;
export default csrfSlice.reducer;
