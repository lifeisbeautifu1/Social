import Conversation from '../models/conversation';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

export const createConversation = async (req: Request, res: Response) => {
  const exist = await Conversation.findOne({
    $or: [
      { members: [res.locals.user.id, req.params.id] },
      { members: [req.params.id, res.locals.user.id] },
    ],
  });
  if (!exist) {
    const conversation = await Conversation.create({
      members: [res.locals.user.id, req.params.id],
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
      $in: [res.locals.user.id],
    },
  }).populate('members', 'profilePicture username');
  res.status(StatusCodes.OK).json(conversations);
};

export const getConversation = async (req: Request, res: Response) => {
  const conversation = await Conversation.findById(req.params.id).populate(
    'members',
    'profilePicture username'
  );
  res.status(StatusCodes.OK).json(conversation);
};
