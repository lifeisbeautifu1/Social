import express from 'express';

const router = express.Router();

import {
  updateUser,
  getUser,
  deleteUser,
  followUser,
  unfollowUser,
} from '../controllers/user.js';

router.get('/:id', getUser);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

router.post('/:id/follow', followUser);

router.post('/:id/unfollow', unfollowUser);

export default router;
