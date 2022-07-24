import { Search, Person, Chat, Notifications } from '@material-ui/icons';
import ProfileImage from '../assets/person/1.jpeg';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar__left">
        <span className="navbar__logo">Social</span>
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
          <span className="navbar__link">Home</span>
          <span className="navbar__link">Timeline</span>
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
          <img src={ProfileImage} alt="profile" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
