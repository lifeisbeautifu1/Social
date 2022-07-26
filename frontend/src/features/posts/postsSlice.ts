import { createSlice } from '@reduxjs/toolkit';
import { IPost } from '../../interfaces';

type initialStateType = {
  posts: IPost[];
};

const initialState: initialStateType = {
  posts: [],
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    init: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
  },
});

export const { init, addPost } = postsSlice.actions;

export default postsSlice.reducer;
