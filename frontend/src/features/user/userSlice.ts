import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
  onlineUsers: [],
  refetchMessages: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    updateFollowing: (state, action) => {
      state.user.following = action.payload;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setRefetchMessages: (state) => {
      state.refetchMessages = !state.refetchMessages;
    },
  },
});

export const {
  login,
  logout,
  updateFollowing,
  setOnlineUsers,
  setRefetchMessages,
} = userSlice.actions;

export default userSlice.reducer;
