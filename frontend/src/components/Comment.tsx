import { IComment } from '../interfaces';
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
        `/posts/${comment.postId}/comment/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(updateSelectedPost(data));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="comment">
      <div className="comment__top">
        <div className="comment__info">
          <div className="comment__image">
            <img src={comment.author.profilePicture} alt="" />
          </div>
          <div>
            <h1 className="comment__author">{comment.author.username}</h1>
            <h2 className="comment__time">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </h2>
          </div>
        </div>
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
