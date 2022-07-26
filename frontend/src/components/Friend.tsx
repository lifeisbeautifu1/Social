import React from 'react';
import { IUser } from '../interfaces';

type FriendProps = {
  user: {
    id: string;
    username: string;
    profilePicture: string;
  };
};

const Friend: React.FC<FriendProps> = ({ user }) => {
  return (
    <li className="sidebar__item--friend">
      <img
        className="sidebar__image--friend"
        src={'http://localhost:3000/' + user?.profilePicture}
        alt="friend"
      />
      <span className="sidebar__name--friend">{user?.username}</span>
    </li>
  );
};

export default Friend;
