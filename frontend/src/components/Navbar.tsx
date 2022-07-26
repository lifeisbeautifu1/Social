import { Search, Person, Chat, Notifications } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks';

const Navbar = () => {
  const { user } = useAppSelector((state) => state.user);
  return (
    <div className="navbar">
      <div className="navbar__left">
        <Link to="/">
          <span className="navbar__logo">Social</span>
        </Link>
      </div>
      <div className="navbar__center">
        <div className="navbar__searchBar">
          <Search className="navbar__searchIcon" />
          <input
            type="text"
            placeholder="Search for friends, post or video"
            className="navbar__searchInput"
          />
        </div>
      </div>
      <div className="navbar__right">
        <div className="navbar__links">
          <Link to={`/profile/${user?._id}`}>
            <span className="navbar__link">Home</span>
          </Link>
          <Link to="/">
            <span className="navbar__link">Timeline</span>
          </Link>
        </div>
        <div className="navbar__icons">
          <div className="navbar__icon">
            <Person />
            <span className="navbar__badge">1</span>
          </div>
          <div className="navbar__icon">
            <Chat />
            <span className="navbar__badge">1</span>
          </div>
          <div className="navbar__icon">
            <Notifications />
            <span className="navbar__badge">1</span>
          </div>
        </div>
        <div className="navbar__profile">
          <Link to={'/profile/' + user?._id}>
            <img
              src={
                user?.profilePicture
                  ? `http://localhost:5000/images/${user?.profilePicture}`
                  : 'http://localhost:5000/images/person/noAvatar.png'
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
