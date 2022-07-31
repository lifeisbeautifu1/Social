import React from 'react';
import { IUser } from '../interfaces';

type OnlineProps = {
  user: IUser;
};

const Online: React.FC<OnlineProps> = ({ user }) => {
  return (
    <li className="rightbar__item--friend">
      <div className="rightbar__imageContainer">
        <img
          src={
            user.profilePicture
              ? user.profilePicture
              : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
          }
          alt="friend"
          className="rightbar__image--friend"
        />
        <span className="rightbar__online"></span>
      </div>
      <span className="rightbar__name--friend">{user?.username}</span>
    </li>
  );
};

export default Online;
