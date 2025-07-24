import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import sidebarToggleReducer from './sidebarToggle.js';

export default configureStore({
  reducer: {
    auth: authReducer,
    'sidebarToggle': sidebarToggleReducer,
  },
});
