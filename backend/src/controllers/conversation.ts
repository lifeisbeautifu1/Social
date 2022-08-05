import Conversation from '../models/conversation';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

export const createConversation = async (req: Request, res: Response) => {
  const conversation = await Conversation.create({
    members: [req.user.id, req.body.receiverId],
  });
  res.status(StatusCodes.OK).json(conversation);
};

export const getConversations = async (req: Request, res: Response) => {
  const conversations = await Conversation.find({
    members: {
      $in: [req.user.id],
    },
  }).populate('members', 'profilePicture username');
  res.status(StatusCodes.OK).json(conversations);
};
