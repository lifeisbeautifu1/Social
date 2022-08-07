import { Outlet } from 'react-router-dom';
import { Navbar } from './';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../interfaces';

type SharedLayoutProps = {
  socket?: React.MutableRefObject<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>;
};

const SharedLayout: React.FC<SharedLayoutProps> = ({ socket }) => {
  return (
    <>
      <Navbar socket={socket} />
      <Outlet />
    </>
  );
};

export default SharedLayout;
