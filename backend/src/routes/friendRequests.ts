import express from 'express';

const router = express.Router();

import { createRequest, closeRequest } from '../controllers/friendRequests';

router.post('/', createRequest);

router.patch('/:id', closeRequest);

export default router;
