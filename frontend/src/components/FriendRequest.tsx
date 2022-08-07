import '../friendRequest.css';
import { IFriendRequest } from '../interfaces';
import { formatDistanceToNow } from 'date-fns';
import { BsCheck2Circle } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import axios from 'axios';
import { addFriend, removeFriendRequest } from '../features/user/userSlice';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../interfaces';

interface FriendRequestProps {
  fr: IFriendRequest;
  socket?: React.MutableRefObject<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>;
}

const FriendRequest: React.FC<FriendRequestProps> = ({ fr, socket }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const closeFriendRequest = async (status: string) => {
    try {
      if (status === 'Accept') {
        const { data } = await axios.patch(
          `/friendRequests/${fr._id}`,
          {
            status,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        dispatch(addFriend(data));
        dispatch(removeFriendRequest(fr));
      } else {
        await axios.patch(
          `/friendRequests/${fr._id}`,
          {
            status,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        dispatch(removeFriendRequest(fr));
      }
      socket?.current?.emit('sendRequest', fr.from._id);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="friend-request">
      <img
        className="friend-request__image"
        src={
          fr.from.profilePicture
            ? fr.from.profilePicture
            : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
        }
        alt={fr.from.username}
      />
      <div className="friend-request__info">
        <p>{fr.from.username}</p>
        <p>
          {formatDistanceToNow(new Date(fr.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
      <div className="friend-request__actions">
        <BsCheck2Circle
          onClick={() => closeFriendRequest('Accept')}
          className="friend-request__button"
        />
        <MdOutlineCancel
          onClick={() => closeFriendRequest('Decline')}
          className="friend-request__button"
        />
      </div>
    </div>
  );
};

export default FriendRequest;
