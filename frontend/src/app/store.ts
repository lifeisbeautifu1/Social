import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import postsReducer from '../features/posts/postsSlice';
import conversationsReducer from '../features/conversations/conversationsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    conversations: conversationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
