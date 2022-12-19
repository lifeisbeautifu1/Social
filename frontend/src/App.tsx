import {
  Home,
  Profile,
  Login,
  Messanger,
  SinglePost,
  Verify,
  Confirm,
  NotFound,
  ResetPassword,
  UpdatePassword,
} from './pages';
import { ProtectedRoute, SharedLayout } from './components';
import { Routes, Route } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useRef, useEffect } from 'react';
import {
  login,
  setRefetch,
  updateNotifications,
} from './features/user/userSlice';
import { useAppDispatch } from './app/hooks';
import { setOnlineUsers, logout } from './features/user/userSlice';
import {
  setRefetchMessages,
  setIsTyping,
} from './features/conversations/conversationsSlice';
import { useAppSelector } from './hooks';
import { ServerToClientEvents, ClientToServerEvents } from './interfaces';
import { ProfileInfoContextProvider } from './context';
// import useSound from 'use-sound';
// @ts-ignore
import sound from './sounds/notification.mp3';
import axios from 'axios';

axios.defaults.baseURL = 'https://social-backend-production.up.railway.app/api';
axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useAppDispatch();
  const socket = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const { user, refetch } = useAppSelector((state) => state.user);

  useEffect(() => {
    const updateUser = async () => {
      try {
        const { data } = await axios.get('/users/me');
        dispatch(login({ ...data }));
      } catch (error) {
        dispatch(logout());
        console.log(error);
      }
    };
    updateUser();
  }, [refetch, dispatch]);

  useEffect(() => {
    if (user) {
      socket.current = io('https://social-backend-production.up.railway.app');
      socket?.current?.emit('addUser', user?._id);
      socket?.current?.on('getUsers', (users) => {
        dispatch(setOnlineUsers(users));
      });
      socket?.current?.on('getMessage', () => {
        // console.log('i got new message');
        // @ts-ignore
        dispatch(updateNotifications());
        dispatch(setRefetchMessages());
        const audio = new Audio(sound);

        audio.play();
      });
      socket?.current?.on('getRequest', () => {
        const audio = new Audio(sound);
        dispatch(setRefetch());
        audio.play();
      });
      socket?.current?.on('typing', () => dispatch(setIsTyping(true)));
      socket?.current?.on('stopTyping', () => dispatch(setIsTyping(false)));
    } else {
      // socket?.current?.disconnect();
    }
  }, [user, dispatch]);

  return (
    <Routes>
      <Route path='/' element={<SharedLayout socket={socket} />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Home socket={socket} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/post/:id'
          element={
            <ProtectedRoute>
              <SinglePost socket={socket} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/:userId'
          element={
            <ProtectedRoute>
              <ProfileInfoContextProvider>
                <Profile socket={socket} />
              </ProfileInfoContextProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path='/messanger'
          element={
            <ProtectedRoute>
              <Messanger socket={socket} />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Login />} />
      <Route path='/verify' element={<Verify />} />
      <Route path='/email/confirm/:token' element={<Confirm />} />
      <Route path='/password/reset' element={<ResetPassword />} />
      <Route path='/password/reset/:token' element={<UpdatePassword />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default App;
