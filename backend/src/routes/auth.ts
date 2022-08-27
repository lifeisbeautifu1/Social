import express from 'express';

const router = express.Router();

import {
  register,
  login,
  logout,
  verifyAccount,
  resetPassword,
  updatePassword,
} from '../controllers/auth';

router.post('/register', register);

router.post('/login', login);

router.get('/logout', logout);

router.post('/verify', verifyAccount);

router.post('/reset/password', resetPassword);

router.patch('/update/password', updatePassword);

export default router;
