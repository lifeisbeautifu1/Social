import { Sidebar, Feed, Rightbar } from '../components';
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
    <div className="bg-gray-100">
      <div className="flex w-full md:w-[70%] mx-auto">
        <Sidebar />
        <Feed scrollable socket={socket} />
        {/* <Rightbar socket={socket} /> */}
      </div>
    </div>
  );
};

export default Home;
