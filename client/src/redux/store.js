import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import moodReducer from './slices/moodSlice';
import journalReducer from './slices/journalSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    mood: moodReducer,
    journal: journalReducer,
  },
});

export default store;
