import User from '../models/user.js';
import Post from '../models/post.js';
import { BadRequestError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

export const updatePost = async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (post.userId === req.user.id) {
    post = await post.updateOne(req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(StatusCodes.OK).json(post);
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
  if (post.userId === req.user.id) {
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
  if (!post.likes.includes(req.user.id)) {
    await post.updateOne({ $push: { likes: req.user.id } });
    res.status(StatusCodes.OK).json({ message: 'The post has been liked!' });
  } else {
    await post.updateOne({ $pull: { likes: req.user.id } });
    res.status(StatusCodes.OK).json({ message: 'The post has been disliked!' });
  }
};

export const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.status(StatusCodes.OK).json(post);
};

export const getPosts = async (req, res) => {
  const currentUser = await User.findById(req.params.userId);
  const userPosts = await Post.find({ userId: req.params.userId });
  const friendPosts = await Post.find({
    userId: {
      $in: currentUser.following,
    },
  });
  const allPosts = userPosts.concat(...friendPosts).sort((p1, p2) => {
    return new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime();
  });
  res.status(StatusCodes.OK).json(allPosts);
};

export const getUsersPosts = async (req, res) => {
  const posts = await Post.find({ userId: req.params.userId }).sort({
    createdAt: -1,
  });
  res.status(StatusCodes.OK).json(posts);
};


