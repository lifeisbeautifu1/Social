import FriendRequest from '../models/friendRequest';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user';
import { Request, Response } from 'express';
import { constants } from 'perf_hooks';

export const createRequest = async (req: Request, res: Response) => {
  const { to } = req.body;
  const newFriendRequest = await FriendRequest.create({
    from: res.locals.user.id,
    to,
  });
  await User.findByIdAndUpdate(to, {
    $push: {
      // @ts-ignore
      friendRequests: newFriendRequest,
    },
  });
  await User.findByIdAndUpdate(res.locals.user.id, {
    $push: {
      // @ts-ignore
      friendRequests: newFriendRequest,
    },
  });
  const friendRequest = await FriendRequest.findById(newFriendRequest)
    .populate('from', 'username profilePicture')
    .populate('to', 'username profilePicture');
  res.status(StatusCodes.OK).json(friendRequest);
};

export const closeRequest = async (req: Request, res: Response) => {
  const { id: requestId } = req.params;
  const { status } = req.body;
  const friendRequest = await FriendRequest.findById(requestId);
  if (status.toLowerCase() === 'accept') {
    const user = await User.findByIdAndUpdate(
      friendRequest?.to,
      {
        $push: {
          // @ts-ignore
          friends: friendRequest?.from,
        },
        $pull: {
          // @ts-ignore
          friendRequests: friendRequest?._id,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    await User.findByIdAndUpdate(friendRequest?.from, {
      $push: {
        // @ts-ignore
        friends: friendRequest?.to,
      },
      $pull: {
        // @ts-ignore
        friendRequests: friendRequest?._id,
      },
    });
    const newFriend = await User.findById(friendRequest?.from).select(
      'username profilePicture'
    );
    await friendRequest?.remove();
    res.status(StatusCodes.OK).json(newFriend);
  } else {
    const user = await User.findByIdAndUpdate(friendRequest?.to, {
      $pull: {
        // @ts-ignore
        friendRequests: friendRequest?._id,
      },
    });
    await User.findByIdAndUpdate(friendRequest?.from, {
      $pull: {
        // @ts-ignore
        friendRequests: friendRequest?._id,
      },
    });
    await friendRequest?.remove();
    res.status(StatusCodes.OK).json(user);
  }
};
