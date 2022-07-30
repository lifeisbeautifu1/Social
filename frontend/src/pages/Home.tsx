import { Sidebar, Feed, Rightbar, Navbar } from '../components';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../interfaces';

type HomeProps = {
  socket: React.MutableRefObject<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>;
};

const Home: React.FC<HomeProps> = ({ socket }) => {
  return (
    <>
      <Navbar />
      <div className="home">
        <Sidebar />
        <Feed />
        <Rightbar socket={socket} />
      </div>
    </>
  );
};

export default Home;
