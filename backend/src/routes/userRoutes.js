import express from 'express';
import { getUsers, getUserById, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUsers);
router.put('/profile', updateProfile);
router.get('/:id', getUserById);

export default router;
