import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Plus, Search, Filter, CheckSquare } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { getTasks, createTask, deleteTask } from '../api/taskApi';
import { getProjects } from '../api/projectApi';
import { getUsers } from '../api/userApi';
import TaskCard from '../components/TaskCard';
import CustomSelect from '../components/CustomSelect';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';

const schema = yup.object({
  title: yup.string().required('Title is required').max(150),
  description: yup.string().required('Description is required').max(2000),
  assignedTo: yup.string().required('Assignee is required'),
  project: yup.string().required('Project is required'),
  priority: yup.string().oneOf(['Low', 'Medium', 'High']),
  status: yup.string().oneOf(['Todo', 'In Progress', 'Completed', 'Overdue']),
  dueDate: yup.string().required('Due date is required'),
});

const Tasks = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [location.search]);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { status: 'Todo', priority: 'Medium' },
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const { data } = await getTasks(params);
      setTasks(data.data);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [page, search, statusFilter, priorityFilter]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [p, u] = await Promise.all([getProjects({ limit: 100 }), getUsers({ limit: 100 })]);
        setProjects(p.data.data);
        setUsers(u.data.data);
      } catch {}
    };
    fetchOptions();
  }, []);

  const onCreateTask = async (formData) => {
    setCreating(true);
    try {
      await createTask(formData);
      toast.success('Task created!');
      setShowCreate(false);
      reset();
      setPage(1);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(deleteId);
      toast.success('Task deleted');
      setDeleteId(null);
      fetchTasks();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-100">Tasks</h1>
          <p className="text-dark-400 text-sm">{pagination.total || 0} total tasks</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)} className="btn-gradient flex items-center gap-2" id="create-task-btn">
            <Plus className="w-4 h-4" /> New Task
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
        </div>
        <CustomSelect
          value={statusFilter}
          onChange={(val) => { setStatusFilter(val); setPage(1); }}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'Todo', label: 'Todo' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Overdue', label: 'Overdue' },
          ]}
          icon={Filter}
          className="min-w-[160px]"
        />
        <CustomSelect
          value={priorityFilter}
          onChange={(val) => { setPriorityFilter(val); setPage(1); }}
          options={[
            { value: '', label: 'All Priorities' },
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
          ]}
          icon={Filter}
          className="min-w-[160px]"
        />
      </div>

      {loading ? <Loader /> : tasks.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No tasks found" message={search || statusFilter || priorityFilter ? 'Try adjusting your filters.' : 'Create your first task.'} action={isAdmin ? () => setShowCreate(true) : undefined} actionLabel="Create Task" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tasks.map((task, i) => <TaskCard key={task._id} task={task} delay={i * 0.03} />)}
          </div>
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-400 hover:bg-dark-700'}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}

      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); reset(); }} title="Create Task" size="lg">
        <form onSubmit={handleSubmit(onCreateTask)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Title</label>
            <input {...register('title')} className="input-field" placeholder="Task title" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Description</label>
            <textarea {...register('description')} className="input-field min-h-[80px] resize-none" placeholder="Describe the task..." />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Controller
                name="assignedTo"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Assign To"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select User"
                    options={users.map(u => ({ value: u._id, label: u.name }))}
                    error={errors.assignedTo?.message}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="project"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Project"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Project"
                    options={projects.map(p => ({ value: p._id, label: p.title }))}
                    error={errors.project?.message}
                  />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Priority"
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: 'Low', label: 'Low' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'High', label: 'High' },
                    ]}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Status"
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: 'Todo', label: 'Todo' },
                      { value: 'In Progress', label: 'In Progress' },
                      { value: 'Completed', label: 'Completed' },
                    ]}
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Due Date</label>
              <input {...register('dueDate')} type="date" className="input-field" />
              {errors.dueDate && <p className="text-red-400 text-xs mt-1">{errors.dueDate.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowCreate(false); reset(); }} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={creating} className="btn-gradient">{creating ? 'Creating...' : 'Create Task'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Task" message="This action cannot be undone." loading={deleting} />
    </div>
  );
};

export default Tasks;
