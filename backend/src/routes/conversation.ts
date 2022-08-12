import express from 'express';

const router = express.Router();

import {
  createConversation,
  getConversations,
  getConversation,
} from '../controllers/conversation';

router.post('/:id', createConversation);

router.get('/', getConversations);

router.get('/:id', getConversation);

export default router;
