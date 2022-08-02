import User from '../models/user.js';
import { BadRequestError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
// import bcrypt from 'bcryptjs';

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    'following',
    'username profilePicture'
  );
  const { password, updatedAt, ...other } = user._doc;
  res.status(StatusCodes.OK).json(other);
};

export const updateUser = async (req, res) => {
  // if (req.body.userId === req.params.id || req.body.isAdmin) {
  //   if (req.body.password) {
  //     const salt = await bcrypt.genSalt(10);
  //     req.body.password = await bcrypt.hash(req.body.password, salt);
  //   }
  //   await User.findByIdAndUpdate(req.params.id, req.body);
  //   return res
  //     .status(StatusCodes.OK)
  //     .json({ message: 'Account has been updated' });
  // } else {
  //   throw new BadRequestError('You can only update your account');
  // }
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('following', 'profilePicture username');
  res.status(StatusCodes.OK).json(updatedUser);
};

export const deleteUser = async (req, res) => {
  if (req.user.id === req.params.id || req.body.isAdmin) {
    await User.findByIdAndDelete(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Account has been deleted' });
  } else {
    throw new BadRequestError('You can only delete your account');
  }
};

export const followUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    const user = await User.findById(req.params.id);
    let currentUser = await User.findById(req.user.id);
    if (!user.followers.includes(req.user.id)) {
      await user.updateOne({ $push: { followers: req.user.id } });
      currentUser = await User.findByIdAndUpdate(
        currentUser._id,
        {
          $push: { following: req.params.id },
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate('following', 'username profilePicture');
      return res.status(StatusCodes.OK).json(currentUser.following);
    } else {
      throw new BadRequestError('You already follow this user');
    }
  } else {
    throw new BadRequestError('You cant follow yourself');
  }
};

export const unfollowUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    const user = await User.findById(req.params.id);
    let currentUser = await User.findById(req.user.id);
    if (user.followers.includes(req.user.id)) {
      await user.updateOne({ $pull: { followers: req.user.id } });
      currentUser = await User.findByIdAndUpdate(
        currentUser._id,
        {
          $pull: { following: req.params.id },
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate('following', 'username profilePicture');
      return res.status(StatusCodes.OK).json(currentUser.following);
    } else {
      throw new BadRequestError('You dont follow this user');
    }
  } else {
    throw new BadRequestError('You cant unfollow yourself');
  }
};

export const getFriends = async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    'following',
    '_id username profilePicture'
  );
  res.status(StatusCodes.OK).json(user.following);
};
