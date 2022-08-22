import Message from '../models/message';
import MessageNotification from '../models/messageNotification';
import User from '../models/user';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

export const createMessage = async (req: Request, res: Response) => {
  const { conversationId, sender, receiver, text } = req.body;
  const newMessage = await Message.create({
    conversationId,
    text,
    sender,
  });
  const message = await Message.findById(newMessage._id).populate(
    'sender',
    'username profilePicture'
  );
  const notification = await MessageNotification.create({
    from: sender,
    conversation: conversationId,
    to: receiver,
  });
  await User.findByIdAndUpdate(receiver, {
    $push: {
      // @ts-ignore
      messageNotifications: notification,
    },
  });
  res.status(StatusCodes.OK).json(message);
};

export const getMessages = async (req: Request, res: Response) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  })
    .populate('sender', 'username profilePicture')
    .sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json(messages);
};
