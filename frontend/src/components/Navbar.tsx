import { NavLink, Link } from 'react-router-dom';
import { logout } from '../features/user/userSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsFillPersonFill, BsFillChatLeftTextFill } from 'react-icons/bs';
import { IoIosNotifications } from 'react-icons/io';
import { IUser } from '../interfaces';
import axios from 'axios';
import { useState } from 'react';

const Navbar = () => {
  const { user } = useAppSelector((state) => state.user);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<IUser[]>([]);
  const dispatch = useAppDispatch();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search) {
      try {
        const { data } = await axios.get(`/users/find?search=${search}`, {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        });
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
    <div className="navbar">
      <div className="navbar__left">
        <Link to="/">
          <span className="navbar__logo">Social</span>
        </Link>
      </div>
      <div className="navbar__center">
        <form className="navbar__searchBar" onSubmit={handleSubmit}>
          <AiOutlineSearch className="navbar__searchIcon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for friends, post or video"
            className="navbar__searchInput"
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
      </div>
      <div className="navbar__right">
        <div className="navbar__links">
          <NavLink to={`/profile/${user?._id}`} className="navbar__link">
            Home
          </NavLink>
          <NavLink to="/" className="navbar__link">
            Feed
          </NavLink>
          {
            <span className="navbar__link" onClick={() => dispatch(logout())}>
              Logout
            </span>
          }
        </div>
        <div className="navbar__icons">
          <div className="navbar__icon navbar__icon--friends">
            <BsFillPersonFill />
            <span className="tooltip--messages">Friends</span>
            <span className="navbar__badge">1</span>
          </div>
          <Link to="/messanger">
            <div className="navbar__icon navbar__icon--messages">
              <BsFillChatLeftTextFill />
              <span className="tooltip--messages">Messages</span>
              <span className="navbar__badge">1</span>
            </div>
          </Link>
          <div className="navbar__icon navbar__icon--notifications">
            <IoIosNotifications />
            <span className="tooltip--messages">Notifications</span>
            <span className="navbar__badge">1</span>
          </div>
        </div>
        <div className="navbar__profile">
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
        </div>
      </div>
    </div>
  );
};

export default Navbar;
