import LikeImage from '../assets/like.png';
import HeartImage from '../assets/heart.png';
import { MoreVert } from '@material-ui/icons';
import React, { useState } from 'react';
import { IPost } from '../interfaces';
import { Users } from '../data';

type PostProps = {
  post: IPost;
};

const Post: React.FC<PostProps> = ({ post }) => {
  const [likes, setLikes] = useState(post.like);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked((prevState) => !prevState);
  };
  return (
    <div className="post">
      <div className="post__wrapper">
        <div className="post__top">
          <div className="post__top--left">
            <img
              src={
                Users.filter((u) => u.id === post?.userId)[0]?.profilePicture
              }
              alt="profile"
              className="post__image--left"
            />
            <span className="post__name">
              {Users.filter((u) => u.id === post?.userId)[0]?.username}
            </span>
            <span className="post__date">{post?.date}</span>
          </div>
          <div className="post__top--right">
            <MoreVert />
          </div>
        </div>
        <div className="post__center">
          <span className="post__text">{post?.desc}</span>
          <img src={post?.photo} alt="post" className="post__image--center" />
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
            <span className="post__comment">{post?.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
