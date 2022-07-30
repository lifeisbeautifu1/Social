import GiftImage from '../assets/gift.png';
import AdImage from '../assets/ad.png';
import { Users } from '../data';
import { Online, RightbarFriend } from './';
import { IUser } from '../interfaces';
import { useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import { follow, unfollow } from '../features/user/userSlice';
import { Add, Remove } from '@material-ui/icons';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

type RightbarProps = {
  user?: IUser;
};

const Rightbar: React.FC<RightbarProps> = ({ user }) => {
  const [friends, setFriends] = useState<IUser[]>([]);
  const { user: currentUser } = useAppSelector((state) => state.user);

  const dispatch = useDispatch();

  const [isFollowing, setIsFollowing] = useState(
    currentUser.following.includes(user?._id)
  );

  const handleClick = async () => {
    try {
      await axios.patch(
        '/users/' + user?._id + (isFollowing ? '/unfollow' : '/follow'),
        {
          userId: currentUser._id,
        }
      );
      isFollowing ? dispatch(unfollow(user?._id)) : dispatch(follow(user?._id));
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (user?._id) {
          const { data } = await axios.get('/users/friends/' + user?._id);
          setFriends(data);
          setIsFollowing(currentUser.following.includes(user._id));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriends();
  }, [user?._id, currentUser.following]);
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
        {currentUser._id !== user?._id && (
          <button className="rightbar__button--follow" onClick={handleClick}>
            {isFollowing ? (
              <>
                Unfollow <Remove />
              </>
            ) : (
              <>
                Follow <Add />
              </>
            )}
          </button>
        )}
        <h4 className="rightbar__title">User information</h4>
        <div className="rightbar__info">
          <div className="rightbar__item">
            <span className="rightbar__key">City: </span>
            <span className="rightbar__value">{user?.city}</span>
          </div>
          <div className="rightbar__item">
            <span className="rightbar__key">From: </span>
            <span className="rightbar__value">{user?.from}</span>
          </div>
          <div className="rightbar__item">
            <span className="rightbar__key">Relationship: </span>
            <span className="rightbar__value">
              {user?.relationship === 1
                ? 'Single'
                : user?.relationship === 2
                ? 'Married'
                : 'Married with children'}
            </span>
          </div>
        </div>
        <h4 className="rightbar__title">User friends</h4>
        <div className="rightbar__followings">
          {friends.map((friend) => (
            <RightbarFriend key={friend._id} friend={friend} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbar__wrapper">
        {user ? RightbarProfile() : RightbarHome()}
      </div>
    </div>
  );
};

export default Rightbar;
