import LikeImage from '../assets/like.png';
import HeartImage from '../assets/heart.png';
import { MoreVert } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../hooks';
import { IPost, IUser } from '../interfaces';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

type PostProps = {
  post: IPost;
};

const Post: React.FC<PostProps> = ({ post }) => {
  const [likes, setLikes] = useState(post.likes?.length!);
  const [user, setUser] = useState({} as IUser);

  const { user: currentUser } = useAppSelector((state) => state.user);

  const [isLiked, setIsLiked] = useState(
    post?.likes?.includes(currentUser._id)
  );

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get(`/users/${post?.userId}`);
      setUser(data);
    };
    fetchUser();
  }, [post.userId]);

  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked((prevState) => !prevState);
    try {
      axios.post(`/posts/${post._id}/like`, {
        userId: currentUser._id,
      });
    } catch (error) {
      console.log(error);
    }
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
              <Link to={`/profile/${user?._id}`}>
                <img
                  src={
                    user?.profilePicture
                      ? 'http://localhost:5000/images/' + user?.profilePicture
                      : 'http://localhost:5000/images/person/noAvatar.png'
                  }
                  alt="profile"
                  className="post__image--left"
                />
              </Link>
              <span className="post__name">{user?.username}</span>
              <span className="post__date">{format(post?.createdAt!)}</span>
            </div>
            <div className="post__top--right">
              <MoreVert />
            </div>
          </div>
          <div className="post__center">
            <span className="post__text">{post?.desc}</span>
            {post?.img && (
              <img
                src={'http://localhost:5000/images/' + post?.img}
                alt="post"
                className="post__image--center"
              />
            )}
          </div>
          <div className="post__bottom">
            <div className="post__bottom--left">
              <img
                src={LikeImage}
                alt="like"
                onClick={handleLike}
                className="post__like"
              />
              <img
                src={HeartImage}
                alt="heart"
                onClick={handleLike}
                className="post__like"
              />
              <span className="post__counter">{likes} people like it</span>
            </div>
            <div className="post__bottom--right">
              <span className="post__comment"> comments</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Post;
