import { IMessageNotification } from '../interfaces';
import { formatDistanceToNow } from 'date-fns';
import { useAppDispatch } from '../app/hooks';
import { fetchAndSetConversation } from '../features/conversations/conversationsSlice';
import { useNavigate } from 'react-router-dom';
import '../messageNotification.css';

interface MessageNotificationProps {
  notification: IMessageNotification;
}

const MessageNotification: React.FC<MessageNotificationProps> = ({
  notification,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <div
      className="message-notification"
      onClick={() => {
        navigate('/messanger');
        dispatch(fetchAndSetConversation(notification.conversation));
      }}
    >
      <img
        className="message-notification__image"
        src={
          notification.from.profilePicture
            ? notification.from.profilePicture
            : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1663824680/dquestion_app_widget_1_b_axtw5v.png'
        }
        alt={notification.from.username}
      />
      <div className="message-notification__info">
        <p>{notification.from.username} send you message</p>
        <p>
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
};

export default MessageNotification;
