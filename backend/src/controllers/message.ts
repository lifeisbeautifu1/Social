import Message from '../models/message';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

export const createMessage = async (req: Request, res: Response) => {
  const newMessage = await Message.create(req.body);
  const message = await Message.findById(newMessage._id).populate(
    'sender',
    'username profilePicture'
  );
  res.status(StatusCodes.OK).json(message);
};

export const getMessages = async (req: Request, res: Response) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  }).populate('sender', 'username profilePicture');
  res.status(StatusCodes.OK).json(messages);
};
