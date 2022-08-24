import { Sidebar, Feed, Rightbar } from '../components';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import { IUser } from '../interfaces';
import { FiEdit2 } from 'react-icons/fi';
import axios from 'axios';
import { updateUser } from '../features/user/userSlice';
import { useProfileInfoContext } from '../context';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../interfaces';
import { createRipple } from '../config/createRipple';

type ProfileProps = {
  socket: React.MutableRefObject<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>;
};

const Profile: React.FC<ProfileProps> = ({ socket }) => {
  const { userId } = useParams();
  const { user: currentUser } = useAppSelector((state) => state.user);
  const [user, setUser] = useState({} as IUser);
  const {
    refetch,
    setRefetch,
    isEdit,
    setIsEdit,
    profileData,
    setProfileData,
    handleChange,
  } = useProfileInfoContext();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    photo: string
  ) => {
    // @ts-ignore
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        if (currentUser.profilePicture) {
          const id = currentUser.profilePicture.split('/').at(-1).split('.')[0];
          await axios.delete('/upload/' + id);
        }
        const { data: imageData } = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const url = imageData.secure_url;
        try {
          const { data } = await axios.patch('/users/' + currentUser._id, {
            [photo]: url,
          });
          dispatch(updateUser(data));
          setRefetch(!refetch);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/users/' + userId);
        setUser(data);
        setProfileData({
          ...profileData,
          username: data.username,
          desc: data.desc,
        });
      } catch (error) {
        console.log(error);
        navigate('/');
      }
    };
    fetchUser();
  }, [userId, navigate, refetch]);

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch('/users/' + currentUser._id, {
        ...profileData,
      });
      dispatch(updateUser(data));
      setIsEdit(false);
      setRefetch(!refetch);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex w-full md:w-[70%] mx-auto">
        <Sidebar />
        <div className="profile__right w-full pl-0 md:pl-4">
          <div className="profile__right--top">
            <div className="profile__cover">
              <div
                className={`profile__cover-wrapper transition duration-200 ${
                  currentUser._id === user._id &&
                  'hover:border hover:border-white'
                }`}
              >
                <img
                  className="profile__cover--image"
                  alt="cover"
                  src={
                    user?.coverPicture
                      ? user?.coverPicture
                      : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264833/16588370472353_vy1sjr.jpg'
                  }
                />
                {currentUser._id === userId && (
                  <label htmlFor="cover" className="profile__cover-label">
                    <input
                      type="file"
                      id="cover"
                      style={{ display: 'none' }}
                      accept=".png,.jpeg,.jpg"
                      // @ts-ignore
                      onChange={(e) => handleImageChange(e, 'coverPicture')}
                    />
                  </label>
                )}
              </div>
              <div
                className={`profile__cover-wrapper--secondary transition duration-200 ${
                  currentUser._id === user._id && 'hover:border-[3px]'
                }`}
              >
                <img
                  className=""
                  src={
                    user?.profilePicture
                      ? user?.profilePicture
                      : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
                  }
                  alt="user"
                />
                {currentUser._id === userId && (
                  <label
                    htmlFor="profile"
                    className="profile__cover-label--secondary"
                  >
                    <input
                      type="file"
                      id="profile"
                      style={{ display: 'none' }}
                      accept=".png,.jpeg,.jpg"
                      // @ts-ignore
                      onChange={(e) => handleImageChange(e, 'profilePicture')}
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="profile__info">
              {!isEdit ? (
                <>
                  {' '}
                  <h4 className="profile__name">{user?.username}</h4>
                  <span className="profile__description">{user?.desc}</span>
                </>
              ) : (
                <form
                  className="profile__info-form"
                  onSubmit={handleUpdateSubmit}
                >
                  <input
                    className="mt-1 w-full px-3 py-2 transition duration-200 border border-gray-300 shadow-inner rounded outline-none bg-gray-50 focus:bg-white hover:bg-white"
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleChange}
                  />
                  <input
                    className="mt-1 w-full shadow-inner px-3 py-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white"
                    name="desc"
                    type="text"
                    value={profileData.desc}
                    onChange={handleChange}
                  />
                  <button
                    onClick={createRipple}
                    className="relative overflow-hidden w-full shadow  border  py-2 px-4 text-sm font-bold rounded text-white transition duration-300 bg-blue-500  hover:bg-blue-500/90 "
                  >
                    Update
                  </button>
                </form>
              )}
              {currentUser._id === userId && !isEdit && (
                <>
                  <FiEdit2
                    className="profile__info-edit"
                    onClick={() => setIsEdit(true)}
                  />
                  <span className="profile__tooltip">Edit Profile</span>
                </>
              )}
            </div>
          </div>
          <div className="flex px-2 md:px-0">
            <Feed profile userId={userId} socket={socket} />
            <Rightbar user={user} socket={socket} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
