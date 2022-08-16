import { Sidebar, Rightbar, Post, Comment } from '../components';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { updateSelectedPost } from '../features/posts/postsSlice';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../interfaces';
import axios from 'axios';
import { removeNotifications } from '../features/user/userSlice';

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

  return (
    <div className="home">
      <Sidebar />
      <div className="single-post">
        {selectedPost && (
          <Post socket={socket} post={selectedPost} callback={callback} />
        )}
        <div className="comment__form--wrapper">
          <h3 className="comment__form--title">Post comment</h3>
          <form className="comment__form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="comment"
              value={body}
              placeholder="Comment..."
              onChange={(e) => setBody(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="comments__wrapper">
          {selectedPost?.comments.map((c) => (
            <Comment key={c._id} comment={c} />
          ))}
        </div>
      </div>
      <Rightbar socket={socket} />
    </div>
  );
};

export default SinglePost;
