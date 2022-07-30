import { GoFileMedia } from 'react-icons/go';
import { MdLabelImportant, MdRoom, MdCancel } from 'react-icons/md';
import { BsFillEmojiHeartEyesFill } from 'react-icons/bs';
import { useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import { addPost } from '../features/posts/postsSlice';
import React, { useState } from 'react';
import axios from 'axios';

const Share = () => {
  const { user } = useAppSelector((state) => state.user);
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc,
      img: '',
    };
    if (file) {
      const data = new FormData();
      // @ts-ignore
      const fileName = Date.now() + file.name;
      data.append('name', fileName);
      data.append('file', file);
      newPost.img = fileName;
      try {
        await axios.post('/upload', data);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      const { data } = await axios.post('/posts', newPost);
      setDesc('');
      setFile(null);
      dispatch(addPost(data));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="share">
      <div className="share__wrapper">
        <div className="share__top">
          <img
            src={
              user?.profilePicture
                ? `http://localhost:5000/images/${user?.profilePicture}`
                : 'http://localhost:5000/images/person/noAvatar.png'
            }
            alt="profile"
            className="share__image"
          />
          <input
            placeholder={`What's on your mind ${user?.username}?`}
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="share__input"
          />
        </div>
        <hr className="share__hr" />
        {file && (
          <div className="share__container">
            <img
              className="share__image--upload"
              src={URL.createObjectURL(file)}
              alt="upload"
            />
            <MdCancel className="share__cancel" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="share__bottom" onSubmit={handleSubmit}>
          <div className="share__options">
            <label htmlFor="file" className="share__option">
              <GoFileMedia
                style={{ color: 'tomato' }}
                className="share__icon"
              />
              <span className="share__text">Photo or Video</span>
              <input
                type="file"
                id="file"
                style={{ display: 'none' }}
                accept=".png,.jpeg,.jpg"
                // @ts-ignore
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="share__option">
              <MdLabelImportant
                style={{ color: 'blue' }}
                className="share__icon"
              />
              <span className="share__text">Tag</span>
            </div>
            <div className="share__option">
              <MdRoom style={{ color: 'green' }} className="share__icon" />
              <span className="share__text">Locations</span>
            </div>
            <div className="share__option">
              <BsFillEmojiHeartEyesFill
                style={{ color: 'goldenrod' }}
                className="share__icon"
              />
              <span className="share__text">Feelings</span>
            </div>
          </div>
          <button className="share__button">Share</button>
        </form>
      </div>
    </div>
  );
};

export default Share;
