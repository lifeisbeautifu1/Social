import User from '../models/user.js';
import { BadRequestError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  const { password, updatedAt, ...other } = user._doc;
  res.status(StatusCodes.OK).json(other);
};

export const updateUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    await User.findByIdAndUpdate(req.params.id, req.body);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Account has been updated' });
  } else {
    throw new BadRequestError('You can only update your account');
  }
};

export const deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    await User.findByIdAndDelete(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Account has been deleted' });
  } else {
    throw new BadRequestError('You can only delete your account');
  }
};

export const followUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (!user.followers.includes(req.body.userId)) {
      await user.updateOne({ $push: { followers: req.body.userId } });
      await currentUser.updateOne({ $push: { following: req.params.id } });
      return res
        .status(StatusCodes.OK)
        .json({ message: 'User has been followed' });
    } else {
      throw new BadRequestError('You already follow this user');
    }
  } else {
    throw new BadRequestError('You cant follow yourself');
  }
};

export const unfollowUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (user.followers.includes(req.body.userId)) {
      await user.updateOne({ $pull: { followers: req.body.userId } });
      await currentUser.updateOne({ $pull: { following: req.params.id } });
      return res
        .status(StatusCodes.OK)
        .json({ message: 'User has been unfollowed' });
    } else {
      throw new BadRequestError('You dont follow this user');
    }
  } else {
    throw new BadRequestError('You cant unfollow yourself');
  }
};
