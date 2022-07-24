import { Sidebar, Feed, Rightbar, Navbar } from '../components';

const Profile = () => {
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
                src="./assets/post/3.jpeg"
              />
              <img
                className="profile__cover--user"
                src="./assets/person/7.jpeg"
                alt="user"
              />
            </div>
            <div className="profile__info">
              <h4 className="profile__name">harry potter</h4>
              <span className="profile__description">hello my friends!</span>
            </div>
          </div>
          <div className="profile__right--bottom">
            <Feed />
            <Rightbar profile />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
