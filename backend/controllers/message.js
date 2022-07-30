import Message from '../models/message.js';
import { StatusCodes } from 'http-status-codes';

export const createMessage = async (req, res) => {
  const newMessage = await Message.create(req.body);
  const message = await Message.findById(newMessage._id).populate(
    'sender',
    'username profilePicture'
  );
  res.status(StatusCodes.OK).json(message);
};

export const getMessages = async (req, res) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  }).populate('sender', 'username profilePicture');
  res.status(StatusCodes.OK).json(messages);
};
