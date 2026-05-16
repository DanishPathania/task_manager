import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  getDashboardStats,
} from '../controllers/taskController.js';
import { createTaskValidator, updateTaskValidator } from '../validators/taskValidator.js';
import validate from '../middleware/validate.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Dashboard stats (must be before /:id to avoid conflict)
router.get('/stats/dashboard', getDashboardStats);

router.route('/')
  .get(getTasks)
  .post(adminMiddleware, createTaskValidator, validate, createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTaskValidator, validate, updateTask)
  .delete(adminMiddleware, deleteTask);

router.post('/:id/comments', addComment);

export default router;
