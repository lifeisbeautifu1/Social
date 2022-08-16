import { NavLink, Link } from 'react-router-dom';
import { logout } from '../features/user/userSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsFillPersonFill, BsFillChatLeftTextFill } from 'react-icons/bs';
import { IoIosNotifications } from 'react-icons/io';
import {
  IFriendRequest,
  IMessageNotification,
  IPostNotification,
  IUser,
} from '../interfaces';
import axios from 'axios';
import { onlyUniqueNotifications } from '../config/utils';
import { useState } from 'react';
import { FriendRequest, MessageNotification, PostNotification } from './';
import { Socket } from 'socket.io-client';

import { ServerToClientEvents, ClientToServerEvents } from '../interfaces';

type NavbarProps = {
  socket?: React.MutableRefObject<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>;
};

const Navbar: React.FC<NavbarProps> = ({ socket }) => {
  const { user, friendRequests } = useAppSelector((state) => state.user);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<IUser[]>([]);
  const dispatch = useAppDispatch();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search) {
      try {
        const { data } = await axios.get(`/users/find?search=${search}`);
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      setUsers([]);
    }
    setSearch('');
  };

  return (
    <div className="navbar shadow flex items-center">
      <div className="flex item-center gap-16 w-[70%] m-auto">
        <Link to="/" className="font-bold text-xl flex items-center">
          Social
        </Link>

        <form
          className="flex items-center gap-2 bg-[#edeef0] p-[5px] px-[8px] w-[200px] rounded-md text-xl"
          onSubmit={handleSubmit}
        >
          <AiOutlineSearch className="text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="bg-transparent w-full h-full outline-none text-sm"
          />
        </form>
        {users.length > 0 && (
          <div className="navbar__users">
            {users.map((user) => (
              <Link
                key={user._id}
                to={`/profile/${user._id}`}
                onClick={() => setUsers([])}
                className="navbar__user"
              >
                <div className="navbar__user-picture">
                  <img
                    src={
                      user.profilePicture
                        ? user.profilePicture
                        : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
                    }
                    alt="user"
                  />
                </div>
                <div className="navbar__user-info">
                  <h4>{user.username}</h4>
                  <h5>From: {user.from ? user.from : 'Not specified'}</h5>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="ml-auto flex items-center text-gray-700">
          <div className="navbar__icon navbar__icon--friends">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {friendRequests?.length > 0 && (
              <div className="navbar__friend-requests">
                <div className="navbar__friend-requests-header">
                  Pending requests ({friendRequests?.length})
                </div>
                {friendRequests?.map((fr: IFriendRequest) => (
                  <FriendRequest socket={socket} key={fr._id} fr={fr} />
                ))}
              </div>
            )}
            {friendRequests?.length > 0 && (
              <span className="navbar__badge">{friendRequests?.length}</span>
            )}
          </div>
          <Link to="/messanger">
            <div className="navbar__icon navbar__icon--messages center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {user?.messageNotifications?.length > 0 ? (
                <div className="navbar__message-notifications">
                  {user?.messageNotifications
                    .filter(onlyUniqueNotifications)
                    .map((n: IMessageNotification) => (
                      <MessageNotification key={n._id} notification={n} />
                    ))}
                </div>
              ) : (
                <div className="tooltip--messages tooltip--wide">
                  No New Messages
                </div>
              )}

              {user?.messageNotifications?.length > 0 && (
                <span className="navbar__badge">
                  {
                    user?.messageNotifications?.filter(onlyUniqueNotifications)
                      .length
                  }
                </span>
              )}
            </div>
          </Link>
          <div className="navbar__icon navbar__icon--notifications">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {user?.postNotifications?.length > 0 ? (
              <div className="navbar__message-notifications">
                {user?.postNotifications.map((n: IPostNotification) => (
                  <PostNotification key={n._id} notification={n} />
                ))}
              </div>
            ) : (
              <span className="tooltip--messages">Notifications</span>
            )}
            {user?.postNotifications?.length > 0 && (
              <span className="navbar__badge">
                {user?.postNotifications?.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

 /* <div className="navbar__profile hidden">
            <Link to={'/profile/' + user?._id}>
              <img
                src={
                  user?.profilePicture
                    ? user?.profilePicture
                    : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
                }
                alt="profile"
              />
            </Link>
          </div> */
