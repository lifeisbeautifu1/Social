import User from '../models/user';
import MessageNotification from '../models/messageNotification';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getNotifications = async (req: Request, res: Response) => {
  let user = await User.findById(res.locals.user.id).populate(
    'messageNotifications',
    'createdAt from to conversation'
  );
  user = await User.populate(user, {
    path: 'messageNotifications.from',
    select: 'profilePicture username',
  });
  res.status(StatusCodes.OK).json(user.messageNotifications);
};

export const deleteNotifications = async (req: Request, res: Response) => {
  const { id } = req.params;
  const notifications = await MessageNotification.find({ from: id });
  let notificationsId = notifications.map((n) => n._id);
  await User.findByIdAndUpdate(res.locals.user.id, {
    $pull: {
      messageNotifications: {
        // @ts-ignore
        $in: notificationsId,
      },
    },
  });
  await MessageNotification.deleteMany({
    from: id,
  });
  res.status(StatusCodes.OK).json({ message: 'OK' });
};
