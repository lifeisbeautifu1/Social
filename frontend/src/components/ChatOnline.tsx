import React from 'react';
import { useAppSelector } from '../hooks';
import { IOnlineUser } from '../interfaces';

type ChatOnlineProps = {
  onlineUsers: IOnlineUser[];
};

const ChatOnline: React.FC<ChatOnlineProps> = () => {
  const { onlineFriends } = useAppSelector((state) => state.user);
  // const [onlineFriends, setOnlineFriends] = useState<IUser[]>([]);

  // useEffect(() => {
  //   const onlineUsersId = onlineUsers.map((onlineUser) => onlineUser.userId);

  //   setOnlineFriends(
  //     // @ts-ignore
  //     user.following.filter((friend) => onlineUsersId.includes(friend._id))
  //   );
  // }, [onlineUsers, user.following]);

  return (
    <div className="chat-online">
      {onlineFriends &&
        onlineFriends.map((friend: any) => (
          <div key={friend._id} className="chat-online__friend">
            <div className="chat-online__image-container">
              <img
                className="chat-online__image"
                src={
                  friend.profilePicture
                    ? friend.profilePicture
                    : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1663824680/dquestion_app_widget_1_b_axtw5v.png'
                }
                alt="friend online"
              />
              <div className="chat-online__badge"></div>
            </div>
            <span className="chat-online__name">{friend.username}</span>
          </div>
        ))}
    </div>
  );
};

export default ChatOnline;
