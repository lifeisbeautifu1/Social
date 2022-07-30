import express from 'express';

const router = express();

import { createMessage, getMessages } from '../controllers/message.js';

router.post('/', createMessage);

router.get('/:conversationId', getMessages);

export default router;
