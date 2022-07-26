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
} from '../controllers/post.js';

router.post('/', createPost);

router.get('/:id', getPost);

router.get('/timeline/:userId', getPosts);

router.get('/all/:userId', getUsersPosts);

router.patch('/:id', updatePost);

router.delete('/:id', deletePost);

router.post('/:id/like', likePost);

export default router;
