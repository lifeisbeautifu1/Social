import express from 'express';

const router = express.Router();

import {
  getPost,
  getPosts,
  getUsersPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
} from '../controllers/post';

router.post('/', createPost);

router.get('/timeline', getPosts);

router.get('/:id', getPost);

router.get('/all/:userId', getUsersPosts);

router.patch('/:id', updatePost);

router.delete('/:id', deletePost);

router.post('/:id/like', likePost);

router.post('/:id/comment', addComment);

router.delete('/:postId/comment/:commentId', deleteComment);

export default router;
