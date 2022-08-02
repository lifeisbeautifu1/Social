import { NavLink, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice';
import { useAppSelector } from '../hooks';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsFillPersonFill, BsFillChatLeftTextFill } from 'react-icons/bs';
import { IoIosNotifications } from 'react-icons/io';

const Navbar = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useDispatch();
  return (
    <div className="navbar">
      <div className="navbar__left">
        <Link to="/">
          <span className="navbar__logo">Social</span>
        </Link>
      </div>
      <div className="navbar__center">
        <div className="navbar__searchBar">
          <AiOutlineSearch className="navbar__searchIcon" />
          <input
            type="text"
            placeholder="Search for friends, post or video"
            className="navbar__searchInput"
          />
        </div>
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
          <div className="navbar__icon">
            <BsFillPersonFill />
            <span className="navbar__badge">1</span>
          </div>
          <Link to="/messanger">
            <div className="navbar__icon">
              <BsFillChatLeftTextFill />
              <span className="navbar__badge">1</span>
            </div>
          </Link>
          <div className="navbar__icon">
            <IoIosNotifications />
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
