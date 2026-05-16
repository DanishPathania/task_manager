import Project from '../models/Project.js';
import Task from '../models/Task.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * @desc    Get all projects (with search, filter, pagination)
 * @route   GET /api/projects
 * @access  Private
 */
export const getProjects = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const query = {};

  // Search by title
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  // Filter by status
  if (status && ['Active', 'Completed', 'On Hold'].includes(status)) {
    query.status = status;
  }

  // Members can only see projects they belong to or created
  if (req.user.role === 'Member') {
    query.$or = [
      { members: req.user._id },
      { createdBy: req.user._id },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Project.countDocuments(query);

  const projects = await Project.find(query)
    .populate('createdBy', 'name email avatar')
    .populate('members', 'name email avatar role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: projects,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email avatar')
    .populate('members', 'name email avatar role');

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private/Admin
 */
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, status, members, dueDate } = req.body;

  const project = await Project.create({
    title,
    description,
    status,
    members: members || [],
    createdBy: req.user._id,
    dueDate,
  });

  const populated = await Project.findById(project._id)
    .populate('createdBy', 'name email avatar')
    .populate('members', 'name email avatar role');

  res.status(201).json({
    success: true,
    data: populated,
  });
});

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private/Admin
 */
export const updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('createdBy', 'name email avatar')
    .populate('members', 'name email avatar role');

  res.status(200).json({
    success: true,
    data: project,
  });
});

/**
 * @desc    Delete a project and its associated tasks
 * @route   DELETE /api/projects/:id
 * @access  Private/Admin
 */
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Delete all tasks associated with this project
  await Task.deleteMany({ project: req.params.id });

  await Project.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Project and associated tasks deleted successfully',
  });
});
