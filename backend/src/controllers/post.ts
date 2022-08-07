import User from '../models/user';
import Post from '../models/post';
import Comment from '../models/comment';
import { BadRequestError, NotFoundError } from '../errors';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

export const updatePost = async (req: Request, res: Response) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    throw new NotFoundError(`Post with id ${req.params.id} doesnt exist`);
  } else {
    if (post.author == req.user.id) {
      post = await post.updateOne(req.body, {
        new: true,
        runValidators: true,
      });
      return res.status(StatusCodes.OK).json(post);
    } else {
      throw new BadRequestError('You can only update your posts');
    }
  }
};

export const createPost = async (req: Request, res: Response) => {
  const post = await Post.create(req.body);
  const fullPost = await User.populate(post, {
    path: 'author',
    select: 'username profilePicture',
  });
  res.status(StatusCodes.OK).json(fullPost);
};

export const deletePost = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    if (post.author == req.user.id) {
      await Comment.deleteMany({ postId: post._id });
      await post.deleteOne();
      return res
        .status(StatusCodes.OK)
        .json({ message: 'The post has been deleted' });
    } else {
      throw new BadRequestError('You can only delete your posts');
    }
  } else {
    throw new NotFoundError(`Post with id ${req.params.id} doesnt exist`);
  }
};

export const likePost = async (req: Request, res: Response) => {
  let post = await Post.findById(req.params.id);
  if (post) {
    // @ts-ignore
    if (post.likes.includes(req.user.id)) {
      // @ts-ignore
      post.likes = post.likes.filter((id) => id != req.user.id);
    } else {
      // @ts-ignore
      post.likes.push(req.user.id);
    }
    await post.save();
    post = await Post.findById(req.params.id).populate(
      'author',
      'username profilePicture'
    );
    res.status(StatusCodes.OK).json(post);
  } else {
    throw new NotFoundError(`Post with id ${req.params.id} not found`);
  }
};

export const getPost = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username profilePicture')
    .populate('comments', 'author body postId createdAt');
  const fullPost = await User.populate(post, {
    path: 'comments.author',
    select: 'username profilePicture',
  });
  res.status(StatusCodes.OK).json(fullPost);
};

export const getPosts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const currentUser = await User.findById(req.query.userId);
  const userPosts = await Post.find({ author: req.query.userId }).populate(
    'author',
    'username profilePicture'
  );
  const friendPosts = await Post.find({
    author: {
      $in: currentUser?.friends,
    },
  }).populate('author', 'username profilePicture');
  // @ts-ignore
  let allPosts = userPosts.concat(...friendPosts).sort((p1, p2) => {
    return (
      // @ts-ignore
      new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime()
    );
  });
  const numberOfPages = Math.ceil(allPosts.length / limit);
  allPosts = allPosts.slice(skip).slice(0, limit);

  res.status(StatusCodes.OK).json({
    posts: allPosts,
    numberOfPages,
  });
};

export const getUsersPosts = async (req: Request, res: Response) => {
  const posts = await Post.find({ author: req.params.userId })
    .populate('author', 'username profilePicture')
    .sort({
      createdAt: -1,
    });
  res.status(StatusCodes.OK).json(posts);
};

export const addComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req.body;
  const comment = await Comment.create({
    postId: id,
    author: req.user.id,
    body,
  });
  const post = await Post.findByIdAndUpdate(
    id,
    {
      $push: {
        comments: comment._id,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate('author', 'username profilePicture')
    .populate('comments', 'author body postId createdAt');
  const updatedPost = await User.populate(post, {
    path: 'comments.author',
    select: 'username profilePicture',
  });
  res.status(StatusCodes.OK).json(updatedPost);
};

export const deleteComment = async (req: Request, res: Response) => {
  const { postId, commentId } = req.params;
  await Comment.findByIdAndDelete(commentId);
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $pull: {
        comments: commentId,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate('author', 'username profilePicture')
    .populate('comments', 'author body postId createdAt');
  const updatedPost = await User.populate(post, {
    path: 'comments.author',
    select: 'username profilePicture',
  });
  res.status(StatusCodes.OK).json(updatedPost);
};
