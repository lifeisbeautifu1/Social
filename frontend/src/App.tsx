import { Home, Profile, Login, Messanger, SinglePost } from './pages';
import { ProtectedRoute, SharedLayout } from './components';
import { Routes, Route } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useRef, useEffect } from 'react';
import {
  login,
  setRefetch,
  updateNotifications,
} from './features/user/userSlice';
import { useDispatch } from 'react-redux';
import { setOnlineUsers } from './features/user/userSlice';
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

const App = () => {
  const dispatch = useDispatch();
  const socket = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const { user, refetch } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      socket.current = io('http://localhost:8900');
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
      socket?.current?.disconnect();
    }
  }, [user, dispatch]);

  useEffect(() => {
    const updateUser = async () => {
      try {
        const { data } = await axios.get('/users/me');
        dispatch(login({ ...data }));
      } catch (error) {
        console.log(error);
      }
    };
    updateUser();
  }, [refetch, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<SharedLayout socket={socket} />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Home socket={socket} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <SinglePost socket={socket} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <ProfileInfoContextProvider>
                <Profile socket={socket} />
              </ProfileInfoContextProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messanger"
          element={
            <ProtectedRoute>
              <Messanger socket={socket} />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />
    </Routes>
  );
};

export default App;
