import { IComment } from '../interfaces';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { updateSelectedPost } from '../features/posts/postsSlice';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from '../app/hooks';

interface CommentProps {
  comment: IComment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `/posts/${comment.postId}/comment/${comment._id}`
      );
      dispatch(updateSelectedPost(data));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="comment">
      <div className="comment__top">
        <Link className="comment__info" to={`/profile/${comment.author._id}`}>
          <div className="comment__image">
            <img
              src={
                comment.author.profilePicture
                  ? comment.author.profilePicture
                  : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
              }
              alt=""
            />
          </div>
          <div className="comment__info-author">
            <h1 className="comment__author">{comment.author.username}</h1>
            <h2 className="comment__time">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </h2>
          </div>
        </Link>
        {user._id === comment.author._id && (
          <span className="comment__delete" onClick={handleDelete}>
            <FaTrash />
          </span>
        )}
      </div>
      <div className="comment__bottom">{comment.body}</div>
    </div>
  );
};

export default Comment;
