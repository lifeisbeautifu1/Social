import express from 'express';

const router = express();

import { createMessage, getMessages } from '../controllers/message';

router.post('/', createMessage);

router.get('/:conversationId', getMessages);

export default router;
