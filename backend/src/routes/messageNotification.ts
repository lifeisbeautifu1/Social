import express from 'express';

import {
  getNotifications,
  deleteNotifications,
} from '../controllers/messageNotification';

const router = express.Router();

router.get('/', getNotifications);

router.delete('/:id', deleteNotifications);

export default router;
