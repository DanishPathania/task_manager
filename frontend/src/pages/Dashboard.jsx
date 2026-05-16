import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  AlertTriangle,
  FolderKanban,
  Users,
  TrendingUp,
  ListTodo,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { getDashboardStats } from '../api/taskApi';
import { getProjects } from '../api/projectApi';
import { getUsers } from '../api/userApi';
import StatsCard from '../components/StatsCard';
import Loader from '../components/Loader';
import TaskCard from '../components/TaskCard';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes, usersRes] = await Promise.all([
          getDashboardStats(),
          getProjects({ limit: 1 }),
          getUsers({ limit: 1 }),
        ]);
        setStats(statsRes.data.data);
        setTotalProjects(projectsRes.data.pagination.total);
        setTotalMembers(usersRes.data.pagination.total);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card-sm p-3 text-sm">
          <p className="text-dark-200 font-medium">{label || payload[0].name}</p>
          <p className="text-primary-400">{payload[0].value} tasks</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-dark-100 mb-1">
          Welcome back, <span className="gradient-text">{user?.name}</span> 👋
        </h1>
        <p className="text-dark-400">Here&apos;s what&apos;s happening with your projects today.</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard icon={FolderKanban} label="Total Projects" value={totalProjects} color="purple" delay={0} />
        <StatsCard icon={ListTodo} label="Total Tasks" value={stats?.totalTasks || 0} color="blue" delay={0.05} />
        <StatsCard icon={CheckSquare} label="Completed" value={stats?.completedTasks || 0} color="green" delay={0.1} />
        <StatsCard icon={Clock} label="In Progress" value={stats?.inProgressTasks || 0} color="amber" delay={0.15} />
        <StatsCard icon={AlertTriangle} label="Overdue" value={stats?.overdueTasks || 0} color="red" delay={0.2} />
        <StatsCard icon={Users} label="Team Members" value={totalMembers} color="cyan" delay={0.25} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart — Status distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-dark-200 font-semibold mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-primary-400" />
            Task Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats?.statusDistribution || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {(stats?.statusDistribution || []).map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-dark-400 text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart — Priority distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6"
        >
          <h3 className="text-dark-200 font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent-400" />
            Priority Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.priorityDistribution || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {(stats?.priorityDistribution || []).map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Line Chart — Monthly trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-dark-200 font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Monthly Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats?.trendData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#a78bfa' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <h3 className="text-dark-200 font-semibold mb-4">Recent Tasks</h3>
        {stats?.recentTasks && stats.recentTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {stats.recentTasks.map((task, i) => (
              <TaskCard key={task._id} task={task} delay={i * 0.05} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center text-dark-500">
            No tasks yet. Create your first project and task to get started!
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
