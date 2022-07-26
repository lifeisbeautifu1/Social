import React from 'react';
import { IUser } from '../interfaces';
import { Link } from 'react-router-dom';

type RightbarFriendProps = {
  friend: IUser;
};

const RightbarFriend: React.FC<RightbarFriendProps> = ({ friend }) => {
  return (
    <Link style={{ color: '#000' }} to={`/profile/${friend._id}`}>
      <div className="rightbar__following">
        <img
          src={
            friend.profilePicture
              ? `http://localhost:5000/images/${friend?.profilePicture}`
              : 'http://localhost:5000/images/person/noAvatar.png'
          }
          alt="following user"
          className="rightbar__image--following"
        />
        <span className="rightbar__name--following">{friend?.username}</span>
      </div>
    </Link>
  );
};

export default RightbarFriend;
