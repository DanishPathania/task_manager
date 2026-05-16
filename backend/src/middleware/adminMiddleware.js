import ApiError from '../utils/ApiError.js';

/**
 * Restricts access to Admin users only.
 * Must be used after authMiddleware.
 */
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    throw new ApiError(403, 'Access denied — Admin privileges required');
  }
};

export default adminMiddleware;
