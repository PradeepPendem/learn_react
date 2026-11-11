import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
  // Adding custom middleware or devTools configs is common here
  devTools: process.env.NODE_ENV !== 'production',
});
