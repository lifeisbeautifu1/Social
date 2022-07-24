import React from 'react';
import { IUser } from '../interfaces';

type FriendProps = {
  user: IUser;
};

const Friend: React.FC<FriendProps> = ({ user }) => {
  return (
    <li className="sidebar__item--friend">
      <img
        className="sidebar__image--friend"
        src={user?.profilePicture}
        alt="friend"
      />
      <span className="sidebar__name--friend">{user?.username}</span>
    </li>
  );
};

export default Friend;
