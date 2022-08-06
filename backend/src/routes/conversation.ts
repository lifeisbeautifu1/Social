import express from 'express';

const router = express.Router();

import {
  createConversation,
  getConversations,
} from '../controllers/conversation';

router.post('/:id', createConversation);

router.get('/', getConversations);

export default router;
