import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  startedTask: ''
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStart: (state, action) => {
      state.startedTask = action.payload;
    }
  }
});

export const { setStart } = dashboardSlice.actions;
export default dashboardSlice.reducer;
