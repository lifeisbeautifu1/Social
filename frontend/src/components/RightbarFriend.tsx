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
              ? friend?.profilePicture
              : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1663824680/dquestion_app_widget_1_b_axtw5v.png'
          }
          alt="following user"
          className="w-16 h-16 rounded"
        />
        <span className="rightbar__name--following">{friend?.username}</span>
      </div>
    </Link>
  );
};

export default RightbarFriend;
