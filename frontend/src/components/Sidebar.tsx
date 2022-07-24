import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from '@material-ui/icons';
import { Users } from '../data';
import { Friend } from './';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__wrapper">
        <ul className="sidebar__list">
          <li className="sidebar__item">
            <RssFeed className="sidebar__icon" />
            <span className="sidebar__text">Feed</span>
          </li>
          <li className="sidebar__item">
            <Chat className="sidebar__icon" />
            <span className="sidebar__text">Chat</span>
          </li>
          <li className="sidebar__item">
            <PlayCircleFilledOutlined className="sidebar__icon" />
            <span className="sidebar__text">Videos</span>
          </li>
          <li className="sidebar__item">
            <Group className="sidebar__icon" />
            <span className="sidebar__text">Groups</span>
          </li>
          <li className="sidebar__item">
            <Bookmark className="sidebar__icon" />
            <span className="sidebar__text">Bookmarks</span>
          </li>
          <li className="sidebar__item">
            <HelpOutline className="sidebar__icon" />
            <span className="sidebar__text">Questions</span>
          </li>
          <li className="sidebar__item">
            <WorkOutline className="sidebar__icon" />
            <span className="sidebar__text">Jobs</span>
          </li>
          <li className="sidebar__item">
            <Event className="sidebar__icon" />
            <span className="sidebar__text">Events</span>
          </li>
          <li className="sidebar__item">
            <School className="sidebar__icon" />
            <span className="sidebar__text">Courses</span>
          </li>
        </ul>
        <button className="sidebar__button">Show More</button>
        <hr className="sidebar__hr" />
        <ul className="sidebar__list--friend">
          {Users.map((u) => (
            <Friend key={u?.id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
