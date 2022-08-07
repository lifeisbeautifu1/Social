import { Online, RightbarFriend } from './';
import { IFriendRequest, IUser } from '../interfaces';
import { useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addFriendRequest, removeFriend } from '../features/user/userSlice';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../interfaces';
import { useProfileInfoContext } from '../context';

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
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const createConversation = async () => {
    try {
      await axios.post(
        '/conversations/' + user?._id,
        {},
        {
          headers: {
            authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    navigate('/messanger');
  };

  const [isFriend, setIsFriend] = useState(
    currentUser?.friends?.map((user: IUser) => user._id).includes(user?._id)
  );

  const hide =
    currentUser?.friendRequests
      .map((fr: IFriendRequest) => fr.from._id)
      .includes(user?._id) ||
    currentUser?.friendRequests
      .map((fr: IFriendRequest) => fr.from._id)
      .includes(currentUser?._id);

  const { isEdit, profileData, setProfileData, handleChange } =
    useProfileInfoContext();

  useEffect(() => {
    if (setProfileData) {
      setProfileData({
        ...profileData,
        city: user?.city!,
        from: user?.from!,
        relationship: user?.relationship!,
      });
    }
  }, [user]);

  const [onlineFriends, setOnlineFriends] = useState<IUser[]>([]);

  useEffect(() => {
    // @ts-ignore
    const onlineUsersId = onlineUsers?.map((onlineUser) => onlineUser.userId);

    setOnlineFriends(
      // @ts-ignore
      currentUser?.friends.filter((friend) =>
        onlineUsersId.includes(friend._id)
      )
    );
  }, [onlineUsers, currentUser?.friends]);

  const handleClick = async () => {
    try {
      if (isFriend) {
        await axios.delete(`/users/${user?._id}/friend`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        dispatch(removeFriend(user!));
        setIsFriend(!isFriend);
      } else {
        const { data } = await axios.post(
          '/friendRequests/',
          {
            to: user?._id,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );
        dispatch(addFriendRequest(data));
      }
      socket?.current?.emit('sendRequest', user?._id!);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (user?._id) {
          const { data } = await axios.get('/users/friends/' + user?._id, {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          });
          setFriends(data);
          const friendsId = currentUser?.friends?.map(
            // @ts-ignore
            (friend) => friend._id
          );
          setIsFriend(friendsId?.includes(user._id));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFriends();
  }, [user?._id, currentUser?.friends, currentUser?.token]);

  const RightbarHome = () => {
    return (
      <>
        <div className="rightbar__birthday">
          <img
            src="https://res.cloudinary.com/dxf7urmsh/image/upload/v1659268597/gift_cfrjp9.png"
            alt="birthday"
            className="rightbar__image--birthday"
          />
          <span className="rightbar__text--birthday">
            <b>Pola Foster</b> and <b>3 others</b> have a birthday today.
          </span>
        </div>
        <img
          src="https://res.cloudinary.com/dxf7urmsh/image/upload/v1659268597/ad_m6csgu.png"
          alt="ad"
          className="rightbar__ad"
        />
        <h4 className="rightbar__title">Online Friends</h4>
        <ul className="rightbar__list--friends">
          {onlineFriends?.map((u) => (
            <Online key={u?._id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const RightbarProfile = () => {
    return (
      <>
        {currentUser?._id !== user?._id && (
          <div className="rightbar__buttons">
            {!hide && (
              <button className="rightbar__button" onClick={handleClick}>
                {isFriend ? 'Remove Friend' : 'Add Friend'}
              </button>
            )}
            <button className="rightbar__button" onClick={createConversation}>
              Send Message
            </button>
          </div>
        )}
        <h4 className="rightbar__title">
          {isEdit ? 'Update user information' : 'User Information'}
        </h4>
        {!isEdit ? (
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
        ) : (
          <div className="rightbar__edit-info">
            <div className="rightbar__control">
              <label htmlFor="city">City: </label>
              <input
                className="rightbar__edit-input"
                type="text"
                name="city"
                placeholder={'City ...'}
                id="city"
                value={profileData.city}
                onChange={handleChange}
              />
            </div>
            <div className="rightbar__control">
              <label htmlFor="from">From: </label>
              <input
                className="rightbar__edit-input"
                type="text"
                name="from"
                id="from"
                placeholder={'Where from ...'}
                value={profileData.from}
                onChange={handleChange}
              />
            </div>
            <div className="rightbar__control">
              <label htmlFor="relationship">Relationship: </label>
              <select
                className="rightbar__edit-input"
                name="relationship"
                id="relationship"
                value={profileData.relationship}
                onChange={handleChange}
              >
                <option value="1">Single</option>
                <option value="2">Married</option>
                <option value="3">Married with children</option>
              </select>
            </div>
          </div>
        )}
        <h4 className="rightbar__title">User friends</h4>
        <div className="rightbar__followings">
          {friends?.map((friend) => (
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
