import React from 'react';
import { IMessage } from '../interfaces';
import { formatDistanceToNow } from 'date-fns';

type MessageProps = {
  own?: boolean;
  message: IMessage;
};

const Message: React.FC<MessageProps> = ({ own, message }) => {
  return (
    <div className={own ? 'message own' : 'message'}>
      <div className={own ? 'message__top own' : 'message__top'}>
        <img
          src={
            message.sender.profilePicture
              ? `http://localhost:5000/images/${message.sender.profilePicture}`
              : 'http://localhost:5000/images/person/noAvatar.png'
          }
          alt="message"
          className="message__image"
        />
        <p className="message__text">{message.text}</p>
      </div>
      <div className="message__bottom">
        {formatDistanceToNow(new Date(message.createdAt), {
          addSuffix: true,
        })}
      </div>
    </div>
  );
};

export default Message;
