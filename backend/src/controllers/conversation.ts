import Conversation from '../models/conversation';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

export const createConversation = async (req: Request, res: Response) => {
  const exist = await Conversation.findOne({
    $or: [
      { members: [req.user.id, req.params.id] },
      { members: [req.params.id, req.user.id] },
    ],
  });
  if (!exist) {
    const conversation = await Conversation.create({
      members: [req.user.id, req.params.id],
    });
    return res.status(StatusCodes.OK).json(conversation);
  } else {
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Conversation alerady exist' });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  const conversations = await Conversation.find({
    members: {
      $in: [req.user.id],
    },
  }).populate('members', 'profilePicture username');
  res.status(StatusCodes.OK).json(conversations);
};
