import ProfileImage from '../assets/person/1.jpeg';
import { PermMedia, Label, Room, EmojiEmotions } from '@material-ui/icons';

const Share = () => {
  return (
    <div className="share">
      <div className="share__wrapper">
        <div className="share__top">
          <img src={ProfileImage} alt="profile" className="share__image" />
          <input
            placeholder="What's on your mind?"
            type="text"
            className="share__input"
          />
        </div>
        <hr className="share__hr" />
        <div className="share__bottom">
          <div className="share__options">
            <div className="share__option">
              <PermMedia htmlColor="tomato" className="share__icon" />
              <span className="share__text">Photo or Video</span>
            </div>
            <div className="share__option">
              <Label htmlColor="blue" className="share__icon" />
              <span className="share__text">Tag</span>
            </div>
            <div className="share__option">
              <Room htmlColor="green" className="share__icon" />
              <span className="share__text">Locations</span>
            </div>
            <div className="share__option">
              <EmojiEmotions htmlColor="goldenrod" className="share__icon" />
              <span className="share__text">Feelings</span>
            </div>
          </div>
          <button className="share__button">Share</button>
        </div>
      </div>
    </div>
  );
};

export default Share;
