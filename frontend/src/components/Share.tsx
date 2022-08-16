import { MdCancel } from 'react-icons/md';
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
    if (!desc && !file) return;
    const newPost = {
      author: user._id,
      desc,
      img: '',
    };
    if (file) {
      const formData = new FormData();
      // @ts-ignore
      // const fileName = Date.now() + file.name;
      // data.append('name', fileName);
      formData.append('file', file);
      // newPost.img = fileName;
      try {
        const { data: imageData } = await axios.post('/upload', formData);
        newPost.img = imageData.secure_url;
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
    <div className="w-full bg-white rounded shadow-md border border-gray-200">
      <div className="p-6">
        <h1 className="text-lg font-semibold mb-4">Create new post</h1>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <img
              src={
                user?.profilePicture
                  ? user?.profilePicture
                  : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
              }
              alt="profile"
              className="w-12 h-12 rounded-full object-cover "
            />
            <textarea
              className="w-full p-3 border border-gray-200 rounded outline-none resize-none h-[150px]"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Type your message..."
            />
          </div>

          <hr className="my-4" />
          {file && (
            <div className="share__container">
              <img
                className="share__image--upload"
                src={URL.createObjectURL(file)}
                alt="upload"
              />
              <MdCancel
                className="share__cancel"
                onClick={() => setFile(null)}
              />
            </div>
          )}
          <div className="share__bottom">
            <div className="share__options">
              <label
                htmlFor="post"
                className="hover:text-gray-700 flex items-center text-sm cursor-pointer text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="share__text">Attach Photo</span>
                <input
                  type="file"
                  id="post"
                  style={{ display: 'none' }}
                  accept=".png,.jpeg,.jpg"
                  // @ts-ignore
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>

            <button
              type="submit"
              className="self-end justify-end border border-gray-300 py-[2px] px-4 rounded font-medium transition duration-200 hover:bg-gray-700 hover:border-gray-700 hover:text-white"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Share;
