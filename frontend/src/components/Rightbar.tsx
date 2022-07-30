import GiftImage from '../assets/gift.png';
import AdImage from '../assets/ad.png';
import { Online, RightbarFriend } from './';
import { IUser } from '../interfaces';
import { useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import { follow, unfollow } from '../features/user/userSlice';
import { IoMdAdd, IoIosRemove } from 'react-icons/io';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../interfaces';

type RightbarProps = {
  user?: IUser;
  socket?: React.MutableRefObject<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>;
};

const Rightbar: React.FC<RightbarProps> = ({ user, socket }) => {
  const [friends, setFriends] = useState<IUser[]>([]);
  const { user: currentUser, onlineUsers } = useAppSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();

  const [isFollowing, setIsFollowing] = useState(
    currentUser.following.includes(user?._id)
  );

  const [onlineFriends, setOnlineFriends] = useState<IUser[]>([]);

  useEffect(() => {
    // @ts-ignore
    const onlineUsersId = onlineUsers.map((onlineUser) => onlineUser.userId);

    setOnlineFriends(
      // @ts-ignore
      currentUser?.following.filter((friend) =>
        onlineUsersId.includes(friend._id)
      )
    );
  }, [onlineUsers, currentUser.following]);

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
          const followingId = currentUser.following.map(
            // @ts-ignore
            (following) => following._id
          );
          setIsFollowing(followingId.includes(user._id));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriends();
  }, [user?._id, currentUser?.following]);
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
          {onlineFriends.map((u) => (
            <Online key={u?._id} user={u} />
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
                Unfollow <IoIosRemove />
              </>
            ) : (
              <>
                Follow <IoMdAdd />
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
