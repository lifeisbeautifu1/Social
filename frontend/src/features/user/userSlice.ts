import { createSlice } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';

let user = null;

if (localStorage.getItem('user')) {
  user = JSON.parse(localStorage.getItem('user')!);
  // @ts-ignore
  if (jwtDecode(user.token).exp * 1000 < Date.now()) {
    user = null;
  }
}

const initialState = {
  user,
  onlineUsers: [],
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
    updateUser: (state, action) => {
      state.user = {
        ...action.payload,
        token: state.user.token,
      };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
});

export const { login, logout, updateFollowing, setOnlineUsers, updateUser } =
  userSlice.actions;

export default userSlice.reducer;
