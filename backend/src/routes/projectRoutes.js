import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { createProjectValidator, updateProjectValidator } from '../validators/projectValidator.js';
import validate from '../middleware/validate.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.route('/')
  .get(getProjects)
  .post(adminMiddleware, createProjectValidator, validate, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(adminMiddleware, updateProjectValidator, validate, updateProject)
  .delete(adminMiddleware, deleteProject);

export default router;
