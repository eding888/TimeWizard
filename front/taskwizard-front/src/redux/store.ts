import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './sessionSlice';
import dashboardReducer from './dashboardSlice';
export interface SessionState {
  session: string
}
export interface DashboardState {
  started: string
}
const store = configureStore({
  reducer: {
    session: sessionReducer,
    dashboard: dashboardReducer
  }
});

export default store;
