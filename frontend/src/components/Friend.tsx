import { Link } from 'react-router-dom';
import { IUser } from '../interfaces';

type FriendProps = {
  user: IUser;
};

const Friend: React.FC<FriendProps> = ({ user }) => {
  return (
    <Link to={`/profile/${user._id}`}>
      <li className="sidebar__item--friend">
        <img
          className="sidebar__image--friend"
          src={
            user.profilePicture
              ? user.profilePicture
              : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1663824680/dquestion_app_widget_1_b_axtw5v.png'
          }
          alt="friend"
        />
        <span className="sidebar__name--friend">{user?.username}</span>
      </li>
    </Link>
  );
};

export default Friend;
