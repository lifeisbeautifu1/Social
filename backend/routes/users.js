import express from 'express';

const router = express.Router();

import {
  updateUser,
  getUser,
  getFriends,
  deleteUser,
  followUser,
  unfollowUser,
} from '../controllers/user.js';

router.get('/:id', getUser);

router.get('/friends/:id', getFriends);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

router.patch('/:id/follow', followUser);

router.patch('/:id/unfollow', unfollowUser);

export default router;
