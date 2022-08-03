import { Sidebar, Feed, Rightbar } from '../components';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import { IUser } from '../interfaces';
import { FiEdit2 } from 'react-icons/fi';
import axios from 'axios';
import { updateUser } from '../features/user/userSlice';
import { useProfileInfoContext } from '../context';

const Profile = () => {
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
        const { data: imageData } = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const url = imageData.secure_url;
        try {
          const { data } = await axios.patch(
            '/users/' + currentUser._id,
            {
              [photo]: url,
            },
            {
              headers: {
                Authorization: `Bearer ${currentUser.token}`,
              },
            }
          );
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
        const { data } = await axios.get('/users/' + userId, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
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
  }, [userId, navigate, refetch, currentUser.token]);

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        '/users/' + currentUser._id,
        {
          ...profileData,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      dispatch(updateUser(data));
      setIsEdit(false);
      setRefetch(!refetch);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="profile">
        <Sidebar />
        <div className="profile__right">
          <div className="profile__right--top">
            <div className="profile__cover">
              <div className="profile__cover-wrapper">
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
                  <label htmlFor="file" className="profile__cover-label">
                    <input
                      type="file"
                      id="file"
                      style={{ display: 'none' }}
                      accept=".png,.jpeg,.jpg"
                      // @ts-ignore
                      onChange={(e) => handleImageChange(e, 'coverPicture')}
                    />
                  </label>
                )}
              </div>
              <div className="profile__cover-wrapper--secondary">
                <img
                  className="profile__cover--user"
                  src={
                    user?.profilePicture
                      ? user?.profilePicture
                      : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
                  }
                  alt="user"
                />
                {currentUser._id === userId && (
                  <label
                    htmlFor="file2"
                    className="profile__cover-label--secondary"
                  >
                    <input
                      type="file"
                      id="file2"
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
                    className="profile__info-input"
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleChange}
                  />
                  <input
                    className="profile__info-input"
                    name="desc"
                    type="text"
                    value={profileData.desc}
                    onChange={handleChange}
                  />
                  <button className="profile__info-btn">Update</button>
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
          <div className="profile__right--bottom">
            <Feed profile userId={userId} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
