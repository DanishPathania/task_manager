import Task from '../models/Task.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * @desc    Get all tasks (with search, filter, pagination)
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = asyncHandler(async (req, res) => {
  const { search, status, priority, project, page = 1, limit = 10 } = req.query;
  const query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  if (status && ['Todo', 'In Progress', 'Completed', 'Overdue'].includes(status)) {
    query.status = status;
  }

  if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
    query.priority = priority;
  }

  if (project) {
    query.project = project;
  }

  // Members can only see tasks assigned to them or created by them
  if (req.user.role === 'Member') {
    query.$or = [
      { assignedTo: req.user._id },
      { createdBy: req.user._id },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Task.countDocuments(query);

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email avatar')
    .populate('project', 'title')
    .populate('createdBy', 'name email avatar')
    .populate('comments.user', 'name email avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: tasks,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email avatar')
    .populate('project', 'title')
    .populate('createdBy', 'name email avatar')
    .populate('comments.user', 'name email avatar');

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private/Admin
 */
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, project, status, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    assignedTo,
    project,
    status,
    priority,
    dueDate,
    createdBy: req.user._id,
  });

  const populated = await Task.findById(task._id)
    .populate('assignedTo', 'name email avatar')
    .populate('project', 'title')
    .populate('createdBy', 'name email avatar');

  res.status(201).json({
    success: true,
    data: populated,
  });
});

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private (Admin can update all, Member can update status of own tasks)
 */
export const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  // Members can only update status of their own assigned tasks
  if (req.user.role === 'Member') {
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You can only update tasks assigned to you');
    }
    // Members can only update status
    const allowedFields = ['status'];
    const updateKeys = Object.keys(req.body);
    const isAllowed = updateKeys.every((key) => allowedFields.includes(key));
    if (!isAllowed) {
      throw new ApiError(403, 'Members can only update task status');
    }
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('assignedTo', 'name email avatar')
    .populate('project', 'title')
    .populate('createdBy', 'name email avatar')
    .populate('comments.user', 'name email avatar');

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private/Admin
 */
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  await Task.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
});

/**
 * @desc    Add a comment to a task
 * @route   POST /api/tasks/:id/comments
 * @access  Private
 */
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    throw new ApiError(400, 'Comment text is required');
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  task.comments.push({
    user: req.user._id,
    text: text.trim(),
  });

  await task.save();

  const populated = await Task.findById(task._id)
    .populate('assignedTo', 'name email avatar')
    .populate('project', 'title')
    .populate('createdBy', 'name email avatar')
    .populate('comments.user', 'name email avatar');

  res.status(201).json({
    success: true,
    data: populated,
  });
});

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/tasks/stats/dashboard
 * @access  Private
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userFilter = req.user.role === 'Member'
    ? { $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }] }
    : {};

  const [totalTasks, todoTasks, inProgressTasks, completedTasks, overdueTasks] = await Promise.all([
    Task.countDocuments(userFilter),
    Task.countDocuments({ ...userFilter, status: 'Todo' }),
    Task.countDocuments({ ...userFilter, status: 'In Progress' }),
    Task.countDocuments({ ...userFilter, status: 'Completed' }),
    Task.countDocuments({
      ...userFilter,
      status: { $ne: 'Completed' },
      dueDate: { $lt: new Date() },
    }),
  ]);

  // Task status distribution for pie chart
  const statusDistribution = [
    { name: 'Todo', value: todoTasks, color: '#8B5CF6' },
    { name: 'In Progress', value: inProgressTasks, color: '#3B82F6' },
    { name: 'Completed', value: completedTasks, color: '#10B981' },
    { name: 'Overdue', value: overdueTasks, color: '#EF4444' },
  ];

  // Priority distribution for bar chart
  const [lowPriority, mediumPriority, highPriority] = await Promise.all([
    Task.countDocuments({ ...userFilter, priority: 'Low' }),
    Task.countDocuments({ ...userFilter, priority: 'Medium' }),
    Task.countDocuments({ ...userFilter, priority: 'High' }),
  ]);

  const priorityDistribution = [
    { name: 'Low', value: lowPriority, color: '#10B981' },
    { name: 'Medium', value: mediumPriority, color: '#F59E0B' },
    { name: 'High', value: highPriority, color: '#EF4444' },
  ];

  // Monthly task creation trend (last 6 months) for line chart
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrend = await Task.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        ...(req.user.role === 'Member' ? { assignedTo: req.user._id } : {}),
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendData = monthlyTrend.map((item) => ({
    name: monthNames[item._id.month - 1],
    tasks: item.count,
  }));

  // Recent tasks
  const recentTasks = await Task.find(userFilter)
    .populate('assignedTo', 'name email avatar')
    .populate('project', 'title')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      statusDistribution,
      priorityDistribution,
      trendData,
      recentTasks,
    },
  });
});
