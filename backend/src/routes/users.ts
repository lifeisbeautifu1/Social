import express from 'express';

const router = express.Router();

import {
  updateUser,
  getUser,
  getFriends,
  getUserInfo,
  deleteUser,
  searchUsers,
  removeFriend,
} from '../controllers/user';

router.get('/find', searchUsers);

router.get('/me', getUserInfo);

router.get('/:id', getUser);

router.get('/friends/:id', getFriends);

router.patch('/:id', updateUser);

router.delete('/:id/friend', removeFriend);

router.delete('/:id', deleteUser);


export default router;
