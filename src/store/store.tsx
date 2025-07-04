// src/store/store.
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/slices/userSlice';
import viewsReducer from '@/store/slices/viewsSlice';
import languageReducer from '@/store/slices/languageSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    views: viewsReducer,
    language: languageReducer,
  },
});

// TypeScript 支援：RootState 與 AppDispatch 型別
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;