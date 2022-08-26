import express from 'express';

const router = express.Router();

import { register, login, logout, verifyAccount } from '../controllers/auth';

router.post('/register', register);

router.post('/login', login);

router.get('/logout', logout);

router.post('/verify', verifyAccount);

export default router;
