import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Trash2, Calendar, User, Send, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getTaskById, updateTask, deleteTask, addComment } from '../api/taskApi';
import { getUsers } from '../api/userApi';
import { getProjects } from '../api/projectApi';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';
import { formatDate, formatDateTime, getStatusBadgeClass, getPriorityBadgeClass, getInitials } from '../utils/helpers';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user: currentUser } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, usersRes, projRes] = await Promise.all([
          getTaskById(id),
          getUsers({ limit: 100 }),
          getProjects({ limit: 100 }),
        ]);
        setTask(taskRes.data.data);
        setUsers(usersRes.data.data);
        setProjects(projRes.data.data);
      } catch {
        toast.error('Failed to load task');
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const openEdit = () => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description);
      setValue('status', task.status);
      setValue('priority', task.priority);
      setValue('assignedTo', task.assignedTo?._id);
      setValue('project', task.project?._id);
      setValue('dueDate', task.dueDate?.split('T')[0]);
    }
    setShowEdit(true);
  };

  const onUpdate = async (data) => {
    setUpdating(true);
    try {
      // Members can only update status
      const payload = isAdmin ? data : { status: data.status };
      const { data: res } = await updateTask(id, payload);
      setTask(res.data);
      toast.success('Task updated');
      setShowEdit(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    setDeleting(true);
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      navigate('/tasks');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommenting(true);
    try {
      const { data } = await addComment(id, { text: commentText });
      setTask(data.data);
      setCommentText('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setCommenting(false);
    }
  };

  const canEdit = isAdmin || task?.assignedTo?._id === currentUser?._id;

  if (loading) return <Loader />;
  if (!task) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate('/tasks')} className="flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tasks
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-dark-100 mb-2">{task.title}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`badge ${getStatusBadgeClass(task.status)}`}>{task.status}</span>
              <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>{task.priority} Priority</span>
            </div>
          </div>
          <div className="flex gap-2">
            {canEdit && <button onClick={openEdit} className="btn-secondary flex items-center gap-2 text-sm"><Edit2 className="w-4 h-4" /> Edit</button>}
            {isAdmin && <button onClick={() => setShowDelete(true)} className="btn-danger flex items-center gap-2 text-sm"><Trash2 className="w-4 h-4" /> Delete</button>}
          </div>
        </div>

        <p className="text-dark-300 mb-6 leading-relaxed">{task.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-dark-400">
            <Calendar className="w-4 h-4" />
            <span>Due: <span className="text-dark-200">{formatDate(task.dueDate)}</span></span>
          </div>
          <div className="flex items-center gap-2 text-dark-400">
            <User className="w-4 h-4" />
            <span>Assigned to: <span className="text-dark-200">{task.assignedTo?.name || 'Unassigned'}</span></span>
          </div>
          {task.project && (
            <div className="flex items-center gap-2 text-dark-400">
              📁 <span>Project: <span className="text-dark-200 cursor-pointer hover:text-primary-400" onClick={() => navigate(`/projects/${task.project._id}`)}>{task.project.title}</span></span>
            </div>
          )}
          {task.createdBy && (
            <div className="flex items-center gap-2 text-dark-400">
              <User className="w-4 h-4" />
              <span>Created by: <span className="text-dark-200">{task.createdBy.name}</span></span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Comments */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h2 className="text-lg font-semibold text-dark-200 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary-400" />
          Comments ({task.comments?.length || 0})
        </h2>

        <form onSubmit={handleComment} className="flex gap-3 mb-6">
          <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." className="input-field flex-1" />
          <button type="submit" disabled={commenting || !commentText.trim()} className="btn-gradient px-4">
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="space-y-4">
          {task.comments && task.comments.length > 0 ? (
            task.comments.map((comment, i) => (
              <div key={comment._id || i} className="flex gap-3 p-3 rounded-xl bg-dark-800/30">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center text-xs font-bold text-primary-300 flex-shrink-0">
                  {getInitials(comment.user?.name)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-dark-200">{comment.user?.name}</span>
                    <span className="text-xs text-dark-500">{formatDateTime(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-dark-400">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-dark-500 text-sm text-center py-4">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </motion.div>

      {/* Edit modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Task" size="lg">
        <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
          {isAdmin ? (
            <>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Title</label>
                <input {...register('title')} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Description</label>
                <textarea {...register('description')} className="input-field min-h-[80px] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">Assign To</label>
                  <select {...register('assignedTo')} className="input-field appearance-none">
                    {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">Project</label>
                  <select {...register('project')} className="input-field appearance-none">
                    {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">Status</label>
                  <select {...register('status')} className="input-field appearance-none">
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">Priority</label>
                  <select {...register('priority')} className="input-field appearance-none">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">Due Date</label>
                  <input {...register('dueDate')} type="date" className="input-field" />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Status</label>
              <select {...register('status')} className="input-field appearance-none">
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <p className="text-dark-500 text-xs mt-2">As a member, you can only update the task status.</p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowEdit(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={updating} className="btn-gradient">{updating ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDeleteTask} title="Delete Task" message="This action cannot be undone." loading={deleting} />
    </div>
  );
};

export default TaskDetails;
