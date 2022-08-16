import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFriendRequest, IPostNotification, IUser } from '../../interfaces';
import axios from 'axios';

let user: any = null;

if (localStorage.getItem('user')) {
  user = JSON.parse(localStorage.getItem('user')!);
}

const initialState = {
  user,
  refetch: false,
  onlineUsers: [],
  friendRequests: [],
};

export const updateNotifications = createAsyncThunk(
  '/user/updateNotifications',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('/messageNotifications/');
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteNotifications = createAsyncThunk(
  '/user/deleteNotifications',
  async (from: string, thunkAPI) => {
    try {
      await axios.delete('/messageNotifications/' + from);
      return from;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk('/user/logout', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get('/auth/logout');
    return data;
  } catch (error) {
    thunkAPI.rejectWithValue(error);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.friendRequests = action.payload.friendRequests?.filter(
        (fr: IFriendRequest) => fr.from._id !== action.payload._id
      );
      localStorage.setItem('user', JSON.stringify(action.payload));

      state.user.postNotifications = action.payload.postNotifications.filter(
        (p: IPostNotification) => p.user._id !== state.user._id
      );
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setRefetch: (state) => {
      state.refetch = !state.refetch;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      state.user.postNotifications = action.payload.postNotifications.filter(
        (p: IPostNotification) => p.user._id !== state.user._id
      );
      state.friendRequests = action.payload.friendRequests?.filter(
        (fr: IFriendRequest) => fr.from._id !== action.payload._id
      );
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    addFriendRequest: (state, action: PayloadAction<IFriendRequest>) => {
      state.user?.friendRequests.push(action.payload);
    },
    removeFriendRequest: (state, action: PayloadAction<IFriendRequest>) => {
      state.user.friendRequests = state.user?.friendRequests.filter(
        (fr: IFriendRequest) => fr._id !== action.payload._id
      );
      state.friendRequests = state.friendRequests?.filter(
        (fr: IFriendRequest) => fr._id !== action.payload._id
      );
    },
    removeNotifications: (state, action: PayloadAction<string>) => {
      state.user.postNotifications = state.user.postNotifications.filter(
        (n: IPostNotification) => n.post !== action.payload
      );
    },
    addFriend: (state, action: PayloadAction<IUser>) => {
      state.user?.friends.push(action.payload);
    },
    removeFriend: (state, action: PayloadAction<IUser>) => {
      state.user.friends = state.user?.friends.filter(
        (user: IUser) => user._id !== action.payload._id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateNotifications.fulfilled, (state, action) => {
        state.user.messageNotifications = action.payload;
      })
      .addCase(deleteNotifications.fulfilled, (state, action) => {
        state.user.messageNotifications =
          state.user.messageNotifications.filter(
            (n: any) => n.from._id !== action.payload
          );
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.user = null;
        state.friendRequests = [];
        state.onlineUsers = [];
        localStorage.removeItem('user');
      });
  },
});

export const {
  login,
  setOnlineUsers,
  updateUser,
  addFriendRequest,
  removeFriendRequest,
  removeNotifications,
  removeFriend,
  addFriend,
  setRefetch,
} = userSlice.actions;

export default userSlice.reducer;
