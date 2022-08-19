import { Link } from 'react-router-dom';
import { logout } from '../features/user/userSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { AiOutlineSearch } from 'react-icons/ai';
import Logo from '../images/social-logo.png';
import {
  IFriendRequest,
  IMessageNotification,
  IPostNotification,
  IUser,
} from '../interfaces';
import axios from 'axios';
import { onlyUniqueNotifications } from '../config/utils';
import { useEffect, useState, useRef } from 'react';
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
  const [showInfo, setShowInfo] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const dispatch = useAppDispatch();
  const modal = useRef<any>();

  useEffect(() => {
    const closeModal = (e: any) => {
      // console.log(e.target, modal.current?.parentElement);
      if (
        e.target !== modal.current
        // e.target === modal.current?.parentElement
      )
        setShowInfo(false);
    };
    window.addEventListener('click', closeModal);
    return () => window.removeEventListener('click', closeModal);
  }, []);

  useEffect(() => {
    const searchNow = async () => {
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
    };

    searchNow();
  }, [search]);

  return (
    <div className="navbar shadow">
      <div className="h-full flex item-center w-full px-4 md:px-0 md:w-[70%] m-auto">
        <Link
          to="/"
          className="font-bold text-xl flex items-center gradient-text"
        >
          <img src={Logo} alt="Social" className="w-10 h-8 object-cover" />
          Social
        </Link>
        <div className="hidden ml-4 md:ml-16 my-2  sm:flex items-center gap-2 bg-[#edeef0] p-[5px] px-[8px] w-[200px] rounded-md text-xl relative">
          <AiOutlineSearch className="text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="bg-transparent w-full h-full outline-none text-sm"
          />
          {users.length > 0 && (
            <div className="navbar__users w-full left-0 top-[50px] text-sm">
              {users.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user._id}`}
                  className="navbar__user"
                >
                  <div className="w-8 h-8 rounded-full object-cover overflow-hidden">
                    <img
                      src={
                        user.profilePicture
                          ? user.profilePicture
                          : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
                      }
                      alt="user"
                    />
                  </div>
                  <div className="flex flex-col justify-start">
                    <h4 className="font-semibold text-sm text-[#2a5885]">
                      {user.username}
                    </h4>
                    <h5 className="text-[#626d7a] text-xs">
                      {user.from === 'From ...' ? '' : user.from}
                    </h5>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex gap-3 items-center text-gray-500">
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
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {friendRequests?.length > 0 ? (
              <div className="navbar__friend-requests">
                <div className="navbar__friend-requests-header">
                  Pending requests ({friendRequests?.length})
                </div>
                {friendRequests?.map((fr: IFriendRequest) => (
                  <FriendRequest socket={socket} key={fr._id} fr={fr} />
                ))}
              </div>
            ) : (
              <div className="tooltip--messages">Friends</div>
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
                <div className="tooltip--messages">Messages</div>
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

        <div
          className="flex px-2 h-full items-center gap-2 ml-4 md:ml-8 relative  hover:bg-gray-100 cursor-pointer profile-section"
          onClick={(e) => {
            setShowInfo(!showInfo);
            e.stopPropagation();
          }}
        >
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={
              user?.profilePicture
                ? user?.profilePicture
                : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
            }
            alt="profile"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4  transition duration-300 text-gray-600 ${
              showInfo && 'rotate-180'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          {showInfo && (
            <div
              ref={modal}
              className="info flex flex-col w-[250%]  bg-white border border-gray-200 shadow rounded absolute top-[60px] right-[20%] md:right-[-50%] text-sm text-gray-500 font-semibold"
            >
              <Link
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-1"
                to={`/profile/${user?._id}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-[#5181b8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Profile
              </Link>
              <Link
                className="p-2 hover:bg-gray-100 cursor-pointer flex gap-1 items-center"
                to="/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-[#5181b8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                News
              </Link>
              <span
                className="p-2 hover:bg-gray-100 cursor-pointer flex gap-1  hover:underline items-center"
                onClick={() => dispatch(logout())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-[#5181b8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
