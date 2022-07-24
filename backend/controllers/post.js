import User from '../models/user.js';
import Post from '../models/post.js';
import { BadRequestError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

export const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await post.updateOne(req.body);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'The post has been updated' });
  } else {
    throw new BadRequestError('You can only update your posts');
  }
};

export const createPost = async (req, res) => {
  const post = await Post.create(req.body);
  res.status(StatusCodes.OK).json(post);
};

// (!)

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await post.deleteOne();
    return res
      .status(StatusCodes.OK)
      .json({ message: 'The post has been deleted' });
  } else {
    throw new BadRequestError('You can only delete your posts');
  }
};

export const likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  console.log(post._doc);
  if (!post.likes.includes(req.body.userId)) {
    await post.updateOne({ $push: { likes: req.body.userId } });
    res.status(StatusCodes.OK).json({ message: 'The post has been liked!' });
  } else {
    await post.updateOne({ $pull: { likes: req.body.userId } });
    res.status(StatusCodes.OK).json({ message: 'The post has been disliked!' });
  }
};

export const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.status(StatusCodes.OK).json(post);
};

export const getPosts = async (req, res) => {
  const currentUser = await User.findById(req.body.userId);
  const userPosts = await Post.find({ userId: req.body.userId });
  //   const friendPosts = await Promise.all(
  //     currentUser.following.map((friendId) => {
  //       return Post.find({ userId: friendId });
  //     })
  //   );
  const friendPosts = await Post.find({
    userId: {
      $in: currentUser.following,
    },
  });
  res.status(StatusCodes.OK).json(userPosts.concat(...friendPosts));
};
