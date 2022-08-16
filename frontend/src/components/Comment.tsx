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
  // console.log(comment.author);
  return (
    <div className="bg-white rounded-t border border-gray-200 p-4 flex gap-4 ">
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
      </Link>
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between items-center">
          <h1 className=" text-gray-700 font-semibold">
            {comment.author.username}
          </h1>
          <div className="flex gap-2">
            <h2 className="comment__time mr-2">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </h2>
            {user._id === comment.author._id && (
              <span
                className="cursor-pointer text-red-400"
                onClick={handleDelete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-400">{comment.author.desc}</p>
        <p className="text-gray-600 mt-2 text-lg">{comment.body}</p>
      </div>

      {/* <div className="comment__bottom">{comment.body}</div> */}
    </div>
  );
};

export default Comment;
