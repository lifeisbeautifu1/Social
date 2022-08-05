import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IPost } from '../../interfaces';

type initialStateType = {
  posts: IPost[];
  selectedPost: IPost | null;
};

const initialState: initialStateType = {
  posts: [],
  selectedPost: null,
};

export const deletePost = createAsyncThunk(
  '/posts/deletePost',
  async (post: IPost, thunkAPI) => {
    try {
      // @ts-ignore
      const token = thunkAPI.getState().user.user.token;
      await axios.delete('/posts/' + post._id, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return post;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<IPost>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<IPost>) => {
      state.posts = state.posts.map((post) => {
        if (post._id === action.payload._id) {
          return action.payload;
        } else return post;
      });
    },
    updateSelectedPost: (state, action: PayloadAction<IPost>) => {
      state.selectedPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deletePost.pending, (state, action) => {
        console.log('delete post pendig');
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post._id !== action?.payload?._id
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        console.log('delete post rejected', action.payload);
      });
  },
});

export const { init, addPost, updatePost, updateSelectedPost } =
  postsSlice.actions;

export default postsSlice.reducer;
