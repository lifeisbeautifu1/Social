import React from 'react';
import { Link } from 'react-router-dom';
import { IUser } from '../interfaces';

type OnlineProps = {
  user: IUser;
};

const Online: React.FC<OnlineProps> = ({ user }) => {
  return (
    <Link
      to={`/profile/${user._id}`}
      className="rightbar__item--friend  hover:bg-gray-200 py-1 rounded"
    >
      <div className="pl-2 rightbar__imageContainer ">
        <img
          src={
            user.profilePicture
              ? user.profilePicture
              : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
          }
          alt="friend"
          className="h-6 w-6 rounded-full object-cover"
        />
        {/* <span className="rightbar__online"></span> */}
      </div>
      <span className="text-sm">{user?.username}</span>
    </Link>
  );
};

export default Online;
