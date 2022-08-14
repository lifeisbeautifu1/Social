import { FaTrash } from 'react-icons/fa';
import React, { useState } from 'react';
import { useAppSelector } from '../hooks';
import {
  ClientToServerEvents,
  IPost,
  ServerToClientEvents,
} from '../interfaces';
import { useDispatch } from 'react-redux';
import { deletePost, updatePost } from '../features/posts/postsSlice';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Socket } from 'socket.io-client';
import axios from 'axios';

type PostProps = {
  post: IPost;
  callback?: () => void;
  socket: React.MutableRefObject<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>;
};

const Post: React.FC<PostProps> = ({ post, callback, socket }) => {
  const [likes, setLikes] = useState(post.likes?.length!);
  const dispatch = useDispatch();

  const { user: currentUser } = useAppSelector((state) => state.user);

  const [isLiked, setIsLiked] = useState(
    post?.likes?.includes(currentUser._id)
  );

  const handleLike = async () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked((prevState) => !prevState);
    try {
      const { data } = await axios.post(`/posts/${post._id}/like`);
      socket?.current?.emit('sendRequest', post.author._id);
      dispatch(updatePost(data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (post) {
      if (post.img) {
        //@ts-ignore
        const id = post.img.split('/').at(-1).split('.')[0];
        await axios.delete('/upload/' + id);
      }
    }
    // @ts-ignore
    dispatch(deletePost(post));
    callback && callback();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="post">
        <div className="post__wrapper">
          <div className="post__top">
            <div className="post__top--left">
              <Link to={`/profile/${post?.author?._id}`}>
                <img
                  src={
                    post.author?.profilePicture
                      ? post.author?.profilePicture
                      : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
                  }
                  alt="profile"
                  className="post__image--left"
                />
              </Link>
              <span className="post__name">{post.author?.username}</span>
              <span className="post__date">
                {formatDistanceToNow(new Date(post?.createdAt!), {
                  addSuffix: true,
                })}
              </span>
            </div>
            {currentUser._id === post.author._id && (
              <div className="post__top--right" onClick={handleDelete}>
                <FaTrash />
              </div>
            )}
          </div>
          <div className="post__center">
            <span className="post__text">{post?.desc}</span>
            {post?.img && (
              <img src={post?.img} alt="post" className="post__image--center" />
            )}
          </div>
          <div className="post__bottom">
            <div className="post__bottom--left">
              <img
                src="https://res.cloudinary.com/dxf7urmsh/image/upload/v1659268597/like_mjyy2f.png"
                alt="like"
                onClick={handleLike}
                className="post__like"
              />
              <img
                src="https://res.cloudinary.com/dxf7urmsh/image/upload/v1659268597/heart_ghyyc6.png"
                alt="heart"
                onClick={handleLike}
                className="post__like"
              />
              <span className="post__counter">{likes} people like it</span>
            </div>
            <div className="post__bottom--right">
              <Link to={`/post/${post._id}`} className="post__comment">
                {' '}
                {post.comments.length} comments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Post;
