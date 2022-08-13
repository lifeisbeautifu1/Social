import { IPostNotification } from '../interfaces';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import '../messageNotification.css';

interface PostNotificationProps {
  notification: IPostNotification;
}

const PostNotification: React.FC<PostNotificationProps> = ({
  notification,
}) => {
  return (
    <Link to={`/post/${notification.post}`} className="message-notification">
      <img
        className="message-notification__image"
        src={
          notification.user.profilePicture
            ? notification.user.profilePicture
            : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
        }
        alt={notification.user.username}
      />
      <div className="message-notification__info">
        <p>
          {notification.user.username}{' '}
          {notification.type === 'Like'
            ? 'liked your post'
            : 'commented on your post'}
        </p>
        <p>
          {formatDistanceToNow(new Date(notification?.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </Link>
  );
};

export default PostNotification;
