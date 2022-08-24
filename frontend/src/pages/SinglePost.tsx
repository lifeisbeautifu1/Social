import { Sidebar, Post, Comment } from '../components';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { updateSelectedPost } from '../features/posts/postsSlice';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../interfaces';
import axios from 'axios';
import Picker from 'emoji-picker-react';
import { removeNotifications } from '../features/user/userSlice';
import { createRipple } from '../config/createRipple';

type SinglePostProps = {
  socket: React.MutableRefObject<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>;
};

const SinglePost: React.FC<SinglePostProps> = ({ socket }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [body, setBody] = useState('');

  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await axios.get('/posts/' + id, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      dispatch(updateSelectedPost(data));
      dispatch(removeNotifications(data._id));
    };
    fetchPost();
  }, [id, dispatch, user.token]);
  const { selectedPost } = useAppSelector((state) => state.posts);

  const callback = () => navigate('/');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (body.trim()) {
      try {
        const { data } = await axios.post(
          `/posts/${id}/comment`,
          {
            body,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        dispatch(updateSelectedPost(data));
        if (selectedPost?.author?._id !== user._id)
          socket?.current?.emit('sendRequest', selectedPost?.author?._id!);
        setBody('');
      } catch (error) {
        console.log(error);
      }
    }
  };
  const onEmojiClick = (event: any, emojiObject: any) => {
    // console.log(emojiObject.emoji);
    setBody(body + emojiObject.emoji);
  };

  return (
    <div className="flex w-full md:w-[70%] mx-auto">
      <Sidebar />
      <div className="single-post">
        {selectedPost && (
          <Post socket={socket} post={selectedPost} callback={callback} />
        )}
        <div className="mt-8 rounded shadow border border-gray-200 p-6 flex flex-col gap-4">
          <h3 className="text-lg">Add a new comment</h3>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-4 relative">
              <img
                className="w-10 h-10 object-cover rounded-full"
                src={user.profilePicture}
                alt=""
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type your message..."
                className="shadow-inner w-full p-3 border border-gray-200 resize-none outline-none rounded h-[100px]"
              />
              <span
                className="absolute top-2 right-2"
                onClick={() => setShowPicker(!showPicker)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer h-6 w-6 text-gray-500 hover:text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              {showPicker && (
                <div className="absolute top-10 right-2">
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
            <button
              onClick={createRipple}
              className="relative overflow-hidden self-end w-[150px] shadow  border  py-2 px-4 text-sm font-bold rounded text-white transition duration-300 bg-blue-500    hover:bg-blue-500/90 "
            >
              Post comment
            </button>
          </form>
        </div>
        <div className="flex flex-col mt-4 mb-10">
          {selectedPost?.comments.map((c) => (
            <Comment key={c._id} comment={c} />
          ))}
        </div>
      </div>
      {/* <Rightbar socket={socket} /> */}
    </div>
  );
};

export default SinglePost;
