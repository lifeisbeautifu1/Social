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
              ? message.sender.profilePicture
              : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1663824680/dquestion_app_widget_1_b_axtw5v.png'
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
