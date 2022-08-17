import React from 'react';
import { IConversation } from '../interfaces';
import { useDispatch } from 'react-redux';
import { deleteNotifications } from '../features/user/userSlice';
import { selectConversation } from '../features/conversations/conversationsSlice';
import { useAppSelector } from '../hooks';

type ConversationProps = {
  conversation: IConversation;
};

const Conversation: React.FC<ConversationProps> = ({ conversation }) => {
  const { user, onlineUsers } = useAppSelector((state) => state.user);
  const { selectedConversation } = useAppSelector(
    (state) => state.conversations
  );
  const otherUser = conversation.members.find((m) => m._id !== user._id);
  const dispatch = useDispatch();
  const ids = onlineUsers.map((o: { userId: string }) => o.userId);

  return (
    <div
      className={`conversation ${
        selectedConversation &&
        selectedConversation?._id === conversation._id &&
        'conversation--active'
      }`}
      onClick={() => {
        dispatch(selectConversation(conversation));
        // @ts-ignore
        dispatch(deleteNotifications(otherUser._id));
      }}
    >
      <div className="chat-online__image-container">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={
            otherUser?.profilePicture
              ? otherUser?.profilePicture
              : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
          }
          alt="friend online"
        />
        {ids.includes(otherUser?._id!) && (
          <div className="chat-online__badge"></div>
        )}
        {/* <div className="chat-online__badge"></div> */}
      </div>
      {/* <img
        src={
          otherUser?.profilePicture
            ? otherUser?.profilePicture
            : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264459/noAvatar_lyqqt7.png'
        }
        alt="conversation"
        className="w-10 h-10 rounded-full object-cover mr-2"
      /> */}
      <span className="font-medium text-gray-600">{otherUser?.username}</span>
    </div>
  );
};

export default Conversation;
