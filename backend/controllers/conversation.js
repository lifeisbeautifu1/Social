import Conversation from '../models/conversation.js';
import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';

export const createConversation = async (req, res) => {
  const conversation = await Conversation.create({
    members: [req.user.id, req.body.receiverId],
  }).populate('members', 'profilePicture username');
  res.status(StatusCodes.OK).json(conversation);
};

export const getConversations = async (req, res) => {
  const conversations = await Conversation.find({
    members: {
      $in: [req.user.id],
    },
  }).populate('members', 'profilePicture username');
  res.status(StatusCodes.OK).json(conversations);
};
