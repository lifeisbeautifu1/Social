import { RightbarFriend } from './';
import { IFriendRequest, IUser } from '../interfaces';
import { useAppSelector } from '../app/hooks';
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
  const { user: currentUser } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const createConversation = async () => {
    try {
      await axios.post('/conversations/' + user?._id);
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
      ?.map((fr: IFriendRequest) => fr.from?._id)
      .includes(user?._id) ||
    currentUser?.friendRequests
      ?.map((fr: IFriendRequest) => fr.from?._id)
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

  // const [onlineFriends, setOnlineFriends] = useState<IUser[]>([]);

  // useEffect(() => {
  //   // @ts-ignore
  //   const onlineUsersId = onlineUsers?.map((onlineUser) => onlineUser.userId);

  //   setOnlineFriends(
  //     // @ts-ignore
  //     currentUser?.friends.filter((friend) =>
  //       onlineUsersId.includes(friend._id)
  //     )
  //   );
  // }, [onlineUsers, currentUser?.friends]);

  const handleClick = async () => {
    try {
      if (isFriend) {
        await axios.delete(`/users/${user?._id}/friend`);
        dispatch(removeFriend(user!));
        setIsFriend(!isFriend);
      } else {
        const { data } = await axios.post('/friendRequests/', {
          to: user?._id,
        });
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
          const { data } = await axios.get('/users/friends/' + user?._id);
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
  }, [user?._id, currentUser?.friends]);

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
        {/* <img
          src="https://res.cloudinary.com/dxf7urmsh/image/upload/v1659268597/ad_m6csgu.png"
          alt="ad"
          className="rightbar__ad"
        /> */}
        <h4 className="rightbar__title mt-8">Online Friends</h4>
        {/* <ul className="rightbar__list--friends">
          {onlineFriends?.map((u) => (
            <Online key={u?._id} user={u} />
          ))}
        </ul> */}
      </>
    );
  };

  const RightbarProfile = () => {
    return (
      <>
        {currentUser?._id !== user?._id && (
          <div className="my-4 flex items-center flex-wrap gap-2">
            {!hide && (
              <button
                className="w-[150px] shadow hover:shadow-lg border  py-2 px-4 text-sm font-bold rounded text-white transition duration-300 bg-blue-500  border-blue-500  hover:bg-blue-500/90 "
                onClick={handleClick}
              >
                {isFriend ? 'Remove Friend' : 'Add Friend'}
              </button>
            )}
            <button
              className="w-[150px] shadow hover:shadow-lg border  py-2 px-4 text-sm font-bold rounded text-white transition duration-300 bg-blue-500  border-blue-500  hover:bg-blue-500/90 "
              onClick={createConversation}
            >
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
            <div className="relative mb-2">
              <input
                type="text"
                name="city"
                placeholder=" "
                id="city"
                value={profileData.city}
                onChange={handleChange}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none shadow-inner
                  focus:outline-none focus:ring-0  peer"
              />
              <label
                htmlFor="city"
                className="absolute text-sm  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                City
              </label>
            </div>
            {/* <div className="rightbar__control">
              <label htmlFor="city">City </label>
              <input
                className="mt-1 w-full px-3 py-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white"
                type="text"
                name="city"
                placeholder={'City ...'}
                id="city"
                value={profileData.city}
                onChange={handleChange}
              />
            </div> */}
            <div className="relative mb-2">
              <input
                type="text"
                name="from"
                placeholder=" "
                id="from"
                value={profileData.from}
                onChange={handleChange}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none shadow-inner
                  focus:outline-none focus:ring-0  peer"
              />
              <label
                htmlFor="from"
                className="absolute text-sm  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                From
              </label>
            </div>
            {/* <div className="rightbar__control">
              <label htmlFor="from">From </label>
              <input
                className="mt-1 w-full px-3 py-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white"
                type="text"
                name="from"
                id="from"
                placeholder={'Where from ...'}
                value={profileData.from}
                onChange={handleChange}
              />
            </div> */}
            <div className="rightbar__control">
              <label htmlFor="relationship">Relationship </label>
              <select
                className="block p-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border
                  focus:outline-none focus:ring-0 shadow-inner"
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
    <div className="hidden md:block w-[35%]">
      <div className="p-5">{user ? RightbarProfile() : RightbarHome()}</div>
    </div>
  );
};

export default Rightbar;
