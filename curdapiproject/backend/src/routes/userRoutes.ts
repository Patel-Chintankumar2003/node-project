import express from 'express';
//  registerUser,
import { loginUser } from '../controllers/userController';

const router = express.Router();

// router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
