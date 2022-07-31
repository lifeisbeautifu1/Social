import { Sidebar, Feed, Rightbar, Navbar } from '../components';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IUser } from '../interfaces';
import axios from 'axios';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({} as IUser);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/users/' + userId);
        setUser(data);
      } catch (error) {
        console.log(error);
        navigate('/');
      }
    };
    fetchUser();
  }, [userId, navigate]);

  return (
    <>
      <Navbar />
      <div className="profile">
        <Sidebar />
        <div className="profile__right">
          <div className="profile__right--top">
            <div className="profile__cover">
              <img
                className="profile__cover--image"
                alt="cover"
                src={
                  user?.coverPicture
                    ? user?.coverPicture
                    : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264833/16588370472353_vy1sjr.jpg'
                }
              />
              <img
                className="profile__cover--user"
                src={
                  user?.profilePicture
                    ? user?.profilePicture
                    : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
                }
                alt="user"
              />
            </div>
            <div className="profile__info">
              <h4 className="profile__name">{user?.username}</h4>
              <span className="profile__description">{user?.desc}</span>
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
