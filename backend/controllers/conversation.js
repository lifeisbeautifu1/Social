import Conversation from '../models/conversation.js';
import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';

export const createConversation = async (req, res) => {
  const conversation = await Conversation.create({
    members: [req.body.senderId, req.body.receiverId],
  }).populate('members', 'profilePicture username');
  res.status(StatusCodes.OK).json(conversation);
};

export const getConversations = async (req, res) => {
  const conversations = await Conversation.find({
    members: {
      $in: [req.params.userId],
    },
  }).populate('members', 'profilePicture username');
  res.status(StatusCodes.OK).json(conversations);
};
