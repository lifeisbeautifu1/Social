import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { onlyUniqueNotifications } from '../config/utils';
import { IoPeopleOutline } from 'react-icons/io5';
import { useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import { setOnlineFriends } from '../features/user/userSlice';
// import { IUser } from '../interfaces';
import { Online } from './';
// import { FaUsers } from 'react-icons/fa';

const Sidebar = () => {
  const { user, onlineUsers, onlineFriends } = useAppSelector(
    (state) => state.user
  );
  const dispatch = useAppDispatch();
  // const [onlineFriends, setOnlineFriends] = useState<IUser[]>([]);

  useEffect(() => {
    // @ts-ignore
    const onlineUsersId = onlineUsers?.map((onlineUser) => onlineUser.userId);

    dispatch(
      setOnlineFriends(
        // @ts-ignore
        user?.friends.filter((friend) => onlineUsersId.includes(friend._id))
      )
    );
  }, [onlineUsers, user?.friends, dispatch]);
  // console.log(onlineFriends);
  return (
    <div className="sidebar w-[200px]">
      <div className="py-5 px-1">
        <ul className="flex flex-col gap-1">
          <Link to={`/profile/${user._id}`}>
            <li className="flex items-center gap-2 px-2 py-2 rounded transition duration-200 hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#5181b8]"
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

              <span className="text-sm">My Profile</span>
            </li>
          </Link>
          <Link to="/">
            <li className="flex items-center gap-2 px-2 py-2 rounded transition duration-200 hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#5181b8]"
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
              <span className="text-sm">News</span>
            </li>
          </Link>
          <Link to="/messanger">
            <li className="flex items-center gap-2 px-2 py-2 rounded transition duration-200 hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#5181b8]"
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
              <span className="text-sm">Messanger</span>
              {user?.messageNotifications?.length > 0 && (
                <span className="ml-auto text-xs rounded-full">
                  {
                    user?.messageNotifications?.filter(onlyUniqueNotifications)
                      .length
                  }
                </span>
              )}
            </li>
          </Link>

          <Link to="/">
            <li className="flex items-center gap-2 px-2 py-2 rounded transition duration-200 hover:bg-gray-200">
              <IoPeopleOutline className="h-5 w-5 text-[#5181b8]" />
              <span className="text-sm">Friends</span>
            </li>
          </Link>
          <Link to="/">
            <li className="flex items-center gap-2 px-2 py-2 rounded transition duration-200 hover:bg-gray-200">
              <svg
                fill="none"
                className="h-5 w-5 text-[#5181b8]"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M10 7.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zM7.25 6.5a2.75 2.75 0 1 1 5.5 0 2.75 2.75 0 0 1-5.5 0zm-.5 7.25c0-.42.23-.83.8-1.17A4.81 4.81 0 0 1 10 12c1.03 0 1.88.23 2.45.58.57.34.8.75.8 1.17 0 .3-.1.44-.22.54-.14.11-.4.21-.78.21h-4.5c-.39 0-.64-.1-.78-.21-.12-.1-.22-.25-.22-.54zM10 10.5c-1.22 0-2.37.27-3.23.8-.88.53-1.52 1.37-1.52 2.45 0 .7.28 1.3.78 1.71.48.39 1.1.54 1.72.54h4.5c.61 0 1.24-.15 1.72-.54.5-.4.78-1 .78-1.71 0-1.08-.64-1.92-1.52-2.45-.86-.53-2-.8-3.23-.8zm4-5.59c.06-.4.44-.7.85-.64a2.5 2.5 0 0 1-.35 4.98.75.75 0 0 1 0-1.5 1 1 0 0 0 .14-1.99.75.75 0 0 1-.63-.85zM15.76 10a.75.75 0 0 0 0 1.5c1.16 0 1.75.67 1.75 1.25 0 .22-.07.41-.19.55-.1.12-.24.2-.46.2a.75.75 0 0 0 0 1.5c1.43 0 2.15-1.21 2.15-2.25 0-1.71-1.6-2.75-3.25-2.75zM5 10.75a.75.75 0 0 0-.75-.75C2.61 10 1 11.04 1 12.75 1 13.79 1.72 15 3.15 15a.75.75 0 0 0 0-1.5.57.57 0 0 1-.47-.2.86.86 0 0 1-.18-.55c0-.58.6-1.25 1.75-1.25.41 0 .75-.34.75-.75zm.14-6.47a.75.75 0 0 1 .22 1.48 1 1 0 0 0 .14 1.99.75.75 0 1 1 0 1.5 2.5 2.5 0 0 1-.36-4.97z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
              <span className="text-sm">Communities</span>
            </li>
          </Link>
          <hr className="my-2" />
          <Link to="/">
            <li className="flex items-center gap-2 px-2 py-2 rounded transition duration-200 hover:bg-gray-200">
              <svg
                fill="none"
                className="h-5 w-5 text-[#5181b8]"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M17.2 6.78a2 2 0 0 1 .24.58c.06.23.06.48.06.97v2.97c0 2.52 0 3.78-.49 4.74a4.5 4.5 0 0 1-1.97 1.97c-.96.49-2.22.49-4.74.49h-.6c-2.52 0-3.78 0-4.74-.49a4.5 4.5 0 0 1-1.97-1.97c-.49-.96-.49-2.22-.49-4.74V8.7c0-2.52 0-3.78.49-4.74a4.5 4.5 0 0 1 1.97-1.97c.96-.49 2.22-.49 4.74-.49h.97c.5 0 .74 0 .97.06.2.04.4.13.58.23.2.13.37.3.72.65l3.62 3.62c.35.35.52.52.65.72zM10.3 17h-.6c-1.28 0-2.16 0-2.83-.06-.66-.05-1-.15-1.23-.27a3 3 0 0 1-1.31-1.3 3.24 3.24 0 0 1-.27-1.24C4 13.46 4 12.58 4 11.3V8.7c0-1.28 0-2.16.06-2.83.05-.66.15-1 .27-1.23a3 3 0 0 1 1.3-1.31c.24-.12.58-.22 1.24-.27C7.54 3 8.42 3 9.7 3h.3v1.28c0 .67 0 1.23.04 1.67.03.47.12.88.31 1.28.32.6.81 1.1 1.42 1.42.4.2.81.28 1.28.31.44.04 1 .04 1.67.04H16v2.3c0 1.28 0 2.16-.06 2.83-.05.66-.15 1-.27 1.23a3 3 0 0 1-1.3 1.31c-.24.12-.58.22-1.24.27-.67.06-1.55.06-2.83.06zm5.57-9.5h-1.12c-.71 0-1.2 0-1.58-.03a1.88 1.88 0 0 1-.71-.16c-.33-.17-.6-.44-.77-.77a1.88 1.88 0 0 1-.16-.7 21.6 21.6 0 0 1-.03-1.59V3.13l.01.01.37.36 3.62 3.62.36.37.01.01z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
              <span className="text-sm">Files</span>
            </li>
          </Link>
          <hr className="my-2" />
          <ul className="flex flex-col gap-1">
            <li className="flex items-center gap-2 px-2 py-2 rounded transition duration-200 hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#5181b8]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>

              <span className="text-sm">Online friends</span>
            </li>

            {onlineFriends.map((friend: any) => (
              <Online key={friend._id} user={friend} />
            ))}
          </ul>
        </ul>
      </div>
    </div>
  );
};;;;;;;;;;

export default Sidebar;
