import express from 'express';
import { getUsers, getUserById, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', adminMiddleware, getUsers);
router.put('/profile', updateProfile);
router.get('/:id', getUserById);

export default router;
