import GiftImage from '../assets/gift.png';
import AdImage from '../assets/ad.png';
import { Online } from './';
import { Users } from '../data';
import React from 'react';

type RightbarProps = {
  profile?: boolean;
};

const Rightbar: React.FC<RightbarProps> = ({ profile }) => {
  const RightbarHome = () => {
    return (
      <>
        <div className="rightbar__birthday">
          <img
            src={GiftImage}
            alt="birthday"
            className="rightbar__image--birthday"
          />
          <span className="rightbar__text--birthday">
            <b>Pola Foster</b> and <b>3 others</b> have a birthday today.
          </span>
        </div>
        <img src={AdImage} alt="ad" className="rightbar__ad" />
        <h4 className="rightbar__title">Online Friends</h4>
        <ul className="rightbar__list--friends">
          {Users.map((u) => (
            <Online key={u?.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const RightbarProfile = () => {
    return (
      <>
        <h4 className="rightbar__title">User information</h4>
        <div className="rightbar__info">
          <div className="rightbar__item">
            <span className="rightbar__key">City: </span>
            <span className="rightbar__value">New York</span>
          </div>
          <div className="rightbar__item">
            <span className="rightbar__key">From: </span>
            <span className="rightbar__value">Madrid</span>
          </div>
          <div className="rightbar__item">
            <span className="rightbar__key">Relationship: </span>
            <span className="rightbar__value">Single</span>
          </div>
        </div>
        <h4 className="rightbar__title">User friends</h4>
        <div className="rightbar__followings">
          <div className="rightbar__following">
            <img
              src="./assets/person/1.jpeg"
              alt="following user"
              className="rightbar__image--following"
            />
            <span className="rightbar__name--following">John Carter</span>
          </div>
          <div className="rightbar__following">
            <img
              src="./assets/person/2.jpeg"
              alt="following user"
              className="rightbar__image--following"
            />
            <span className="rightbar__name--following">John Carter</span>
          </div>
          <div className="rightbar__following">
            <img
              src="./assets/person/3.jpeg"
              alt="following user"
              className="rightbar__image--following"
            />
            <span className="rightbar__name--following">John Carter</span>
          </div>
          <div className="rightbar__following">
            <img
              src="./assets/person/4.jpeg"
              alt="following user"
              className="rightbar__image--following"
            />
            <span className="rightbar__name--following">John Carter</span>
          </div>
          <div className="rightbar__following">
            <img
              src="./assets/person/5.jpeg"
              alt="following user"
              className="rightbar__image--following"
            />
            <span className="rightbar__name--following">John Carter</span>
          </div>
          <div className="rightbar__following">
            <img
              src="./assets/person/6.jpeg"
              alt="following user"
              className="rightbar__image--following"
            />
            <span className="rightbar__name--following">John Carter</span>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbar__wrapper">
        {profile ? RightbarProfile() : RightbarHome()}
      </div>
    </div>
  );
};

export default Rightbar;
