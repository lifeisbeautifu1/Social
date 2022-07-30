import { MdRssFeed, MdOutlineWorkOutline, MdSchool } from 'react-icons/md';
import {
  BsFillChatLeftTextFill,
  BsFillBookmarkFill,
  BsCalendarEvent,
} from 'react-icons/bs';
import { AiFillPlayCircle } from 'react-icons/ai';
import { HiUserGroup } from 'react-icons/hi';
import { FiHelpCircle } from 'react-icons/fi';
import { useAppSelector } from '../hooks';

import { Friend } from './';

const Sidebar = () => {
  const { user } = useAppSelector((state) => state.user);
  return (
    <div className="sidebar">
      <div className="sidebar__wrapper">
        <ul className="sidebar__list">
          <li className="sidebar__item">
            <MdRssFeed className="sidebar__icon" />
            <span className="sidebar__text">Feed</span>
          </li>
          <li className="sidebar__item">
            <BsFillChatLeftTextFill className="sidebar__icon" />
            <span className="sidebar__text">Chat</span>
          </li>
          <li className="sidebar__item">
            <AiFillPlayCircle className="sidebar__icon" />
            <span className="sidebar__text">Videos</span>
          </li>
          <li className="sidebar__item">
            <HiUserGroup className="sidebar__icon" />
            <span className="sidebar__text">Groups</span>
          </li>
          <li className="sidebar__item">
            <BsFillBookmarkFill className="sidebar__icon" />
            <span className="sidebar__text">Bookmarks</span>
          </li>
          <li className="sidebar__item">
            <FiHelpCircle className="sidebar__icon" />
            <span className="sidebar__text">Questions</span>
          </li>
          <li className="sidebar__item">
            <MdOutlineWorkOutline className="sidebar__icon" />
            <span className="sidebar__text">Jobs</span>
          </li>
          <li className="sidebar__item">
            <BsCalendarEvent className="sidebar__icon" />
            <span className="sidebar__text">Events</span>
          </li>
          <li className="sidebar__item">
            <MdSchool className="sidebar__icon" />
            <span className="sidebar__text">Courses</span>
          </li>
        </ul>
        <button className="sidebar__button">Show More</button>
        <hr className="sidebar__hr" />
        <ul className="sidebar__list--friend">
          {/* @ts-ignore */}
          {user.following.map((u) => (
            <Friend key={u?._id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
