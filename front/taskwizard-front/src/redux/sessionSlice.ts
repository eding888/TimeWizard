import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  csrf: ''
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCsrf: (state, action) => {
      state.csrf = action.payload;
    }
  }
});

export const { setCsrf } = sessionSlice.actions;
export default sessionSlice.reducer;
