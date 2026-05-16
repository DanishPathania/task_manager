import API from './axios';

export const getTasks = (params) => API.get('/tasks', { params });
export const getTaskById = (id) => API.get(`/tasks/${id}`);
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const addComment = (id, data) => API.post(`/tasks/${id}/comments`, data);
export const getDashboardStats = () => API.get('/tasks/stats/dashboard');
