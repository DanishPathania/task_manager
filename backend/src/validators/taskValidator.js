import { body } from 'express-validator';

export const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 150 })
    .withMessage('Title cannot exceed 150 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Task description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('assignedTo')
    .notEmpty()
    .withMessage('Task must be assigned to a user')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('project')
    .notEmpty()
    .withMessage('Task must belong to a project')
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('status')
    .optional()
    .isIn(['Todo', 'In Progress', 'Completed', 'Overdue'])
    .withMessage('Invalid task status'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid date'),
];

export const updateTaskValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Title cannot exceed 150 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('project')
    .optional()
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('status')
    .optional()
    .isIn(['Todo', 'In Progress', 'Completed', 'Overdue'])
    .withMessage('Invalid task status'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
];
