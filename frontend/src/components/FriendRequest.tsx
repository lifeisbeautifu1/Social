import '../friendRequest.css';
import { IFriendRequest } from '../interfaces';
import { formatDistanceToNow } from 'date-fns';
// import { BsCheck2Circle } from 'react-icons/bs';
// import { MdOutlineCancel } from 'react-icons/md';
import { useAppDispatch } from '../app/hooks';
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
  const closeFriendRequest = async (status: string) => {
    try {
      if (status === 'Accept') {
        const { data } = await axios.patch(`/friendRequests/${fr._id}`, {
          status,
        });
        dispatch(addFriend(data));
        dispatch(removeFriendRequest(fr));
      } else {
        await axios.patch(`/friendRequests/${fr._id}`, {
          status,
        });
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
            : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1663824680/dquestion_app_widget_1_b_axtw5v.png'
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => closeFriendRequest('Accept')}
          className="h-8 w-8 friend-request__button"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => closeFriendRequest('Accept')}
          className="h-8 w-8 friend-request__button"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => closeFriendRequest('Decline')}
          className="h-8 w-8 friend-request__button"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => closeFriendRequest('Decline')}
          className="h-8 w-8 friend-request__button"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg> */}
        {/* <BsCheck2Circle
          onClick={() => closeFriendRequest('Accept')}
          className="friend-request__button"
        /> */}
        {/* <MdOutlineCancel
          onClick={() => closeFriendRequest('Decline')}
          className="friend-request__button"
        /> */}
      </div>
    </div>
  );
};

export default FriendRequest;
