import { Home, Profile, Login, Messanger } from './pages';
import { ProtectedRoute } from './components';
import { Routes, Route } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setOnlineUsers, setRefetchMessages } from './features/user/userSlice';
import { useAppSelector } from './hooks';
import { ServerToClientEvents, ClientToServerEvents } from './interfaces';

const App = () => {
  const dispatch = useDispatch();
  const socket = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const { user } = useAppSelector((state) => state.user);
  useEffect(() => {
    if (user) {
      socket.current = io('http://localhost:8900');
      socket?.current?.emit('addUser', user._id);
      socket?.current?.on('getUsers', (users) => {
        dispatch(setOnlineUsers(users));
      });
      socket?.current?.on('getMessage', () => {
        dispatch(setRefetchMessages());
      });
    } else {
      socket?.current?.disconnect();
    }
  }, [user, dispatch]);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home socket={socket} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <Profile />
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />
    </Routes>
  );
};

export default App;
